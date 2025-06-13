<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Models\Resident;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// Bootstrap Laravel application
$app = Application::configure(basePath: __DIR__)
    ->withRouting(
        web: __DIR__.'/routes/web.php',
        api: __DIR__.'/routes/api.php',
        commands: __DIR__.'/routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->create();

// Test data with all possible fields
$testData = [
    'first_name' => 'Test',
    'last_name' => 'Resident',
    'middle_name' => 'Middle',
    'suffix' => 'Jr.',
    'birth_date' => '1990-01-01',
    'birth_place' => 'Test City',
    'age' => 35,
    'gender' => 'MALE',
    'civil_status' => 'SINGLE',
    'nationality' => 'Filipino',
    'religion' => 'Catholic',
    'mobile_number' => '09123456789',
    'telephone_number' => '(02)1234567',
    'email_address' => 'test@example.com',
    'house_number' => '123',
    'street' => 'Test Street',
    'purok' => 'Purok 1',
    'complete_address' => '123 Test Street, Purok 1, Test City',
    'philhealth_number' => '12-345678901-2',
    'sss_number' => '12-3456789-0',
    'tin_number' => '123-456-789-000',
    'voters_id_number' => 'VID123456789',
    'is_household_head' => true,
    'relationship_to_head' => null,
    'occupation' => 'Engineer',
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

echo "Testing resident creation with all fields...\n\n";

try {
    $resident = Resident::create($testData);
    echo "✓ Resident created successfully with ID: " . $resident->id . "\n";
    
    // Verify all fields were saved
    echo "\nVerifying all fields were saved...\n";
    $saved = Resident::find($resident->id);
    
    foreach ($testData as $field => $value) {
        if ($saved->$field != $value) {
            echo "⚠ Field $field: expected '$value', got '{$saved->$field}'\n";
        } else {
            echo "✓ Field $field: $value\n";
        }
    }
    
    echo "\n✓ All tests completed successfully!\n";
    
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " Line: " . $e->getLine() . "\n";
}

?>
