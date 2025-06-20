<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class Appointment extends Model
{
    // Use static initialization instead of constructor
    protected $fillable = [
        'appointment_number', 'full_name', 'email', 'phone', 'department', 'purpose',
        'preferred_date', 'preferred_time', 'alternative_date', 'alternative_time',
        'additional_notes', 'resident_id', 'appointment_date', 'appointment_time',
        'end_time', 'duration_minutes', 'location', 'room_venue', 'assigned_official',
        'assigned_official_name', 'status', 'date_requested', 'confirmed_date',
        'actual_start_time', 'actual_end_time', 'original_date', 'original_time',
        'reschedule_reason', 'reschedule_count', 'meeting_notes', 'action_items',
        'outcome_summary', 'resolution_status', 'priority', 'is_walk_in', 'is_emergency',
        'confirmation_sent', 'reminder_sent', 'confirmation_sent_at', 'reminder_sent_at',
        'attachments', 'reference_number', 'remarks', 'created_by', 'updated_by'
    ];

    protected $casts = [
        'preferred_date' => 'date',
        'alternative_date' => 'date',
        'appointment_date' => 'date',
        'appointment_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'original_time' => 'datetime:H:i',
        'date_requested' => 'date',
        'confirmed_date' => 'datetime',
        'actual_start_time' => 'datetime',
        'actual_end_time' => 'datetime',
        'original_date' => 'date',
        'confirmation_sent_at' => 'datetime',
        'reminder_sent_at' => 'datetime',
        'duration_minutes' => 'integer',
        'reschedule_count' => 'integer',
        'is_walk_in' => 'boolean',
        'is_emergency' => 'boolean',
        'confirmation_sent' => 'boolean',
        'reminder_sent' => 'boolean',
        'attachments' => 'array',
    ];

    protected $appends = [
        'is_today',
        'is_upcoming',
        'is_overdue'
    ];

    // Relationships
    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    public function assignedOfficial(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_official');
    }

    public function followupAssignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'followup_assigned_to');
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
    public function getIsTodayAttribute(): bool
    {
        return $this->appointment_date && $this->appointment_date->isToday();
    }

    public function getIsUpcomingAttribute(): bool
    {
        return $this->appointment_date && $this->appointment_date->isFuture();
    }

    public function getIsOverdueAttribute(): bool
    {
        if (in_array($this->status, ['COMPLETED', 'CANCELLED', 'NO_SHOW'])) {
            return false;
        }
        
        if (!$this->appointment_date || !$this->appointment_time) {
            return false;
        }
        
        $appointmentDateTime = Carbon::parse($this->appointment_date->format('Y-m-d') . ' ' . $this->appointment_time->format('H:i:s'));
        return $appointmentDateTime->isPast();
    }

    // Scopes
    public function scopeToday(Builder $query): Builder
    {
        return $query->whereDate('appointment_date', today());
    }

    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->where('appointment_date', '>=', today())
                    ->whereNotIn('status', ['COMPLETED', 'CANCELLED', 'NO_SHOW']);
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'PENDING');
    }

    public function scopeConfirmed(Builder $query): Builder
    {
        return $query->where('status', 'CONFIRMED');
    }

    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('appointment_type', $type);
    }

    public function scopeByOfficial(Builder $query, int $officialId): Builder
    {
        return $query->where('assigned_official', $officialId);
    }

    public function scopeOverdue(Builder $query): Builder
    {
        $now = now();
        return $query->where(function ($q) use ($now) {
            $q->where('appointment_date', '<', $now->toDateString())
              ->orWhere(function ($subQuery) use ($now) {
                  $subQuery->where('appointment_date', '=', $now->toDateString())
                           ->where('appointment_time', '<', $now->toTimeString());
              });
        })->whereNotIn('status', ['COMPLETED', 'CANCELLED', 'NO_SHOW']);
    }

    public function scopeRequiresFollowup(Builder $query): Builder
    {
        return $query->where('requires_followup', true)
                    ->where('followup_date', '<=', today());
    }

    public function scopeHighPriority(Builder $query): Builder
    {
        return $query->whereIn('priority', ['HIGH', 'URGENT'])
                    ->orWhere('is_emergency', true);
    }

    // Helper methods
    public static function generateAppointmentNumber(): string
    {
        $year = date('Y');
        $count = static::whereYear('created_at', $year)->count() + 1;
        return "APT-{$year}-" . str_pad($count, 4, '0', STR_PAD_LEFT);
    }

    public function confirm(int $userId): void
    {
        $this->update([
            'status' => 'CONFIRMED',
            'confirmed_date' => now(),
            'updated_by' => $userId
        ]);
    }

    public function reschedule(Carbon $newDate, Carbon $newTime, string $reason, int $userId): void
    {
        $this->update([
            'original_date' => $this->appointment_date,
            'original_time' => $this->appointment_time,
            'appointment_date' => $newDate,
            'appointment_time' => $newTime,
            'reschedule_reason' => $reason,
            'reschedule_count' => $this->reschedule_count + 1,
            'status' => 'RESCHEDULED',
            'updated_by' => $userId
        ]);
    }

    public function startAppointment(int $userId): void
    {
        $this->update([
            'status' => 'IN_PROGRESS',
            'actual_start_time' => now(),
            'updated_by' => $userId
        ]);
    }

    public function completeAppointment(string $notes = null, string $outcome = null, int $userId): void
    {
        $this->update([
            'status' => 'COMPLETED',
            'actual_end_time' => now(),
            'meeting_notes' => $notes,
            'outcome_summary' => $outcome,
            'updated_by' => $userId
        ]);
    }

    public function cancel(string $reason, int $userId): void
    {
        $this->update([
            'status' => 'CANCELLED',
            'remarks' => $reason,
            'updated_by' => $userId
        ]);
    }

    public function markAsNoShow(int $userId): void
    {
        $this->update([
            'status' => 'NO_SHOW',
            'updated_by' => $userId
        ]);
    }

    public function scheduleFollowup(Carbon $date, string $notes, int $assignedTo): void
    {
        $this->update([
            'requires_followup' => true,
            'followup_date' => $date,
            'followup_notes' => $notes,
            'followup_assigned_to' => $assignedTo
        ]);
    }

    public function assignOfficial(int $officialId, string $department = null): void
    {
        $this->update([
            'assigned_official' => $officialId,
            'department' => $department
        ]);
    }

    public function markConfirmationSent(): void
    {
        $this->update([
            'confirmation_sent' => true,
            'confirmation_sent_at' => now()
        ]);
    }

    public function markReminderSent(): void
    {
        $this->update([
            'reminder_sent' => true,
            'reminder_sent_at' => now()
        ]);
    }

    public function submitFeedback(int $rating, string $feedback = null): void
    {
        $this->update([
            'service_rating' => $rating,
            'appointee_feedback' => $feedback,
            'feedback_received' => true
        ]);
    }

    public function checkRequirements(): void
    {
        $required = $this->required_documents ?? [];
        $submitted = $this->documents_submitted ?? [];
        
        $allMet = count($required) > 0 && count(array_diff($required, $submitted)) === 0;
        
        $this->update([
            'all_requirements_met' => $allMet
        ]);
    }

    public function calculateEndTime(): ?Carbon
    {
        if (!$this->appointment_date || !$this->appointment_time || !$this->duration_minutes) {
            return null;
        }
        
        $startTime = Carbon::parse($this->appointment_date->format('Y-m-d') . ' ' . $this->appointment_time->format('H:i:s'));
        return $startTime->addMinutes($this->duration_minutes);
    }

    // Boot method
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($appointment) {
            if (empty($appointment->appointment_number)) {
                $appointment->appointment_number = static::generateAppointmentNumber();
            }
            if (empty($appointment->date_requested)) {
                $appointment->date_requested = now();
            }
            
            // Calculate end time if not provided
            if (empty($appointment->end_time) && $appointment->appointment_time && $appointment->duration_minutes) {
                $startTime = Carbon::parse($appointment->appointment_time);
                $appointment->end_time = $startTime->addMinutes($appointment->duration_minutes);
            }
        });
    }
}
