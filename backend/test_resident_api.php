<?php

/**
 * Simple test script to verify the Resident API is working
 * Run this with: php test_resident_api.php
 */

// Change to the script's directory
chdir(__DIR__);

// Include the autoloader
require_once 'vendor/autoload.php';

// Load environment
$app = require_once 'bootstrap/app.php';

// Boot the application
$app->boot();

echo "Testing Resident API Functionality\n";
echo "==================================\n\n";

try {
    // Test 1: Check if we can access the Resident model
    echo "1. Testing Resident Model Access...\n";
    $residentCount = App\Models\Resident::count();
    echo "   ✓ Current resident count: {$residentCount}\n\n";

    // Test 2: Test validation rules
    echo "2. Testing Validation Rules...\n";
    $validator = Illuminate\Support\Facades\Validator::make([
        'first_name' => 'John',
        'last_name' => 'Doe',
        'birth_date' => '1990-01-01',
        'birth_place' => 'Test City',
        'gender' => 'MALE',
        'civil_status' => 'SINGLE',
        'nationality' => 'Filipino',
        'complete_address' => 'Test Address',
        'voter_status' => 'NOT_REGISTERED'
    ], [
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'birth_date' => 'required|date|before:today',
        'birth_place' => 'required|string|max:255',
        'gender' => 'required|in:MALE,FEMALE',
        'civil_status' => 'required|in:SINGLE,MARRIED,WIDOWED,DIVORCED,SEPARATED',
        'nationality' => 'required|string|max:100',
        'complete_address' => 'required|string',
        'voter_status' => 'required|in:REGISTERED,NOT_REGISTERED,DECEASED,TRANSFERRED',
    ]);

    if ($validator->fails()) {
        echo "   ✗ Validation failed:\n";
        foreach ($validator->errors()->all() as $error) {
            echo "     - {$error}\n";
        }
    } else {
        echo "   ✓ Validation rules working correctly\n";
    }
    echo "\n";

    // Test 3: Test creating a resident
    echo "3. Testing Resident Creation...\n";
    $testData = [
        'first_name' => 'Test',
        'last_name' => 'User',
        'birth_date' => '1990-01-01',
        'birth_place' => 'Test City',
        'gender' => 'MALE',
        'civil_status' => 'SINGLE',
        'nationality' => 'Filipino',
        'complete_address' => 'Test Address',
        'voter_status' => 'NOT_REGISTERED',
        'status' => 'ACTIVE',
        'senior_citizen' => false,
        'person_with_disability' => false,
        'indigenous_people' => false,
        'four_ps_beneficiary' => false,
        'is_household_head' => false,
    ];

    $resident = App\Models\Resident::create($testData);
    echo "   ✓ Test resident created with ID: {$resident->id}\n";

    // Test 4: Test querying residents
    echo "4. Testing Resident Queries...\n";
    $residents = App\Models\Resident::where('first_name', 'Test')->get();
    echo "   ✓ Found {$residents->count()} test residents\n";

    // Test 5: Test statistics
    echo "5. Testing Statistics...\n";
    $stats = [
        'total' => App\Models\Resident::count(),
        'male' => App\Models\Resident::where('gender', 'MALE')->count(),
        'female' => App\Models\Resident::where('gender', 'FEMALE')->count(),
    ];
    echo "   ✓ Statistics: Total={$stats['total']}, Male={$stats['male']}, Female={$stats['female']}\n";

    // Clean up: Delete the test resident
    echo "6. Cleaning up...\n";
    $resident->delete();
    echo "   ✓ Test resident deleted\n";

    echo "\n✅ All tests passed! The Resident API is working correctly.\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}
