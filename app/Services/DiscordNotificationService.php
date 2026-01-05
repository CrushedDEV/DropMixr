<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Setting;

class DiscordNotificationService
{
    protected function getWebhookUrl()
    {
        return Setting::where('key', 'discord_webhook_url')->value('value');
    }

    public function send($message)
    {
        $webhookUrl = $this->getWebhookUrl();

        if (!$webhookUrl) {
            return;
        }

        try {
            Http::post($webhookUrl, [
                'content' => $message,
            ]);
        } catch (\Exception $e) {
            Log::error('Discord Webhook Failed: ' . $e->getMessage());
        }
    }

    public function notifyNewContent($type, $title, $userName, $url)
    {
        $message = "**Nuevo {$type} pendiente de revisión** 🚨\n\n" .
            "**Título:** {$title}\n" .
            "**Usuario:** {$userName}\n" .
            "**Link:** {$url}\n";

        $this->send($message);
    }

    public function notifyReviewResult($type, $title, $status, $userName)
    {
        $emoji = $status === 'approved' ? '✅' : '❌';
        $statusText = $status === 'approved' ? 'aprobado' : 'rechazado';

        $message = "{$emoji} **{$type} {$statusText}**\n\n" .
            "**Título:** {$title}\n" .
            "**Usuario:** {$userName}\n";

        $this->send($message);
    }
}
