<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use CapsulesCodes\InertiaMailable\Mail\Mailable;
use CapsulesCodes\InertiaMailable\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;


class VerifyEmailCustom extends Mailable
{
    use Queueable, SerializesModels;

    public string $verificationUrl;

    public function __construct(string $verificationUrl, string $name)
    {
        $this->verificationUrl = $verificationUrl;
        $this->name = $name;
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Verifica tu correo');
    }

    public function content(): Content
    {
        return new Content(
            view: 'VerifyEmail',
            props: [
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
