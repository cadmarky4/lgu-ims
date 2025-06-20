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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('document_type');
            $table->unsignedBigInteger('resident_id');
            $table->string('resident_name');
            $table->text('purpose');
            $table->enum('status', ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'RELEASED', 'REJECTED'])->default('PENDING');
            $table->enum('priority', ['LOW', 'NORMAL', 'HIGH', 'URGENT'])->default('NORMAL');
            $table->timestamp('request_date');
            $table->timestamp('processed_date')->nullable();
            $table->timestamp('approved_date')->nullable();
            $table->timestamp('released_date')->nullable();
            $table->decimal('processing_fee', 8, 2)->default(0);
            $table->enum('payment_status', ['UNPAID', 'PAID', 'WAIVED'])->default('UNPAID');
            $table->string('certifying_official')->nullable();
            $table->text('notes')->nullable();
            $table->text('remarks')->nullable();
            $table->json('requirements_submitted')->nullable();
            $table->string('document_number')->nullable();
            $table->date('expiry_date')->nullable();
            $table->string('qr_code')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('processed_by')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->unsignedBigInteger('released_by')->nullable();
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('resident_id')->references('id')->on('residents')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('processed_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('released_by')->references('id')->on('users')->onDelete('set null');

            // Indexes
            $table->index('resident_id');
            $table->index('document_type');
            $table->index('status');
            $table->index('request_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
