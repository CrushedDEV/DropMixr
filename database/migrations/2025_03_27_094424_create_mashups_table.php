<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mashups', function (Blueprint $table) {
            $table->id();
            $table->string('title');  // Título del mashup
            $table->string('file_path');  // Ruta del archivo en almacenamiento
            $table->unsignedBigInteger('user_id');  // Relación con el usuario que sube el mashup
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->integer('bpm')->nullable();  // BPM del mashup
            $table->string('key')->nullable();  // Tonalidad del mashup
            $table->float('duration')->nullable();  // Duración del mashup en segundos
            $table->text('description')->nullable();  // Descripción del mashup
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');  // Estado del mashup
            $table->timestamps();
            $table->boolean('is_public')->default(false);  // Indica si el mashup es visible para otros usuarios
            $table->boolean('is_approved')->default(false);  // Indica si el mashup ha sido aprobado por un moderador
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mashups');
    }
};
