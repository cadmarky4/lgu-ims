<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, drop any indexes that might exist on columns we want to remove
        try {
            DB::statement('DROP INDEX IF EXISTS households_purok_index');
            DB::statement('DROP INDEX IF EXISTS households_municipality_index');
            DB::statement('DROP INDEX IF EXISTS households_income_classification_index');
            DB::statement('DROP INDEX IF EXISTS households_house_type_index');
        } catch (\Exception $e) {
            // Indexes might not exist, continue
        }

        Schema::table('households', function (Blueprint $table) {
            // Check if columns exist before trying to drop them
            $columns = Schema::getColumnListing('households');
            
            $columnsToRemove = [
                'purok',
                'municipality', 
                'province',
                'zip_code',
                'total_members',
                'male_members',
                'female_members',
                'senior_citizens',
                'pwd_members',
                'children_under_5',
                'school_age_children',
                'estimated_monthly_income',
                'income_classification',
                'four_ps_household_id',
                'house_ownership',
                'house_type',
                'roof_material',
                'wall_material',
                'number_of_rooms',
                'water_source',
                'has_toilet',
                'toilet_type',
                'government_programs',
                'livelihood_programs',
                'health_programs'
            ];

            // Only drop columns that actually exist
            $existingColumnsToRemove = array_intersect($columnsToRemove, $columns);
            
            if (!empty($existingColumnsToRemove)) {
                $table->dropColumn($existingColumnsToRemove);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('households', function (Blueprint $table) {
            // Add back the columns in case we need to rollback
            $table->string('purok')->nullable();
            $table->string('municipality')->nullable();
            $table->string('province')->nullable();
            $table->string('zip_code')->nullable();
            $table->integer('total_members')->default(0);
            $table->integer('male_members')->default(0);
            $table->integer('female_members')->default(0);
            $table->integer('senior_citizens')->default(0);
            $table->integer('pwd_members')->default(0);
            $table->integer('children_under_5')->default(0);
            $table->integer('school_age_children')->default(0);
            $table->decimal('estimated_monthly_income', 10, 2)->nullable();
            $table->string('income_classification')->nullable();
            $table->string('four_ps_household_id')->nullable();
            $table->string('house_ownership')->nullable();
            $table->string('house_type')->nullable();
            $table->string('roof_material')->nullable();
            $table->string('wall_material')->nullable();
            $table->integer('number_of_rooms')->default(1);
            $table->string('water_source')->nullable();
            $table->boolean('has_toilet')->default(false);
            $table->string('toilet_type')->nullable();
            $table->json('government_programs')->nullable();
            $table->json('livelihood_programs')->nullable();
            $table->json('health_programs')->nullable();
        });
    }
};
