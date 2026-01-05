<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MashupController;
use App\Http\Controllers\UserMashupController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserDashboardController;
use App\Http\Controllers\PackController;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect('/explore');
    }
    return Inertia::render('HomePage');
})->name('home');

Route::get('/about', function () {
    if (auth()->check()) {
        return redirect('/explore');
    }
    return Inertia::render('about');
})->name('about');

// Rutas protegidas de mashups (requieren autenticación y verificación de email)
// ⚠️ IMPORTANTE: Estas deben estar ANTES de las rutas públicas con parámetros
Route::middleware(['auth', 'verified'])->group(function () {
    // User Dashboard
    Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');

    Route::get('explore', function () {
        return Inertia::render('explore');
    })->name('explore');

    Route::get('/onboarding', function () {
        return Inertia::render('Welcome/Onboarding');
    })->name('onboarding');

    // API de mashups del usuario
    Route::get('/api/user/mashups', [UserMashupController::class, 'index']);
    Route::get('/mashups/my', function () {
        return Inertia::render('Mashups/MyMashups');
    })->name('mashups.my');

    Route::get('/mashups/create', [MashupController::class, 'create'])->name('mashups.create');
    Route::get('/mashups/batch', function () {
        return Inertia::render('mashups/BatchUpload');
    })->name('mashups.batch');
    Route::post('/mashups', [MashupController::class, 'store'])->name('mashups.store');
    Route::get('/mashups/{mashup}/edit', [MashupController::class, 'edit'])->name('mashups.edit');
    Route::put('/mashups/{mashup}', [MashupController::class, 'update'])->name('mashups.update');
    Route::delete('/mashups/{mashup}', [MashupController::class, 'destroy'])->name('mashups.destroy');
    Route::get('/mashups/{mashup}/download', [MashupController::class, 'download'])->name('mashups.download');
    Route::get('/mashups/{mashup}/stream', [MashupController::class, 'stream'])->name('mashups.stream'); // Protected secure stream using header check

    // Pack Routes
    Route::get('/packs/create', [PackController::class, 'create'])->name('packs.create');
    Route::post('/packs', [PackController::class, 'store'])->name('packs.store');
    Route::get('/packs/{pack}', [PackController::class, 'show'])->name('packs.show');
    Route::post('/packs/{pack}/buy', [PackController::class, 'buy'])->name('packs.buy');
    Route::get('/packs/{pack}/download', [PackController::class, 'download'])->name('packs.download');


    // Admin Routes - Solo usuarios con rol admin
    Route::prefix('admin')->middleware('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('dashboard');
        Route::put('/mashups/{mashup}/approve', [AdminController::class, 'approve'])->name('mashups.approve');
        Route::put('/mashups/{mashup}/approve', [AdminController::class, 'approve'])->name('mashups.approve');
        Route::put('/mashups/{mashup}/reject', [AdminController::class, 'reject'])->name('mashups.reject');

        Route::put('/packs/{pack}/approve', [AdminController::class, 'approvePack'])->name('packs.approve');
        Route::put('/packs/{pack}/reject', [AdminController::class, 'rejectPack'])->name('packs.reject');

        // Extended Admin Management
        Route::delete('/mashups/{id}', [AdminController::class, 'destroyMashup'])->name('mashups.delete');
        Route::post('/mashups/{id}/restore', [AdminController::class, 'restoreMashup'])->name('mashups.restore');

        Route::delete('/users/{id}', [AdminController::class, 'destroyUser'])->name('users.delete');
        Route::post('/users/{id}/restore', [AdminController::class, 'restoreUser'])->name('users.restore');
        Route::put('/users/{id}', [AdminController::class, 'updateUser'])->name('users.update');

        Route::delete('/packs/{id}', [AdminController::class, 'destroyPack'])->name('packs.delete');
        Route::post('/packs/{id}/restore', [AdminController::class, 'restorePack'])->name('packs.restore');

        Route::get('/settings', [AdminController::class, 'settings'])->name('settings');
        Route::post('/settings', [AdminController::class, 'updateSettings'])->name('settings.update');
    });
});

// Rutas públicas de mashups (después de las protegidas)
Route::get('/mashups', [MashupController::class, 'index'])->name('mashups.index');
Route::get('/mashups/{mashup}', [MashupController::class, 'show'])->name('mashups.show');
Route::get('/packs', [PackController::class, 'index'])->name('packs.index');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';