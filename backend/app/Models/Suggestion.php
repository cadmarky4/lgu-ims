<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class Suggestion extends Model
{
    protected $fillable = [
        'suggestion_number',
        'title',
        'description',
        'category',
        'resident_id',
        'suggester_name',
        'suggester_contact',
        'suggester_email',
        'is_anonymous',
        'current_situation',
        'proposed_solution',
        'expected_benefits',
        'estimated_cost',
        'implementation_timeline',
        'status',
        'date_submitted',
        'review_date',
        'decision_date',
        'implementation_date',
        'reviewed_by',
        'review_comments',
        'decision_remarks',
        'feasibility_rating',
        'impact_rating',
        'assigned_to',
        'implementation_plan',
        'implementation_status',
        'implementation_progress',
        'upvotes',
        'downvotes',
        'community_comments',
        'attachments',
        'supporting_documents',
        'remarks',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'date_submitted' => 'date',
        'review_date' => 'date',
        'decision_date' => 'date',
        'implementation_date' => 'date',
        'is_anonymous' => 'boolean',
        'estimated_cost' => 'decimal:2',
        'implementation_progress' => 'integer',
        'upvotes' => 'integer',
        'downvotes' => 'integer',
        'community_comments' => 'array',
        'attachments' => 'array',
        'supporting_documents' => 'array'
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
        return $this->upvotes - $this->downvotes;
    }

    public function getDaysPendingAttribute(): int
    {
        if ($this->status === 'IMPLEMENTED') {
            return 0;
        }
        
        return Carbon::parse($this->date_submitted)->diffInDays(now());
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
