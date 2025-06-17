<?php

namespace App\Models\Schemas;

/**
 * Centralized schema definition for Document model
 * This serves as the single source of truth for all document-related data structure
 */
class DocumentSchema
{
    /**
     * Complete field definitions for documents
     */
    public static function getFields(): array
    {
        return [
            // Basic Information
            'document_number' => ['type' => 'string', 'max' => 255, 'required' => true, 'unique' => true],
            'document_type' => ['type' => 'enum', 'values' => ['BARANGAY_CLEARANCE', 'CERTIFICATE_OF_RESIDENCY', 'CERTIFICATE_OF_INDIGENCY', 'BUSINESS_PERMIT', 'BUILDING_PERMIT', 'FIRST_TIME_JOB_SEEKER', 'SENIOR_CITIZEN_ID', 'PWD_ID', 'BARANGAY_ID', 'OTHERS'], 'required' => true],
            'title' => ['type' => 'string', 'max' => 255, 'required' => true],
            'description' => ['type' => 'text', 'nullable' => true],
            
            // Applicant Information
            'resident_id' => ['type' => 'foreignId', 'references' => 'residents.id', 'nullable' => true],
            'applicant_name' => ['type' => 'string', 'max' => 255, 'required' => true],
            'applicant_address' => ['type' => 'text', 'required' => true],
            'applicant_contact' => ['type' => 'string', 'max' => 20, 'nullable' => true],
            'purpose' => ['type' => 'text', 'required' => true],
            
            // Request Information
            'requested_date' => ['type' => 'date', 'required' => true],
            'needed_date' => ['type' => 'date', 'nullable' => true],
            'priority' => ['type' => 'enum', 'values' => ['LOW', 'NORMAL', 'HIGH', 'URGENT'], 'default' => 'NORMAL'],
            
            // Status & Processing
            'status' => ['type' => 'enum', 'values' => ['PENDING', 'IN_PROCESS', 'FOR_APPROVAL', 'APPROVED', 'READY_FOR_RELEASE', 'RELEASED', 'REJECTED', 'CANCELLED'], 'default' => 'PENDING'],
            'approved_date' => ['type' => 'date', 'nullable' => true],
            'released_date' => ['type' => 'date', 'nullable' => true],
            'expiry_date' => ['type' => 'date', 'nullable' => true],
            
            // Personnel
            'processed_by' => ['type' => 'foreignId', 'references' => 'users.id', 'nullable' => true],
            'approved_by' => ['type' => 'foreignId', 'references' => 'users.id', 'nullable' => true],
            'released_by' => ['type' => 'foreignId', 'references' => 'users.id', 'nullable' => true],
            
            // Payment Information
            'processing_fee' => ['type' => 'decimal', 'precision' => 8, 'scale' => 2, 'default' => 0],
            'amount_paid' => ['type' => 'decimal', 'precision' => 8, 'scale' => 2, 'default' => 0],
            'payment_status' => ['type' => 'enum', 'values' => ['UNPAID', 'PARTIAL', 'PAID', 'WAIVED'], 'default' => 'UNPAID'],
            'payment_method' => ['type' => 'enum', 'values' => ['CASH', 'CHECK', 'ONLINE', 'GCASH', 'BANK_TRANSFER'], 'nullable' => true],
            'receipt_number' => ['type' => 'string', 'max' => 100, 'nullable' => true],
            'payment_date' => ['type' => 'date', 'nullable' => true],
            
            // Requirements & Attachments
            'requirements_submitted' => ['type' => 'json', 'nullable' => true],
            'attachments' => ['type' => 'json', 'nullable' => true],
            
            // Additional Information
            'remarks' => ['type' => 'text', 'nullable' => true],
            'rejection_reason' => ['type' => 'text', 'nullable' => true],
            
            // Verification
            'qr_code' => ['type' => 'text', 'nullable' => true],
            'verification_code' => ['type' => 'string', 'max' => 50, 'nullable' => true],
            
            // System Fields
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
                if (isset($config['unique']) && $config['unique']) {
                    $fieldRules[] = 'unique:documents,' . $field;
                }
            } elseif ($config['type'] === 'date') {
                $fieldRules[] = 'date';
            } elseif ($config['type'] === 'enum') {
                $fieldRules[] = 'in:' . implode(',', $config['values']);
            } elseif ($config['type'] === 'decimal') {
                $fieldRules[] = 'numeric';
                $fieldRules[] = 'min:0';
            } elseif ($config['type'] === 'foreignId') {
                if (isset($config['references'])) {
                    $table = explode('.', $config['references'])[0];
                    $fieldRules[] = "exists:{$table},id";
                }
            } elseif ($config['type'] === 'json') {
                $fieldRules[] = 'array';
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
     * Get casts for the model
     */
    public static function getCasts(): array
    {
        $casts = [];
        foreach (static::getFields() as $field => $config) {
            if ($config['type'] === 'date') {
                $casts[$field] = 'date';
            } elseif ($config['type'] === 'decimal') {
                $casts[$field] = "decimal:{$config['scale']}";
            } elseif ($config['type'] === 'json') {
                $casts[$field] = 'array';
            }
        }
        
        return $casts;
    }
}
