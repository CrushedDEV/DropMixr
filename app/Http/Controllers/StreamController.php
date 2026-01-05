<?php

namespace App\Http\Controllers;

use App\Models\Mashup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StreamController extends Controller
{
    public function stream(Request $request, Mashup $mashup)
    {
        try {
            // 1. Security Check: Require custom header identifying the player
            if (!$request->hasHeader('X-dropmixr-Stream')) {
                abort(403, 'Direct access denied.');
            }

            if (!$mashup->file_path) {
                abort(404, 'File path missing.');
            }

            $disk = config('filesystems.default', 'public');

            // Determine if we should serve original quality (Admins only)
            // or if we must serve the preview (General public/users)
            $isAdmin = $request->user()?->role === 'admin';

            $pathToSend = (!$isAdmin && $mashup->preview_path && Storage::disk($disk)->exists($mashup->preview_path))
                ? $mashup->preview_path
                : $mashup->file_path;

            if (!Storage::disk($disk)->exists($pathToSend)) {
                abort(404, 'File not found on disk.');
            }

            // Serve the file using Storage facade which handles paths correctly for different drivers
            return Storage::disk($disk)->response($pathToSend, $mashup->title . ($pathToSend === $mashup->preview_path ? '-preview' : '') . '.mp3', [
                'Content-Type' => 'audio/mpeg',
                'Content-Disposition' => 'inline',
                'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
            ]);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Stream Error: ' . $e->getMessage());
            abort(500, 'Stream Error');
        }
    }
}
