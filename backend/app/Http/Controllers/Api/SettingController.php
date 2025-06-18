<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class SettingController extends Controller
{
    /**
     * Display the settings.
     */
    public function index(): JsonResponse
    {
        try {
            $settings = Setting::current();
            
            return response()->json([
                'success' => true,
                'data' => $settings->toFrontendFormat(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the settings.
     */
    public function update(Request $request): JsonResponse
    {
        try {
            // Validation rules
            $validator = Validator::make($request->all(), [
                // General Information
                'barangay' => 'nullable|string|max:255',
                'city' => 'nullable|string|max:255',
                'province' => 'nullable|string|max:255',
                'region' => 'nullable|string|max:255',
                'type' => 'nullable|string|max:255',
                'contactNumber' => 'nullable|string|max:255',
                'emailAddress' => 'nullable|email|max:255',
                'openingHours' => 'nullable|string|regex:/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/',
                'closingHours' => 'nullable|string|regex:/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/',
                'primaryLanguage' => 'nullable|string|max:255',
                'secondaryLanguage' => 'nullable|string|max:255',
                
                // Privacy and Security
                'sessionTimeout' => 'nullable|integer|min:5|max:1440', // 5 minutes to 24 hours
                'maxLoginAttempts' => 'nullable|integer|min:1|max:10',
                'dataRetention' => 'nullable|integer|min:1|max:50', // 1 to 50 years
                'backupFrequency' => 'nullable|in:Daily,Weekly,Monthly',
                
                // System
                'systemName' => 'nullable|string|max:255',
                'versionNumber' => 'nullable|string|max:20',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $settings = Setting::current();
            $settings->updateFromFrontend($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Settings updated successfully',
                'data' => $settings->fresh()->toFrontendFormat(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reset settings to default values.
     */
    public function reset(): JsonResponse
    {
        try {
            $settings = Setting::current();
            
            $settings->update([
                'system_name' => 'LGU Information Management System',
                'version_number' => '1.0.0',
                'primary_language' => 'English',
                'session_timeout' => 30,
                'max_login_attempts' => 3,
                'data_retention' => 7,
                'backup_frequency' => 'Daily',
                // Clear other fields
                'barangay' => null,
                'city' => null,
                'province' => null,
                'region' => null,
                'type' => null,
                'contact_number' => null,
                'email_address' => null,
                'opening_hours' => null,
                'closing_hours' => null,
                'secondary_language' => null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Settings reset to default values',
                'data' => $settings->fresh()->toFrontendFormat(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reset settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
