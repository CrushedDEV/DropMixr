<?php

namespace App\Http\Controllers;

use App\Models\Mashup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\Setting;
use App\Models\Pack;
use Inertia\Inertia;

class MashupController extends Controller
{
    public function index()
    {
        $disk = config('filesystems.default', 'public');
        $mashups = Mashup::where('is_public', true)
            ->where('is_approved', true)
            ->with('user')
            ->latest()
            ->get()
            ->map(function ($mashup) use ($disk) {
                return [
                    'id' => $mashup->id,
                    'title' => $mashup->title,
                    'bpm' => $mashup->bpm,
                    'key' => $mashup->key,
                    'duration' => $mashup->duration,
                    'description' => $mashup->description,
                    'image' => $mashup->image_path ? Storage::disk($disk)->url($mashup->image_path) : '/default-image.jpg',
                    'file_path' => $mashup->file_path ? Storage::disk($disk)->url($mashup->file_path) : null,
                    'audio' => $mashup->file_path ? Storage::disk($disk)->url($mashup->file_path) : null,
                    'user' => [
                        'name' => $mashup->user->name ?? 'Desconocido',
                    ],
                    'created_at' => $mashup->created_at,
                ];
            });

        return response()->json($mashups);
    }

    public function create()
    {
        return Inertia::render('mashups/Create');
    }

    public function store(Request $request)
    {
        $dailyLimit = (int) Setting::where('key', 'daily_upload_limit')->first()?->value ?? 10;
        $storageLimitMb = (int) Setting::where('key', 'storage_limit_mb')->first()?->value ?? 500;
        $maxFileSizeMb = (int) Setting::where('key', 'max_file_size_mb')->first()?->value ?? 500; // Increased default to 500MB

        // 1. Rate Limiting
        $user = auth()->user();
        $todayUploads = $user->mashups()->whereDate('created_at', today())->count()
            + Pack::where('user_id', $user->id)->whereDate('created_at', today())->count();

        if ($todayUploads >= $dailyLimit) {
            return redirect()->back()->withErrors(['file_path' => "Has alcanzado tu límite diario de subidas ({$dailyLimit})."]);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'file_path' => "required|file|mimes:mp3,wav,ogg,m4a|max:" . ($maxFileSizeMb * 1024),
            'image_path' => 'required|image|mimes:jpeg,png,webp|max:5120',
            'bpm' => 'nullable|integer|min:1|max:300',
            'key' => 'nullable|string|max:10',
            'duration' => 'nullable|numeric',
            'description' => 'nullable|string|max:1000',
            'type' => 'nullable|string|in:Mashup,Extended,Vocal In,Vocal Out,Original,Edit,Remix',
            'is_public' => 'boolean',
        ]);

        try {
            // 2. Storage Quota Check
            $currentStorageBytes = $user->mashups()->sum('file_size') ?? 0;
            $currentStorageBytes += Pack::where('user_id', $user->id)->sum('file_size') ?? 0;

            $newFileSize = $request->file('file_path')->getSize();
            $storageLimitBytes = $storageLimitMb * 1024 * 1024;

            if (($currentStorageBytes + $newFileSize) > $storageLimitBytes) {
                return redirect()->back()->withErrors(['file_path' => "No tienes suficiente espacio de almacenamiento. Límite: {$storageLimitMb}MB."]);
            }

            // Guardar archivos - usa el disco configurado en .env (FILESYSTEM_DISK)
            $disk = config('filesystems.default', 'public');
            $audioPath = null;
            $imagePath = null;

            if ($request->hasFile('file_path')) {
                $file = $request->file('file_path');
                // Strict Filename Sanitization
                $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $extension = $file->getClientOriginalExtension();
                $safeName = Str::slug($originalName) . '.' . $extension;
                $filename = time() . '_' . $safeName;

                $audioPath = $file->storeAs('mashups/audio', $filename, $disk);
                if ($audioPath === false) {
                    throw new \Exception("Error al subir el archivo de audio a {$disk}. Verifica la configuración de almacenamiento.");
                }
            }

            if ($request->hasFile('image_path')) {
                $file = $request->file('image_path');
                $filename = time() . '_' . $file->getClientOriginalName();
                $imagePath = $file->storeAs('mashups/images', $filename, $disk);
                if ($imagePath === false) {
                    throw new \Exception("Error al subir la imagen a {$disk}. Verifica la configuración de almacenamiento.");
                }
            }

            // Crear mashup
            $user = Auth::user();
            $mashup = Mashup::create([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'bpm' => $validated['bpm'] ?? null,
                'key' => $validated['key'] ?? null,
                'duration' => $validated['duration'] ?? null,
                'duration' => $validated['duration'] ?? null,
                'file_path' => $audioPath,
                'file_size' => $newFileSize,
                'image_path' => $imagePath,
                'user_id' => $user?->id,
                // 'type' => $validated['type'] ?? 'Mashup',
                'is_public' => $validated['is_public'] ?? true,
                'is_approved' => false,
                'status' => 'pending',
            ]);

            // GENERATE PREVIEW
            try {
                $processor = new \App\Services\AudioProcessor();
                $previewPath = $processor->generatePreview($audioPath);
                if ($previewPath) {
                    $mashup->preview_path = $previewPath;
                    $mashup->save();
                }
            } catch (\Exception $e) {
                // Content Validation: If preview fails, assume corrupt file and fail upload
                Log::error('Failed to generate preview on upload: ' . $e->getMessage());
                throw new \Exception("El archivo de audio parece inválido o corrupto. No se pudo procesar.");
            }

            // Notify Discord
            try {
                app(\App\Services\DiscordNotificationService::class)->notifyNewContent(
                    'Mashup',
                    $mashup->title,
                    $user->name,
                    route('admin.dashboard')
                );
            } catch (\Exception $e) {
                Log::error('Notification failed: ' . $e->getMessage());
            }

            return redirect()->route('explore')->with('success', 'Mashup subido exitosamente. Está pendiente de aprobación.');
        } catch (\Exception $e) {
            // Eliminar archivos si algo falla
            if ($audioPath) {
                Storage::disk($disk)->delete($audioPath);
            }
            if ($imagePath) {
                Storage::disk($disk)->delete($imagePath);
            }

            Log::error('Error al crear mashup: ' . $e->getMessage(), [
                'exception' => $e,
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()->withErrors(['error' => 'Error al subir el mashup. Intenta nuevamente.']);
        }
    }

    public function show(Mashup $mashup)
    {
        return Inertia::render('mashups/Show', [
            'mashup' => $mashup->load('user'),
        ]);
    }

    public function edit(Mashup $mashup)
    {
        $this->authorize('update', $mashup);
        return Inertia::render('mashups/Edit', [
            'mashup' => $mashup,
        ]);
    }

    public function update(Request $request, Mashup $mashup)
    {
        $this->authorize('update', $mashup);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'bpm' => 'nullable|integer|min:1|max:300',
            'key' => 'nullable|string|max:10',
            'duration' => 'nullable|numeric',
            'description' => 'nullable|string|max:1000',
            'is_public' => 'boolean',
        ]);

        $mashup->update($validated);

        return redirect()->route('explore')->with('success', 'Mashup actualizado exitosamente.');
    }

    public function destroy(Mashup $mashup)
    {
        $this->authorize('delete', $mashup);
        $disk = config('filesystems.default', 'public');

        // Eliminar archivos
        if ($mashup->file_path) {
            Storage::disk($disk)->delete($mashup->file_path);
        }
        if ($mashup->image_path) {
            Storage::disk($disk)->delete($mashup->image_path);
        }

        $mashup->delete();

        return redirect()->route('explore')->with('success', 'Mashup eliminado exitosamente.');
    }

    public function download(Mashup $mashup)
    {
        $user = Auth::user();
        $cost = \App\Models\Setting::where('key', 'credit_cost_download')->first()?->value ?? 1;
        $cost = (int) $cost;

        // Check if user already purchased this mashup
        $existingDownload = \App\Models\Download::where('user_id', $user->id)
            ->where('mashup_id', $mashup->id)
            ->first();

        // If not already purchased, check credits and deduct
        if (!$existingDownload) {
            if ($user->credits < $cost) {
                return redirect()->back()->withErrors(['error' => "No tienes suficientes créditos. Necesitas {$cost} créditos."]);
            }

            // Deduct credits and record download
            $user->decrement('credits', $cost);

            \App\Models\Download::create([
                'user_id' => $user->id,
                'mashup_id' => $mashup->id,
                'credits_spent' => $cost,
            ]);
        }

        $disk = config('filesystems.default', 'public');

        // Para S3 usamos temporaryUrl, para local usamos respuesta de descarga directa
        if ($disk === 's3') {
            $url = Storage::disk('s3')->temporaryUrl(
                $mashup->file_path,
                now()->addMinutes(5),
                ['ResponseContentDisposition' => 'attachment; filename="' . basename($mashup->file_path) . '"']
            );
            return Inertia::location($url);
        } else {
            // Para almacenamiento local
            return Storage::disk($disk)->download($mashup->file_path);
        }
    }
    public function stream(Mashup $mashup)
    {
        $disk = config('filesystems.default', 'public');
        $path = $mashup->file_path;

        // if (!$path || !Storage::disk($disk)->exists($path)) {
        //     Log::warning("Stream: File not found via Storage::exists: " . $path);
        //     // abort(404); // Let response()->file try, it might be a windows path thing
        // }

        // Handle local disk
        if ($disk === 'public' || $disk === 'local') {
            $fullPath = Storage::disk($disk)->path($path);
            return response()->file($fullPath);
        }

        // Handle S3 or others (Redirect to temporary URL)
        if ($disk === 's3') {
            return redirect(Storage::disk('s3')->temporaryUrl(
                $path,
                now()->addMinutes(60)
            ));
        }

        abort(400, 'Unsupported filesystem driver for streaming.');
    }
}
