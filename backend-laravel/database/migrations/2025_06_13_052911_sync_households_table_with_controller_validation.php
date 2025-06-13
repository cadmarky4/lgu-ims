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
        Schema::table('households', function (Blueprint $table) {
            // Add missing fields from controller validation
            $table->enum('household_type', ['OWNED', 'RENTED', 'SHARED', 'INFORMAL_SETTLER'])->nullable()->after('head_resident_id');
            $table->enum('monthly_income_bracket', ['BELOW_5000', '5000_10000', '10001_15000', '15001_20000', '20001_30000', '30001_50000', 'ABOVE_50000'])->nullable()->after('household_type');
            $table->string('source_of_income')->nullable()->after('monthly_income_bracket');
            $table->boolean('indigent_family')->default(false)->after('four_ps_beneficiary');
            $table->boolean('has_senior_citizen')->default(false)->after('indigent_family');
            $table->boolean('has_pwd_member')->default(false)->after('has_senior_citizen');
            $table->boolean('has_internet')->default(false)->after('has_water_supply');
            
            // Remove fields that are not in controller validation (we'll keep them for backward compatibility but mark them as deprecated)
            // We won't drop columns to avoid data loss, but they're not used in the API anymore
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('households', function (Blueprint $table) {
            $table->dropColumn([
                'household_type',
                'monthly_income_bracket', 
                'source_of_income',
                'indigent_family',
                'has_senior_citizen',
                'has_pwd_member',
                'has_internet'
            ]);
        });
    }
};
