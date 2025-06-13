<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Super Admin
        $superAdmin = User::create([
            'username' => 'admin',
            'email' => 'admin@lgu.gov.ph',
            'password' => Hash::make('password123'),
            'first_name' => 'System',
            'last_name' => 'Administrator',
            'is_active' => true,
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);
        $superAdmin->assignRole('super-admin');

        // Create Barangay Captain
        $captain = User::create([
            'username' => 'captain',
            'email' => 'captain@lgu.gov.ph',
            'password' => Hash::make('password123'),
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
            'middle_name' => 'Santos',
            'is_active' => true,
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);
        $captain->assignRole('barangay-captain');

        // Create Barangay Secretary
        $secretary = User::create([
            'username' => 'secretary',
            'email' => 'secretary@lgu.gov.ph',
            'password' => Hash::make('password123'),
            'first_name' => 'Maria',
            'last_name' => 'Santos',
            'middle_name' => 'Cruz',
            'is_active' => true,
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);
        $secretary->assignRole('barangay-secretary');

        // Create Barangay Clerk
        $clerk = User::create([
            'username' => 'clerk',
            'email' => 'clerk@lgu.gov.ph',
            'password' => Hash::make('password123'),
            'first_name' => 'Pedro',
            'last_name' => 'Garcia',
            'middle_name' => 'Reyes',
            'is_active' => true,
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);
        $clerk->assignRole('barangay-clerk');

        // Create Test User
        $user = User::create([
            'username' => 'testuser',
            'email' => 'user@lgu.gov.ph',
            'password' => Hash::make('password123'),
            'first_name' => 'Test',
            'last_name' => 'User',
            'is_active' => true,
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);
        $user->assignRole('user');
    }
}
