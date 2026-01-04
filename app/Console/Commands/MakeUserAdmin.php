<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class MakeUserAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:make-admin {email : El email del usuario}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Asignar rol de administrador a un usuario';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');

        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("❌ Usuario con email '{$email}' no encontrado.");
            return 1;
        }

        if ($user->role === 'admin') {
            $this->warn("⚠️  El usuario '{$user->name}' ya es administrador.");
            return 0;
        }

        $user->role = 'admin';
        $user->save();

        $this->info("✅ Usuario '{$user->name}' ({$email}) ahora es administrador.");
        return 0;
    }
}
