<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class EmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_email_verification_screen_can_be_rendered()
    {
        $user = User::factory()->unverified()->create();

        $response = $this->actingAs($user)->get('/verify-email');

        $response->assertStatus(200);
    }

    public function test_email_can_be_verified_and_autologs_in()
    {
        $user = User::factory()->unverified()->create();

        Event::fake();

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(30),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        // Access without being logged in
        $response = $this->get($verificationUrl);

        Event::assertDispatched(Verified::class);
        $this->assertTrue($user->fresh()->hasVerifiedEmail());
        $this->assertAuthenticatedAs($user);
        $response->assertRedirect(route('explore', absolute: false) . '?verified=1');
    }

    public function test_verified_user_cannot_autologin_with_verification_link()
    {
        $user = User::factory()->create(); // Verified by default
        $this->assertTrue($user->hasVerifiedEmail());

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(30),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        // Ensure we are guest
        $this->assertGuest();

        // Access link
        $response = $this->get($verificationUrl);

        // Should be redirected but NOT logged in
        $response->assertRedirect(route('explore', absolute: false) . '?verified=1');
        $this->assertGuest();
    }

    public function test_verification_link_expires_after_30_minutes()
    {
        $user = User::factory()->unverified()->create();

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(30),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        // Travel to future
        $this->travel(31)->minutes();

        $response = $this->get($verificationUrl);

        $response->assertStatus(403);
        $this->assertFalse($user->fresh()->hasVerifiedEmail());
    }

    public function test_email_is_not_verified_with_invalid_hash()
    {
        $user = User::factory()->unverified()->create();

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(30),
            ['id' => $user->id, 'hash' => sha1('wrong-email')]
        );

        $this->get($verificationUrl);

        $this->assertFalse($user->fresh()->hasVerifiedEmail());
    }
}
