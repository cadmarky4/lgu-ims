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
        Schema::table('residents', function (Blueprint $table) {
            // Add unique constraints to prevent duplicate records
            // Combination of first_name, last_name, birth_date should be unique
            $table->unique(['first_name', 'last_name', 'birth_date'], 'residents_name_birthdate_unique');
            
            // Make some government IDs unique when not null (but allow nulls)
            $table->index('philhealth_number', 'residents_philhealth_index');
            $table->index('sss_number', 'residents_sss_index');
            $table->index('tin_number', 'residents_tin_index');
            $table->index('voters_id_number', 'residents_voters_id_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('residents', function (Blueprint $table) {
            $table->dropUnique('residents_name_birthdate_unique');
            $table->dropIndex('residents_philhealth_index');
            $table->dropIndex('residents_sss_index');
            $table->dropIndex('residents_tin_index');
            $table->dropIndex('residents_voters_id_index');
        });
    }
};
