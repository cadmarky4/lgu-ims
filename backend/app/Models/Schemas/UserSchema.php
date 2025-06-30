<?php

namespace App\Models\Schemas;

/**
 * Enhanced User Schema - Single source of truth for user data structure
 * Following the frontend Zod schema patterns
 */
class UserSchema
{
    /**
     * User role constants
     */
    public const ROLES = [
        'SUPER_ADMIN',
        'ADMIN',
        'BARANGAY_CAPTAIN',
        'BARANGAY_SECRETARY',
        'BARANGAY_TREASURER',
        'BARANGAY_COUNCILOR',
        'BARANGAY_CLERK',
        'HEALTH_WORKER',
        'SOCIAL_WORKER',
        'SECURITY_OFFICER',
        'DATA_ENCODER',
        'VIEWER'
    ];

    /**
     * Department constants
     */
    public const DEPARTMENTS = [
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

    /**
     * User status constants
     */
    public const STATUSES = [
        'ACTIVE',
        'INACTIVE',
        'SUSPENDED',
        'PENDING_VERIFICATION'
    ];

    /**
     * Complete field definitions for users
     */
    public static function getFields(): array
    {
        return [
            // Personal Information
            'first_name' => [
                'type' => 'string',
                'max' => 255,
                'required' => true,
                'fillable' => true,
                'searchable' => true
            ],
            'last_name' => [
                'type' => 'string',
                'max' => 255,
                'required' => true,
                'fillable' => true,
                'searchable' => true
            ],
            'middle_name' => [
                'type' => 'string',
                'max' => 255,
                'nullable' => true,
                'fillable' => true,
                'searchable' => true
            ],

            // Contact Information
            'email' => [
                'type' => 'email',
                'max' => 255,
                'required' => true,
                'unique' => true,
                'fillable' => true,
                'searchable' => true
            ],
            'phone' => [
                'type' => 'string',
                'max' => 20,
                'required' => true,
                'fillable' => true,
                'regex' => '/^(\+639|09)\d{9}$/' // Philippine phone format
            ],

            // Account Information
            'username' => [
                'type' => 'string',
                'max' => 50,
                'min' => 3,
                'required' => true,
                'unique' => true,
                'fillable' => true,
                'searchable' => true,
                'regex' => '/^[a-zA-Z0-9_]+$/' // Alphanumeric and underscore only
            ],
            'password' => [
                'type' => 'string',
                'required' => true,
                'min' => 8,
                'fillable' => true,
                'hidden' => true,
                'cast' => 'hashed'
            ],

            // Role & Department Information
            'role' => [
                'type' => 'enum',
                'values' => self::ROLES,
                'required' => true,
                'fillable' => true
            ],
            'department' => [
                'type' => 'enum',
                'values' => self::DEPARTMENTS,
                'required' => true,
                'fillable' => true
            ],
            'position' => [
                'type' => 'string',
                'max' => 255,
                'nullable' => true,
                'fillable' => true
            ],
            'employee_id' => [
                'type' => 'string',
                'max' => 100,
                'nullable' => true,
                'fillable' => true,
                'searchable' => true
            ],

            // Status & Verification
            'is_active' => [
                'type' => 'boolean',
                'default' => true,
                'fillable' => true,
                'cast' => 'boolean'
            ],
            'is_verified' => [
                'type' => 'boolean',
                'default' => false,
                'fillable' => true,
                'cast' => 'boolean'
            ],
            'last_login_at' => [
                'type' => 'datetime',
                'nullable' => true,
                'fillable' => true,
                'cast' => 'datetime'
            ],

            // Additional Information
            'notes' => [
                'type' => 'text',
                'nullable' => true,
                'fillable' => true
            ],

            // System Fields
            'email_verified_at' => [
                'type' => 'datetime',
                'nullable' => true,
                'cast' => 'datetime'
            ],
            'remember_token' => [
                'type' => 'string',
                'max' => 100,
                'nullable' => true,
                'hidden' => true
            ],
            'created_by' => [
                'type' => 'foreignId',
                'references' => 'users.id',
                'nullable' => true,
                'fillable' => true
            ],
            'updated_by' => [
                'type' => 'foreignId',
                'references' => 'users.id',
                'nullable' => true,
                'fillable' => true
            ],

            // Timestamps (handled by Laravel)
            'created_at' => [
                'type' => 'datetime',
                'cast' => 'datetime'
            ],
            'updated_at' => [
                'type' => 'datetime',
                'cast' => 'datetime'
            ],
        ];
    }

    /**
     * Get fillable fields for the model
     */
    public static function getFillableFields(): array
    {
        $fields = static::getFields();
        $fillable = [];

        foreach ($fields as $field => $config) {
            if (isset($config['fillable']) && $config['fillable']) {
                $fillable[] = $field;
            }
        }

        return $fillable;
    }

    /**
     * Get hidden fields for the model
     */
    public static function getHiddenFields(): array
    {
        $fields = static::getFields();
        $hidden = [];

        foreach ($fields as $field => $config) {
            if (isset($config['hidden']) && $config['hidden']) {
                $hidden[] = $field;
            }
        }

        return $hidden;
    }

    /**
     * Get searchable fields for the model
     */
    public static function getSearchableFields(): array
    {
        $fields = static::getFields();
        $searchable = [];

        foreach ($fields as $field => $config) {
            if (isset($config['searchable']) && $config['searchable']) {
                $searchable[] = $field;
            }
        }

        return $searchable;
    }

    /**
     * Get validation rules for create operations
     */
    public static function getCreateValidationRules(): array
    {
        $rules = [];
        $fields = static::getFields();

        foreach ($fields as $field => $config) {
            // Skip system fields
            if (in_array($field, ['remember_token', 'email_verified_at', 'created_at', 'updated_at'])) {
                continue;
            }

            $fieldRules = [];

            // Required/nullable
            if (isset($config['required']) && $config['required']) {
                $fieldRules[] = 'required';
            } else {
                $fieldRules[] = 'nullable';
            }

            // Type-specific rules
            switch ($config['type']) {
                case 'string':
                    $fieldRules[] = 'string';
                    if (isset($config['max'])) {
                        $fieldRules[] = "max:{$config['max']}";
                    }
                    if (isset($config['min'])) {
                        $fieldRules[] = "min:{$config['min']}";
                    }
                    if (isset($config['unique']) && $config['unique']) {
                        $fieldRules[] = 'unique:users,' . $field;
                    }
                    if (isset($config['regex'])) {
                        $fieldRules[] = 'regex:' . $config['regex'];
                    }
                    break;

                case 'email':
                    $fieldRules[] = 'email';
                    if (isset($config['max'])) {
                        $fieldRules[] = "max:{$config['max']}";
                    }
                    if (isset($config['unique']) && $config['unique']) {
                        $fieldRules[] = 'unique:users,' . $field;
                    }
                    break;

                case 'enum':
                    $fieldRules[] = 'in:' . implode(',', $config['values']);
                    break;

                case 'text':
                    $fieldRules[] = 'string';
                    break;

                case 'boolean':
                    $fieldRules[] = 'boolean';
                    break;

                case 'datetime':
                    $fieldRules[] = 'date';
                    break;

                case 'foreignId':
                    $fieldRules[] = 'integer';
                    if (isset($config['references'])) {
                        $fieldRules[] = 'exists:' . $config['references'];
                    }
                    break;
            }

            if (!empty($fieldRules)) {
                $rules[$field] = implode('|', $fieldRules);
            }
        }

        // Add password confirmation for create
        $rules['confirm_password'] = 'required|same:password';

        return $rules;
    }

    /**
     * Get validation rules for update operations
     */
    public static function getUpdateValidationRules(): array
    {
        $rules = static::getCreateValidationRules();

        // Remove confirm_password requirement for updates
        unset($rules['confirm_password']);

        // Make most fields optional for updates
        foreach ($rules as $field => $rule) {
            if (str_starts_with($rule, 'required')) {
                $rules[$field] = 'sometimes|' . $rule;
            }
        }

        // Update unique rules for updates (placeholder for ID)
        if (isset($rules['username'])) {
            $rules['username'] = str_replace('unique:users,username', 'unique:users,username,{id}', $rules['username']);
        }
        if (isset($rules['email'])) {
            $rules['email'] = str_replace('unique:users,email', 'unique:users,email,{id}', $rules['email']);
        }

        // Password is optional for updates
        if (isset($rules['password'])) {
            $rules['password'] = 'sometimes|' . $rules['password'];
            $rules['confirm_password'] = 'required_with:password|same:password';
        }

        return $rules;
    }

    /**
     * Get validation rules for password change
     */
    public static function getPasswordChangeRules(): array
    {
        return [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/',
            'new_password_confirmation' => 'required|same:new_password',
        ];
    }

    /**
     * Get casts for the model
     */
    public static function getCasts(): array
    {
        $casts = [];
        $fields = static::getFields();

        foreach ($fields as $field => $config) {
            if (isset($config['cast'])) {
                $casts[$field] = $config['cast'];
            }
        }

        return $casts;
    }

    /**
     * Get database migration rules
     */
    public static function getMigrationRules(): array
    {
        $fields = static::getFields();
        $migrations = [];

        foreach ($fields as $field => $config) {
            $migration = [];

            switch ($config['type']) {
                case 'string':
                    $migration['type'] = 'string';
                    if (isset($config['max'])) {
                        $migration['length'] = $config['max'];
                    }
                    break;

                case 'email':
                    $migration['type'] = 'string';
                    $migration['length'] = $config['max'] ?? 255;
                    break;

                case 'enum':
                    $migration['type'] = 'enum';
                    $migration['values'] = $config['values'];
                    break;

                case 'text':
                    $migration['type'] = 'text';
                    break;

                case 'boolean':
                    $migration['type'] = 'boolean';
                    if (isset($config['default'])) {
                        $migration['default'] = $config['default'];
                    }
                    break;

                case 'datetime':
                    $migration['type'] = 'timestamp';
                    break;

                case 'foreignId':
                    $migration['type'] = 'foreignId';
                    if (isset($config['references'])) {
                        $migration['references'] = $config['references'];
                    }
                    break;
            }

            if (isset($config['nullable']) && $config['nullable']) {
                $migration['nullable'] = true;
            }

            if (isset($config['unique']) && $config['unique']) {
                $migration['unique'] = true;
            }

            if (isset($config['default'])) {
                $migration['default'] = $config['default'];
            }

            $migrations[$field] = $migration;
        }

        return $migrations;
    }

    /**
     * Get role hierarchy for permission checking
     */
    public static function getRoleHierarchy(): array
    {
        return [
            'SUPER_ADMIN' => 10,
            'ADMIN' => 9,
            'BARANGAY_CAPTAIN' => 8,
            'BARANGAY_SECRETARY' => 7,
            'BARANGAY_TREASURER' => 6,
            'BARANGAY_COUNCILOR' => 5,
            'BARANGAY_CLERK' => 4,
            'HEALTH_WORKER' => 3,
            'SOCIAL_WORKER' => 3,
            'SECURITY_OFFICER' => 3,
            'DATA_ENCODER' => 2,
            'VIEWER' => 1,
        ];
    }

    /**
     * Check if user can edit another user
     */
    public static function canUserEdit(string $currentUserRole, string $targetUserRole, int $currentUserId, int $targetUserId): bool
    {
        $hierarchy = static::getRoleHierarchy();
        $currentUserLevel = $hierarchy[$currentUserRole] ?? 0;
        $targetUserLevel = $hierarchy[$targetUserRole] ?? 0;

        // Super admin can edit anyone
        if ($currentUserRole === 'SUPER_ADMIN') {
            return true;
        }

        // Users can edit themselves (basic info only)
        if ($currentUserId === $targetUserId) {
            return true;
        }

        // Higher level users can edit lower level users
        return $currentUserLevel > $targetUserLevel;
    }

    /**
     * Check if user can delete another user
     */
    public static function canUserDelete(string $currentUserRole, string $targetUserRole, int $currentUserId, int $targetUserId): bool
    {
        // Only super admin and admin can delete users
        if (!in_array($currentUserRole, ['SUPER_ADMIN', 'ADMIN'])) {
            return false;
        }

        // Cannot delete yourself
        if ($currentUserId === $targetUserId) {
            return false;
        }

        $hierarchy = static::getRoleHierarchy();

        // Super admin can delete anyone except other super admins
        if ($currentUserRole === 'SUPER_ADMIN') {
            return $targetUserRole !== 'SUPER_ADMIN';
        }

        // Admin can only delete users below admin level
        $targetUserLevel = $hierarchy[$targetUserRole] ?? 0;
        return $targetUserLevel < $hierarchy['ADMIN'];
    }
}