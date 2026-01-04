<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Setting::firstOrCreate([
            'key' => 'credit_cost_download',
        ], [
            'value' => '1',
        ]);

        \App\Models\Setting::firstOrCreate([
            'key' => 'credit_reward_upload',
        ], [
            'value' => '5',
        ]);

        \App\Models\Setting::firstOrCreate([
            'key' => 'storage_limit_mb',
        ], [
            'value' => '500',
        ]);

        \App\Models\Setting::firstOrCreate([
            'key' => 'daily_upload_limit',
        ], [
            'value' => '10',
        ]);

        \App\Models\Setting::firstOrCreate([
            'key' => 'max_file_size_mb',
        ], [
            'value' => '500',
        ]);
    }
}
