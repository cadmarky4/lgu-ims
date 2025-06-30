<?php

namespace App\Models;

use App\Models\Schemas\UserSchema;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, HasRoles, SoftDeletes;

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

    /**
     * Additional casts
     */
    protected $dates = ['deleted_at'];

    public function __construct(array $attributes = [])
    {
        // Set fillable, hidden, and casts from schema
        $this->fillable = UserSchema::getFillableFields();
        $this->hidden = array_merge(
            UserSchema::getHiddenFields(),
            ['remember_token', 'deleted_at']
        );
        $this->casts = array_merge(
            UserSchema::getCasts(),
            [
                'email_verified_at' => 'datetime',
                'last_login_at' => 'datetime',
                'is_active' => 'boolean',
                'is_verified' => 'boolean',
            ]
        );
        
        parent::__construct($attributes);
    }

    /**
     * Boot method for model events
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-set created_by and updated_by
        static::creating(function ($model) {
            if (auth()->check() && !$model->created_by) {
                $model->created_by = auth()->id();
            }
        });

        static::updating(function ($model) {
            if (auth()->check() && !$model->updated_by) {
                $model->updated_by = auth()->id();
            }
        });
    }

    /**
     * Computed attributes
     */
    public function getFullNameAttribute(): string
    {
        $parts = array_filter([
            $this->first_name,
            $this->middle_name,
            $this->last_name
        ]);
        
        return implode(' ', $parts);
    }

    public function getInitialsAttribute(): string
    {
        $firstInitial = $this->first_name ? strtoupper(substr($this->first_name, 0, 1)) : '';
        $lastInitial = $this->last_name ? strtoupper(substr($this->last_name, 0, 1)) : '';
        
        return $firstInitial . $lastInitial;
    }

    public function getIsActiveStatusAttribute(): bool
    {
        return $this->is_active && $this->is_verified;
    }

    public function getHasLoggedInAttribute(): bool
    {
        return !is_null($this->last_login_at);
    }

    public function getRoleDisplayNameAttribute(): string
    {
        $roleMap = [
            'SUPER_ADMIN' => 'Super Administrator',
            'ADMIN' => 'Administrator',
            'BARANGAY_CAPTAIN' => 'Barangay Captain',
            'BARANGAY_SECRETARY' => 'Barangay Secretary',
            'BARANGAY_TREASURER' => 'Barangay Treasurer',
            'BARANGAY_COUNCILOR' => 'Barangay Councilor',
            'BARANGAY_CLERK' => 'Barangay Clerk',
            'HEALTH_WORKER' => 'Health Worker',
            'SOCIAL_WORKER' => 'Social Worker',
            'SECURITY_OFFICER' => 'Security Officer',
            'DATA_ENCODER' => 'Data Encoder',
            'VIEWER' => 'Viewer',
        ];

        return $roleMap[$this->role] ?? $this->role;
    }

    public function getDepartmentDisplayNameAttribute(): string
    {
        $departmentMap = [
            'ADMINISTRATION' => 'Administration',
            'HEALTH_SERVICES' => 'Health Services',
            'SOCIAL_SERVICES' => 'Social Services',
            'SECURITY_PUBLIC_SAFETY' => 'Security & Public Safety',
            'FINANCE_TREASURY' => 'Finance & Treasury',
            'RECORDS_MANAGEMENT' => 'Records Management',
            'COMMUNITY_DEVELOPMENT' => 'Community Development',
            'DISASTER_RISK_REDUCTION' => 'Disaster Risk Reduction',
            'ENVIRONMENTAL_MANAGEMENT' => 'Environmental Management',
            'YOUTH_SPORTS_DEVELOPMENT' => 'Youth & Sports Development',
            'SENIOR_CITIZEN_AFFAIRS' => 'Senior Citizen Affairs',
            'WOMENS_AFFAIRS' => 'Women\'s Affairs',
            'BUSINESS_PERMITS' => 'Business Permits & Licensing',
            'INFRASTRUCTURE_DEVELOPMENT' => 'Infrastructure Development',
        ];

        return $departmentMap[$this->department] ?? $this->department;
    }

    /**
     * Relationships
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function activities(): HasMany
    {
        return $this->hasMany(UserActivity::class);
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(UserSession::class);
    }

    public function residents(): HasMany
    {
        return $this->hasMany(Resident::class, 'created_by');
    }

    public function households(): HasMany
    {
        return $this->hasMany(Household::class, 'created_by');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'processed_by');
    }

    public function approvedDocuments(): HasMany
    {
        return $this->hasMany(Document::class, 'approved_by');
    }

    public function releasedDocuments(): HasMany
    {
        return $this->hasMany(Document::class, 'released_by');
    }

    public function managedProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'project_manager_id');
    }

    public function projectTeamMemberships(): HasMany
    {
        return $this->hasMany(ProjectTeamMember::class);
    }

    public function assignedComplaints(): HasMany
    {
        return $this->hasMany(Complaint::class, 'assigned_to');
    }

    public function investigatedComplaints(): HasMany
    {
        return $this->hasMany(Complaint::class, 'investigated_by');
    }

    public function reviewedSuggestions(): HasMany
    {
        return $this->hasMany(Suggestion::class, 'reviewed_by');
    }

    public function investigatedBlotterCases(): HasMany
    {
        return $this->hasMany(BlotterCase::class, 'investigating_officer');
    }

    public function mediatedBlotterCases(): HasMany
    {
        return $this->hasMany(BlotterCase::class, 'mediator_assigned');
    }

    public function appointments(): HasMany
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

    public function scopeInactive($query)
    {
        return $query->where('is_active', false);
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopeUnverified($query)
    {
        return $query->where('is_verified', false);
    }

    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }

    public function scopeByDepartment($query, $department)
    {
        return $query->where('department', $department);
    }

    public function scopeSearch($query, $search)
    {
        if (empty($search)) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->where('first_name', 'like', "%{$search}%")
              ->orWhere('last_name', 'like', "%{$search}%")
              ->orWhere('username', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%")
              ->orWhere('employee_id', 'like', "%{$search}%")
              ->orWhereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%{$search}%"])
              ->orWhereRaw("CONCAT(first_name, ' ', IFNULL(middle_name, ''), ' ', last_name) LIKE ?", ["%{$search}%"]);
        });
    }

    public function scopeRecentLogins($query, $days = 30)
    {
        return $query->where('last_login_at', '>=', now()->subDays($days));
    }

    public function scopeNeverLoggedIn($query)
    {
        return $query->whereNull('last_login_at');
    }

    /**
     * Helper methods
     */
    public function canEdit(User $targetUser): bool
    {
        return UserSchema::canUserEdit(
            $this->role,
            $targetUser->role,
            $this->id,
            $targetUser->id
        );
    }

    public function canDelete(User $targetUser): bool
    {
        return UserSchema::canUserDelete(
            $this->role,
            $targetUser->role,
            $this->id,
            $targetUser->id
        );
    }

    public function getRoleLevel(): int
    {
        $hierarchy = UserSchema::getRoleHierarchy();
        return $hierarchy[$this->role] ?? 0;
    }

    public function isHigherRoleThan(User $user): bool
    {
        return $this->getRoleLevel() > $user->getRoleLevel();
    }

    public function isSameRoleAs(User $user): bool
    {
        return $this->role === $user->role;
    }

    public function hasPermissionFor(string $action, string $resource): bool
    {
        // Basic permission logic - can be extended with Spatie Permission package
        $permissions = [
            'SUPER_ADMIN' => ['*'],
            'ADMIN' => ['users.*', 'residents.*', 'reports.*', 'settings.*'],
            'BARANGAY_CAPTAIN' => ['users.view', 'residents.*', 'reports.*', 'settings.view'],
            'BARANGAY_SECRETARY' => ['residents.*', 'reports.view'],
            'BARANGAY_TREASURER' => ['residents.view', 'reports.view'],
            'BARANGAY_COUNCILOR' => ['residents.view', 'reports.view'],
            'BARANGAY_CLERK' => ['residents.*'],
            'HEALTH_WORKER' => ['residents.view', 'residents.edit'],
            'SOCIAL_WORKER' => ['residents.view', 'residents.edit'],
            'SECURITY_OFFICER' => ['residents.view'],
            'DATA_ENCODER' => ['residents.create', 'residents.edit'],
            'VIEWER' => ['residents.view'],
        ];

        $userPermissions = $permissions[$this->role] ?? [];
        
        // Check for wildcard permission
        if (in_array('*', $userPermissions)) {
            return true;
        }

        // Check for specific permission
        $permission = "{$resource}.{$action}";
        if (in_array($permission, $userPermissions)) {
            return true;
        }

        // Check for resource wildcard
        $resourceWildcard = "{$resource}.*";
        if (in_array($resourceWildcard, $userPermissions)) {
            return true;
        }

        return false;
    }

    public function updateLastLogin(): void
    {
        $this->update(['last_login_at' => now()]);
    }

    public function markAsVerified(): void
    {
        $this->update([
            'is_verified' => true,
            'email_verified_at' => now()
        ]);
    }

    public function activate(): void
    {
        $this->update(['is_active' => true]);
    }

    public function deactivate(): void
    {
        $this->update(['is_active' => false]);
    }

    public function suspend(): void
    {
        $this->update(['is_active' => false]);
        // Additional suspension logic can be added here
    }

    /**
     * Override the default serialization to include computed attributes
     */
    public function toArray()
    {
        $array = parent::toArray();
        
        // Add computed attributes
        $array['full_name'] = $this->full_name;
        $array['initials'] = $this->initials;
        $array['is_active_status'] = $this->is_active_status;
        $array['has_logged_in'] = $this->has_logged_in;
        $array['role_display_name'] = $this->role_display_name;
        $array['department_display_name'] = $this->department_display_name;

        return $array;
    }
}