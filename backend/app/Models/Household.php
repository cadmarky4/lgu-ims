<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Household extends Model
{
    use HasFactory;

    protected $fillable = [
        'household_number',
        'head_resident_id',
        'house_number',
        'street',
        'purok',
        'barangay',
        'municipality',
        'province',
        'zip_code',
        'complete_address',
        'total_members',
        'male_members',
        'female_members',
        'senior_citizens',
        'pwd_members',
        'children_under_5',
        'school_age_children',
        'estimated_monthly_income',
        'income_classification',
        'four_ps_beneficiary',
        'four_ps_household_id',
        'house_ownership',
        'house_type',
        'roof_material',
        'wall_material',
        'number_of_rooms',
        'has_electricity',
        'has_water_supply',
        'water_source',
        'has_toilet',
        'toilet_type',
        'government_programs',
        'livelihood_programs',
        'health_programs',
        'status',
        'remarks',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'estimated_monthly_income' => 'decimal:2',
        'four_ps_beneficiary' => 'boolean',
        'has_electricity' => 'boolean',
        'has_water_supply' => 'boolean',
        'has_toilet' => 'boolean',
        'government_programs' => 'array',
    ];

    /**
     * Relationships
     */
    public function headResident()
    {
        return $this->belongsTo(Resident::class, 'head_resident_id');
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
