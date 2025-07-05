<?php

// app/Models/Appointment.php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'base_ticket_id',
        'department',
        'date',
        'time',
        'additional_notes',
    ];

    protected $casts = [
        'date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Constants for departments (adjust based on your DepartmentSchema)
    const DEPARTMENTS = [
        'ADMINISTRATION',
        'HEALTH_SERVICES',
        'SOCIAL_SERVICES',
        'SECURITY_PUBLIC_SAFETY',
        'FINANCE_TREASURY',
        'RECORDS_MANAGEMENT',
        'COMMUNITY_DEVELOPMENT',
        'DISASTER_RISK_REDUCTION',
        'ENVIRONMENTAL_MANAGEMENT',
        'YOUTH_SPORTS_DEVELOPMENT',
        'SENIOR_CITIZEN_AFFAIRS',
        'WOMENS_AFFAIRS',
        'BUSINESS_PERMITS',
        'INFRASTRUCTURE_DEVELOPMENT'
    ];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class, 'base_ticket_id');
    }

    // Scope for checking schedule conflicts
    public function scopeByDateAndTime($query, $date, $time)
    {
        return $query->where('date', $date)->where('time', $time);
    }

    public function scopeByDepartment($query, $department)
    {
        return $query->where('department', $department);
    }
}