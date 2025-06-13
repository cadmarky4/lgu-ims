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
        Schema::create('suggestions', function (Blueprint $table) {
            $table->id();
            
            // Suggestion Information
            $table->string('suggestion_number')->unique();
            $table->string('title');
            $table->text('description');
            $table->enum('category', [
                'INFRASTRUCTURE',
                'PUBLIC_SERVICE',
                'HEALTH_PROGRAMS',
                'EDUCATION',
                'ENVIRONMENT',
                'LIVELIHOOD',
                'YOUTH_PROGRAMS',
                'SENIOR_CITIZEN',
                'TECHNOLOGY',
                'GOVERNANCE',
                'COMMUNITY_EVENTS',
                'OTHER'
            ]);
            
            // Suggester Information
            $table->foreignId('resident_id')->nullable()->constrained()->onDelete('set null');
            $table->string('suggester_name');
            $table->string('suggester_contact')->nullable();
            $table->string('suggester_email')->nullable();
            $table->boolean('is_anonymous')->default(false);
            
            // Suggestion Details
            $table->text('current_situation')->nullable();
            $table->text('proposed_solution');
            $table->text('expected_benefits')->nullable();
            $table->decimal('estimated_cost', 12, 2)->nullable();
            $table->text('implementation_timeline')->nullable();
            
            // Processing Information
            $table->enum('status', [
                'SUBMITTED',
                'UNDER_REVIEW',
                'APPROVED',
                'REJECTED',
                'IMPLEMENTED',
                'DEFERRED',
                'DUPLICATE'
            ])->default('SUBMITTED');
            
            $table->date('date_submitted');
            $table->date('review_date')->nullable();
            $table->date('decision_date')->nullable();
            $table->date('implementation_date')->nullable();
            
            // Review and Decision
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('review_comments')->nullable();
            $table->text('decision_remarks')->nullable();
            $table->enum('feasibility_rating', ['LOW', 'MEDIUM', 'HIGH'])->nullable();
            $table->enum('impact_rating', ['LOW', 'MEDIUM', 'HIGH'])->nullable();
            
            // Implementation
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->text('implementation_plan')->nullable();
            $table->text('implementation_status')->nullable();
            $table->integer('implementation_progress')->default(0);
            
            // Community Support
            $table->integer('upvotes')->default(0);
            $table->integer('downvotes')->default(0);
            $table->json('community_comments')->nullable();
            
            // Documentation
            $table->json('attachments')->nullable();
            $table->json('supporting_documents')->nullable();
            
            // Metadata
            $table->text('remarks')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
            
            // Indexes
            $table->index('suggestion_number');
            $table->index('category');
            $table->index('status');
            $table->index('date_submitted');
            $table->index(['status', 'feasibility_rating']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suggestions');
    }
};
