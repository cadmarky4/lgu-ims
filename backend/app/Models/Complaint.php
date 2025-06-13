<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class Complaint extends Model
{
    protected $fillable = [
        'complaint_number',
        'subject',
        'description',
        'category',
        'priority',
        'resident_id',
        'complainant_name',
        'complainant_contact',
        'complainant_email',
        'complainant_address',
        'is_anonymous',
        'incident_location',
        'incident_date',
        'incident_time',
        'persons_involved',
        'witnesses',
        'status',
        'date_received',
        'acknowledged_date',
        'target_resolution_date',
        'actual_resolution_date',
        'assigned_to',
        'investigated_by',
        'assigned_department',
        'actions_taken',
        'resolution_details',
        'recommendations',
        'resolution_type',
        'satisfaction_rating',
        'complainant_feedback',
        'is_feedback_received',
        'attachments',
        'evidence_files',
        'investigation_notes',
        'requires_followup',
        'followup_date',
        'followup_notes',
        'remarks',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'incident_date' => 'date',
        'incident_time' => 'datetime:H:i',
        'date_received' => 'date',
        'acknowledged_date' => 'date',
        'target_resolution_date' => 'date',
        'actual_resolution_date' => 'date',
        'followup_date' => 'date',
        'is_anonymous' => 'boolean',
        'requires_followup' => 'boolean',
        'is_feedback_received' => 'boolean',
        'satisfaction_rating' => 'integer',
        'attachments' => 'array',
        'evidence_files' => 'array'
    ];

    protected $appends = [
        'days_pending',
        'is_overdue',
        'resolution_time_days'
    ];

    // Relationships
    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function investigatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'investigated_by');
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
        if (in_array($this->status, ['RESOLVED', 'CLOSED', 'REJECTED'])) {
            return 0;
        }
        
        return Carbon::parse($this->date_received)->diffInDays(now());
    }

    public function getIsOverdueAttribute(): bool
    {
        if (!$this->target_resolution_date || in_array($this->status, ['RESOLVED', 'CLOSED', 'REJECTED'])) {
            return false;
        }
        
        return $this->target_resolution_date->isPast();
    }

    public function getResolutionTimeDaysAttribute(): int
    {
        if (!$this->actual_resolution_date) return 0;
        
        return Carbon::parse($this->date_received)->diffInDays($this->actual_resolution_date);
    }

    // Scopes
    public function scopePending(Builder $query): Builder
    {
        return $query->whereIn('status', ['PENDING', 'ACKNOWLEDGED', 'UNDER_INVESTIGATION', 'IN_PROGRESS']);
    }

    public function scopeResolved(Builder $query): Builder
    {
        return $query->whereIn('status', ['RESOLVED', 'CLOSED']);
    }

    public function scopeHighPriority(Builder $query): Builder
    {
        return $query->whereIn('priority', ['HIGH', 'URGENT']);
    }

    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    public function scopeOverdue(Builder $query): Builder
    {
        return $query->where('target_resolution_date', '<', now())
                    ->whereNotIn('status', ['RESOLVED', 'CLOSED', 'REJECTED']);
    }

    public function scopeAssignedTo(Builder $query, int $userId): Builder
    {
        return $query->where('assigned_to', $userId);
    }

    public function scopeRequiresFollowup(Builder $query): Builder
    {
        return $query->where('requires_followup', true)
                    ->where('followup_date', '<=', now());
    }

    public function scopeAnonymous(Builder $query): Builder
    {
        return $query->where('is_anonymous', true);
    }

    // Helper methods
    public function generateComplaintNumber(): string
    {
        $year = date('Y');
        $categoryCode = $this->getCategoryCode();
        $count = static::where('category', $this->category)
                      ->whereYear('created_at', $year)
                      ->count() + 1;
        
        return "COMP-{$categoryCode}-{$year}-" . str_pad($count, 4, '0', STR_PAD_LEFT);
    }

    private function getCategoryCode(): string
    {
        $codes = [
            'INFRASTRUCTURE' => 'INF',
            'PUBLIC_SERVICE' => 'PUB',
            'HEALTH_SANITATION' => 'HLT',
            'PEACE_ORDER' => 'PEA',
            'ENVIRONMENT' => 'ENV',
            'CORRUPTION' => 'COR',
            'DISCRIMINATION' => 'DIS',
            'NOISE_COMPLAINT' => 'NOI',
            'GARBAGE_COLLECTION' => 'GAR',
            'WATER_SUPPLY' => 'WAT',
            'ELECTRICAL' => 'ELE',
            'ROAD_MAINTENANCE' => 'ROA',
            'OTHER' => 'OTH'
        ];

        return $codes[$this->category] ?? 'GEN';
    }

    public function acknowledge(int $userId, Carbon $targetDate = null): void
    {
        $this->update([
            'status' => 'ACKNOWLEDGED',
            'acknowledged_date' => now(),
            'target_resolution_date' => $targetDate ?? now()->addDays($this->getDefaultResolutionDays()),
            'updated_by' => $userId
        ]);
    }

    public function assign(int $userId, string $department = null): void
    {
        $this->update([
            'assigned_to' => $userId,
            'assigned_department' => $department,
            'status' => $this->status === 'PENDING' ? 'ACKNOWLEDGED' : $this->status
        ]);
    }

    public function startInvestigation(int $investigatorId): void
    {
        $this->update([
            'status' => 'UNDER_INVESTIGATION',
            'investigated_by' => $investigatorId
        ]);
    }

    public function markInProgress(string $actions = null): void
    {
        $this->update([
            'status' => 'IN_PROGRESS',
            'actions_taken' => $actions
        ]);
    }

    public function resolve(string $resolution, string $type = 'RESOLVED', int $userId): void
    {
        $this->update([
            'status' => 'RESOLVED',
            'resolution_details' => $resolution,
            'resolution_type' => $type,
            'actual_resolution_date' => now(),
            'updated_by' => $userId
        ]);
    }

    public function close(string $reason = null, int $userId): void
    {
        $this->update([
            'status' => 'CLOSED',
            'remarks' => $reason,
            'actual_resolution_date' => now(),
            'updated_by' => $userId
        ]);
    }

    public function reject(string $reason, int $userId): void
    {
        $this->update([
            'status' => 'REJECTED',
            'remarks' => $reason,
            'updated_by' => $userId
        ]);
    }

    public function putOnHold(string $reason): void
    {
        $this->update([
            'status' => 'ON_HOLD',
            'remarks' => $reason
        ]);
    }

    public function scheduleFollowup(Carbon $date, string $notes): void
    {
        $this->update([
            'requires_followup' => true,
            'followup_date' => $date,
            'followup_notes' => $notes
        ]);
    }

    public function addInvestigationNote(string $note): void
    {
        $currentNotes = $this->investigation_notes ?? '';
        $timestamp = now()->format('Y-m-d H:i:s');
        $newNote = "[{$timestamp}] {$note}";
        
        $this->update([
            'investigation_notes' => $currentNotes ? $currentNotes . "\n\n" . $newNote : $newNote
        ]);
    }

    public function updateActions(string $actions): void
    {
        $this->update([
            'actions_taken' => $actions
        ]);
    }

    public function addRecommendation(string $recommendation): void
    {
        $currentRecommendations = $this->recommendations ?? '';
        
        $this->update([
            'recommendations' => $currentRecommendations ? $currentRecommendations . "\n• " . $recommendation : "• " . $recommendation
        ]);
    }

    public function submitFeedback(int $rating, string $feedback = null): void
    {
        $this->update([
            'satisfaction_rating' => max(1, min(5, $rating)),
            'complainant_feedback' => $feedback,
            'is_feedback_received' => true
        ]);
    }

    public function addAttachment(string $filename, string $path): void
    {
        $attachments = $this->attachments ?? [];
        $attachments[] = [
            'filename' => $filename,
            'path' => $path,
            'uploaded_at' => now()
        ];
        
        $this->update([
            'attachments' => $attachments
        ]);
    }

    public function addEvidence(string $filename, string $path, string $description = null): void
    {
        $evidence = $this->evidence_files ?? [];
        $evidence[] = [
            'filename' => $filename,
            'path' => $path,
            'description' => $description,
            'uploaded_at' => now()
        ];
        
        $this->update([
            'evidence_files' => $evidence
        ]);
    }

    public function escalatePriority(): void
    {
        $priorities = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];
        $currentIndex = array_search($this->priority, $priorities);
        
        if ($currentIndex < count($priorities) - 1) {
            $this->update([
                'priority' => $priorities[$currentIndex + 1]
            ]);
        }
    }

    public function extendTargetDate(int $days, string $reason): void
    {
        if ($this->target_resolution_date) {
            $newDate = $this->target_resolution_date->addDays($days);
            
            $this->update([
                'target_resolution_date' => $newDate,
                'remarks' => ($this->remarks ?? '') . "\nExtended by {$days} days: {$reason}"
            ]);
        }
    }

    private function getDefaultResolutionDays(): int
    {
        $defaultDays = [
            'URGENT' => 1,
            'HIGH' => 3,
            'NORMAL' => 7,
            'LOW' => 14
        ];

        return $defaultDays[$this->priority] ?? 7;
    }

    public function canBeResolved(): bool
    {
        return in_array($this->status, ['UNDER_INVESTIGATION', 'IN_PROGRESS']);
    }

    public function needsFollowup(): bool
    {
        return $this->requires_followup && 
               $this->followup_date && 
               $this->followup_date->isPast();
    }

    public function getContactInfo(): array
    {
        if ($this->is_anonymous) {
            return [
                'name' => 'Anonymous',
                'contact' => null,
                'email' => null
            ];
        }

        return [
            'name' => $this->complainant_name,
            'contact' => $this->complainant_contact,
            'email' => $this->complainant_email
        ];
    }

    // Boot method
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($complaint) {
            if (empty($complaint->complaint_number)) {
                $complaint->complaint_number = $complaint->generateComplaintNumber();
            }
            if (empty($complaint->date_received)) {
                $complaint->date_received = now();
            }
        });
    }
}
