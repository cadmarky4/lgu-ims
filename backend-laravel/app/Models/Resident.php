<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resident extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'middle_name',
        'suffix',
        'birth_date',
        'birth_place',
        'gender',
        'civil_status',
        'nationality',
        'religion',
        'mobile_number',
        'telephone_number',
        'email_address',
        'house_number',
        'street',
        'purok',
        'barangay',
        'municipality',
        'province',
        'zip_code',
        'complete_address',
        'philhealth_number',
        'sss_number',
        'tin_number',
        'voters_id_number',
        'household_id',
        'is_household_head',
        'relationship_to_head',
        'occupation',
        'employer',
        'monthly_income',
        'employment_status',
        'educational_attainment',
        'senior_citizen',
        'person_with_disability',
        'disability_type',
        'indigenous_people',
        'indigenous_group',
        'four_ps_beneficiary',
        'four_ps_household_id',
        'voter_status',
        'precinct_number',
        'medical_conditions',
        'allergies',
        'emergency_contact_name',
        'emergency_contact_number',
        'emergency_contact_relationship',
        'status',
        'remarks',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'monthly_income' => 'decimal:2',
        'is_household_head' => 'boolean',
        'senior_citizen' => 'boolean',
        'person_with_disability' => 'boolean',
        'indigenous_people' => 'boolean',
        'four_ps_beneficiary' => 'boolean',
    ];

    /**
     * Computed attributes
     */
    public function getFullNameAttribute(): string
    {
        $middle = $this->middle_name ? ' ' . $this->middle_name : '';
        $suffix = $this->suffix ? ', ' . $this->suffix : '';
        return "{$this->first_name}{$middle} {$this->last_name}{$suffix}";
    }

    public function getAgeAttribute(): int
    {
        return $this->birth_date->age;
    }

    /**
     * Relationships
     */
    public function household()
    {
        return $this->belongsTo(Household::class);
    }

    public function householdsAsHead()
    {
        return $this->hasMany(Household::class, 'head_resident_id');
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    public function complaints()
    {
        return $this->hasMany(Complaint::class);
    }

    public function suggestions()
    {
        return $this->hasMany(Suggestion::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function complainantBlotterCases()
    {
        return $this->hasMany(BlotterCase::class, 'complainant_resident_id');
    }

    public function respondentBlotterCases()
    {
        return $this->hasMany(BlotterCase::class, 'respondent_resident_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'ACTIVE');
    }

    public function scopeSeniorCitizens($query)
    {
        return $query->where('senior_citizen', true);
    }

    public function scopePwd($query)
    {
        return $query->where('person_with_disability', true);
    }

    public function scopeFourPs($query)
    {
        return $query->where('four_ps_beneficiary', true);
    }

    public function scopeHouseholdHeads($query)
    {
        return $query->where('is_household_head', true);
    }

    public function scopeByPurok($query, $purok)
    {
        return $query->where('purok', $purok);
    }
}
