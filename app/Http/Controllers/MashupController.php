<?php

namespace App\Http\Controllers;

use App\Models\Mashup;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class MashupController extends Controller
{
    public function index()
    {
        $mashups = Mashup::with('user')
            ->get()
            ->map(function ($mashup) {
                return [
                    'id' => $mashup->id,
                    'title' => $mashup->title,
                    'bpm' => $mashup->bpm,
                    'key' => $mashup->key,
                    'duration' => $mashup->duration,
                    'description' => $mashup->description,
                    'image' => $mashup->image_path ?? '/default-image.jpg',
                    'audio' => $mashup->file_path,
                    'user' => [
                        'name' => $mashup->user->name ?? 'Desconocido',
                    ],
                ];
            });

        return response()->json($mashups);
    }

    public function create()
    {
        // Retornar la vista de creación a través de Inertia
        return Inertia::render('Mashups/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'file_path' => 'required|file|mimes:mp3,wav',
            'bpm' => 'nullable|integer',
            'key' => 'nullable|string|max:10',
            'duration' => 'nullable|numeric',
            'description' => 'nullable|string',
            'is_public' => 'required|boolean',
        ]);

        $filePath = $request->file('file_path')->store('mashups', 'public');

        Mashup::create([
            'title' => $request->title,
            'file_path' => $filePath,
            'user_id' => auth()->id(),
            'bpm' => $request->bpm,
            'key' => $request->key,
            'duration' => $request->duration,
            'description' => $request->description,
            'is_public' => $request->is_public,
            'is_approved' => false,
            'status' => 'pending',
        ]);

        return redirect('/explore')->with('success', 'Mashup subido exitosamente.');
    }

    public function show(Mashup $mashup)
    {
        // Retornar los detalles del mashup a través de Inertia
        return Inertia::render('Mashups/Show', [
            'mashup' => $mashup,
        ]);
    }

    public function edit(Mashup $mashup)
    {
        // Retornar la vista de edición a través de Inertia
        return Inertia::render('Mashups/Edit', [
            'mashup' => $mashup,
        ]);
    }

    public function update(Request $request, Mashup $mashup)
    {
        // Validar los datos del formulario
        $request->validate([
            'title' => 'required|string|max:255',
            'file_path' => 'required|string',
            'bpm' => 'nullable|integer',
            'key' => 'nullable|string|max:10',
            'duration' => 'nullable|numeric',
            'description' => 'nullable|string',
            'is_public' => 'required|boolean',
            'is_approved' => 'required|boolean',
            'status' => 'required|in:pending,approved,rejected',
        ]);

        // Actualizar el mashup
        $mashup->update($request->all());

        // Redirigir al índice con un mensaje de éxito
        return redirect()->route('mashups.index')->with('success', 'Mashup actualizado exitosamente.');
    }

    public function destroy(Mashup $mashup)
    {
        // Eliminar el mashup
        $mashup->delete();

        // Redirigir al índice con un mensaje de éxito
        return redirect()->route('mashups.index')->with('success', 'Mashup eliminado exitosamente.');
    }

    public function download($filename)
    {
        return Storage::download('mashups/' . $filename);
    }
}
