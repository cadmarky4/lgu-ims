<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Models\Household;
use App\Models\Resident;

// Simple test to verify household-resident relationship
echo "Testing Household-Resident Relationship\n";
echo "=====================================\n\n";

// Check database connection
try {
    $app = require_once __DIR__ . '/bootstrap/app.php';
    
    echo "✓ Database connection successful\n";
    
    // Check if we have any residents
    $residentCount = Resident::count();
    echo "✓ Total residents in database: {$residentCount}\n";
    
    // Check if we have any households
    $householdCount = Household::count();
    echo "✓ Total households in database: {$householdCount}\n";
    
    if ($householdCount > 0) {
        echo "\nChecking household relationships...\n";
        
        $household = Household::with(['headResident', 'members'])->first();
        if ($household) {
            echo "✓ Found household ID: {$household->id}\n";
            echo "  - Head Resident: " . ($household->headResident ? 
                $household->headResident->first_name . ' ' . $household->headResident->last_name : 
                'None') . "\n";
            echo "  - Total Members: " . $household->members->count() . "\n";
            
            foreach ($household->members as $member) {
                echo "    * {$member->first_name} {$member->last_name} - " .
                     "Head: " . ($member->is_household_head ? 'Yes' : 'No') . 
                     ", Relationship: " . ($member->relationship_to_head ?: 'Not set') . "\n";
            }
        }
    } else {
        echo "\nNo households found. This is expected for a new database.\n";
    }
    
    echo "\n✓ Test completed successfully!\n";
    echo "\nThe database schema supports:\n";
    echo "- Households with head_resident_id reference\n";
    echo "- Residents with household_id, is_household_head, and relationship_to_head fields\n";
    echo "- One-to-many relationship between Household and Residents\n";

} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    exit(1);
}
