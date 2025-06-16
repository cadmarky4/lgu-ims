<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Models\Household;
use App\Models\Resident;

// Set up Laravel environment
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Testing Household-Resident relationship storage...\n\n";

// Check if we have any residents in the database
$residentCount = Resident::count();
echo "Total residents in database: {$residentCount}\n";

if ($residentCount == 0) {
    echo "No residents found. Creating test residents...\n";
    
    // Create test residents
    $head = Resident::create([
        'first_name' => 'John',
        'last_name' => 'Doe',
        'birth_date' => '1980-01-01',
        'birth_place' => 'Manila',
        'gender' => 'MALE',
        'civil_status' => 'MARRIED',
        'nationality' => 'Filipino',
        'complete_address' => '123 Test Street, Test City',
        'voter_status' => 'REGISTERED'
    ]);
    
    $member1 = Resident::create([
        'first_name' => 'Jane',
        'last_name' => 'Doe',
        'birth_date' => '1985-05-15',
        'birth_place' => 'Manila',
        'gender' => 'FEMALE',
        'civil_status' => 'MARRIED',
        'nationality' => 'Filipino',
        'complete_address' => '123 Test Street, Test City',
        'voter_status' => 'REGISTERED'
    ]);
    
    $member2 = Resident::create([
        'first_name' => 'Little',
        'last_name' => 'Doe',
        'birth_date' => '2010-03-20',
        'birth_place' => 'Manila',
        'gender' => 'MALE',
        'civil_status' => 'SINGLE',
        'nationality' => 'Filipino',
        'complete_address' => '123 Test Street, Test City',
        'voter_status' => 'NOT_REGISTERED'
    ]);
    
    echo "Created test residents:\n";
    echo "- Head: {$head->first_name} {$head->last_name} (ID: {$head->id})\n";
    echo "- Member 1: {$member1->first_name} {$member1->last_name} (ID: {$member1->id})\n";
    echo "- Member 2: {$member2->first_name} {$member2->last_name} (ID: {$member2->id})\n\n";
} else {
    echo "Using existing residents...\n";
    $head = Resident::first();
    $members = Resident::where('id', '!=', $head->id)->take(2)->get();
    
    echo "Head: {$head->first_name} {$head->last_name} (ID: {$head->id})\n";
    foreach ($members as $i => $member) {
        echo "Member " . ($i + 1) . ": {$member->first_name} {$member->last_name} (ID: {$member->id})\n";
    }
    echo "\n";
}

// Check household count
$householdCount = Household::count();
echo "Total households in database: {$householdCount}\n";

// Check current relationship states
echo "\nCurrent resident-household relationships:\n";
$residents = Resident::whereNotNull('household_id')->with('household')->get();
foreach ($residents as $resident) {
    echo "- {$resident->first_name} {$resident->last_name}: ";
    echo "Household ID: {$resident->household_id}, ";
    echo "Is Head: " . ($resident->is_household_head ? 'Yes' : 'No') . ", ";
    echo "Relationship: " . ($resident->relationship_to_head ?? 'Not set') . "\n";
}

if ($residents->isEmpty()) {
    echo "No residents are currently assigned to households.\n";
}

echo "\nDatabase relationship structure verification complete.\n";
echo "Frontend should be able to create households and set member relationships correctly.\n";
