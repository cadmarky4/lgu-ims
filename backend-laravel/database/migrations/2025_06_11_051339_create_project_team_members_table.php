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
        Schema::create('project_team_members', function (Blueprint $table) {
            $table->id();
            
            // Team Member Information
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('member_name'); // In case external member
            $table->string('member_email')->nullable();
            $table->string('member_contact')->nullable();
            
            // Role and Responsibilities
            $table->enum('role', [
                'PROJECT_MANAGER',
                'TEAM_LEADER',
                'MEMBER',
                'CONSULTANT',
                'CONTRACTOR',
                'SUPPLIER',
                'BENEFICIARY_REPRESENTATIVE',
                'OBSERVER'
            ]);
            $table->text('responsibilities')->nullable();
            $table->boolean('is_active')->default(true);
            
            // Participation Details
            $table->date('joined_date');
            $table->date('left_date')->nullable();
            $table->text('expertise')->nullable();
            $table->integer('availability_percentage')->default(100);
            
            // Performance
            $table->integer('performance_rating')->nullable();
            $table->text('contribution_notes')->nullable();
            
            // Contact and Communication
            $table->boolean('receives_notifications')->default(true);
            $table->enum('communication_preference', ['EMAIL', 'SMS', 'PHONE', 'IN_PERSON'])->default('EMAIL');
            
            // Metadata
            $table->text('remarks')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
            
            // Indexes
            $table->index(['project_id', 'role']);
            $table->index('user_id');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_team_members');
    }
};
