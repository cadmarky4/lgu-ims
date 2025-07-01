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
    use HasFactory, HasUuids; // Add HasUuids trait

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        // Personal Information (based on frontend form)
        'prefix',
        'first_name',
        'middle_name',
        'last_name',
        'gender',
        'birth_date',
        'contact_number',
        'email_address',
        'complete_address',
        'civil_status',
        'educational_background',
        
        // Position Information
        'position',
        'position_title',
        'committee_assignment',
        
        // Term Information
        'term_start',
        'term_end',
        'term_number',
        'is_current_term',
        
        // Election Information
        'election_date',
        'votes_received',
        'is_elected',
        'appointment_document',
        
        // Status
        'status',
        'status_date',
        'status_reason',
        
        // Additional fields
        'work_experience',
        'skills_expertise',
        'trainings_attended',
        'certifications',
        'major_accomplishments',
        'projects_initiated',
        'performance_notes',
        'performance_rating',
        
        // Emergency Contact
        'emergency_contact_name',
        'emergency_contact_number',
        'emergency_contact_relationship',
        
        // Files
        'profile_photo',
        'documents',
        
        // Oath Information
        'oath_taking_date',
        'oath_taking_notes',
        
        // System fields
        'is_active',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'birth_date' => 'date',
        'term_start' => 'date',
        'term_end' => 'date',
        'election_date' => 'date',
        'status_date' => 'date',
        'oath_taking_date' => 'date',
        'is_current_term' => 'boolean',
        'is_elected' => 'boolean',
        'is_active' => 'boolean',
        'votes_received' => 'integer',
        'term_number' => 'integer',
        'performance_rating' => 'integer',
        'trainings_attended' => 'array',
        'certifications' => 'array',
        'projects_initiated' => 'array',
        'documents' => 'array'
    ];

    protected $appends = [
        'full_name',
        'age',
        'term_duration',
        'days_in_office',
        'is_term_ending_soon'
    ];

    // Relationships
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // Computed attributes
    public function getFullNameAttribute(): string
    {
        $name = '';
        
        if ($this->prefix) {
            $name .= $this->prefix . ' ';
        }
        
        $name .= $this->first_name . ' ';
        
        if ($this->middle_name) {
            $name .= $this->middle_name . ' ';
        }
        
        $name .= $this->last_name;
        
        return trim($name);
    }

    public function getAgeAttribute(): int
    {
        return Carbon::parse($this->birth_date)->age;
    }

    public function getTermDurationAttribute(): int
    {
        return Carbon::parse($this->term_start)->diffInDays($this->term_end);
    }

    public function getDaysInOfficeAttribute(): int
    {
        $endDate = $this->status === 'ACTIVE' ? now() : ($this->status_date ?? $this->term_end);
        return Carbon::parse($this->term_start)->diffInDays($endDate);
    }

    public function getIsTermEndingSoonAttribute(): bool
    {
        if ($this->status !== 'ACTIVE' || !$this->is_current_term) {
            return false;
        }
        
        return $this->term_end->diffInDays(now()) <= 90; // 3 months
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

    public function scopeElected(Builder $query): Builder
    {
        return $query->where('is_elected', true);
    }

    public function scopeAppointed(Builder $query): Builder
    {
        return $query->where('is_elected', false);
    }

    public function scopeTermEndingSoon(Builder $query, int $days = 90): Builder
    {
        return $query->where('is_current_term', true)
                    ->where('status', 'ACTIVE')
                    ->where('term_end', '<=', now()->addDays($days));
    }

    public function scopeOfficials(Builder $query): Builder
    {
        return $query->whereIn('position', [
            'BARANGAY_CAPTAIN',
            'BARANGAY_KAGAWAD',
            'BARANGAY_SECRETARY',
            'BARANGAY_TREASURER',
            'SK_CHAIRPERSON',
            'SK_KAGAWAD'
        ]);
    }

    public function scopeStaff(Builder $query): Builder
    {
        return $query->whereIn('position', [
            'BARANGAY_CLERK',
            'BARANGAY_HEALTH_WORKER',
            'BARANGAY_TANOD',
            'BARANGAY_NUTRITION_SCHOLAR'
        ]);
    }

    // Helper methods
    public function suspend(string $reason): void
    {
        $this->update([
            'status' => 'SUSPENDED',
            'status_date' => now(),
            'status_reason' => $reason
        ]);
    }

    public function resign(string $reason): void
    {
        $this->update([
            'status' => 'RESIGNED',
            'status_date' => now(),
            'status_reason' => $reason,
            'is_current_term' => false
        ]);
    }

    public function reactivate(): void
    {
        $this->update([
            'status' => 'ACTIVE',
            'status_date' => now(),
            'status_reason' => null
        ]);
    }

    public function markAsDeceased(Carbon $date = null): void
    {
        $this->update([
            'status' => 'DECEASED',
            'status_date' => $date ?? now(),
            'is_current_term' => false
        ]);
    }

    public function endTerm(): void
    {
        $this->update([
            'is_current_term' => false,
            'status' => 'INACTIVE',
            'status_date' => now()
        ]);
    }

    public function startNewTerm(Carbon $startDate, Carbon $endDate, int $termNumber = null): void
    {
        // End current term if active
        if ($this->is_current_term) {
            $this->endTerm();
        }

        // Create new term record or update current
        $this->update([
            'term_start' => $startDate,
            'term_end' => $endDate,
            'term_number' => $termNumber ?? ($this->term_number + 1),
            'is_current_term' => true,
            'status' => 'ACTIVE',
            'status_date' => $startDate
        ]);
    }

    public function addCommitteeMembership(string $committee): void
    {
        $memberships = $this->committee_memberships ?? [];
        
        if (!in_array($committee, $memberships)) {
            $memberships[] = $committee;
            
            $this->update([
                'committee_memberships' => $memberships,
                'committee_assignments' => count($memberships)
            ]);
        }
    }

    public function removeCommitteeMembership(string $committee): void
    {
        $memberships = $this->committee_memberships ?? [];
        $memberships = array_diff($memberships, [$committee]);
        
        $this->update([
            'committee_memberships' => array_values($memberships),
            'committee_assignments' => count($memberships)
        ]);
    }

    public function addTraining(array $training): void
    {
        $trainings = $this->trainings_attended ?? [];
        $trainings[] = array_merge($training, ['date_added' => now()]);
        
        $this->update([
            'trainings_attended' => $trainings
        ]);
    }

    public function addCertification(array $certification): void
    {
        $certifications = $this->certifications ?? [];
        $certifications[] = array_merge($certification, ['date_added' => now()]);
        
        $this->update([
            'certifications' => $certifications
        ]);
    }

    public function addAccomplishment(string $accomplishment): void
    {
        $accomplishments = $this->major_accomplishments ?? [];
        $accomplishments[] = [
            'description' => $accomplishment,
            'date' => now()->toDateString()
        ];
        
        $this->update([
            'major_accomplishments' => $accomplishments
        ]);
    }

    public function addProject(string $project): void
    {
        $projects = $this->projects_initiated ?? [];
        $projects[] = [
            'title' => $project,
            'date' => now()->toDateString()
        ];
        
        $this->update([
            'projects_initiated' => $projects
        ]);
    }

    public function ratePerformance(int $rating, string $notes = null): void
    {
        $rating = max(1, min(5, $rating));
        
        $this->update([
            'performance_rating' => $rating,
            'performance_notes' => $notes
        ]);
    }

    public function updateProfilePhoto(string $photoPath): void
    {
        $this->update([
            'profile_photo' => $photoPath
        ]);
    }

    public function isExecutive(): bool
    {
        return in_array($this->position, [
            'BARANGAY_CAPTAIN',
            'BARANGAY_SECRETARY',
            'BARANGAY_TREASURER'
        ]);
    }

    public function isKagawad(): bool
    {
        return $this->position === 'BARANGAY_KAGAWAD';
    }

    public function isSKOfficial(): bool
    {
        return in_array($this->position, ['SK_CHAIRPERSON', 'SK_KAGAWAD']);
    }

    public function getRemainingTermDays(): int
    {
        if (!$this->is_current_term || $this->status !== 'ACTIVE') {
            return 0;
        }
        
        return max(0, now()->diffInDays($this->term_end, false));
    }

    public function getTermProgress(): float
    {
        if (!$this->is_current_term) return 100;
        
        $totalDays = $this->term_start->diffInDays($this->term_end);
        $elapsedDays = $this->term_start->diffInDays(now());
        
        if ($totalDays == 0) return 100;
        
        return min(100, ($elapsedDays / $totalDays) * 100);
    }

    public function getCommitteeCount(): int
    {
        return count($this->committee_memberships ?? []);
    }

    // Boot method
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($official) {
            if (empty($official->status_date)) {
                $official->status_date = $official->term_start ?? now();
            }
        });
    }
}
