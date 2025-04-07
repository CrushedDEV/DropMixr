<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MashupController;

Route::get('/', function () {
    return Inertia::render('HomePage');
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('explore', function () {
        return Inertia::render('explore');
    })->name('explore');
});


Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::resource('mashups', controller: MashupController::class);

Route::get('/upload', function () {
    return Inertia::render('upload');
});

Route::get('/mashups/download/{filename}', [MashupController::class, 'download']);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
