<?php

namespace App\Models;

use App\Models\Schemas\HouseholdSchema;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Household extends Model
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
        $this->fillable = HouseholdSchema::getFillableFields();
        $this->casts = HouseholdSchema::getCasts();
        
        parent::__construct($attributes);
    }

    /**
     * Relationships
     */
    public function headResident()
    {
        return $this->belongsTo(Resident::class, 'head_resident_id');
    }

    public function members()
    {
        return $this->hasMany(Resident::class, 'household_id');
    }

    public function allResidents()
    {
        return $this->hasMany(Resident::class, 'household_id');
    }

    public function nonHeadMembers()
    {
        return $this->hasMany(Resident::class, 'household_id')->where('is_household_head', false);
    }

    public function membersIncludingHead()
    {
        return $this->hasMany(Resident::class, 'household_id');
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
    public function scopeFourPs($query)
    {
        return $query->where('four_ps_beneficiary', true);
    }

    public function scopeIndigent($query)
    {
        return $query->where('indigent_family', true);
    }

    public function scopeWithSeniorCitizen($query)
    {
        return $query->where('has_senior_citizen', true);
    }

    public function scopeWithPwd($query)
    {
        return $query->where('has_pwd_member', true);
    }

    public function scopeByBarangay($query, $barangay)
    {
        return $query->where('barangay', $barangay);
    }

    public function scopeByHouseType($query, $houseType)
    {
        return $query->where('house_type', $houseType);
    }

    public function scopeByOwnershipStatus($query, $ownershipStatus)
    {
        return $query->where('ownership_status', $ownershipStatus);
    }
}
