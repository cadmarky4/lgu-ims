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
        Schema::create('barangay_officials', function (Blueprint $table) {
            $table->id();
            
            // Personal Information
            $table->string('first_name');
            $table->string('last_name');
            $table->string('middle_name')->nullable();
            $table->string('suffix')->nullable();
            $table->date('birth_date');
            $table->enum('gender', ['MALE', 'FEMALE']);
            $table->string('contact_number')->nullable();
            $table->string('email_address')->nullable();
            $table->text('address');
            
            // Official Information
            $table->enum('position', [
                'BARANGAY_CAPTAIN',
                'BARANGAY_KAGAWAD',
                'BARANGAY_SECRETARY',
                'BARANGAY_TREASURER',
                'SK_CHAIRPERSON',
                'SK_KAGAWAD',
                'BARANGAY_CLERK',
                'BARANGAY_HEALTH_WORKER',
                'BARANGAY_TANOD',
                'BARANGAY_NUTRITION_SCHOLAR',
                'LUPON_TAGAPAMAYAPA',
                'OTHER'
            ]);
            $table->string('position_title')->nullable(); // For OTHER or custom titles
            $table->integer('committee_assignments')->nullable();
            $table->json('committee_memberships')->nullable();
            
            // Term Information
            $table->date('term_start');
            $table->date('term_end');
            $table->integer('term_number')->default(1);
            $table->boolean('is_current_term')->default(true);
            
            // Election Information
            $table->date('election_date')->nullable();
            $table->integer('votes_received')->nullable();
            $table->boolean('is_elected')->default(true); // vs appointed
            $table->string('appointment_document')->nullable();
            
            // Status and Performance
            $table->enum('status', ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'RESIGNED', 'DECEASED'])->default('ACTIVE');
            $table->date('status_date')->nullable();
            $table->text('status_reason')->nullable();
            
            // Professional Background
            $table->text('educational_background')->nullable();
            $table->text('work_experience')->nullable();
            $table->text('skills_expertise')->nullable();
            $table->json('trainings_attended')->nullable();
            $table->json('certifications')->nullable();
            
            // Performance and Contributions
            $table->json('major_accomplishments')->nullable();
            $table->json('projects_initiated')->nullable();
            $table->text('performance_notes')->nullable();
            $table->integer('performance_rating')->nullable();
            
            // Additional Information
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_number')->nullable();
            $table->string('emergency_contact_relationship')->nullable();
            $table->json('social_media_accounts')->nullable();
            
            // Files and Documents
            $table->json('documents')->nullable(); // ID copies, certificates, etc.
            $table->string('profile_photo')->nullable();
            
            // Metadata
            $table->text('remarks')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
            
            // Indexes
            $table->index(['position', 'is_current_term']);
            $table->index('status');
            $table->index(['term_start', 'term_end']);
            $table->index(['last_name', 'first_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barangay_officials');
    }
};
