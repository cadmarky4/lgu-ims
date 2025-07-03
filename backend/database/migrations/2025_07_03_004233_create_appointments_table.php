<?php

// database/migrations/xxxx_xx_xx_create_appointments_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('base_ticket_id');
            $table->enum('department', [
                'CIVIL_REGISTRY',
                'BARANGAY_ADMINISTRATION',
                'SOCIAL_SERVICES',
                'HEALTH_SERVICES',
                'PUBLIC_SAFETY',
                'BUSINESS_PERMITS'
            ]);
            $table->date('date');
            $table->time('time');
            $table->text('additional_notes')->nullable();
            $table->timestamps();

            // Unique constraint for 1:1 relationship
            $table->unique('base_ticket_id');

            // Indexes
            $table->index('department');
            $table->index('date');
            $table->index(['date', 'time']);

            // Foreign key
            $table->foreign('base_ticket_id')
                ->references('id')
                ->on('tickets')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};