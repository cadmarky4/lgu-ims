<?php

namespace App\Models;

use App\Models\Schemas\UserSchema;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    /**
     * Get fillable fields from schema
     */
    protected $fillable;

    /**
     * Get hidden fields from schema
     */
    protected $hidden;

    /**
     * Get casts from schema
     */
    protected $casts;

    public function __construct(array $attributes = [])
    {
        // Set fillable, hidden, and casts from schema
        $this->fillable = UserSchema::getFillableFields();
        $this->hidden = UserSchema::getHiddenFields();
        $this->casts = UserSchema::getCasts();
        
        parent::__construct($attributes);
    }

    /**
     * Computed attributes
     */
    public function getFullNameAttribute(): string
    {
        $middle = $this->middle_name ? ' ' . $this->middle_name : '';
        return "{$this->first_name}{$middle} {$this->last_name}";
    }

    /**
     * Relationships
     */
    public function residents()
    {
        return $this->hasMany(Resident::class, 'created_by');
    }

    public function households()
    {
        return $this->hasMany(Household::class, 'created_by');
    }

    public function documents()
    {
        return $this->hasMany(Document::class, 'processed_by');
    }

    public function approvedDocuments()
    {
        return $this->hasMany(Document::class, 'approved_by');
    }

    public function releasedDocuments()
    {
        return $this->hasMany(Document::class, 'released_by');
    }

    public function managedProjects()
    {
        return $this->hasMany(Project::class, 'project_manager_id');
    }

    public function projectTeamMemberships()
    {
        return $this->hasMany(ProjectTeamMember::class);
    }

    public function assignedComplaints()
    {
        return $this->hasMany(Complaint::class, 'assigned_to');
    }

    public function investigatedComplaints()
    {
        return $this->hasMany(Complaint::class, 'investigated_by');
    }

    public function reviewedSuggestions()
    {
        return $this->hasMany(Suggestion::class, 'reviewed_by');
    }

    public function investigatedBlotterCases()
    {
        return $this->hasMany(BlotterCase::class, 'investigating_officer');
    }

    public function mediatedBlotterCases()
    {
        return $this->hasMany(BlotterCase::class, 'mediator_assigned');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'assigned_official');
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }

    public function scopeByDepartment($query, $department)
    {
        return $query->where('department', $department);
    }
}
