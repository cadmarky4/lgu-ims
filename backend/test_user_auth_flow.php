<?php

/**
 * Test script to verify User authentication flow
 */

require_once 'vendor/autoload.php';

// Get the base URL from environment or use default
$baseUrl = 'http://localhost:8000/api';

echo "=== Testing User Authentication Flow ===\n\n";

// Test data
$testUser = [
    'username' => 'testuser_' . time(),
    'email' => 'testuser_' . time() . '@barangaysanmiguel.gov.ph',
    'password' => 'Password123!',
    'password_confirmation' => 'Password123!',
    'first_name' => 'Juan',
    'last_name' => 'Dela Cruz',
    'middle_name' => 'Santos',
    'role' => 'STAFF',
    'department' => 'Administration',
    'position' => 'Administrative Assistant',
    'employee_id' => 'EMP001',
    'phone' => '+63 9123456789',
];

// Test 1: User Registration
echo "1. Testing User Registration...\n";
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $baseUrl . '/auth/register',
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($testUser),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json'
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => false,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "   HTTP Code: $httpCode\n";
if ($response) {
    $responseData = json_decode($response, true);
    if ($responseData['success'] ?? false) {
        echo "   ✅ Registration successful\n";
        $token = $responseData['data']['token'];
        $userId = $responseData['data']['user']['id'];
        echo "   User ID: $userId\n";
        echo "   Token: " . substr($token, 0, 20) . "...\n";
    } else {
        echo "   ❌ Registration failed: " . ($responseData['message'] ?? 'Unknown error') . "\n";
        if (isset($responseData['errors'])) {
            echo "   Validation errors:\n";
            foreach ($responseData['errors'] as $field => $errors) {
                echo "     - $field: " . implode(', ', $errors) . "\n";
            }
        }
        exit(1);
    }
} else {
    echo "   ❌ No response received\n";
    exit(1);
}

echo "\n";

// Test 2: User Login
echo "2. Testing User Login...\n";
$loginData = [
    'email' => $testUser['email'],
    'password' => $testUser['password']
];

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $baseUrl . '/auth/login',
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($loginData),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json'
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => false,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "   HTTP Code: $httpCode\n";
if ($response) {
    $responseData = json_decode($response, true);
    if ($responseData['success'] ?? false) {
        echo "   ✅ Login successful\n";
        $loginToken = $responseData['data']['token'];
        $loginUser = $responseData['data']['user'];
        echo "   User: {$loginUser['first_name']} {$loginUser['last_name']}\n";
        echo "   Role: {$loginUser['role']}\n";
        echo "   Department: {$loginUser['department']}\n";
        echo "   Token: " . substr($loginToken, 0, 20) . "...\n";
    } else {
        echo "   ❌ Login failed: " . ($responseData['message'] ?? 'Unknown error') . "\n";
        exit(1);
    }
} else {
    echo "   ❌ No response received\n";
    exit(1);
}

echo "\n";

// Test 3: Get authenticated user
echo "3. Testing Get Authenticated User...\n";
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $baseUrl . '/auth/user',
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: Bearer ' . $loginToken
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => false,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "   HTTP Code: $httpCode\n";
if ($response) {
    $responseData = json_decode($response, true);
    if ($responseData['success'] ?? false) {
        echo "   ✅ Get user successful\n";
        $user = $responseData['data'];
        echo "   Full Name: {$user['full_name']}\n";
        echo "   Email: {$user['email']}\n";
        echo "   Phone: {$user['phone']}\n";
        echo "   Employee ID: {$user['employee_id']}\n";
        echo "   Active: " . ($user['is_active'] ? 'Yes' : 'No') . "\n";
        echo "   Verified: " . ($user['is_verified'] ? 'Yes' : 'No') . "\n";
    } else {
        echo "   ❌ Get user failed: " . ($responseData['message'] ?? 'Unknown error') . "\n";
    }
} else {
    echo "   ❌ No response received\n";
}

echo "\n";

// Test 4: Logout
echo "4. Testing User Logout...\n";
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $baseUrl . '/auth/logout',
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: Bearer ' . $loginToken
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => false,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "   HTTP Code: $httpCode\n";
if ($response) {
    $responseData = json_decode($response, true);
    if ($responseData['success'] ?? false) {
        echo "   ✅ Logout successful\n";
    } else {
        echo "   ❌ Logout failed: " . ($responseData['message'] ?? 'Unknown error') . "\n";
    }
} else {
    echo "   ❌ No response received\n";
}

echo "\n=== Test Complete ===\n";
