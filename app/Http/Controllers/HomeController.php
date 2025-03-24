<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('HomePage', [
            'title' => 'Bienvenidos a DropMix', 
            'description' => 'DropMix es una plataforma donde DJs y productores pueden intercambiar mashups. ¡Comparte y descarga música con facilidad!',
            'features' => [
                'Sube tus mashups',
                'Escucha los mashups más populares',
                'Intercambia música con otros productores',
                'Moderación para asegurar la calidad'
            ],
        ]);
    }
}
