<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class BarangayOfficial extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'prefix',
        'resident_id',
        'position',
        'committee_assignment',
        'term_start',
        'term_end',
        'term_number',
        'is_current_term',
        'status'
    ];

    protected $casts = [
        'term_start' => 'date',
        'term_end' => 'date',
        'is_current_term' => 'boolean',
        'term_number' => 'integer'
    ];

    // Define enum constants
    const POSITIONS = [
        'BARANGAY_CAPTAIN',
        'BARANGAY_SECRETARY',
        'BARANGAY_TREASURER',
        'KAGAWAD',
        'SK_CHAIRPERSON', 
        'SK_KAGAWAD', 
        'BARANGAY_CLERK', 
        'BARANGAY_TANOD',
    ];

    const COMMITTEES = [
        'Health',
        'Education',
        'Public Safety',
        'Environment',
        'Peace and Order',
        'Sports and Recreation',
        'Women and Family',
        'Senior Citizens'
    ];

    const STATUSES = [
        'ACTIVE',
        'INACTIVE',
        'SUSPENDED',
        'RESIGNED',
        'TERMINATED',
        'DECEASED'
    ];

    // Relationships
    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    // Scopes
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'ACTIVE');
    }

    public function scopeCurrentTerm(Builder $query): Builder
    {
        return $query->where('is_current_term', true);
    }

    public function scopeByPosition(Builder $query, string $position): Builder
    {
        return $query->where('position', $position);
    }

    // Helper methods
    public function updateStatus(string $status): void
    {
        $this->update([
            'status' => $status,
            'is_current_term' => $status === 'ACTIVE'
        ]);
    }

    public function startNewTerm(Carbon $startDate, Carbon $endDate, int $termNumber = null): void
    {
        $this->update([
            'term_start' => $startDate,
            'term_end' => $endDate,
            'term_number' => $termNumber ?? ($this->term_number + 1),
            'is_current_term' => true,
            'status' => 'ACTIVE'
        ]);
    }
}