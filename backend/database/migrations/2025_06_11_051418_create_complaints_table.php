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
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            
            // Complaint Information
            $table->string('complaint_number')->unique();
            $table->string('subject');
            $table->text('description');
            $table->enum('category', [
                'INFRASTRUCTURE',
                'PUBLIC_SERVICE',
                'HEALTH_SANITATION',
                'PEACE_ORDER',
                'ENVIRONMENT',
                'CORRUPTION',
                'DISCRIMINATION',
                'NOISE_COMPLAINT',
                'GARBAGE_COLLECTION',
                'WATER_SUPPLY',
                'ELECTRICAL',
                'ROAD_MAINTENANCE',
                'OTHER'
            ]);
            $table->enum('priority', ['LOW', 'NORMAL', 'HIGH', 'URGENT'])->default('NORMAL');
            
            // Complainant Information
            $table->foreignId('resident_id')->nullable()->constrained()->onDelete('set null');
            $table->string('complainant_name');
            $table->string('complainant_contact')->nullable();
            $table->string('complainant_email')->nullable();
            $table->text('complainant_address')->nullable();
            $table->boolean('is_anonymous')->default(false);
            
            // Location and Incident Details
            $table->text('incident_location')->nullable();
            $table->date('incident_date')->nullable();
            $table->time('incident_time')->nullable();
            $table->text('persons_involved')->nullable();
            $table->text('witnesses')->nullable();
            
            // Processing Information
            $table->enum('status', [
                'PENDING',
                'ACKNOWLEDGED',
                'UNDER_INVESTIGATION',
                'IN_PROGRESS',
                'RESOLVED',
                'CLOSED',
                'REJECTED',
                'ON_HOLD'
            ])->default('PENDING');
            
            $table->date('date_received');
            $table->date('acknowledged_date')->nullable();
            $table->date('target_resolution_date')->nullable();
            $table->date('actual_resolution_date')->nullable();
            
            // Assignment and Handling
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('investigated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->string('assigned_department')->nullable();
            
            // Resolution and Actions
            $table->text('actions_taken')->nullable();
            $table->text('resolution_details')->nullable();
            $table->text('recommendations')->nullable();
            $table->enum('resolution_type', [
                'RESOLVED',
                'REFERRED_TO_AUTHORITIES',
                'MEDIATED',
                'NO_ACTION_REQUIRED',
                'INSUFFICIENT_EVIDENCE',
                'WITHDRAWN',
                'OTHER'
            ])->nullable();
            
            // Feedback and Rating
            $table->integer('satisfaction_rating')->nullable(); // 1-5
            $table->text('complainant_feedback')->nullable();
            $table->boolean('is_feedback_received')->default(false);
            
            // Documentation
            $table->json('attachments')->nullable();
            $table->json('evidence_files')->nullable();
            $table->text('investigation_notes')->nullable();
            
            // Follow-up and Monitoring
            $table->boolean('requires_followup')->default(false);
            $table->date('followup_date')->nullable();
            $table->text('followup_notes')->nullable();
            
            // Metadata
            $table->text('remarks')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
            
            // Indexes
            $table->index('complaint_number');
            $table->index('category');
            $table->index('status');
            $table->index('priority');
            $table->index('date_received');
            $table->index(['status', 'priority']);
            $table->index('assigned_to');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
