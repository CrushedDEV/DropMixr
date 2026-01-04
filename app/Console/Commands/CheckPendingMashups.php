<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Mashup;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\PendingMashupsNotification;
use Carbon\Carbon;

class CheckPendingMashups extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mashups:check-pending';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for pending mashups older than 30 minutes and notify admins';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $threshold = Carbon::now()->subMinutes(30);

        // Find pending mashups created before threshold that haven't been notified strictly
        // However, user said "in 30 mins no se ha aceptado".
        // Assuming we notify ONCE per batch.

        $pendingMashups = Mashup::where('status', 'pending')
            ->where('created_at', '<=', $threshold)
            ->where('admin_notified', false)
            ->get();

        if ($pendingMashups->count() > 0) {
            $this->info("Found {$pendingMashups->count()} pending mashups to notify.");

            $admins = User::where('role', 'admin')->get();

            if ($admins->count() > 0) {
                foreach ($admins as $admin) {
                    Mail::to($admin->email)->send(new PendingMashupsNotification($pendingMashups->count()));
                }
                $this->info("Notification sent to {$admins->count()} admins.");

                // Mark as notified so we don't spam 
                // (Unless user wants repeated notifications? usually no)
                Mashup::whereIn('id', $pendingMashups->pluck('id'))
                    ->update(['admin_notified' => true]);
            } else {
                $this->warn("No admins found to notify.");
            }
        } else {
            $this->info("No regular pending mashups found requiring notification.");
        }
    }
}
