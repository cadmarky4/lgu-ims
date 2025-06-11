<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;
use Illuminate\Support\Str;

class Document extends Model
{
    protected $fillable = [
        'document_number',
        'document_type',
        'title',
        'description',
        'resident_id',
        'applicant_name',
        'applicant_address',
        'applicant_contact',
        'purpose',
        'requested_date',
        'needed_date',
        'priority',
        'status',
        'approved_date',
        'released_date',
        'expiry_date',
        'processed_by',
        'approved_by',
        'released_by',
        'processing_fee',
        'amount_paid',
        'payment_status',
        'payment_method',
        'receipt_number',
        'payment_date',
        'requirements_submitted',
        'attachments',
        'remarks',
        'rejection_reason',
        'qr_code',
        'verification_code',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'requested_date' => 'date',
        'needed_date' => 'date',
        'approved_date' => 'date',
        'released_date' => 'date',
        'expiry_date' => 'date',
        'payment_date' => 'date',
        'processing_fee' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'requirements_submitted' => 'array',
        'attachments' => 'array'
    ];

    protected $appends = [
        'is_expired',
        'days_pending',
        'balance_due'
    ];

    // Relationships
    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    public function processedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function releasedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'released_by');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // Computed attributes
    public function getIsExpiredAttribute(): bool
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }

    public function getDaysPendingAttribute(): int
    {
        if (in_array($this->status, ['RELEASED', 'REJECTED', 'CANCELLED'])) {
            return 0;
        }
        
        return Carbon::parse($this->requested_date)->diffInDays(now());
    }

    public function getBalanceDueAttribute(): float
    {
        return max(0, $this->processing_fee - $this->amount_paid);
    }

    // Scopes
    public function scopePending(Builder $query): Builder
    {
        return $query->whereIn('status', ['PENDING', 'UNDER_REVIEW']);
    }

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', 'APPROVED');
    }

    public function scopeReadyForPickup(Builder $query): Builder
    {
        return $query->where('status', 'READY_FOR_PICKUP');
    }

    public function scopeReleased(Builder $query): Builder
    {
        return $query->where('status', 'RELEASED');
    }

    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('document_type', $type);
    }

    public function scopeHighPriority(Builder $query): Builder
    {
        return $query->whereIn('priority', ['HIGH', 'URGENT']);
    }

    public function scopeOverdue(Builder $query): Builder
    {
        return $query->where('needed_date', '<', now())
                    ->whereNotIn('status', ['RELEASED', 'REJECTED', 'CANCELLED']);
    }

    public function scopeUnpaid(Builder $query): Builder
    {
        return $query->where('payment_status', 'UNPAID')
                    ->where('processing_fee', '>', 0);
    }

    public function scopeExpired(Builder $query): Builder
    {
        return $query->where('expiry_date', '<', now())
                    ->where('status', 'RELEASED');
    }

    // Helper methods
    public function generateDocumentNumber(): string
    {
        $year = date('Y');
        $typeCode = $this->getTypeCode();
        $count = static::where('document_type', $this->document_type)
                      ->whereYear('created_at', $year)
                      ->count() + 1;
        
        return "{$typeCode}-{$year}-" . str_pad($count, 4, '0', STR_PAD_LEFT);
    }

    private function getTypeCode(): string
    {
        $codes = [
            'BARANGAY_CLEARANCE' => 'BC',
            'CERTIFICATE_OF_RESIDENCY' => 'CR',
            'CERTIFICATE_OF_INDIGENCY' => 'CI',
            'BUSINESS_PERMIT' => 'BP',
            'BUILDING_PERMIT' => 'BLD',
            'ELECTRICAL_PERMIT' => 'EP',
            'SANITARY_PERMIT' => 'SP',
            'FENCING_PERMIT' => 'FP',
            'EXCAVATION_PERMIT' => 'EXP',
            'CERTIFICATE_OF_GOOD_MORAL' => 'CGM',
            'FIRST_TIME_JOB_SEEKER' => 'FTJS',
            'SOLO_PARENT_CERTIFICATE' => 'SPC',
            'SENIOR_CITIZEN_ID' => 'SCID',
            'PWD_ID' => 'PWDID',
            'CERTIFICATE_OF_COHABITATION' => 'COC',
            'DEATH_CERTIFICATE' => 'DC',
            'BIRTH_CERTIFICATE_COPY' => 'BCC',
            'MARRIAGE_CONTRACT_COPY' => 'MCC',
            'OTHER' => 'OTH'
        ];

        return $codes[$this->document_type] ?? 'DOC';
    }

    public function generateQRCode(): string
    {
        return $this->document_number . '-' . Str::random(8);
    }

    public function generateVerificationCode(): string
    {
        return Str::upper(Str::random(6));
    }

    public function startProcessing(int $userId): void
    {
        $this->update([
            'status' => 'UNDER_REVIEW',
            'processed_by' => $userId
        ]);
    }

    public function approve(int $userId, Carbon $expiryDate = null): void
    {
        $updateData = [
            'status' => 'APPROVED',
            'approved_by' => $userId,
            'approved_date' => now()
        ];

        if ($expiryDate) {
            $updateData['expiry_date'] = $expiryDate;
        }

        // Generate QR code and verification code for approved documents
        if (empty($this->qr_code)) {
            $updateData['qr_code'] = $this->generateQRCode();
        }
        if (empty($this->verification_code)) {
            $updateData['verification_code'] = $this->generateVerificationCode();
        }

        $this->update($updateData);
    }

    public function reject(int $userId, string $reason): void
    {
        $this->update([
            'status' => 'REJECTED',
            'rejection_reason' => $reason,
            'updated_by' => $userId
        ]);
    }

    public function markReadyForPickup(): void
    {
        $this->update([
            'status' => 'READY_FOR_PICKUP'
        ]);
    }

    public function release(int $userId): void
    {
        $this->update([
            'status' => 'RELEASED',
            'released_by' => $userId,
            'released_date' => now()
        ]);
    }

    public function cancel(string $reason = null): void
    {
        $this->update([
            'status' => 'CANCELLED',
            'remarks' => $reason
        ]);
    }

    public function putOnHold(string $reason): void
    {
        $this->update([
            'status' => 'ON_HOLD',
            'remarks' => $reason
        ]);
    }

    public function addPayment(float $amount, string $method, string $receiptNumber = null): void
    {
        $newAmountPaid = $this->amount_paid + $amount;
        $paymentStatus = 'PARTIAL';

        if ($newAmountPaid >= $this->processing_fee) {
            $paymentStatus = 'PAID';
        }

        $this->update([
            'amount_paid' => $newAmountPaid,
            'payment_status' => $paymentStatus,
            'payment_method' => $method,
            'receipt_number' => $receiptNumber,
            'payment_date' => now()
        ]);
    }

    public function waiveFee(int $userId, string $reason = null): void
    {
        $this->update([
            'payment_status' => 'WAIVED',
            'remarks' => $reason,
            'updated_by' => $userId
        ]);
    }

    public function isPaymentComplete(): bool
    {
        return $this->payment_status === 'PAID' || 
               $this->payment_status === 'WAIVED' ||
               $this->processing_fee == 0;
    }

    public function canBeApproved(): bool
    {
        return $this->status === 'UNDER_REVIEW' && $this->isPaymentComplete();
    }

    public function canBeReleased(): bool
    {
        return $this->status === 'READY_FOR_PICKUP' || 
               ($this->status === 'APPROVED' && $this->isPaymentComplete());
    }

    public function getEstimatedProcessingDays(): int
    {
        $processingDays = [
            'BARANGAY_CLEARANCE' => 1,
            'CERTIFICATE_OF_RESIDENCY' => 1,
            'CERTIFICATE_OF_INDIGENCY' => 2,
            'BUSINESS_PERMIT' => 7,
            'BUILDING_PERMIT' => 14,
            'ELECTRICAL_PERMIT' => 7,
            'SANITARY_PERMIT' => 5,
            'FENCING_PERMIT' => 7,
            'EXCAVATION_PERMIT' => 10,
            'CERTIFICATE_OF_GOOD_MORAL' => 3,
            'FIRST_TIME_JOB_SEEKER' => 1,
            'SOLO_PARENT_CERTIFICATE' => 3,
            'SENIOR_CITIZEN_ID' => 2,
            'PWD_ID' => 2,
            'CERTIFICATE_OF_COHABITATION' => 2,
            'OTHER' => 3
        ];

        return $processingDays[$this->document_type] ?? 3;
    }

    // Boot method
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($document) {
            if (empty($document->document_number)) {
                $document->document_number = $document->generateDocumentNumber();
            }
            if (empty($document->requested_date)) {
                $document->requested_date = now();
            }
        });
    }
}
