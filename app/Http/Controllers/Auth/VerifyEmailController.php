<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(Request $request, $id, $hash): RedirectResponse
    {
        $user = User::find($id);

        if (!$user) {
            abort(404);
        }

        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            abort(403);
        }

        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(route('explore', absolute: false) . '?verified=1');
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));

            // Auto-login the user since they just verified
            Auth::login($user);
        }

        return redirect()->intended(route('explore', absolute: false) . '?verified=1');
    }
}