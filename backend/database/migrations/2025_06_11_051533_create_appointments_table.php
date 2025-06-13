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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            
            // Appointment Information
            $table->string('appointment_number')->unique();
            $table->string('subject');
            $table->text('purpose');
            $table->enum('appointment_type', [
                'CONSULTATION',
                'DOCUMENT_REQUEST',
                'COMPLAINT_FILING',
                'BUSINESS_PERMIT',
                'CLEARANCE_REQUEST',
                'MEDIATION',
                'INQUIRY',
                'MARRIAGE_COUNSELING',
                'SENIOR_CITIZEN_BENEFITS',
                'PWD_SERVICES',
                'YOUTH_PROGRAMS',
                'LIVELIHOOD_PROGRAMS',
                'HEALTH_SERVICES',
                'SOCIAL_SERVICES',
                'OTHER'
            ]);
            
            // Appointee Information
            $table->foreignId('resident_id')->nullable()->constrained()->onDelete('set null');
            $table->string('appointee_name');
            $table->string('appointee_contact');
            $table->string('appointee_email')->nullable();
            $table->text('appointee_address')->nullable();
            
            // Appointment Schedule
            $table->date('appointment_date');
            $table->time('appointment_time');
            $table->time('end_time')->nullable();
            $table->integer('duration_minutes')->default(30);
            $table->string('location')->default('Barangay Hall');
            $table->string('room_venue')->nullable();
            
            // Official/Staff Assignment
            $table->foreignId('assigned_official')->nullable()->constrained('users')->onDelete('set null');
            $table->string('assigned_official_name')->nullable(); // In case external official
            $table->string('department')->nullable();
            
            // Status and Processing
            $table->enum('status', [
                'PENDING',
                'CONFIRMED',
                'RESCHEDULED',
                'IN_PROGRESS',
                'COMPLETED',
                'CANCELLED',
                'NO_SHOW',
                'POSTPONED'
            ])->default('PENDING');
            
            $table->date('date_requested');
            $table->date('confirmed_date')->nullable();
            $table->datetime('actual_start_time')->nullable();
            $table->datetime('actual_end_time')->nullable();
            
            // Rescheduling Information
            $table->date('original_date')->nullable();
            $table->time('original_time')->nullable();
            $table->text('reschedule_reason')->nullable();
            $table->integer('reschedule_count')->default(0);
            
            // Requirements and Preparation
            $table->json('required_documents')->nullable();
            $table->json('documents_submitted')->nullable();
            $table->text('special_requirements')->nullable();
            $table->boolean('all_requirements_met')->default(false);
            
            // Outcome and Follow-up
            $table->text('meeting_notes')->nullable();
            $table->text('action_items')->nullable();
            $table->text('outcome_summary')->nullable();
            $table->enum('resolution_status', [
                'RESOLVED',
                'PENDING_ACTION',
                'REQUIRES_FOLLOWUP',
                'REFERRED_TO_OTHER',
                'INCOMPLETE',
                'NOT_APPLICABLE'
            ])->nullable();
            
            // Follow-up Information
            $table->boolean('requires_followup')->default(false);
            $table->date('followup_date')->nullable();
            $table->text('followup_notes')->nullable();
            $table->foreignId('followup_assigned_to')->nullable()->constrained('users')->onDelete('set null');
            
            // Priority and Urgency
            $table->enum('priority', ['LOW', 'NORMAL', 'HIGH', 'URGENT'])->default('NORMAL');
            $table->boolean('is_walk_in')->default(false);
            $table->boolean('is_emergency')->default(false);
            
            // Communication and Notifications
            $table->boolean('confirmation_sent')->default(false);
            $table->boolean('reminder_sent')->default(false);
            $table->datetime('confirmation_sent_at')->nullable();
            $table->datetime('reminder_sent_at')->nullable();
            $table->enum('preferred_contact_method', ['SMS', 'EMAIL', 'PHONE', 'IN_PERSON'])->default('SMS');
            
            // Rating and Feedback
            $table->integer('service_rating')->nullable(); // 1-5
            $table->text('appointee_feedback')->nullable();
            $table->boolean('feedback_received')->default(false);
            
            // Documentation
            $table->json('attachments')->nullable();
            $table->string('reference_number')->nullable();
            
            // Metadata
            $table->text('remarks')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
            
            // Indexes
            $table->index('appointment_number');
            $table->index('appointment_type');
            $table->index('status');
            $table->index('appointment_date');
            $table->index('assigned_official');
            $table->index(['appointment_date', 'appointment_time']);
            $table->index(['status', 'priority']);
            $table->index('resident_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
