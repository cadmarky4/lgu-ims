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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            
            // Authentication
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->string('password');
            
            // Personal Information
            $table->string('first_name');
            $table->string('last_name');
            $table->string('middle_name')->nullable();
            $table->string('phone', 20);
            
            // Role & Department Information
            $table->enum('role', ['SUPER_ADMIN', 'ADMIN', 'BARANGAY_CAPTAIN', 'BARANGAY_SECRETARY', 'BARANGAY_TREASURER', 'KAGAWAD', 'SK_CHAIRPERSON', 'SK_KAGAWAD', 'STAFF', 'USER']);
            $table->enum('department', ['Executive Office', 'Secretary Office', 'Treasury Office', 'Council', 'SK Office', 'Records Office', 'Administration', 'General Staff', 'IT Department']);
            $table->string('position')->nullable();
            $table->string('employee_id', 100)->nullable();
            
            // Status & Verification
            $table->boolean('is_active')->default(true);
            $table->boolean('is_verified')->default(false);
            $table->timestamp('last_login_at')->nullable();
            
            // Additional Information
            $table->text('notes')->nullable();
            
            // System Fields
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
            
            // Indexes
            $table->index(['role']);
            $table->index(['department']);
            $table->index(['is_active']);
            $table->index(['is_verified']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
