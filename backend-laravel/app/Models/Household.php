<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Household extends Model
{
    use HasFactory;

    protected $fillable = [
        // System fields
        'household_number',
        'head_resident_id',
        
        // Address Information
        'house_number',
        'street',
        'barangay',
        'complete_address',
        
        // Basic household info
        'household_type',
        
        // Economic information
        'monthly_income_bracket',
        'source_of_income',
        'four_ps_beneficiary',
        'indigent_family',
        'has_senior_citizen',
        'has_pwd_member',
        
        // Utilities and facilities
        'has_electricity',
        'has_water_supply',
        'has_internet',
        
        // Metadata
        'remarks',
        'status',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'four_ps_beneficiary' => 'boolean',
        'indigent_family' => 'boolean',
        'has_senior_citizen' => 'boolean',
        'has_pwd_member' => 'boolean',
        'has_electricity' => 'boolean',
        'has_water_supply' => 'boolean',
        'has_internet' => 'boolean',
    ];

    /**
     * Relationships
     */
    public function headResident()
    {
        return $this->belongsTo(Resident::class, 'head_resident_id');
    }

    // Alias for easier use in frontend
    public function householdHead()
    {
        return $this->headResident();
    }

    public function members()
    {
        return $this->hasMany(Resident::class);
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

    public function scopeFourPs($query)
    {
        return $query->where('four_ps_beneficiary', true);
    }

    public function scopeByPurok($query, $purok)
    {
        return $query->where('purok', $purok);
    }

    /**
     * Helper methods
     */
    public function updateMemberCounts()
    {
        $members = $this->members;
        
        $this->update([
            'total_members' => $members->count(),
            'male_members' => $members->where('gender', 'MALE')->count(),
            'female_members' => $members->where('gender', 'FEMALE')->count(),
            'senior_citizens' => $members->where('senior_citizen', true)->count(),
            'pwd_members' => $members->where('person_with_disability', true)->count(),
            'children_under_5' => $members->where('birth_date', '>', now()->subYears(5))->count(),
            'school_age_children' => $members->whereBetween('birth_date', [
                now()->subYears(18),
                now()->subYears(5)
            ])->count(),
        ]);
    }
}
