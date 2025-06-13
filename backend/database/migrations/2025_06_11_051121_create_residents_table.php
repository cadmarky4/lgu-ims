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
        Schema::create('residents', function (Blueprint $table) {
            $table->id();
            
            // Personal Information
            $table->string('first_name');
            $table->string('last_name');
            $table->string('middle_name')->nullable();
            $table->string('suffix')->nullable();
            $table->date('birth_date');
            $table->string('birth_place');
            $table->enum('gender', ['MALE', 'FEMALE']);
            $table->enum('civil_status', ['SINGLE', 'MARRIED', 'WIDOWED', 'DIVORCED', 'SEPARATED']);
            $table->string('nationality')->default('Filipino');
            $table->string('religion')->nullable();
            
            // Contact Information
            $table->string('mobile_number')->nullable();
            $table->string('telephone_number')->nullable();
            $table->string('email_address')->nullable();
            
            // Address Information
            $table->string('house_number')->nullable();
            $table->string('street')->nullable();
            $table->string('purok')->nullable();
            $table->string('barangay')->default('Your Barangay');
            $table->string('municipality')->default('Your Municipality');
            $table->string('province')->default('Your Province');
            $table->string('zip_code')->nullable();
            $table->text('complete_address');
            
            // Government IDs
            $table->string('philhealth_number')->nullable();
            $table->string('sss_number')->nullable();
            $table->string('tin_number')->nullable();
            $table->string('voters_id_number')->nullable();
            
            // Household Information
            $table->foreignId('household_id')->nullable()->constrained()->onDelete('set null');
            $table->boolean('is_household_head')->default(false);
            $table->string('relationship_to_head')->nullable();
            
            // Employment Information
            $table->string('occupation')->nullable();
            $table->string('employer')->nullable();
            $table->decimal('monthly_income', 10, 2)->nullable();
            $table->enum('employment_status', ['EMPLOYED', 'UNEMPLOYED', 'SELF_EMPLOYED', 'RETIRED', 'STUDENT', 'OFW'])->nullable();
            
            // Educational Information
            $table->enum('educational_attainment', [
                'NO_FORMAL_EDUCATION',
                'ELEMENTARY_UNDERGRADUATE',
                'ELEMENTARY_GRADUATE',
                'HIGH_SCHOOL_UNDERGRADUATE',
                'HIGH_SCHOOL_GRADUATE',
                'VOCATIONAL',
                'COLLEGE_UNDERGRADUATE',
                'COLLEGE_GRADUATE',
                'POST_GRADUATE'
            ])->nullable();
            
            // Special Classifications
            $table->boolean('senior_citizen')->default(false);
            $table->boolean('person_with_disability')->default(false);
            $table->string('disability_type')->nullable();
            $table->boolean('indigenous_people')->default(false);
            $table->string('indigenous_group')->nullable();
            $table->boolean('four_ps_beneficiary')->default(false);
            $table->string('four_ps_household_id')->nullable();
            
            // Voter Information
            $table->enum('voter_status', ['REGISTERED', 'NOT_REGISTERED', 'DECEASED', 'TRANSFERRED'])->default('NOT_REGISTERED');
            $table->string('precinct_number')->nullable();
            
            // Health Information
            $table->text('medical_conditions')->nullable();
            $table->text('allergies')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_number')->nullable();
            $table->string('emergency_contact_relationship')->nullable();
            
            // Status and Metadata
            $table->enum('status', ['ACTIVE', 'INACTIVE', 'DECEASED', 'TRANSFERRED'])->default('ACTIVE');
            $table->text('remarks')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
            
            // Indexes
            $table->index(['last_name', 'first_name']);
            $table->index('purok');
            $table->index('status');
            $table->index('household_id');
            $table->index('voter_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('residents');
    }
};
