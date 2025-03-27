<?php

namespace Database\Factories;

use App\Models\Mashup;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class MashupFactory extends Factory
{
    protected $model = Mashup::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'file_path' => 'audio/' . $this->faker->uuid() . '.mp3',
            'user_id' => User::factory(), // Crea un usuario asociado
            'bpm' => $this->faker->numberBetween(60, 180),
            'key' => $this->faker->randomElement(['C', 'D#m', 'F#m', 'G']),
            'duration' => $this->faker->randomFloat(2, 1, 10) * 60, // Duración en segundos
            'description' => $this->faker->paragraph(),
            'is_public' => $this->faker->boolean(),
            'is_approved' => $this->faker->boolean(),
            'status' => $this->faker->randomElement(['pending', 'approved', 'rejected']),
        ];
    }
}
