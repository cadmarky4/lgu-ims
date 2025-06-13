<?php
require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Schema;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== HOUSEHOLDS TABLE CLEANUP VERIFICATION ===\n";

// Get current columns
$columns = Schema::getColumnListing('households');
sort($columns);

echo "Database now has " . count($columns) . " columns:\n";
foreach ($columns as $column) {
    echo "  - $column\n";
}

// Check against the model's fillable fields
$expectedFields = [
    'id', 'created_at', 'updated_at', // Laravel defaults
    'household_number',
    'head_resident_id',
    'house_number',
    'street',
    'barangay',
    'complete_address',
    'household_type',
    'monthly_income_bracket',
    'source_of_income',
    'four_ps_beneficiary',
    'indigent_family',
    'has_senior_citizen',
    'has_pwd_member',
    'has_electricity',
    'has_water_supply',
    'has_internet',
    'remarks',
    'status',
    'created_by',
    'updated_by'
];

echo "\nEXPECTED FIELDS (" . count($expectedFields) . "):\n";
foreach ($expectedFields as $field) {
    echo "  - $field\n";
}

echo "\nFIELD VERIFICATION:\n";
$extraFields = array_diff($columns, $expectedFields);
$missingFields = array_diff($expectedFields, $columns);

if (empty($extraFields) && empty($missingFields)) {
    echo "✓ Perfect match! Database has exactly the fields you need.\n";
} else {
    if (!empty($extraFields)) {
        echo "⚠ Extra fields still present:\n";
        foreach ($extraFields as $field) {
            echo "  - $field\n";
        }
    }
    
    if (!empty($missingFields)) {
        echo "⚠ Missing fields:\n";
        foreach ($missingFields as $field) {
            echo "  - $field\n";
        }
    }
}

echo "\n=== CLEANUP VERIFICATION COMPLETE ===\n";
?>
