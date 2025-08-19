<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('buckets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('endpoint');
            $table->string('access_key');
            $table->string('secret_key');
            $table->timestamps();
        });

        DB::table('buckets')->insert([
            'endpoint'   => 'http://localhost:9000',
            'name'       => 'main',
            'access_key' => 'admin',
            'secret_key' => 'password',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('bucket_id')->default(1)->constrained()->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('bucket_id');
        });
        Schema::dropIfExists('buckets');
    }
};
