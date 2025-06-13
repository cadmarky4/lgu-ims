<?php

require_once 'vendor/autoload.php';
require_once 'bootstrap/app.php';

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$user = User::where('email', 'admin@lgu.gov.ph')->first();

if ($user) {
    echo "User found: " . $user->email . "\n";
    echo "Is active: " . ($user->is_active ? 'YES' : 'NO') . "\n";
    echo "Password hash: " . $user->password . "\n";
    echo "Hash check (password): " . (Hash::check('password', $user->password) ? 'PASS' : 'FAIL') . "\n";
    echo "Hash check (admin123): " . (Hash::check('admin123', $user->password) ? 'PASS' : 'FAIL') . "\n";
} else {
    echo "User not found\n";
}
