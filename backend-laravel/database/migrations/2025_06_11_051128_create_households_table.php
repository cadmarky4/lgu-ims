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
        Schema::create('households', function (Blueprint $table) {
            $table->id();
            
            // Household Information
            $table->string('household_number')->unique();
            $table->foreignId('head_resident_id')->nullable()->constrained('residents')->onDelete('set null');
            
            // Address Information
            $table->string('house_number')->nullable();
            $table->string('street')->nullable();
            $table->string('purok')->nullable();
            $table->string('barangay')->default('Your Barangay');
            $table->string('municipality')->default('Your Municipality');
            $table->string('province')->default('Your Province');
            $table->string('zip_code')->nullable();
            $table->text('complete_address');
            
            // Household Details
            $table->integer('total_members')->default(0);
            $table->integer('male_members')->default(0);
            $table->integer('female_members')->default(0);
            $table->integer('senior_citizens')->default(0);
            $table->integer('pwd_members')->default(0);
            $table->integer('children_under_5')->default(0);
            $table->integer('school_age_children')->default(0);
            
            // Economic Information
            $table->decimal('estimated_monthly_income', 12, 2)->nullable();
            $table->enum('income_classification', ['VERY_POOR', 'POOR', 'LOW_INCOME', 'LOWER_MIDDLE', 'MIDDLE', 'UPPER_MIDDLE', 'UPPER'])->nullable();
            $table->boolean('four_ps_beneficiary')->default(false);
            $table->string('four_ps_household_id')->nullable();
            
            // Housing Information
            $table->enum('house_ownership', ['OWNED', 'RENTED', 'SHARED', 'CARETAKER', 'OTHER'])->nullable();
            $table->enum('house_type', ['CONCRETE', 'SEMI_CONCRETE', 'WOOD', 'BAMBOO', 'MIXED', 'OTHER'])->nullable();
            $table->enum('roof_material', ['CONCRETE', 'GALVANIZED_IRON', 'ASBESTOS', 'TILE', 'BAMBOO', 'NIPA', 'OTHER'])->nullable();
            $table->enum('wall_material', ['CONCRETE', 'HOLLOW_BLOCKS', 'WOOD', 'BAMBOO', 'MIXED', 'OTHER'])->nullable();
            $table->integer('number_of_rooms')->nullable();
            $table->boolean('has_electricity')->default(false);
            $table->boolean('has_water_supply')->default(false);
            $table->enum('water_source', ['NAWASA', 'DEEP_WELL', 'SHALLOW_WELL', 'SPRING', 'RIVER', 'OTHER'])->nullable();
            $table->boolean('has_toilet')->default(false);
            $table->enum('toilet_type', ['FLUSH', 'POUR_FLUSH', 'PIT_LATRINE', 'NONE', 'OTHER'])->nullable();
            
            // Benefits and Programs
            $table->json('government_programs')->nullable();
            $table->text('livelihood_programs')->nullable();
            $table->text('health_programs')->nullable();
            
            // Status and Metadata
            $table->enum('status', ['ACTIVE', 'INACTIVE', 'RELOCATED'])->default('ACTIVE');
            $table->text('remarks')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
            
            // Indexes
            $table->index('household_number');
            $table->index('purok');
            $table->index('head_resident_id');
            $table->index('status');
            $table->index('four_ps_beneficiary');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('households');
    }
};
