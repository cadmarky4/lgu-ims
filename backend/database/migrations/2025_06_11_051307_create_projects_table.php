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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            
            // Project Information
            $table->string('project_code')->unique();
            $table->string('title');
            $table->text('description');
            $table->text('objectives')->nullable();
            $table->text('expected_outcomes')->nullable();
            
            // Project Classification
            $table->enum('category', [
                'INFRASTRUCTURE', 
                'HEALTH', 
                'EDUCATION', 
                'SOCIAL_SERVICES', 
                'ENVIRONMENT', 
                'LIVELIHOOD', 
                'DISASTER_PREPAREDNESS',
                'YOUTH_DEVELOPMENT',
                'SENIOR_CITIZEN_PROGRAM',
                'WOMEN_EMPOWERMENT',
                'OTHER'
            ]);
            $table->enum('type', ['REGULAR', 'SPECIAL', 'EMERGENCY', 'FUNDED', 'DONATION'])->default('REGULAR');
            $table->enum('priority', ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'])->default('NORMAL');
            
            // Timeline
            $table->date('start_date');
            $table->date('end_date');
            $table->date('actual_start_date')->nullable();
            $table->date('actual_end_date')->nullable();
            $table->integer('duration_days')->nullable();
            
            // Budget Information
            $table->decimal('total_budget', 15, 2);
            $table->decimal('allocated_budget', 15, 2);
            $table->decimal('utilized_budget', 15, 2)->default(0);
            $table->decimal('remaining_budget', 15, 2)->nullable();
            $table->enum('funding_source', [
                'BARANGAY_FUNDS',
                'MUNICIPAL_FUNDS', 
                'PROVINCIAL_FUNDS',
                'NATIONAL_GOVERNMENT',
                'NGO',
                'PRIVATE_SECTOR',
                'DONATIONS',
                'MIXED_FUNDING'
            ])->default('BARANGAY_FUNDS');
            $table->string('funding_agency')->nullable();
            
            // Location and Beneficiaries
            $table->string('location');
            $table->json('target_puroks')->nullable();
            $table->integer('target_beneficiaries')->nullable();
            $table->integer('actual_beneficiaries')->nullable();
            $table->text('beneficiary_criteria')->nullable();
            
            // Status and Progress
            $table->enum('status', [
                'PLANNING',
                'APPROVED',
                'IN_PROGRESS',
                'ON_HOLD',
                'COMPLETED',
                'CANCELLED',
                'SUSPENDED'
            ])->default('PLANNING');
            $table->integer('progress_percentage')->default(0);
            
            // Project Management
            $table->foreignId('project_manager_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('approving_official_id')->nullable()->constrained('users')->onDelete('set null');
            $table->date('approved_date')->nullable();
            
            // Documentation
            $table->json('attachments')->nullable();
            $table->text('remarks')->nullable();
            $table->text('completion_report')->nullable();
            $table->json('lessons_learned')->nullable();
            
            // Monitoring and Evaluation
            $table->date('last_monitoring_date')->nullable();
            $table->text('monitoring_remarks')->nullable();
            $table->integer('quality_rating')->nullable();
            $table->text('evaluation_notes')->nullable();
            
            // Metadata
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
            
            // Indexes
            $table->index('project_code');
            $table->index('category');
            $table->index('status');
            $table->index('start_date');
            $table->index('end_date');
            $table->index(['status', 'priority']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
