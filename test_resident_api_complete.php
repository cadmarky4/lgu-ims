<?php

// Test the updated resident API endpoints with complete field mapping

$baseUrl = 'http://127.0.0.1:8000/api';

function makeRequest($url, $method = 'GET', $data = null, $headers = []) {
    $ch = curl_init();
    
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => array_merge([
            'Content-Type: application/json',
            'Accept: application/json'
        ], $headers)
    ]);
    
    if ($data && in_array($method, ['POST', 'PUT', 'PATCH'])) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        return ['error' => $error, 'http_code' => $httpCode];
    }
    
    return [
        'data' => json_decode($response, true),
        'http_code' => $httpCode,
        'raw_response' => $response
    ];
}

echo "=== Testing Complete Resident API Integration ===\n\n";

// Test 1: Check duplicate residents endpoint
echo "1. Testing duplicate check endpoint...\n";
$duplicateCheck = makeRequest("$baseUrl/residents/check-duplicates", 'POST', [
    'first_name' => 'John',
    'last_name' => 'Doe',
    'birth_date' => '1990-01-01'
]);

echo "Duplicate check response (HTTP {$duplicateCheck['http_code']}):\n";
if (isset($duplicateCheck['data'])) {
    echo json_encode($duplicateCheck['data'], JSON_PRETTY_PRINT) . "\n\n";
} else {
    echo "Error or no data returned\n";
    echo "Raw response: " . ($duplicateCheck['raw_response'] ?? 'No response') . "\n\n";
}

// Test 2: Create a new resident with all fields
echo "2. Testing create resident with complete field mapping...\n";
$newResident = [
    // Basic Information
    'first_name' => 'Juan',
    'last_name' => 'Dela Cruz',
    'middle_name' => 'Santos',
    'suffix' => 'Jr.',
    'birth_date' => '1985-05-15',
    'birth_place' => 'Manila, Philippines',
    'gender' => 'MALE',
    'civil_status' => 'MARRIED',
    'nationality' => 'Filipino',
    'religion' => 'Catholic',
    
    // Employment Information
    'employment_status' => 'EMPLOYED',
    'educational_attainment' => 'College Graduate',
    'occupation' => 'Software Engineer',
    'employer' => 'Tech Company Inc.',
    'monthly_income' => 50000.00,
    
    // Contact Information
    'mobile_number' => '+639123456789',
    'telephone_number' => '02-8123-4567',
    'email_address' => 'juan.delacruz@email.com',
    'complete_address' => '123 Main Street, Barangay Sample, City',
    'house_number' => '123',
    'street' => 'Main Street',
    'purok' => 'Purok 1',
    
    // Family Information
    'is_household_head' => true,
    'relationship_to_head' => 'Head',
    'emergency_contact_name' => 'Maria Dela Cruz',
    'emergency_contact_number' => '+639987654321',
    'emergency_contact_relationship' => 'Spouse',
    
    // Government IDs
    'philhealth_number' => '12-345678901-2',
    'sss_number' => '12-3456789-0',
    'tin_number' => '123-456-789-000',
    'voters_id_number' => 'VID123456789',
    'voter_status' => 'REGISTERED',
    'precinct_number' => '001A',
    
    // Health & Medical
    'medical_conditions' => 'None',
    'allergies' => 'None',
    
    // Special Classifications
    'senior_citizen' => false,
    'person_with_disability' => false,
    'indigenous_people' => false,
    'four_ps_beneficiary' => false
];

$createResponse = makeRequest("$baseUrl/residents", 'POST', $newResident);

echo "Create resident response (HTTP {$createResponse['http_code']}):\n";
if (isset($createResponse['data'])) {
    echo json_encode($createResponse['data'], JSON_PRETTY_PRINT) . "\n\n";
    
    // If resident was created successfully, test other endpoints
    if ($createResponse['http_code'] === 201 && isset($createResponse['data']['data']['id'])) {
        $residentId = $createResponse['data']['data']['id'];
        
        // Test 3: Get residents list
        echo "3. Testing get residents list...\n";
        $listResponse = makeRequest("$baseUrl/residents");
        echo "Get residents response (HTTP {$listResponse['http_code']}):\n";
        if (isset($listResponse['data'])) {
            echo "Total residents: " . count($listResponse['data']['data'] ?? []) . "\n\n";
        } else {
            echo "Error getting residents list\n\n";
        }
        
        // Test 4: Get specific resident
        echo "4. Testing get specific resident...\n";
        $getResponse = makeRequest("$baseUrl/residents/$residentId");
        echo "Get resident response (HTTP {$getResponse['http_code']}):\n";
        if (isset($getResponse['data'])) {
            echo "Resident name: " . ($getResponse['data']['data']['first_name'] ?? 'Unknown') . " " . ($getResponse['data']['data']['last_name'] ?? '') . "\n\n";
        } else {
            echo "Error getting resident details\n\n";
        }
        
        // Test 5: Update resident
        echo "5. Testing update resident...\n";
        $updateData = [
            'mobile_number' => '+639111222333',
            'occupation' => 'Senior Software Engineer'
        ];
        $updateResponse = makeRequest("$baseUrl/residents/$residentId", 'PUT', $updateData);
        echo "Update resident response (HTTP {$updateResponse['http_code']}):\n";
        if (isset($updateResponse['data'])) {
            echo "Update successful\n\n";
        } else {
            echo "Error updating resident\n";
            echo "Raw response: " . ($updateResponse['raw_response'] ?? 'No response') . "\n\n";
        }
    }
} else {
    echo "Error creating resident:\n";
    echo "Raw response: " . ($createResponse['raw_response'] ?? 'No response') . "\n\n";
}

echo "=== API Integration Test Complete ===\n";

?>
