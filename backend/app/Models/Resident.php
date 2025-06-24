<?php

namespace App\Models;

use App\Models\Schemas\ResidentSchema;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resident extends Model
{
    use HasFactory;

    /**
     * Get fillable fields from schema
     */
    protected $fillable;
    
    /**
     * Get casts from schema
     */
    protected $casts;
    
    public function __construct(array $attributes = [])
    {
        // Set fillable and casts from schema
        $this->fillable = ResidentSchema::getFillableFields();
        $this->casts = ResidentSchema::getCasts();
        
        parent::__construct($attributes);
    }

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
        // If age is stored in database, use it; otherwise compute from birth_date
        if (isset($this->attributes['age']) && $this->attributes['age'] !== null) {
            return (int) $this->attributes['age'];
        }
        
        return $this->birth_date ? $this->birth_date->age : 0;
    }

    /**
     * Accessor for profile photo URL
     */
    public function getProfilePhotoUrlAttribute(): ?string
    {
        return $this->attributes['profile_photo_url'] ?? null;
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

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();
        
        // Auto-calculate age when creating or updating
        static::saving(function ($resident) {
            if ($resident->birth_date) {
                $resident->age = $resident->birth_date->age;
            }
        });
    }
}
