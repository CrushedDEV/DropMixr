<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class DeleteUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:delete {email : The email of the user to delete} {--force : Force delete the user}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete a user by email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $force = $this->option('force');

        $user = User::withTrashed()->where('email', $email)->first();

        if (!$user) {
            $this->error("User with email '{$email}' not found.");
            return 1;
        }

        $status = $user->trashed() ? '[Trashed]' : '';

        if ($this->confirm("Are you sure you want to delete user '{$user->name}' ({$email}) {$status}?")) {
            if ($force) {
                $user->forceDelete();
                $this->info("User '{$email}' force deleted successfully.");
            } else {
                $user->delete();
                $this->info("User '{$email}' deleted successfully (soft delete).");
            }
        } else {
            $this->info("Operation cancelled.");
        }

        return 0;
    }
}
