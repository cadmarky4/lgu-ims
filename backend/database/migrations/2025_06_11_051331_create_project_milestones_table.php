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
        Schema::create('project_milestones', function (Blueprint $table) {
            $table->id();
            
            // Milestone Information
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('sequence_order')->default(1);
            
            // Timeline
            $table->date('target_date');
            $table->date('actual_completion_date')->nullable();
            $table->integer('estimated_duration_days')->nullable();
            
            // Progress and Status
            $table->enum('status', ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'CANCELLED'])->default('PENDING');
            $table->integer('progress_percentage')->default(0);
            $table->decimal('weight_percentage', 5, 2)->default(0); // Weight in overall project
            
            // Deliverables and Requirements
            $table->json('deliverables')->nullable();
            $table->json('requirements')->nullable();
            $table->json('attachments')->nullable();
            
            // Budget for this milestone
            $table->decimal('allocated_budget', 12, 2)->nullable();
            $table->decimal('actual_cost', 12, 2)->nullable();
            
            // Responsible Party
            $table->foreignId('responsible_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('responsible_team')->nullable();
            
            // Quality and Evaluation
            $table->integer('quality_score')->nullable(); // 1-10
            $table->text('completion_notes')->nullable();
            $table->text('remarks')->nullable();
            
            // Dependencies
            $table->json('dependencies')->nullable(); // Other milestone IDs this depends on
            
            // Metadata
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
            
            // Indexes
            $table->index(['project_id', 'sequence_order']);
            $table->index('status');
            $table->index('target_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_milestones');
    }
};
