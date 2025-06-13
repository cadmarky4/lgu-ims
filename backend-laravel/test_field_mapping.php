<?php

/**
 * Test file to verify resident creation with all fields
 * This file tests the complete field mapping and duplicate prevention
 */

require_once __DIR__ . '/../vendor/autoload.php';

// Load Laravel app
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->bind('path.config', __DIR__ . '/../config');

use App\Models\Resident;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

echo "=== RESIDENT FIELD MAPPING TEST ===\n\n";

// Test 1: Check all required database columns exist
echo "1. Checking database schema...\n";
$columns = Schema::getColumnListing('residents');
$requiredFields = [
    'first_name', 'last_name', 'middle_name', 'suffix', 'birth_date', 'birth_place',
    'gender', 'civil_status', 'nationality', 'religion', 'mobile_number', 'telephone_number',
    'email_address', 'house_number', 'street', 'purok', 'complete_address',
    'philhealth_number', 'sss_number', 'tin_number', 'voters_id_number',
    'household_id', 'is_household_head', 'relationship_to_head', 'occupation', 'employer',
    'monthly_income', 'employment_status', 'educational_attainment', 'emergency_contact_name',
    'emergency_contact_number', 'emergency_contact_relationship', 'mother_name', 'father_name',
    'primary_id_type', 'id_number', 'medical_conditions', 'allergies', 'senior_citizen',
    'person_with_disability', 'disability_type', 'indigenous_people', 'indigenous_group',
    'four_ps_beneficiary', 'four_ps_household_id', 'voter_status', 'precinct_number'
];

$missingFields = array_diff($requiredFields, $columns);
if (empty($missingFields)) {
    echo "✓ All required fields exist in database\n";
} else {
    echo "✗ Missing fields: " . implode(', ', $missingFields) . "\n";
}

// Test 2: Check unique constraints
echo "\n2. Checking unique constraints...\n";
try {
    $indexes = DB::select("PRAGMA index_list(residents)");
    $hasUniqueConstraint = false;
    foreach ($indexes as $index) {
        if (strpos($index->name, 'unique') !== false) {
            $hasUniqueConstraint = true;
            break;
        }
    }
    echo $hasUniqueConstraint ? "✓ Unique constraints exist\n" : "✗ No unique constraints found\n";
} catch (Exception $e) {
    echo "✗ Error checking constraints: " . $e->getMessage() . "\n";
}

// Test 3: Test resident creation with all fields
echo "\n3. Testing resident creation with all fields...\n";
try {
    $testData = [
        'first_name' => 'Test',
        'last_name' => 'User',
        'middle_name' => 'Sample',
        'suffix' => 'Jr.',
        'birth_date' => '1990-01-01',
        'birth_place' => 'Test City',
        'gender' => 'MALE',
        'civil_status' => 'SINGLE',
        'nationality' => 'Filipino',
        'religion' => 'Catholic',
        'mobile_number' => '09123456789',
        'telephone_number' => '02-1234567',
        'email_address' => 'test@example.com',
        'house_number' => '123',
        'street' => 'Test Street',
        'purok' => 'Purok 1',
        'complete_address' => '123 Test Street, Purok 1, Test City',
        'philhealth_number' => 'PH123456789',
        'sss_number' => 'SS123456789',
        'tin_number' => 'TN123456789',
        'voters_id_number' => 'VI123456789',
        'is_household_head' => true,
        'occupation' => 'Software Developer',
        'employer' => 'Test Company',
        'monthly_income' => 50000.00,
        'employment_status' => 'EMPLOYED',
        'educational_attainment' => 'COLLEGE_GRADUATE',
        'emergency_contact_name' => 'Emergency Contact',
        'emergency_contact_number' => '09987654321',
        'emergency_contact_relationship' => 'Spouse',
        'mother_name' => 'Test Mother',
        'father_name' => 'Test Father',
        'primary_id_type' => 'National ID',
        'id_number' => 'ID123456789',
        'medical_conditions' => 'None',
        'allergies' => 'None',
        'senior_citizen' => false,
        'person_with_disability' => false,
        'indigenous_people' => false,
        'four_ps_beneficiary' => false,
        'voter_status' => 'REGISTERED',
        'precinct_number' => 'P001',
        'status' => 'ACTIVE'
    ];
    
    $resident = Resident::create($testData);
    echo "✓ Resident created successfully with ID: " . $resident->id . "\n";
    
    // Test 4: Verify all fields were saved
    echo "\n4. Verifying all fields were saved...\n";
    $saved = Resident::find($resident->id);
    $errors = [];
    
    foreach ($testData as $field => $value) {
        if ($saved->$field != $value) {
            $errors[] = "$field: expected '$value', got '{$saved->$field}'";
        }
    }
    
    if (empty($errors)) {
        echo "✓ All fields saved correctly\n";
    } else {
        echo "✗ Field mapping errors:\n";
        foreach ($errors as $error) {
            echo "  - $error\n";
        }
    }
    
    // Test 5: Test duplicate prevention
    echo "\n5. Testing duplicate prevention...\n";
    try {
        $duplicate = Resident::create([
            'first_name' => 'Test',
            'last_name' => 'User',
            'birth_date' => '1990-01-01',
            'birth_place' => 'Test City',
            'gender' => 'MALE',
            'civil_status' => 'SINGLE',
            'nationality' => 'Filipino',
            'complete_address' => '123 Test Street, Purok 1, Test City',
            'voter_status' => 'REGISTERED'
        ]);
        echo "✗ Duplicate creation should have failed but didn't\n";
    } catch (Exception $e) {
        if (strpos($e->getMessage(), 'unique') !== false || strpos($e->getMessage(), 'UNIQUE') !== false) {
            echo "✓ Duplicate prevention working correctly\n";
        } else {
            echo "✗ Unexpected error: " . $e->getMessage() . "\n";
        }
    }
    
    // Cleanup
    $resident->delete();
    echo "\n6. Test cleanup completed\n";
    
} catch (Exception $e) {
    echo "✗ Error creating test resident: " . $e->getMessage() . "\n";
}

echo "\n=== TEST COMPLETED ===\n";
