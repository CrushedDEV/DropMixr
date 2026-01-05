<?php

namespace App\Http\Controllers;

use App\Models\Pack;
use App\Models\Mashup;
use App\Models\PackPurchase;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Services\ZipProcessor;
use App\Models\Setting;
use Illuminate\Support\Facades\DB;

class PackController extends Controller
{
    public function index()
    {
        $packs = Pack::where('is_public', true)
            ->with(['user', 'mashups'])
            ->latest()
            ->get()
            ->map(function ($pack) {
                // Ensure cover image has correct URL using public disk
                if ($pack->cover_image_path && !str_starts_with($pack->cover_image_path, '/storage') && !str_starts_with($pack->cover_image_path, 'http')) {
                    $pack->cover_image_path = Storage::disk('public')->url($pack->cover_image_path);
                }
                return $pack;
            });

        return Inertia::render('Packs/Index', [
            'packs' => $packs
        ]);
    }

    public function create()
    {
        return Inertia::render('Packs/Create');
    }

    public function store(Request $request, ZipProcessor $zipProcessor)
    {
        $dailyLimit = (int) Setting::where('key', 'daily_upload_limit')->first()?->value ?? 10;
        $storageLimitMb = (int) Setting::where('key', 'storage_limit_mb')->first()?->value ?? 500;
        $maxFileSizeMb = (int) Setting::where('key', 'max_file_size_mb')->first()?->value ?? 500; // Increased default to 500MB

        // 1. Rate Limiting
        $user = auth()->user();
        // Check daily uploads count (approximation using created_at)
        $todayUploads = $user->mashups()->whereDate('created_at', today())->count()
            + Pack::where('user_id', $user->id)->whereDate('created_at', today())->count();

        if ($todayUploads >= $dailyLimit) {
            return redirect()->back()->withErrors(['file' => "Has alcanzado tu límite diario de subidas ({$dailyLimit})."]);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|image|max:2048',
            'file' => "required|file|mimes:zip|max:" . ($maxFileSizeMb * 1024), // Dynamic max size
        ]);

        // 2. Storage Quota Check
        $currentStorageBytes = $user->mashups()->sum('file_size') ?? 0;
        // Add packs storage
        $currentStorageBytes += Pack::where('user_id', $user->id)->sum('file_size') ?? 0;

        $newFileSize = $request->file('file')->getSize();
        $storageLimitBytes = $storageLimitMb * 1024 * 1024;

        if (($currentStorageBytes + $newFileSize) > $storageLimitBytes) {
            return redirect()->back()->withErrors(['file' => "No tienes suficiente espacio de almacenamiento. Límite: {$storageLimitMb}MB."]);
        }

        $pack = null;
        $filePath = null;

        try {
            DB::beginTransaction();

            // Process Zip to count audio files
            $file = $request->file('file');
            // We need to save it temporarily to process it, or process directly from tmp path
            // ZipProcessor expects a path. UploadedFile path is tmp.

            try {
                $audioCount = $zipProcessor->countAudioUtils($file->getPathname());
            } catch (\Exception $e) {
                return redirect()->back()->withErrors(['file' => 'El archivo Zip es inválido o está corrupto.']);
            }

            if ($audioCount === 0) {
                return redirect()->back()->withErrors(['file' => 'El archivo Zip no contiene archivos de audio válidos (mp3, wav, ogg, m4a).']);
            }

            // Calculate Price
            $creditCost = (int) Setting::where('key', 'credit_cost_download')->first()?->value ?? 1;
            $price = $audioCount * $creditCost;

            // Save File with Sanitized Name
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            $safeName = Str::slug($originalName) . '.' . $extension;
            $uniqueName = time() . '_' . $safeName;

            $path = $file->storeAs('packs/files', $uniqueName, 'public');
            $filePath = $path;

            $pack = new Pack();
            $pack->user_id = auth()->id();
            $pack->title = $validated['title'];
            $pack->description = $validated['description'];
            $pack->price = $price;
            $pack->file_path = $path;
            $pack->file_path = $path;
            $pack->file_size = $newFileSize;
            $pack->status = 'pending';
            $pack->is_approved = false;
            $pack->is_public = false;

            if ($request->hasFile('cover_image')) {
                $coverPath = $request->file('cover_image')->store('packs/covers', 'public');
                $pack->cover_image_path = Storage::disk('public')->url($coverPath);
            }

            $pack->save();

            // Extract and create Mashups
            $zip = new \ZipArchive;
            if ($zip->open(storage_path('app/public/' . $path)) === TRUE) {
                $extractPath = 'packs/' . $pack->id . '/files';
                // Create directory if not exists
                if (!Storage::disk('public')->exists($extractPath)) {
                    Storage::disk('public')->makeDirectory($extractPath);
                }

                $allowedExtensions = ['mp3', 'wav', 'ogg', 'm4a'];

                for ($i = 0; $i < $zip->numFiles; $i++) {
                    $filename = $zip->getNameIndex($i);
                    $fileinfo = pathinfo($filename);

                    // Skip macos/hidden
                    if (str_contains($filename, '__MACOSX') || str_starts_with($filename, '.'))
                        continue;
                    if (str_ends_with($filename, '/'))
                        continue; // Skip dirs

                    if (isset($fileinfo['extension']) && in_array(strtolower($fileinfo['extension']), $allowedExtensions)) {
                        // Extract file manually to stream to storage or just extraction to temp then move?
                        // ZipArchive extracts to filesystem path.

                        // We can define a temporary extraction path
                        $tempExtractPath = storage_path('app/public/' . $extractPath);
                        $zip->extractTo($tempExtractPath, $filename);

                        $fullPath = $tempExtractPath . '/' . $filename;

                        // Sanitize filename for storage to avoid S3 encoding issues
                        $safeFilename = \Illuminate\Support\Str::slug($fileinfo['filename']) . '.' . $fileinfo['extension'];
                        // Ensure Uniqueness slightly in case slug matches multiple different files (rare but possible with weird chars)
                        $safeFilename = time() . '_' . $i . '_' . $safeFilename;

                        $storagePath = $extractPath . '/' . $safeFilename;

                        // If default disk is S3 (or any non-local public), we need to upload it there
                        $defaultDisk = config('filesystems.default');
                        if ($defaultDisk !== 'public') {
                            if (file_exists($fullPath)) {
                                $fileContent = file_get_contents($fullPath);
                                Storage::disk($defaultDisk)->put($storagePath, $fileContent, 'public');
                            }
                        } else {
                            // If local public, we might want to rename it to the safe name too?
                            // Or just move it?
                            // For consistency, let's just move/rename the local file to the safe path if we are keeping it local.
                            if (file_exists($fullPath)) {
                                Storage::disk('public')->put($storagePath, file_get_contents($fullPath));
                                // Remove the original weird-named file from public storage if it was extracted there directly
                                // zip extractTo extracts with original name.
                                unlink($fullPath);
                            }
                        }

                        // Create Mashup
                        $mashup = new Mashup();
                        $mashup->user_id = auth()->id();
                        $mashup->title = $fileinfo['filename']; // Keep original title
                        $mashup->file_path = $storagePath;
                        $mashup->image_path = $pack->cover_image_path; // Use pack cover
                        $mashup->bpm = 0;
                        $mashup->key = 'N/A';
                        $mashup->status = 'approved'; // Since it's in a pack
                        $mashup->is_public = false; // Hidden from main explore? Or public? Let's say false/hidden for now as it belongs to a pack.
                        $mashup->save();

                        // Attach to Pack
                        $pack->mashups()->attach($mashup->id);
                    }
                }
                $zip->close();
            }

            DB::commit();

            // Notify Discord
            try {
                app(\App\Services\DiscordNotificationService::class)->notifyNewContent(
                    'Pack',
                    $pack->title,
                    $user->name,
                    route('admin.dashboard')
                );
            } catch (\Exception $e) {
                Log::error('Notification failed: ' . $e->getMessage());
            }

            return redirect()->route('dashboard')->with('success', "Pack creado exitosamente. Precio calculado: {$price} créditos ( por {$audioCount} canciones).");

        } catch (\Exception $e) {
            DB::rollBack();
            if ($filePath) {
                Storage::disk('public')->delete($filePath);
            }
            Log::error('Error creating pack: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Error al crear el pack. Intenta nuevamente.']);
        }
    }

    public function show(Pack $pack)
    {
        $pack->load(['user', 'mashups.user']);

        // Format URLs for view
        if ($pack->cover_image_path && !str_starts_with($pack->cover_image_path, '/storage')) {
            $pack->cover_image_path = Storage::url($pack->cover_image_path);
        }

        $hasPurchased = false;
        if (auth()->check()) {
            $hasPurchased = PackPurchase::where('user_id', auth()->id())
                ->where('pack_id', $pack->id)
                ->exists();
            // Also check if user is the owner
            if ($pack->user_id === auth()->id()) {
                $hasPurchased = true;
            }
        }

        return Inertia::render('Packs/Show', [
            'pack' => $pack,
            'hasPurchased' => $hasPurchased
        ]);
    }

    public function download(Pack $pack)
    {
        $user = auth()->user();

        // Ownership or purchase check
        $hasPurchased = PackPurchase::where('user_id', $user->id)
            ->where('pack_id', $pack->id)
            ->exists();

        if ($pack->user_id !== $user->id && !$hasPurchased) {
            return redirect()->back()->withErrors(['error' => 'No tienes permiso para descargar este pack.']);
        }

        if (!$pack->file_path || !Storage::disk('public')->exists($pack->file_path)) {
            return redirect()->back()->withErrors(['error' => 'El archivo del pack no se encuentra.']);
        }

        return Storage::disk('public')->download($pack->file_path);
    }

    public function buy(Pack $pack)
    {
        $user = auth()->user();

        if ($user->id === $pack->user_id) {
            return redirect()->back()->with('error', 'No puedes comprar tu propio pack.');
        }

        if (PackPurchase::where('user_id', $user->id)->where('pack_id', $pack->id)->exists()) {
            return redirect()->back()->with('success', 'Ya has comprado este pack.');
        }

        if ($user->credits < $pack->price) {
            return redirect()->back()->with('error', 'No tienes suficientes créditos.');
        }

        DB::transaction(function () use ($user, $pack) {
            // Deduct credits
            $user->decrement('credits', $pack->price);

            // Record purchase
            PackPurchase::create([
                'user_id' => $user->id,
                'pack_id' => $pack->id,
                'cost' => $pack->price,
            ]);
            // Note: We don't unlock individual mashups anymore, users just download the pack.

            // Credit the pack owner (optional: maybe partial amount?)
            // Implementing 100% transfer for now or whatever rule
            // $pack->user->increment('credits', $pack->price); 
            // Usually platform takes a cut or it's just burning credits. 
            // Sticking to burning credits standard unless specified. 
        });

        return redirect()->back()->with('success', 'Pack comprado exitosamente.');
    }
}
