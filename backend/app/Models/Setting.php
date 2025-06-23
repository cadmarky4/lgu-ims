<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        // General Information
        'barangay',
        'city',
        'province',
        'region',
        'type',
        'contact_number',
        'email_address',
        'opening_hours',
        'closing_hours',
        'primary_language',
        'secondary_language',
        
        // Privacy and Security
        'session_timeout',
        'max_login_attempts',
        'data_retention',
        'backup_frequency',
        
        // System
        'system_name',
        'version_number',
    ];

    protected $casts = [
        'session_timeout' => 'integer',
        'max_login_attempts' => 'integer',
        'data_retention' => 'integer',
    ];

    /**
     * Get the current settings (singleton pattern)
     * Settings should only have one record
     */
    public static function current()
    {
        return static::first() ?: static::create([
            'system_name' => 'LGU Information Management System',
            'version_number' => '1.0.0',
            'primary_language' => 'English',
            'session_timeout' => 30,
            'max_login_attempts' => 3,
            'data_retention' => 7,
            'backup_frequency' => 'Daily',
        ]);
    }

    /**
     * Transform for frontend (camelCase conversion)
     */
    public function toFrontendFormat()
    {
        return [
            'barangay' => $this->barangay,
            'city' => $this->city,
            'province' => $this->province,
            'region' => $this->region,
            'type' => $this->type,
            'contactNumber' => $this->contact_number,
            'emailAddress' => $this->email_address,
            'openingHours' => $this->opening_hours ?? '',
            'closingHours' => $this->closing_hours ?? '',
            'primaryLanguage' => $this->primary_language,
            'secondaryLanguage' => $this->secondary_language,
            'sessionTimeout' => (string)$this->session_timeout,
            'maxLoginAttempts' => (string)$this->max_login_attempts,
            'dataRetention' => (string)$this->data_retention,
            'backupFrequency' => $this->backup_frequency,
            'systemName' => $this->system_name,
            'versionNumber' => $this->version_number,
        ];
    }

    /**
     * Update from frontend format (snake_case conversion)
     */
    public function updateFromFrontend(array $data)
    {
        $backendData = [
            'barangay' => $data['barangay'] ?? null,
            'city' => $data['city'] ?? null,
            'province' => $data['province'] ?? null,
            'region' => $data['region'] ?? null,
            'type' => $data['type'] ?? null,
            'contact_number' => $data['contactNumber'] ?? null,
            'email_address' => $data['emailAddress'] ?? null,
            'opening_hours' => $data['openingHours'] ?? null,
            'closing_hours' => $data['closingHours'] ?? null,
            'primary_language' => $data['primaryLanguage'] ?? null,
            'secondary_language' => $data['secondaryLanguage'] ?? null,
            'session_timeout' => isset($data['sessionTimeout']) ? (int)$data['sessionTimeout'] : null,
            'max_login_attempts' => isset($data['maxLoginAttempts']) ? (int)$data['maxLoginAttempts'] : null,
            'data_retention' => isset($data['dataRetention']) ? (int)$data['dataRetention'] : null,
            'backup_frequency' => $data['backupFrequency'] ?? null,
            'system_name' => $data['systemName'] ?? null,
            'version_number' => $data['versionNumber'] ?? null,
        ];

        // Remove null values
        $backendData = array_filter($backendData, function($value) {
            return $value !== null;
        });

        return $this->update($backendData);
    }
}
