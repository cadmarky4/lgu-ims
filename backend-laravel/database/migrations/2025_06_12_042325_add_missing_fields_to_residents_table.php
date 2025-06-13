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
            // Add missing family information fields
            $table->string('mother_name')->nullable()->after('emergency_contact_relationship');
            $table->string('father_name')->nullable()->after('mother_name');
            
            // Add missing identification fields
            $table->string('primary_id_type')->nullable()->after('father_name');
            $table->string('id_number')->nullable()->after('primary_id_type');
            
            // Age field (computed field but can be stored for performance)
            $table->integer('age')->nullable()->after('birth_place');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('residents', function (Blueprint $table) {
            $table->dropColumn([
                'mother_name',
                'father_name', 
                'primary_id_type',
                'id_number',
                'age'
            ]);
        });
    }
};
