<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('mashups', function (Blueprint $table) {
            $table->bigInteger('file_size')->nullable()->after('duration');
        });

        Schema::table('packs', function (Blueprint $table) {
            $table->string('file_path')->nullable()->after('description');
            $table->bigInteger('file_size')->nullable()->after('file_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mashups', function (Blueprint $table) {
            $table->dropColumn('file_size');
        });

        Schema::table('packs', function (Blueprint $table) {
            $table->dropColumn(['file_path', 'file_size']);
        });
    }
};
