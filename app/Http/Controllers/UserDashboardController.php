<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Download;
use App\Models\Mashup;
use Inertia\Inertia;

class UserDashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $disk = config('filesystems.default', 'public');

        // User's uploaded mashups
        $uploadedMashups = $user->mashups()
            ->latest()
            ->get()
            ->map(function ($mashup) use ($disk) {
                return [
                    'id' => $mashup->id,
                    'title' => $mashup->title,
                    'description' => $mashup->description,
                    'bpm' => $mashup->bpm,
                    'key' => $mashup->key,
                    'image' => $mashup->image_path ? Storage::disk($disk)->url($mashup->image_path) : '/default-image.jpg',
                    'audio' => $mashup->file_path ? Storage::disk($disk)->url($mashup->file_path) : null,
                    'status' => $mashup->status,
                    'is_approved' => $mashup->is_approved,
                    'created_at' => $mashup->created_at,
                    'downloads_count' => Download::where('mashup_id', $mashup->id)->count(),
                ];
            });

        // User's purchased mashups
        $purchasedMashups = Download::where('user_id', $user->id)
            ->with(['mashup.user'])
            ->latest()
            ->get()
            ->map(function ($download) use ($disk) {
                $mashup = $download->mashup;
                return [
                    'id' => $mashup->id,
                    'title' => $mashup->title,
                    'bpm' => $mashup->bpm,
                    'key' => $mashup->key,
                    'image' => $mashup->image_path ? Storage::disk($disk)->url($mashup->image_path) : '/default-image.jpg',
                    'audio' => $mashup->file_path ? Storage::disk($disk)->url($mashup->file_path) : null,
                    'user' => $mashup->user->name ?? 'Desconocido',
                    'credits_spent' => $download->credits_spent,
                    'purchased_at' => $download->created_at,
                ];
            });

        // User stats
        $stats = [
            'credits' => $user->credits,
            'total_uploads' => $user->mashups()->count(),
            'approved_uploads' => $user->mashups()->where('status', 'approved')->count(),
            'pending_uploads' => $user->mashups()->where('status', 'pending')->count(),
            'total_purchases' => Download::where('user_id', $user->id)->count(),
            'credits_spent' => Download::where('user_id', $user->id)->sum('credits_spent'),
            'credits_earned' => $user->mashups()->where('status', 'approved')->count() * 5, // Approximate based on reward
        ];

        return Inertia::render('Dashboard', [
            'uploadedMashups' => $uploadedMashups,
            'purchasedMashups' => $purchasedMashups,
            'stats' => $stats,
        ]);
    }
}
