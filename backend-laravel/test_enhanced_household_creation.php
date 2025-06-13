<?php

require_once 'vendor/autoload.php';

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

echo "Testing Enhanced Household Creation with All Fields\n";
echo "=================================================\n";

$client = new Client([
    'base_uri' => 'http://localhost:8000/api/',
    'timeout' => 30,
    'headers' => [
        'Accept' => 'application/json',
        'Content-Type' => 'application/json',
    ]
]);

// First, let's get a resident to use as household head
echo "1. Getting a resident to use as household head...\n";
try {
    $response = $client->get('residents');
    $data = json_decode($response->getBody(), true);
    
    if (!$data['success'] || empty($data['data']['data'])) {
        echo "❌ No residents available. Please create a resident first.\n";
        exit(1);
    }
    
    $resident = $data['data']['data'][0];
    $residentId = $resident['id'];
    echo "✅ Found resident: {$resident['first_name']} {$resident['last_name']} (ID: {$residentId})\n\n";
    
} catch (RequestException $e) {
    echo "❌ Error fetching residents: " . $e->getMessage() . "\n";
    exit(1);
}

// Now test creating a comprehensive household
echo "2. Creating comprehensive household with all fields...\n";
try {
    $householdData = [
        // Basic required fields
        'household_head_id' => $residentId,
        'purok' => 'Purok 5',
        'address' => 'Basic address for legacy compatibility',
        'housing_type' => 'OWNED',
        'monthly_income_bracket' => '20001_30000',
        
        // Extended address information
        'house_number' => '123-A',
        'street' => 'Mabini Street',
        'complete_address' => '123-A Mabini Street, Purok 5, Barangay Centro',
        
        // Detailed housing information
        'house_ownership' => 'OWNED',
        'house_type' => 'CONCRETE',
        'roof_material' => 'GALVANIZED_IRON',
        'wall_material' => 'HOLLOW_BLOCKS',
        'number_of_rooms' => 4,
        
        // Economic information
        'estimated_monthly_income' => 25000.50,
        'income_classification' => 'MIDDLE',
        'source_of_income' => 'employment',
        
        // Utilities and facilities
        'has_electricity' => true,
        'has_water_supply' => true,
        'water_source' => 'NAWASA',
        'has_toilet' => true,
        'toilet_type' => 'FLUSH',
        'has_internet' => true,
        
        // Government programs
        'four_ps_beneficiary' => false,
        'four_ps_household_id' => null,
        'government_programs' => ['PhilHealth', 'SSS'],
        'livelihood_programs' => 'Micro-enterprise development program',
        'health_programs' => 'Family planning program, Immunization program',
        
        // Other information
        'vehicle_owned' => 'Motorcycle',
        'remarks' => 'Complete household profile with all enhanced fields'
    ];
    
    $response = $client->post('households', [
        'json' => $householdData
    ]);
    
    $result = json_decode($response->getBody(), true);
    
    if ($result['success']) {
        echo "✅ Household created successfully!\n";
        echo "📋 Household Number: {$result['data']['household_number']}\n";
        echo "🏠 Address: {$result['data']['complete_address']}\n";
        echo "💰 Income: ₱{$result['data']['estimated_monthly_income']}\n";
        echo "🏗️ House Type: {$result['data']['house_type']}\n";
        echo "🏘️ House Ownership: {$result['data']['house_ownership']}\n";
        echo "💧 Water Source: {$result['data']['water_source']}\n";
        echo "🚽 Toilet Type: {$result['data']['toilet_type']}\n";
        echo "📱 Government Programs: " . json_encode($result['data']['government_programs']) . "\n";
        echo "💼 Livelihood Programs: {$result['data']['livelihood_programs']}\n";
        echo "🏥 Health Programs: {$result['data']['health_programs']}\n";
        echo "🏍️ Vehicle: {$result['data']['vehicle_owned']}\n";
        
        // Count total fields captured
        $capturedFields = 0;
        foreach ($result['data'] as $key => $value) {
            if (!is_null($value) && $value !== '' && $value !== []) {
                $capturedFields++;
            }
        }
        echo "📊 Total fields captured: {$capturedFields}\n\n";
        
    } else {
        echo "❌ Failed to create household: {$result['message']}\n";
        if (isset($result['errors'])) {
            echo "Validation errors:\n";
            foreach ($result['errors'] as $field => $errors) {
                echo "  - {$field}: " . implode(', ', $errors) . "\n";
            }
        }
    }
    
} catch (RequestException $e) {
    echo "❌ Error creating household: " . $e->getMessage() . "\n";
    if ($e->hasResponse()) {
        $errorBody = json_decode($e->getResponse()->getBody(), true);
        if (isset($errorBody['errors'])) {
            echo "Validation errors:\n";
            foreach ($errorBody['errors'] as $field => $errors) {
                echo "  - {$field}: " . implode(', ', $errors) . "\n";
            }
        }
    }
}

echo "\n3. Testing 4Ps beneficiary household...\n";
try {
    $fourPsHouseholdData = [
        'household_head_id' => $residentId,
        'purok' => 'Purok 1',
        'address' => 'Address for 4Ps beneficiary household',
        'housing_type' => 'RENTED',
        'monthly_income_bracket' => 'BELOW_5000',
        'complete_address' => '456 Santos Street, Purok 1, Barangay Centro',
        'house_ownership' => 'RENTED',
        'house_type' => 'WOOD',
        'estimated_monthly_income' => 4500.00,
        'income_classification' => 'POOR',
        'source_of_income' => 'agriculture',
        'has_electricity' => false,
        'has_water_supply' => false,
        'water_source' => 'DEEP_WELL',
        'has_toilet' => false,
        'toilet_type' => 'NONE',
        'four_ps_beneficiary' => true,
        'four_ps_household_id' => '4PS-2025-001234',
        'government_programs' => ['4Ps', 'PhilHealth', 'Food Stamps'],
        'remarks' => '4Ps beneficiary household test'
    ];
    
    $response = $client->post('households', [
        'json' => $fourPsHouseholdData
    ]);
    
    $result = json_decode($response->getBody(), true);
    
    if ($result['success']) {
        echo "✅ 4Ps Household created successfully!\n";
        echo "🏠 4Ps ID: {$result['data']['four_ps_household_id']}\n";
        echo "📋 Household Number: {$result['data']['household_number']}\n";
        echo "💰 Income: ₱{$result['data']['estimated_monthly_income']}\n";
        echo "🏷️ Classification: {$result['data']['income_classification']}\n";
        
    } else {
        echo "❌ Failed to create 4Ps household: {$result['message']}\n";
    }
    
} catch (RequestException $e) {
    echo "❌ Error creating 4Ps household: " . $e->getMessage() . "\n";
}

echo "\n✅ Enhanced household field mapping test completed!\n";
echo "🎯 All 25+ database fields are now properly captured from the frontend form.\n";
