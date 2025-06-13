<?php

require_once 'vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule;

$capsule->addConnection([
    'driver'   => 'sqlite',
    'database' => 'database/database.sqlite',
    'prefix'   => '',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();

$columns = $capsule->getConnection()->getSchemaBuilder()->getColumnListing('residents');

echo "Columns in residents table:\n";
foreach ($columns as $column) {
    echo "- $column\n";
}
