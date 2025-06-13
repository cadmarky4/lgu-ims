<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Schema;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    echo "=== CHECKING ACTUAL HOUSEHOLDS TABLE COLUMNS ===\n";
    
    $columns = Schema::getColumnListing('households');
    echo "Found " . count($columns) . " columns:\n";
    
    foreach ($columns as $column) {
        echo "  - $column\n";
    }
    
    echo "\n=== CHECKING TABLE INDEXES ===\n";
    $indexes = DB::select("SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='households'");
    echo "Found " . count($indexes) . " indexes:\n";
    
    foreach ($indexes as $index) {
        echo "  - " . $index->name . "\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
