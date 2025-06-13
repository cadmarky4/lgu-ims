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
            
            // Document Information
            $table->string('document_number')->unique();
            $table->enum('document_type', [
                'BARANGAY_CLEARANCE',
                'CERTIFICATE_OF_RESIDENCY',
                'CERTIFICATE_OF_INDIGENCY',
                'BUSINESS_PERMIT',
                'BUILDING_PERMIT',
                'ELECTRICAL_PERMIT',
                'SANITARY_PERMIT',
                'FENCING_PERMIT',
                'EXCAVATION_PERMIT',
                'CERTIFICATE_OF_GOOD_MORAL',
                'FIRST_TIME_JOB_SEEKER',
                'SOLO_PARENT_CERTIFICATE',
                'SENIOR_CITIZEN_ID',
                'PWD_ID',
                'CERTIFICATE_OF_COHABITATION',
                'DEATH_CERTIFICATE',
                'BIRTH_CERTIFICATE_COPY',
                'MARRIAGE_CONTRACT_COPY',
                'OTHER'
            ]);
            $table->string('title');
            $table->text('description')->nullable();
            
            // Applicant Information
            $table->foreignId('resident_id')->constrained()->onDelete('cascade');
            $table->string('applicant_name'); // In case different from resident
            $table->string('applicant_address')->nullable();
            $table->string('applicant_contact')->nullable();
            
            // Request Details
            $table->text('purpose');
            $table->date('requested_date');
            $table->date('needed_date')->nullable();
            $table->enum('priority', ['LOW', 'NORMAL', 'HIGH', 'URGENT'])->default('NORMAL');
            
            // Processing Information
            $table->enum('status', [
                'PENDING',
                'UNDER_REVIEW',
                'APPROVED',
                'READY_FOR_PICKUP',
                'RELEASED',
                'REJECTED',
                'CANCELLED',
                'ON_HOLD'
            ])->default('PENDING');
            
            $table->date('approved_date')->nullable();
            $table->date('released_date')->nullable();
            $table->date('expiry_date')->nullable();
            
            // Staff Information
            $table->foreignId('processed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('released_by')->nullable()->constrained('users')->onDelete('set null');
            
            // Fees and Payment
            $table->decimal('processing_fee', 8, 2)->default(0);
            $table->decimal('amount_paid', 8, 2)->default(0);
            $table->enum('payment_status', ['UNPAID', 'PARTIAL', 'PAID', 'WAIVED'])->default('UNPAID');
            $table->string('payment_method')->nullable();
            $table->string('receipt_number')->nullable();
            $table->date('payment_date')->nullable();
            
            // Additional Information
            $table->json('requirements_submitted')->nullable();
            $table->json('attachments')->nullable();
            $table->text('remarks')->nullable();
            $table->text('rejection_reason')->nullable();
            
            // QR Code and Security
            $table->string('qr_code')->nullable();
            $table->string('verification_code')->nullable();
            
            // Metadata
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
            
            // Indexes
            $table->index('document_number');
            $table->index('document_type');
            $table->index('resident_id');
            $table->index('status');
            $table->index('requested_date');
            $table->index(['status', 'priority']);
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
