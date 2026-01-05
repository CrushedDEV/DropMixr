<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerifyEmailCustom extends Mailable
{
    use Queueable, SerializesModels;

    public string $verificationUrl;
    public string $name;

    public function __construct(string $verificationUrl, string $name)
    {
        $this->verificationUrl = $verificationUrl;
        $this->name = $name;
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Verifica tu cuenta - DropMixr');
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.verify-email',
            with: [
                'url' => $this->verificationUrl,
                'name' => $this->name
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
