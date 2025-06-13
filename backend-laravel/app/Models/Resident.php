<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resident extends Model
{
    use HasFactory;

    protected $fillable = [
        // Basic Information
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
        'employment_status',
        'educational_attainment',
        
        // Contact Information
        'mobile_number',
        'landline_number',
        'email_address',
        'house_number',
        'street',
        'purok',
        'complete_address',
        
        // Family Information
        'household_id',
        'is_household_head',
        'relationship_to_head',
        'mother_name',
        'father_name',
        'emergency_contact_name',
        'emergency_contact_number',
        'emergency_contact_relationship',
        
        // Government IDs and Documents
        'primary_id_type',
        'id_number',
        'philhealth_number',
        'sss_number',
        'tin_number',
        'voters_id_number',
        
        // Health & Classifications
        'medical_conditions',
        'allergies',
        'senior_citizen',
        'person_with_disability',
        'disability_type',
        'indigenous_people',
        'indigenous_group',
        'four_ps_beneficiary',
        'four_ps_household_id',
        
        // Profile Photo
        'photo_path',
        
        // System fields
        'status',
        'remarks',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'is_household_head' => 'boolean',
        'senior_citizen' => 'boolean',
        'person_with_disability' => 'boolean',
        'indigenous_people' => 'boolean',
        'four_ps_beneficiary' => 'boolean',
    ];

    /**
     * Get the full URL for the resident's photo
     */
    public function getPhotoUrlAttribute(): ?string
    {
        if ($this->photo_path) {
            return asset('storage/' . $this->photo_path);
        }
        return null;
    }

    /**
     * Append photo_url to the model's array form
     */
    protected $appends = ['photo_url'];

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
