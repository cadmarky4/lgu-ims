<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
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
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'first_name',
        'last_name',
        'middle_name',
        'is_active',
        'is_verified',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'is_active' => 'boolean',
            'is_verified' => 'boolean',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user's full name.
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
}
