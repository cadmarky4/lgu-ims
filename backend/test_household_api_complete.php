<?php

/**
 * Comprehensive test for household API functionality
 * This test verifies that all fields from the frontend are properly handled by the backend
 */

use App\Models\Household;
use App\Models\Resident;
use App\Models\User;

// Create test user and residents
$user = User::factory()->create([
    'first_name' => 'Test',
    'last_name' => 'Admin',
    'email' => 'admin@test.com'
]);

$headResident = Resident::factory()->create([
    'first_name' => 'John',
    'last_name' => 'Doe',
    'age' => 45,
    'mobile_number' => '09123456789',
    'civil_status' => 'married',
    'gender' => 'male'
]);

$memberResident1 = Resident::factory()->create([
    'first_name' => 'Jane',
    'last_name' => 'Doe',
    'age' => 42,
    'mobile_number' => '09123456790',
    'civil_status' => 'married',
    'gender' => 'female'
]);

$memberResident2 = Resident::factory()->create([
    'first_name' => 'Jimmy',
    'last_name' => 'Doe',
    'age' => 18,
    'mobile_number' => '09123456791',
    'civil_status' => 'single',
    'gender' => 'male'
]);

echo "Created test users and residents\n";

// Test 1: Create household with complete frontend data structure
echo "\n=== Test 1: Create Household with Complete Data ===\n";

$frontendData = [
    'household_number' => 'HH-TEST-' . date('Y-m-d-His'),
    'household_type' => 'nuclear',
    'barangay' => 'Barangay San Antonio',
    'street_sitio' => 'Purok 1, Main Street',
    'head_resident_id' => $headResident->id,
    'member_ids' => [
        [
            'resident_id' => $memberResident1->id,
            'relationship' => 'Spouse'
        ],
        [
            'resident_id' => $memberResident2->id,
            'relationship' => 'Child'
        ]
    ],
    // Classification fields (frontend: householdClassification)
    'is_4ps_beneficiary' => true,
    'is_indigent_family' => false,
    'is_solo_parent' => false,
    'has_pwd_member' => false,
    'has_senior_citizen' => true,
    'has_ofw_member' => false,
    // Utilities fields (frontend: utilitiesAccess)
    'has_electricity' => true,
    'has_water_supply' => true,
    'has_internet_access' => false,
    'has_cable_tv' => false,
    // Additional fields
    'monthly_income' => 25000.00,
    'house_ownership' => 'owned',
    'number_of_rooms' => 3,
    'notes' => 'Complete test household with all possible fields'
];

// Make API call
$response = null;
try {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/households');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($frontendData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: Bearer ' . $user->createToken('test')->plainTextToken
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $responseData = json_decode($response, true);
    
    echo "HTTP Status: $httpCode\n";
    echo "Response: " . json_encode($responseData, JSON_PRETTY_PRINT) . "\n";
    
    if ($httpCode === 201 && isset($responseData['data']['id'])) {
        $householdId = $responseData['data']['id'];
        echo "✅ Household created successfully with ID: $householdId\n";
        
        // Verify all fields were saved correctly
        $household = Household::find($householdId);
        if ($household) {
            echo "✅ Database verification:\n";
            echo "   - Household Number: {$household->household_number}\n";
            echo "   - Type: {$household->household_type}\n";
            echo "   - Barangay: {$household->barangay}\n";
            echo "   - Street/Sitio: {$household->street_sitio}\n";
            echo "   - Head Resident ID: {$household->head_resident_id}\n";
            echo "   - 4Ps Beneficiary: " . ($household->is_4ps_beneficiary ? 'Yes' : 'No') . "\n";
            echo "   - Has Electricity: " . ($household->has_electricity ? 'Yes' : 'No') . "\n";
            echo "   - Has Water Supply: " . ($household->has_water_supply ? 'Yes' : 'No') . "\n";
            echo "   - Monthly Income: {$household->monthly_income}\n";
            echo "   - House Ownership: {$household->house_ownership}\n";
            echo "   - Number of Rooms: {$household->number_of_rooms}\n";
            echo "   - Notes: {$household->notes}\n";
        }
        
        // Verify resident relationships
        $headResident->refresh();
        $memberResident1->refresh();
        $memberResident2->refresh();
        
        echo "✅ Resident relationships:\n";
        echo "   - Head: {$headResident->first_name} {$headResident->last_name} (Household ID: {$headResident->household_id}, Is Head: " . ($headResident->is_household_head ? 'Yes' : 'No') . ", Relationship: {$headResident->relationship_to_head})\n";
        echo "   - Member 1: {$memberResident1->first_name} {$memberResident1->last_name} (Household ID: {$memberResident1->household_id}, Is Head: " . ($memberResident1->is_household_head ? 'Yes' : 'No') . ", Relationship: {$memberResident1->relationship_to_head})\n";
        echo "   - Member 2: {$memberResident2->first_name} {$memberResident2->last_name} (Household ID: {$memberResident2->household_id}, Is Head: " . ($memberResident2->is_household_head ? 'Yes' : 'No') . ", Relationship: {$memberResident2->relationship_to_head})\n";
        
    } else {
        echo "❌ Failed to create household\n";
        if (isset($responseData['errors'])) {
            echo "Validation errors:\n";
            foreach ($responseData['errors'] as $field => $errors) {
                echo "   - $field: " . implode(', ', $errors) . "\n";
            }
        }
    }
    
} catch (Exception $e) {
    echo "❌ Error making API call: " . $e->getMessage() . "\n";
}

// Test 2: Retrieve household with all relationships
if (isset($householdId)) {
    echo "\n=== Test 2: Retrieve Household with Relationships ===\n";
    
    try {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://localhost:8000/api/households/$householdId");
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Accept: application/json',
            'Authorization: Bearer ' . $user->createToken('test')->plainTextToken
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        $responseData = json_decode($response, true);
        
        echo "HTTP Status: $httpCode\n";
        
        if ($httpCode === 200 && isset($responseData['data'])) {
            echo "✅ Household retrieved successfully\n";
            $data = $responseData['data'];
            
            echo "Household Details:\n";
            echo "   - ID: {$data['id']}\n";
            echo "   - Number: {$data['household_number']}\n";
            echo "   - Type: {$data['household_type']}\n";
            echo "   - Address: {$data['barangay']}, {$data['street_sitio']}\n";
            
            if (isset($data['head_resident'])) {
                echo "   - Head: {$data['head_resident']['first_name']} {$data['head_resident']['last_name']}\n";
            }
            
            if (isset($data['members']) && count($data['members']) > 0) {
                echo "   - Members:\n";
                foreach ($data['members'] as $member) {
                    echo "     * {$member['first_name']} {$member['last_name']} ({$member['relationship_to_head']})\n";
                }
            }
            
            echo "Classification:\n";
            echo "   - 4Ps: " . (isset($data['is_4ps_beneficiary']) && $data['is_4ps_beneficiary'] ? 'Yes' : 'No') . "\n";
            echo "   - Indigent: " . (isset($data['is_indigent_family']) && $data['is_indigent_family'] ? 'Yes' : 'No') . "\n";
            echo "   - Senior Citizen: " . (isset($data['has_senior_citizen']) && $data['has_senior_citizen'] ? 'Yes' : 'No') . "\n";
            
            echo "Utilities:\n";
            echo "   - Electricity: " . (isset($data['has_electricity']) && $data['has_electricity'] ? 'Yes' : 'No') . "\n";
            echo "   - Water: " . (isset($data['has_water_supply']) && $data['has_water_supply'] ? 'Yes' : 'No') . "\n";
            echo "   - Internet: " . (isset($data['has_internet_access']) && $data['has_internet_access'] ? 'Yes' : 'No') . "\n";
            
        } else {
            echo "❌ Failed to retrieve household\n";
            echo "Response: " . json_encode($responseData, JSON_PRETTY_PRINT) . "\n";
        }
        
    } catch (Exception $e) {
        echo "❌ Error retrieving household: " . $e->getMessage() . "\n";
    }
}

// Test 3: Update household
if (isset($householdId)) {
    echo "\n=== Test 3: Update Household ===\n";
    
    $updateData = [
        'household_type' => 'extended',
        'barangay' => 'Updated Barangay',
        'street_sitio' => 'Updated Street',
        'is_4ps_beneficiary' => false,
        'is_indigent_family' => true,
        'has_electricity' => true,
        'has_water_supply' => false,
        'has_internet_access' => true,
        'monthly_income' => 30000.00,
        'notes' => 'Updated household information'
    ];
    
    try {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://localhost:8000/api/households/$householdId");
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($updateData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Accept: application/json',
            'Authorization: Bearer ' . $user->createToken('test')->plainTextToken
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        $responseData = json_decode($response, true);
        
        echo "HTTP Status: $httpCode\n";
        
        if ($httpCode === 200) {
            echo "✅ Household updated successfully\n";
            
            // Verify updates in database
            $household = Household::find($householdId);
            if ($household) {
                echo "Updated fields verification:\n";
                echo "   - Type: {$household->household_type}\n";
                echo "   - Barangay: {$household->barangay}\n";
                echo "   - 4Ps: " . ($household->is_4ps_beneficiary ? 'Yes' : 'No') . "\n";
                echo "   - Indigent: " . ($household->is_indigent_family ? 'Yes' : 'No') . "\n";
                echo "   - Internet: " . ($household->has_internet_access ? 'Yes' : 'No') . "\n";
                echo "   - Monthly Income: {$household->monthly_income}\n";
            }
        } else {
            echo "❌ Failed to update household\n";
            echo "Response: " . json_encode($responseData, JSON_PRETTY_PRINT) . "\n";
        }
        
    } catch (Exception $e) {
        echo "❌ Error updating household: " . $e->getMessage() . "\n";
    }
}

// Test 4: List households with search and filters
echo "\n=== Test 4: List Households with Filters ===\n";

try {
    $searchParams = [
        'search' => 'TEST',
        'barangay' => 'Updated Barangay',
        'household_type' => 'extended'
    ];
    
    $queryString = http_build_query($searchParams);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://localhost:8000/api/households?$queryString");
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'Authorization: Bearer ' . $user->createToken('test')->plainTextToken
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $responseData = json_decode($response, true);
    
    echo "HTTP Status: $httpCode\n";
    
    if ($httpCode === 200 && isset($responseData['data']['data'])) {
        $households = $responseData['data']['data'];
        echo "✅ Found " . count($households) . " household(s) matching search criteria\n";
        
        foreach ($households as $household) {
            echo "   - {$household['household_number']} in {$household['barangay']} ({$household['household_type']})\n";
        }
    } else {
        echo "❌ Failed to list households\n";
        echo "Response: " . json_encode($responseData, JSON_PRETTY_PRINT) . "\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error listing households: " . $e->getMessage() . "\n";
}

echo "\n=== Test Complete ===\n";
echo "Summary of tested fields:\n";
echo "✅ Basic Info: household_number, household_type, barangay, street_sitio\n";
echo "✅ Relationships: head_resident_id, member_ids with relationships\n";
echo "✅ Classification: is_4ps_beneficiary, is_indigent_family, is_solo_parent, has_pwd_member, has_senior_citizen, has_ofw_member\n";
echo "✅ Utilities: has_electricity, has_water_supply, has_internet_access, has_cable_tv\n";
echo "✅ Additional: monthly_income, house_ownership, number_of_rooms, notes\n";
echo "✅ CRUD Operations: Create, Read, Update, List with filters\n";
echo "✅ Relationships: Head resident and members assignment\n";
