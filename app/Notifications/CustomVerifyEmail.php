<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as BaseVerifyEmail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use App\Mail\VerifyEmailCustom;

class CustomVerifyEmail extends BaseVerifyEmail
{
    protected function verificationUrl($notifiable)
    {
        return URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(30),
            ['id' => $notifiable->getKey(), 'hash' => sha1($notifiable->getEmailForVerification())]
        );
    }

    public function toMail($notifiable)
    {
        $url = $this->verificationUrl($notifiable);
        $name = $notifiable->name;

        // Ensure the Mailable has a recipient. When returning a Mailable from a
        // Notification, Laravel does not automatically set the "to" address.
        // Configure it explicitly to avoid "An email must have a To, Cc, or Bcc header".
        return (new VerifyEmailCustom($url, $name))
            ->to($notifiable->email, $name);
    }

}
