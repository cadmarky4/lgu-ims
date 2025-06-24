<?php

namespace App\Models\Schemas;

/**
 * Centralized schema definition for Resident model
 * This serves as the single source of truth for all resident-related data structure
 */
class ResidentSchema
{
    /**
     * Complete field definitions based on frontend requirements
     */
    public static function getFields(): array
    {
        return [
            // Basic Information
            'first_name' => ['type' => 'string', 'max' => 255, 'required' => true],
            'last_name' => ['type' => 'string', 'max' => 255, 'required' => true],
            'middle_name' => ['type' => 'string', 'max' => 255, 'nullable' => true],
            'suffix' => ['type' => 'string', 'max' => 10, 'nullable' => true],
            'birth_date' => ['type' => 'date', 'required' => true, 'before' => 'today'],
            'age' => ['type' => 'integer', 'min' => 0, 'max' => 150, 'nullable' => true], // Computed from birth_date
            'birth_place' => ['type' => 'string', 'max' => 255, 'required' => true],
            'gender' => ['type' => 'enum', 'values' => ['MALE', 'FEMALE'], 'required' => true],
            'civil_status' => ['type' => 'enum', 'values' => ['SINGLE', 'MARRIED', 'WIDOWED', 'DIVORCED', 'SEPARATED'], 'required' => true],
            'nationality' => ['type' => 'string', 'max' => 100, 'required' => true],
            'religion' => ['type' => 'string', 'max' => 100, 'nullable' => true],
            // Profile Photo
            'profile_photo_url' => ['type' => 'string', 'max' => 255, 'nullable' => true],
            
            // Contact Information
            'mobile_number' => ['type' => 'string', 'max' => 20, 'nullable' => true],
            'telephone_number' => ['type' => 'string', 'max' => 20, 'nullable' => true],
            'email_address' => ['type' => 'email', 'max' => 255, 'nullable' => true],
            
            // Address Information
            'house_number' => ['type' => 'string', 'max' => 50, 'nullable' => true],
            'street' => ['type' => 'string', 'max' => 100, 'nullable' => true],
            'purok' => ['type' => 'string', 'max' => 100, 'nullable' => true],
            'barangay' => ['type' => 'string', 'max' => 100, 'nullable' => true],
            'municipality' => ['type' => 'string', 'max' => 100, 'nullable' => true],
            'province' => ['type' => 'string', 'max' => 100, 'nullable' => true],
            'zip_code' => ['type' => 'string', 'max' => 10, 'nullable' => true],
            'complete_address' => ['type' => 'text', 'required' => true],
            
            // Government IDs & Documents
            'primary_id_type' => ['type' => 'string', 'max' => 100, 'nullable' => true],
            'id_number' => ['type' => 'string', 'max' => 100, 'nullable' => true],
            'philhealth_number' => ['type' => 'string', 'max' => 20, 'nullable' => true],
            'sss_number' => ['type' => 'string', 'max' => 20, 'nullable' => true],
            'tin_number' => ['type' => 'string', 'max' => 20, 'nullable' => true],
            'voters_id_number' => ['type' => 'string', 'max' => 20, 'nullable' => true],
            'voter_status' => ['type' => 'enum', 'values' => ['REGISTERED', 'NOT_REGISTERED', 'DECEASED', 'TRANSFERRED'], 'required' => true],
            'precinct_number' => ['type' => 'string', 'max' => 20, 'nullable' => true],
            
            // Family Information
            'household_id' => ['type' => 'foreignId', 'references' => 'households.id', 'nullable' => true],
            'is_household_head' => ['type' => 'boolean', 'default' => false],
            'relationship_to_head' => ['type' => 'string', 'max' => 100, 'nullable' => true],
            'mother_name' => ['type' => 'string', 'max' => 255, 'nullable' => true],
            'father_name' => ['type' => 'string', 'max' => 255, 'nullable' => true],
            
            // Emergency Contact
            'emergency_contact_name' => ['type' => 'string', 'max' => 255, 'nullable' => true],
            'emergency_contact_number' => ['type' => 'string', 'max' => 20, 'nullable' => true],
            'emergency_contact_relationship' => ['type' => 'string', 'max' => 100, 'nullable' => true],
            
            // Employment Information
            'occupation' => ['type' => 'string', 'max' => 255, 'nullable' => true],
            'employer' => ['type' => 'string', 'max' => 255, 'nullable' => true],
            'monthly_income' => ['type' => 'decimal', 'precision' => 10, 'scale' => 2, 'nullable' => true],
            'employment_status' => ['type' => 'enum', 'values' => ['EMPLOYED', 'UNEMPLOYED', 'SELF_EMPLOYED', 'RETIRED', 'STUDENT', 'OFW'], 'nullable' => true],
            'educational_attainment' => ['type' => 'string', 'max' => 255, 'nullable' => true],
            
            // Health & Medical Information
            'medical_conditions' => ['type' => 'text', 'nullable' => true],
            'allergies' => ['type' => 'text', 'nullable' => true],
            
            // Special Classifications
            'senior_citizen' => ['type' => 'boolean', 'default' => false],
            'person_with_disability' => ['type' => 'boolean', 'default' => false],
            'disability_type' => ['type' => 'string', 'max' => 255, 'nullable' => true],
            'indigenous_people' => ['type' => 'boolean', 'default' => false],
            'indigenous_group' => ['type' => 'string', 'max' => 255, 'nullable' => true],
            'four_ps_beneficiary' => ['type' => 'boolean', 'default' => false],
            'four_ps_household_id' => ['type' => 'string', 'max' => 50, 'nullable' => true],
            
            // System Fields
            'status' => ['type' => 'enum', 'values' => ['ACTIVE', 'INACTIVE', 'DECEASED'], 'default' => 'ACTIVE'],
            'remarks' => ['type' => 'text', 'nullable' => true],
            'created_by' => ['type' => 'foreignId', 'references' => 'users.id', 'nullable' => true],
            'updated_by' => ['type' => 'foreignId', 'references' => 'users.id', 'nullable' => true],
        ];
    }
    
    /**
     * Get fillable fields for the model
     */
    public static function getFillableFields(): array
    {
        return array_keys(static::getFields());
    }
    
    /**
     * Get validation rules for create operations
     */
    public static function getCreateValidationRules(): array
    {
        $rules = [];
        foreach (static::getFields() as $field => $config) {
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
            } elseif ($config['type'] === 'email') {
                $fieldRules[] = 'email';
                if (isset($config['max'])) {
                    $fieldRules[] = "max:{$config['max']}";
                }
            } elseif ($config['type'] === 'date') {
                $fieldRules[] = 'date';
                if (isset($config['before'])) {
                    $fieldRules[] = "before:{$config['before']}";
                }            } elseif ($config['type'] === 'enum') {
                $fieldRules[] = 'in:' . implode(',', $config['values']);
            } elseif ($config['type'] === 'boolean') {
                $fieldRules[] = 'boolean';
            } elseif ($config['type'] === 'integer') {
                $fieldRules[] = 'integer';
                if (isset($config['min'])) {
                    $fieldRules[] = "min:{$config['min']}";
                }
                if (isset($config['max'])) {
                    $fieldRules[] = "max:{$config['max']}";
                }
            } elseif ($config['type'] === 'decimal') {
                $fieldRules[] = 'numeric';
                $fieldRules[] = 'min:0';
            } elseif ($config['type'] === 'foreignId') {
                if (isset($config['references'])) {
                    $table = explode('.', $config['references'])[0];
                    $fieldRules[] = "exists:{$table},id";
                }
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
        
        return $rules;
    }
    
    /**
     * Get validation rules for resident create operations (excluding household relationship fields)
     */
    public static function getResidentCreateValidationRules(): array
    {
        $rules = static::getCreateValidationRules();
        
        // Remove household relationship fields that should only be managed by Household operations
        unset($rules['household_id']);
        unset($rules['is_household_head']);
        unset($rules['relationship_to_head']);
        
        return $rules;
    }
    
    /**
     * Get validation rules for resident update operations (excluding household relationship fields)
     */
    public static function getResidentUpdateValidationRules(): array
    {
        $rules = static::getUpdateValidationRules();
        
        // Remove household relationship fields that should only be managed by Household operations
        unset($rules['household_id']);
        unset($rules['is_household_head']);
        unset($rules['relationship_to_head']);
        
        return $rules;
    }
    
    /**
     * Get casts for the model
     */    public static function getCasts(): array
    {
        $casts = [];
        foreach (static::getFields() as $field => $config) {
            if ($config['type'] === 'date') {
                $casts[$field] = 'date';
            } elseif ($config['type'] === 'boolean') {
                $casts[$field] = 'boolean';
            } elseif ($config['type'] === 'integer') {
                $casts[$field] = 'integer';
            } elseif ($config['type'] === 'decimal') {
                $casts[$field] = "decimal:{$config['scale']}";
            }
        }
        
        return $casts;
    }
}
