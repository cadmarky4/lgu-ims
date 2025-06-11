<?php

require_once 'vendor/autoload.php';

use Illuminate\Http\Request;
use Illuminate\Foundation\Application;

// Create Laravel app instance for testing
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    // Test login first
    $loginData = [
        'email' => 'admin@lgu.gov.ph',
        'password' => 'password123'
    ];

    $loginResponse = \Illuminate\Support\Facades\Http::post('http://127.0.0.1:8000/api/auth/login', $loginData);
    $loginResult = $loginResponse->json();
    
    if (!$loginResult['success']) {
        echo "❌ Login failed: " . $loginResult['message'] . "\n";
        exit(1);
    }
    
    $token = $loginResult['data']['token'];
    echo "✅ Login successful, token: " . substr($token, 0, 20) . "...\n\n";

    // Test statistics endpoint
    echo "🧮 Testing Statistics Endpoints\n";
    echo "================================\n";
    
    $endpoints = [
        'residents/statistics',
        'households/statistics',
        'documents/statistics',
        'projects/statistics',
        'complaints/statistics',
        'suggestions/statistics',
        'blotter-cases/statistics',
        'appointments/statistics',
        'barangay-officials/statistics'
    ];
    
    foreach ($endpoints as $endpoint) {
        try {
            $response = \Illuminate\Support\Facades\Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
                'Accept' => 'application/json'
            ])->get("http://127.0.0.1:8000/api/{$endpoint}");
            
            $result = $response->json();
            
            if ($response->successful() && isset($result['success']) && $result['success']) {
                echo "✅ {$endpoint} - Working\n";
            } else {
                echo "❌ {$endpoint} - Failed\n";
                if (isset($result['message'])) {
                    echo "   Error: {$result['message']}\n";
                }
                if (isset($result['error'])) {
                    echo "   Details: {$result['error']}\n";
                }
            }
        } catch (\Exception $e) {
            echo "❌ {$endpoint} - Exception: " . $e->getMessage() . "\n";
        }
    }
    
    echo "\n🔍 Testing Special Endpoints\n";
    echo "=============================\n";
    
    $specialEndpoints = [
        'appointments/available-slots?date=2025-06-15',
        'barangay-officials/active'
    ];
    
    foreach ($specialEndpoints as $endpoint) {
        try {
            $response = \Illuminate\Support\Facades\Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
                'Accept' => 'application/json'
            ])->get("http://127.0.0.1:8000/api/{$endpoint}");
            
            $result = $response->json();
            
            if ($response->successful() && isset($result['success']) && $result['success']) {
                echo "✅ {$endpoint} - Working\n";
            } else {
                echo "❌ {$endpoint} - Failed\n";
                if (isset($result['message'])) {
                    echo "   Error: {$result['message']}\n";
                }
                if (isset($result['error'])) {
                    echo "   Details: {$result['error']}\n";
                }
            }
        } catch (\Exception $e) {
            echo "❌ {$endpoint} - Exception: " . $e->getMessage() . "\n";
        }
    }

} catch (\Exception $e) {
    echo "❌ Test failed with exception: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
