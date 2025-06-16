<?php

namespace App\Models\Schemas;

/**
 * Centralized schema definition for User model
 * This serves as the single source of truth for all user-related data structure
 */
class UserSchema
{    /**
     * Complete field definitions for users
     */
    public static function getFields(): array
    {
        return [
            // Authentication
            'username' => ['type' => 'string', 'max' => 255, 'required' => true, 'unique' => true],
            'email' => ['type' => 'email', 'max' => 255, 'required' => true, 'unique' => true],
            'password' => ['type' => 'string', 'required' => true, 'min' => 8],
              // Personal Information
            'first_name' => ['type' => 'string', 'max' => 255, 'required' => true],
            'last_name' => ['type' => 'string', 'max' => 255, 'required' => true],
            'middle_name' => ['type' => 'string', 'max' => 255, 'nullable' => true],
            'phone' => ['type' => 'string', 'max' => 20, 'required' => true],
            
            // Role & Department Information
            'role' => ['type' => 'enum', 'values' => ['SUPER_ADMIN', 'ADMIN', 'BARANGAY_CAPTAIN', 'BARANGAY_SECRETARY', 'BARANGAY_TREASURER', 'KAGAWAD', 'SK_CHAIRPERSON', 'SK_KAGAWAD', 'STAFF', 'USER'], 'required' => true],
            'department' => ['type' => 'enum', 'values' => ['Executive Office', 'Secretary Office', 'Treasury Office', 'Council', 'SK Office', 'Records Office', 'Administration', 'General Staff', 'IT Department'], 'required' => true],
            'position' => ['type' => 'string', 'max' => 255, 'nullable' => true],
            'employee_id' => ['type' => 'string', 'max' => 100, 'nullable' => true],
            
            // Status & Verification
            'is_active' => ['type' => 'boolean', 'default' => true],
            'is_verified' => ['type' => 'boolean', 'default' => false],
            'last_login_at' => ['type' => 'datetime', 'nullable' => true],
              // Additional Information
            'notes' => ['type' => 'text', 'nullable' => true],
            
            // System Fields
            'email_verified_at' => ['type' => 'datetime', 'nullable' => true],
            'remember_token' => ['type' => 'string', 'max' => 100, 'nullable' => true],
            'created_by' => ['type' => 'foreignId', 'references' => 'users.id', 'nullable' => true],
            'updated_by' => ['type' => 'foreignId', 'references' => 'users.id', 'nullable' => true],
        ];
    }
    
    /**
     * Get fillable fields for the model
     */
    public static function getFillableFields(): array
    {
        $fillable = array_keys(static::getFields());
        // Remove sensitive fields from fillable
        return array_filter($fillable, function($field) {
            return !in_array($field, ['remember_token', 'email_verified_at']);
        });
    }
    
    /**
     * Get hidden fields for the model
     */
    public static function getHiddenFields(): array
    {
        return ['password', 'remember_token'];
    }
      /**
     * Get validation rules for the model (alias for create rules)
     */
    public static function getValidationRules(): array
    {
        return static::getCreateValidationRules();
    }
    
    /**
     * Get validation rules for create operations
     */
    public static function getCreateValidationRules(): array
    {
        $rules = [];
        foreach (static::getFields() as $field => $config) {
            if (in_array($field, ['remember_token', 'email_verified_at'])) {
                continue; // Skip system fields
            }
            
            $fieldRules = [];
            
            if (isset($config['required']) && $config['required']) {
                $fieldRules[] = 'required';
            } else {
                $fieldRules[] = 'nullable';
            }
            
            if ($config['type'] === 'string') {
                $fieldRules[] = 'string';
                if (isset($config['max'])) {
                    $fieldRules[] = "max:{$config['max']}";
                }
                if (isset($config['min'])) {
                    $fieldRules[] = "min:{$config['min']}";
                }
                if (isset($config['unique']) && $config['unique']) {
                    $fieldRules[] = 'unique:users,' . $field;
                }            } elseif ($config['type'] === 'email') {
                $fieldRules[] = 'email';
                if (isset($config['max'])) {
                    $fieldRules[] = "max:{$config['max']}";
                }
                if (isset($config['unique']) && $config['unique']) {
                    $fieldRules[] = 'unique:users,' . $field;
                }
            } elseif ($config['type'] === 'enum') {
                $fieldRules[] = 'in:' . implode(',', $config['values']);
            } elseif ($config['type'] === 'text') {
                $fieldRules[] = 'string';
            } elseif ($config['type'] === 'boolean') {
                $fieldRules[] = 'boolean';
            } elseif ($config['type'] === 'datetime') {
                $fieldRules[] = 'date';
            }
            
            $rules[$field] = implode('|', $fieldRules);
        }
        
        return $rules;
    }
    
    /**
     * Get validation rules for update operations
     */
    public static function getUpdateValidationRules(): array
    {
        $rules = static::getCreateValidationRules();
        
        // Make required fields optional for updates
        foreach ($rules as $field => $rule) {
            if (str_starts_with($rule, 'required')) {
                $rules[$field] = 'sometimes|' . $rule;
            }
        }
        
        // Update unique rules for updates
        if (isset($rules['username'])) {
            $rules['username'] = str_replace('unique:users,username', 'unique:users,username,{id}', $rules['username']);
        }
        if (isset($rules['email'])) {
            $rules['email'] = str_replace('unique:users,email', 'unique:users,email,{id}', $rules['email']);
        }
        
        return $rules;
    }
    
    /**
     * Get casts for the model
     */
    public static function getCasts(): array
    {
        $casts = [];
        foreach (static::getFields() as $field => $config) {
            if ($config['type'] === 'datetime') {
                $casts[$field] = 'datetime';
            } elseif ($config['type'] === 'boolean') {
                $casts[$field] = 'boolean';
            } elseif ($field === 'password') {
                $casts[$field] = 'hashed';
            }
        }
        
        return $casts;
    }
}
