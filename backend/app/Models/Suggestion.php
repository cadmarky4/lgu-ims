<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Carbon\Carbon;

class Suggestion extends Model
{
    use HasFactory, HasUuids; // Add HasUuids trait

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'suggestion_number',
        'title',
        'description',
        'category',
        'priority',
        'target_department',
        'suggested_solution',
        'expected_outcome',
        'implementation_timeline',
        'estimated_budget',
        'suggested_by_name',
        'suggested_by_contact',
        'suggested_by_resident_id',
        'anonymous',
        'status',
        'assigned_evaluator',
        'evaluation_date',
        'evaluation_notes',
        'feasibility_score',
        'impact_assessment',
        'cost_benefit_analysis',
        'implementation_plan',
        'decision',
        'decision_date',
        'decision_reason',
        'approved_budget',
        'implementation_start_date',
        'implementation_end_date',
        'progress_notes',
        'completion_date',
        'outcome_summary',
        'lessons_learned',
        'upvotes',
        'downvotes',
        'public_feedback',
        'remarks',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'evaluation_date' => 'date',
        'decision_date' => 'date',
        'implementation_start_date' => 'date',
        'implementation_end_date' => 'date',
        'completion_date' => 'date',
        'anonymous' => 'boolean',
        'feasibility_score' => 'integer',
        'estimated_budget' => 'decimal:2',
        'approved_budget' => 'decimal:2',
        'upvotes' => 'integer',
        'downvotes' => 'integer',
        'public_feedback' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    protected $appends = [
        'net_votes',
        'days_pending'
    ];

    // Relationships
    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
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
    public function getNetVotesAttribute(): int
    {
        return ($this->upvotes ?? 0) - ($this->downvotes ?? 0);
    }

    public function getDaysPendingAttribute(): int
    {
        if ($this->status === 'IMPLEMENTED') {
            return 0;
        }

        $dateSubmitted = $this->date_submitted ?? $this->created_at;
        if (!$dateSubmitted) return 0;

        return Carbon::parse($dateSubmitted)->diffInDays(now());
    }

    // Scopes
    public function scopePending(Builder $query): Builder
    {
        return $query->whereIn('status', ['SUBMITTED', 'UNDER_REVIEW']);
    }

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', 'APPROVED');
    }

    public function scopeImplemented(Builder $query): Builder
    {
        return $query->where('status', 'IMPLEMENTED');
    }

    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    public function scopeHighPriority(Builder $query): Builder
    {
        return $query->where('feasibility_rating', 'HIGH')
            ->where('impact_rating', 'HIGH');
    }

    public function scopePopular(Builder $query): Builder
    {
        return $query->orderByRaw('(upvotes - downvotes) DESC');
    }

    // Helper methods
    public function generateSuggestionNumber(): string
    {
        $year = date('Y');
        $count = static::whereYear('created_at', $year)->count() + 1;
        return "SUG-{$year}-" . str_pad($count, 4, '0', STR_PAD_LEFT);
    }

    public function updateVotes(string $type): void
    {
        if ($type === 'upvote') {
            $this->increment('upvotes');
        } elseif ($type === 'downvote') {
            $this->increment('downvotes');
        }
    }

    public function markAsReviewed(int $reviewerId, string $comments = null): void
    {
        $this->update([
            'status' => 'UNDER_REVIEW',
            'reviewed_by' => $reviewerId,
            'review_date' => now(),
            'review_comments' => $comments
        ]);
    }

    public function approve(int $userId, string $remarks = null): void
    {
        $this->update([
            'status' => 'APPROVED',
            'decision_date' => now(),
            'decision_remarks' => $remarks,
            'updated_by' => $userId
        ]);
    }

    public function reject(int $userId, string $remarks): void
    {
        $this->update([
            'status' => 'REJECTED',
            'decision_date' => now(),
            'decision_remarks' => $remarks,
            'updated_by' => $userId
        ]);
    }

    public function assignImplementation(int $assigneeId, string $plan = null): void
    {
        $this->update([
            'assigned_to' => $assigneeId,
            'implementation_plan' => $plan
        ]);
    }

    public function updateProgress(int $progress, string $status = null): void
    {
        $this->update([
            'implementation_progress' => min(100, max(0, $progress)),
            'implementation_status' => $status
        ]);

        if ($progress >= 100) {
            $this->update([
                'status' => 'IMPLEMENTED',
                'implementation_date' => now()
            ]);
        }
    }

    // Boot method
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($suggestion) {
            if (empty($suggestion->suggestion_number)) {
                $suggestion->suggestion_number = $suggestion->generateSuggestionNumber();
            }
            if (empty($suggestion->date_submitted)) {
                $suggestion->date_submitted = now();
            }
        });
    }
}
