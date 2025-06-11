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
        Schema::create('blotter_cases', function (Blueprint $table) {
            $table->id();
            
            // Case Information
            $table->string('case_number')->unique();
            $table->string('case_title');
            $table->text('case_description');
            $table->enum('case_type', [
                'CIVIL_DISPUTE',
                'CRIMINAL_COMPLAINT',
                'NEIGHBORHOOD_DISPUTE',
                'FAMILY_DISPUTE',
                'PROPERTY_DISPUTE',
                'NOISE_COMPLAINT',
                'HARASSMENT',
                'THEFT',
                'ASSAULT',
                'VANDALISM',
                'DOMESTIC_VIOLENCE',
                'CHILD_ABUSE',
                'ELDER_ABUSE',
                'FRAUD',
                'TRESPASSING',
                'OTHER'
            ]);
            
            // Parties Involved
            $table->foreignId('complainant_resident_id')->nullable()->constrained('residents')->onDelete('set null');
            $table->string('complainant_name');
            $table->string('complainant_contact')->nullable();
            $table->text('complainant_address')->nullable();
            
            $table->foreignId('respondent_resident_id')->nullable()->constrained('residents')->onDelete('set null');
            $table->string('respondent_name');
            $table->string('respondent_contact')->nullable();
            $table->text('respondent_address')->nullable();
            
            // Incident Details
            $table->date('incident_date');
            $table->time('incident_time')->nullable();
            $table->text('incident_location');
            $table->text('incident_narrative');
            $table->text('witnesses')->nullable();
            $table->json('evidence_items')->nullable();
            
            // Case Processing
            $table->enum('status', [
                'FILED',
                'UNDER_INVESTIGATION',
                'MEDIATION_SCHEDULED',
                'IN_MEDIATION',
                'SETTLED',
                'REFERRED_TO_COURT',
                'REFERRED_TO_POLICE',
                'DISMISSED',
                'CLOSED',
                'ON_HOLD'
            ])->default('FILED');
            
            $table->date('date_filed');
            $table->date('hearing_date')->nullable();
            $table->time('hearing_time')->nullable();
            $table->text('hearing_location')->nullable();
            
            // Assignment and Handling
            $table->foreignId('investigating_officer')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('mediator_assigned')->nullable()->constrained('users')->onDelete('set null');
            $table->string('lupon_members')->nullable(); // JSON array of member names
            
            // Resolution
            $table->text('settlement_agreement')->nullable();
            $table->date('settlement_date')->nullable();
            $table->enum('resolution_type', [
                'AMICABLE_SETTLEMENT',
                'MEDIATION_SUCCESS',
                'REFERRED_TO_COURT',
                'REFERRED_TO_POLICE',
                'DISMISSED',
                'WITHDRAWN',
                'NO_SETTLEMENT'
            ])->nullable();
            
            // Documentation
            $table->json('attachments')->nullable();
            $table->text('investigation_report')->nullable();
            $table->text('mediation_notes')->nullable();
            $table->json('court_documents')->nullable();
            
            // Follow-up and Monitoring
            $table->boolean('requires_monitoring')->default(false);
            $table->date('next_followup_date')->nullable();
            $table->text('followup_notes')->nullable();
            $table->enum('compliance_status', ['COMPLIED', 'PARTIAL', 'NON_COMPLIANT', 'NOT_APPLICABLE'])->nullable();
            
            // Priority and Urgency
            $table->enum('priority', ['LOW', 'NORMAL', 'HIGH', 'URGENT'])->default('NORMAL');
            $table->boolean('is_urgent')->default(false);
            $table->text('urgency_reason')->nullable();
            
            // Legal References
            $table->string('applicable_laws')->nullable();
            $table->string('ordinance_violated')->nullable();
            $table->text('legal_basis')->nullable();
            
            // Metadata
            $table->text('remarks')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
            
            // Indexes
            $table->index('case_number');
            $table->index('case_type');
            $table->index('status');
            $table->index('date_filed');
            $table->index('incident_date');
            $table->index(['status', 'priority']);
            $table->index('investigating_officer');
            $table->index('complainant_resident_id');
            $table->index('respondent_resident_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blotter_cases');
    }
};
