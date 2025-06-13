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
            // Check if telephone_number column exists and rename it to landline_number
            if (Schema::hasColumn('residents', 'telephone_number')) {
                $table->renameColumn('telephone_number', 'landline_number');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('residents', function (Blueprint $table) {
            // Reverse the changes
            if (Schema::hasColumn('residents', 'landline_number')) {
                $table->renameColumn('landline_number', 'telephone_number');
            }
        });
    }
};
