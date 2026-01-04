<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controller;

class UserMashupController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    /**
     * Obtener todos los mashups del usuario autenticado
     */
    public function index(Request $request)
    {
        $mashups = $request->user()
            ->mashups()
            ->latest()
            ->get()
            ->map(function ($mashup) {
                return [
                    'id' => $mashup->id,
                    'title' => $mashup->title,
                    'description' => $mashup->description,
                    'bpm' => $mashup->bpm,
                    'key' => $mashup->key,
                    'duration' => $mashup->duration,
                    'image' => $mashup->image_path ? Storage::url($mashup->image_path) : '/default-image.jpg',
                    'audio' => $mashup->file_path ? Storage::url($mashup->file_path) : null,
                    'is_public' => $mashup->is_public,
                    'is_approved' => $mashup->is_approved,
                    'status' => $mashup->status,
                    'created_at' => $mashup->created_at,
                ];
            });

        return response()->json($mashups);
    }
}
