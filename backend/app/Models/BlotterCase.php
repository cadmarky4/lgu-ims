<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use OwenIt\Auditing\Contracts\Auditable;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class BlotterCase extends Model implements Auditable
{
    use HasFactory, HasUuids; // Add HasUuids trait

    use \OwenIt\Auditing\Auditable;
    
    protected $auditModel = ActivityLog::class;
    
    public function transformAudit(array $data): array
    {
        return [
            'user_id' => Auth::id() ?? null, 
            'action_type' => $data['event'], // created, updated, deleted
            'table_name' => $this->getTable(),
            'record_id' => $this->getKey(),
            'old_values' => $data['old_values'] ?? null,
            'new_values' => $data['new_values'] ?? null,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'timestamp' => now(),
            'description' => $this->generateDescription($data['event'])
        ];
    }
    
    private function generateDescription($event)
    {
        $user = Auth::user() ? Auth::user()->name : 'System';
        return match($event) {
            'created' => "{$user} created a new blotter record",
            'updated' => "{$user} updated blotter information", 
            'deleted' => "{$user} deleted a blotter record",
            default => "{$user} performed {$event} action"
        };
    }

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'case_number', 'incident_type', 'incident_description', 'incident_date', 'incident_time',
        'incident_location', 'complainant_name', 'complainant_contact', 'complainant_address',
        'complainant_resident_id', 'respondent_name', 'respondent_contact', 'respondent_address',
        'respondent_resident_id', 'witnesses', 'narrative_report', 'evidence_description',
        'supporting_documents', 'investigating_officer', 'investigation_date', 'investigation_notes',
        'status', 'case_classification', 'referral_needed', 'referred_to', 'referral_date',
        'referral_notes', 'resolution_type', 'resolution_date', 'resolution_description',
        'settlement_amount', 'case_outcome', 'follow_up_required', 'follow_up_date',
        'follow_up_notes', 'case_notes', 'remarks', 'created_by', 'updated_by'
    ];

    protected $casts = [
        'incident_date' => 'date',
        'incident_time' => 'datetime:H:i',
        'investigation_date' => 'date',
        'referral_date' => 'date',
        'resolution_date' => 'date',
        'follow_up_date' => 'date',
        'referral_needed' => 'boolean',
        'follow_up_required' => 'boolean',
        'settlement_amount' => 'decimal:2',
        'witnesses' => 'array',
        'supporting_documents' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    protected $appends = [
        'days_pending',
        'is_overdue'
    ];

    // Relationships
    public function complainantResident(): BelongsTo
    {
        return $this->belongsTo(Resident::class, 'complainant_resident_id');
    }

    public function respondentResident(): BelongsTo
    {
        return $this->belongsTo(Resident::class, 'respondent_resident_id');
    }

    public function investigatingOfficer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'investigating_officer');
    }

    public function mediatorAssigned(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mediator_assigned');
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
    public function getDaysPendingAttribute(): int
    {
        if (in_array($this->status, ['SETTLED', 'DISMISSED', 'CLOSED'])) {
            return 0;
        }
        
        $dateFiled = $this->date_filed ?? $this->created_at;
        if (!$dateFiled) return 0;
        
        return Carbon::parse($dateFiled)->diffInDays(now());
    }

    public function getIsOverdueAttribute(): bool
    {
        if (!$this->hearing_date || in_array($this->status, ['SETTLED', 'DISMISSED', 'CLOSED'])) {
            return false;
        }
        
        return Carbon::parse($this->hearing_date)->isPast();
    }

    // Scopes
    public function scopePending(Builder $query): Builder
    {
        return $query->whereNotIn('status', ['SETTLED', 'DISMISSED', 'CLOSED']);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->whereIn('status', ['FILED', 'UNDER_INVESTIGATION', 'MEDIATION_SCHEDULED', 'IN_MEDIATION']);
    }

    public function scopeUrgent(Builder $query): Builder
    {
        return $query->where('is_urgent', true)
                    ->orWhere('priority', 'URGENT');
    }

    public function scopeHighPriority(Builder $query): Builder
    {
        return $query->whereIn('priority', ['HIGH', 'URGENT']);
    }

    public function scopeByCaseType(Builder $query, string $type): Builder
    {
        return $query->where('case_type', $type);
    }

    public function scopeOverdue(Builder $query): Builder
    {
        return $query->where('hearing_date', '<', now())
                    ->whereNotIn('status', ['SETTLED', 'DISMISSED', 'CLOSED']);
    }

    public function scopeRequiresFollowup(Builder $query): Builder
    {
        return $query->where('requires_monitoring', true)
                    ->where('next_followup_date', '<=', now());
    }

    // Helper methods
    public function generateCaseNumber(): string
    {
        $year = date('Y');
        $count = static::whereYear('created_at', $year)->count() + 1;
        return "BLT-{$year}-" . str_pad($count, 4, '0', STR_PAD_LEFT);
    }

    public function assignInvestigator(int $officerId): void
    {
        $this->update([
            'investigating_officer' => $officerId,
            'status' => 'UNDER_INVESTIGATION'
        ]);
    }

    public function scheduleHearing(Carbon $date, Carbon $time, string $location): void
    {
        $this->update([
            'hearing_date' => $date,
            'hearing_time' => $time,
            'hearing_location' => $location,
            'status' => 'MEDIATION_SCHEDULED'
        ]);
    }

    public function assignMediator(int $mediatorId): void
    {
        $this->update([
            'mediator_assigned' => $mediatorId
        ]);
    }

    public function startMediation(): void
    {
        $this->update([
            'status' => 'IN_MEDIATION'
        ]);
    }

    public function settle(string $agreement, string $resolutionType = 'AMICABLE_SETTLEMENT'): void
    {
        $this->update([
            'status' => 'SETTLED',
            'settlement_agreement' => $agreement,
            'settlement_date' => now(),
            'resolution_type' => $resolutionType
        ]);
    }

    public function referToAuthority(string $authority): void
    {
        $status = $authority === 'court' ? 'REFERRED_TO_COURT' : 'REFERRED_TO_POLICE';
        
        $this->update([
            'status' => $status,
            'resolution_type' => $status
        ]);
    }

    public function dismiss(string $reason): void
    {
        $this->update([
            'status' => 'DISMISSED',
            'resolution_type' => 'DISMISSED',
            'remarks' => $reason
        ]);
    }

    public function close(): void
    {
        $this->update([
            'status' => 'CLOSED'
        ]);
    }

    public function scheduleFollowup(Carbon $date, string $notes = null): void
    {
        $this->update([
            'requires_monitoring' => true,
            'next_followup_date' => $date,
            'followup_notes' => $notes
        ]);
    }

    public function updateCompliance(string $status, string $notes = null): void
    {
        $this->update([
            'compliance_status' => $status,
            'followup_notes' => $notes
        ]);
    }

    public function markAsUrgent(string $reason): void
    {
        $this->update([
            'is_urgent' => true,
            'priority' => 'URGENT',
            'urgency_reason' => $reason
        ]);
    }

    // Boot method
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($blotterCase) {
            if (empty($blotterCase->case_number)) {
                $blotterCase->case_number = $blotterCase->generateCaseNumber();
            }
            if (empty($blotterCase->date_filed)) {
                $blotterCase->date_filed = now();
            }
        });
    }
}
