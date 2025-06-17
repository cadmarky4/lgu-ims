<?php

namespace App\Models\Schemas;

/**
 * Centralized schema definition for Household model
 * This serves as the single source of truth for all household-related data structure
 * Based on frontend requirements from AddNewHousehold.tsx
 */
class HouseholdSchema
{
    /**
     * Complete field definitions based on frontend requirements
     */
    public static function getFields(): array
    {        return [
            // Household Identification
            'household_number' => ['type' => 'string', 'max' => 50, 'required' => false, 'unique' => true],
            'household_type' => ['type' => 'enum', 'values' => ['nuclear', 'extended', 'single', 'single-parent', 'other'], 'required' => true],
            'head_resident_id' => ['type' => 'foreignId', 'references' => 'residents.id', 'nullable' => true],
            
            // Address Information
            'house_number' => ['type' => 'string', 'max' => 50, 'required' => true],
            'street_sitio' => ['type' => 'string', 'max' => 100, 'required' => true],
            'barangay' => ['type' => 'string', 'max' => 100, 'required' => true],
            'complete_address' => ['type' => 'text', 'required' => true],
            
            // Socioeconomic Information
            'monthly_income' => ['type' => 'enum', 'values' => ['below-10000', '10000-25000', '25000-50000', '50000-100000', 'above-100000'], 'nullable' => true],
            'primary_income_source' => ['type' => 'string', 'max' => 255, 'nullable' => true],
            
            // Household Classification
            'four_ps_beneficiary' => ['type' => 'boolean', 'default' => false],
            'indigent_family' => ['type' => 'boolean', 'default' => false],
            'has_senior_citizen' => ['type' => 'boolean', 'default' => false],
            'has_pwd_member' => ['type' => 'boolean', 'default' => false],
            
            // Housing Information
            'house_type' => ['type' => 'enum', 'values' => ['concrete', 'semi-concrete', 'wood', 'bamboo', 'mixed'], 'nullable' => true],
            'ownership_status' => ['type' => 'enum', 'values' => ['owned', 'rented', 'shared', 'informal-settler'], 'nullable' => true],
            
            // Utilities Access
            'has_electricity' => ['type' => 'boolean', 'default' => false],
            'has_water_supply' => ['type' => 'boolean', 'default' => false],
            'has_internet_access' => ['type' => 'boolean', 'default' => false],
            
            // System Fields
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
            
            // Special handling for household_number - make it optional for create since it can be auto-generated
            if ($field === 'household_number') {
                $fieldRules[] = 'nullable';
                $fieldRules[] = 'string';
                $fieldRules[] = "max:{$config['max']}";
                $fieldRules[] = 'unique:households,household_number';
            } elseif (isset($config['required']) && $config['required']) {
                $fieldRules[] = 'required';
            } else {
                $fieldRules[] = 'nullable';
            }
            
            if ($config['type'] === 'string' && $field !== 'household_number') {
                $fieldRules[] = 'string';
                if (isset($config['max'])) {
                    $fieldRules[] = "max:{$config['max']}";
                }
                if (isset($config['unique']) && $config['unique']) {
                    $fieldRules[] = 'unique:households,' . $field;
                }
            } elseif ($config['type'] === 'text') {
                $fieldRules[] = 'string';
            } elseif ($config['type'] === 'enum') {
                $fieldRules[] = 'in:' . implode(',', $config['values']);
            } elseif ($config['type'] === 'boolean') {
                $fieldRules[] = 'boolean';
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
        
        // Handle unique validation for updates
        if (isset($rules['household_number'])) {
            $rules['household_number'] = str_replace(
                'unique:households,household_number',
                'unique:households,household_number,{id}',
                $rules['household_number']
            );
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
            if ($config['type'] === 'boolean') {
                $casts[$field] = 'boolean';
            }
        }
          return $casts;
    }
}
