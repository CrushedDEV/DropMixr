<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mashup extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'file_path',
        'user_id',
        'bpm',
        'key',
        'duration',
        'description',
        'is_public',
        'is_approved',
        'status',
    ];

    /**
     * Relación con el modelo User.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
