<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

echo "User Statistics Test\n";
echo "===================\n";

echo "Total Users: " . User::count() . "\n";
echo "Active Users: " . User::where('is_active', true)->count() . "\n";
echo "Admin Users: " . User::whereIn('role', ['ADMIN', 'SUPER_ADMIN'])->count() . "\n";
echo "Recent Users (last 30 days): " . User::where('created_at', '>=', now()->subDays(30))->count() . "\n";

echo "\nFirst 5 Users:\n";
echo "--------------\n";
$users = User::take(5)->get(['id', 'first_name', 'last_name', 'email', 'role', 'is_active']);
foreach ($users as $user) {
    echo "ID: {$user->id}, Name: {$user->first_name} {$user->last_name}, Email: {$user->email}, Role: {$user->role}, Active: " . ($user->is_active ? 'Yes' : 'No') . "\n";
}

echo "\nTesting Statistics Endpoint...\n";
echo "-----------------------------\n";

// Simulate the statistics method from UserController
$totalUsers = User::count();
$activeUsers = User::where('is_active', true)->count();
$adminUsers = User::whereIn('role', ['ADMIN', 'SUPER_ADMIN'])->count();
$recentUsers = User::where('created_at', '>=', now()->subDays(30))->count();

$stats = [
    'total_users' => $totalUsers,
    'active_users' => $activeUsers,
    'admin_users' => $adminUsers,
    'recent_users' => $recentUsers
];

echo "Statistics Result: " . json_encode($stats, JSON_PRETTY_PRINT) . "\n";
