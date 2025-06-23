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
        Schema::table('documents', function (Blueprint $table) {
            $table->string('title')->after('document_type')->nullable();
            $table->text('description')->after('title')->nullable();
            $table->string('applicant_name')->after('resident_name')->nullable();
            $table->string('applicant_address')->after('applicant_name')->nullable();
            $table->string('applicant_contact')->after('applicant_address')->nullable();
            $table->timestamp('requested_date')->after('purpose')->nullable();
            $table->timestamp('needed_date')->after('requested_date')->nullable();
            $table->decimal('amount_paid', 8, 2)->after('processing_fee')->default(0);
            $table->string('payment_method')->after('payment_status')->nullable();
            $table->string('receipt_number')->after('payment_method')->nullable();
            $table->timestamp('payment_date')->after('receipt_number')->nullable();
            $table->json('attachments')->after('requirements_submitted')->nullable();
            $table->text('rejection_reason')->after('remarks')->nullable();
            $table->string('verification_code')->after('qr_code')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropColumn([
                'title',
                'description', 
                'applicant_name',
                'applicant_address',
                'applicant_contact',
                'requested_date',
                'needed_date',
                'amount_paid',
                'payment_method',
                'receipt_number',
                'payment_date',
                'attachments',
                'rejection_reason',
                'verification_code'
            ]);
        });
    }
};
