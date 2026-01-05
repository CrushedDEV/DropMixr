<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Mashup;
use App\Models\User;
use App\Models\Pack;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        $disk = config('filesystems.default', 'public');

        $pendingMashups = Mashup::where('status', 'pending')
            ->with('user')
            ->latest()
            ->get()
            ->map(function ($mashup) use ($disk) {
                // Ensure audio url is correct
                $mashup->audio_url = $mashup->file_path ? \Illuminate\Support\Facades\Storage::disk($disk)->url($mashup->file_path) : null;
                return $mashup;
            });

        $pendingPacks = Pack::where('status', 'pending')
            ->with(['user', 'mashups.user'])
            ->latest()
            ->get()
            ->map(function ($pack) use ($disk) {
                $pack->mashups->transform(function ($mashup) use ($disk) {
                    $mashup->audio_url = $mashup->file_path ? \Illuminate\Support\Facades\Storage::disk($disk)->url($mashup->file_path) : null;
                    return $mashup;
                });
                return $pack;
            });

        $search = $request->input('search');

        $allMashupsQuery = Mashup::with('user')->withTrashed()->latest();

        if ($search) {
            $allMashupsQuery->where(function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $allMashups = $allMashupsQuery->paginate(10, ['*'], 'mashups_page')->withQueryString();
        $allMashups->getCollection()->transform(function ($mashup) use ($disk) {
            $mashup->audio_url = $mashup->file_path ? \Illuminate\Support\Facades\Storage::disk($disk)->url($mashup->file_path) : null;
            return $mashup;
        });
        $allPacks = Pack::with('user')->withCount('mashups')->withTrashed()->latest()->paginate(10, ['*'], 'packs_page');
        $allUsers = User::withCount('mashups')->withTrashed()->latest()->paginate(10, ['*'], 'users_page');

        // Statistics
        $stats = [
            'total_mashups' => Mashup::count(),
            'approved_mashups' => Mashup::where('status', 'approved')->count(),
            'pending_mashups' => Mashup::where('status', 'pending')->count(),
            'pending_packs' => Pack::where('status', 'pending')->count(),
            'rejected_mashups' => Mashup::where('status', 'rejected')->count(),
            'total_users' => User::count(),
            'total_packs' => Pack::count(),
            'total_credits_distributed' => User::sum('credits'),
        ];

        return Inertia::render('Admin/Dashboard', [
            'pendingMashups' => $pendingMashups,
            'pendingPacks' => $pendingPacks,
            'allMashups' => $allMashups,
            'allPacks' => $allPacks,
            'allUsers' => $allUsers,
            'stats' => $stats,
            'filters' => $request->only(['search']),
        ]);
    }

    public function approve(Mashup $mashup)
    {
        $mashup->update([
            'is_approved' => true,
            'status' => 'approved',
            'is_public' => true,
        ]);

        // Award credits
        $reward = \App\Models\Setting::where('key', 'credit_reward_upload')->first()?->value ?? 5;
        $mashup->user->increment('credits', (int) $reward);

        // Notify Discord
        try {
            app(\App\Services\DiscordNotificationService::class)->notifyReviewResult('Mashup', $mashup->title, 'approved', $mashup->user->name);
        } catch (\Exception $e) {
        }

        return redirect()->back()->with('success', 'Mashup aprobado y créditos otorgados.');
    }

    public function reject(Mashup $mashup)
    {
        $mashup->update([
            'is_approved' => false,
            'status' => 'rejected',
            'is_public' => false,
        ]);

        // Notify Discord
        try {
            app(\App\Services\DiscordNotificationService::class)->notifyReviewResult('Mashup', $mashup->title, 'rejected', $mashup->user->name);
        } catch (\Exception $e) {
        }

        return redirect()->back()->with('success', 'Mashup rechazado.');
    }

    public function approvePack(Pack $pack)
    {
        $pack->update([
            'is_approved' => true,
            'status' => 'approved',
            'is_public' => true,
        ]);

        // Notify Discord
        try {
            app(\App\Services\DiscordNotificationService::class)->notifyReviewResult('Pack', $pack->title, 'approved', $pack->user->name);
        } catch (\Exception $e) {
        }

        return redirect()->back()->with('success', 'Pack aprobado.');
    }

    public function rejectPack(Pack $pack)
    {
        $pack->update([
            'is_approved' => false,
            'status' => 'rejected',
            'is_public' => false,
        ]);

        // Notify Discord
        try {
            app(\App\Services\DiscordNotificationService::class)->notifyReviewResult('Pack', $pack->title, 'rejected', $pack->user->name);
        } catch (\Exception $e) {
        }

        return redirect()->back()->with('success', 'Pack rechazado.');
    }

    public function destroyMashup($id)
    {
        $mashup = Mashup::withTrashed()->findOrFail($id);
        if ($mashup->trashed()) {
            $mashup->forceDelete();
            $msg = 'Mashup eliminado permanentemente.';
        } else {
            $mashup->delete();
            $msg = 'Mashup enviado a la papelera.';
        }
        return redirect()->back()->with('success', $msg);
    }

    public function restoreMashup($id)
    {
        Mashup::withTrashed()->findOrFail($id)->restore();
        return redirect()->back()->with('success', 'Mashup restaurado.');
    }

    public function destroyUser($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        if ($user->trashed()) {
            $user->forceDelete();
            $msg = 'Usuario eliminado permanentemente.';
        } else {
            $user->delete();
            $msg = 'Usuario enviado a la papelera.';
        }
        return redirect()->back()->with('success', $msg);
    }

    public function restoreUser($id)
    {
        User::withTrashed()->findOrFail($id)->restore();
        return redirect()->back()->with('success', 'Usuario restaurado.');
    }

    public function destroyPack($id)
    {
        $pack = Pack::withTrashed()->findOrFail($id);
        if ($pack->trashed()) {
            $pack->forceDelete();
            $msg = 'Pack eliminado permanentemente.';
        } else {
            $pack->delete();
            $msg = 'Pack enviado a la papelera.';
        }
        return redirect()->back()->with('success', $msg);
    }

    public function restorePack($id)
    {
        Pack::withTrashed()->findOrFail($id)->restore();
        return redirect()->back()->with('success', 'Pack restaurado.');
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $id,
            'role' => 'required|in:user,admin',
            'credits' => 'integer|min:0'
        ]);

        $user->update($validated);
        return redirect()->back()->with('success', 'Usuario actualizado.');
    }

    public function settings()
    {
        return Inertia::render('Admin/Settings', [
            'settings' => \App\Models\Setting::all()
        ]);
    }

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'credit_cost_download' => 'required|integer|min:0',
            'credit_reward_upload' => 'required|integer|min:0',
            'storage_limit_mb' => 'required|integer|min:10',
            'daily_upload_limit' => 'required|integer|min:1',
            'max_file_size_mb' => 'required|integer|min:1',
            'discord_webhook_url' => 'nullable|url',
        ]);

        foreach ($validated as $key => $value) {
            \App\Models\Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return redirect()->back()->with('success', 'Configuración actualizada.');
    }
}
