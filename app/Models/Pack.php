<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pack extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'cover_image_path',
        'price',
        'is_public',
        'file_path',
        'file_size',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function mashups()
    {
        return $this->belongsToMany(Mashup::class, 'mashup_pack');
    }

    public function purchases()
    {
        return $this->hasMany(PackPurchase::class);
    }
}
