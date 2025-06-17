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
        User::create([
            'username' => 'admin',
            'email' => 'admin@lgu.gov.ph',
            'password' => Hash::make('password123'),
            'first_name' => 'System',
            'last_name' => 'Administrator',
            'role' => 'SUPER_ADMIN',
            'department' => 'IT Department',
            'position' => 'System Administrator',
            'employee_id' => 'EMP001',
            'phone' => '+63 9123456789',
            'is_active' => true,
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);

        // Create Barangay Captain
        User::create([
            'username' => 'captain',
            'email' => 'captain@lgu.gov.ph',
            'password' => Hash::make('password123'),
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
            'middle_name' => 'Santos',
            'role' => 'BARANGAY_CAPTAIN',
            'department' => 'Executive Office',
            'position' => 'Barangay Captain',
            'employee_id' => 'EMP002',
            'phone' => '+63 9123456790',
            'is_active' => true,
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);

        // Create Barangay Secretary
        User::create([
            'username' => 'secretary',
            'email' => 'secretary@lgu.gov.ph',
            'password' => Hash::make('password123'),
            'first_name' => 'Maria',
            'last_name' => 'Santos',
            'middle_name' => 'Cruz',
            'role' => 'BARANGAY_SECRETARY',
            'department' => 'Secretary Office',
            'position' => 'Barangay Secretary',
            'employee_id' => 'EMP003',
            'phone' => '+63 9123456791',
            'is_active' => true,
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);

        // Create Barangay Treasurer
        User::create([
            'username' => 'treasurer',
            'email' => 'treasurer@lgu.gov.ph',
            'password' => Hash::make('password123'),
            'first_name' => 'Pedro',
            'last_name' => 'Garcia',
            'middle_name' => 'Reyes',
            'role' => 'BARANGAY_TREASURER',
            'department' => 'Treasury Office',
            'position' => 'Barangay Treasurer',
            'employee_id' => 'EMP004',
            'phone' => '+63 9123456792',
            'is_active' => true,
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);

        // Create Kagawad
        User::create([
            'username' => 'kagawad1',
            'email' => 'kagawad1@lgu.gov.ph',
            'password' => Hash::make('password123'),
            'first_name' => 'Ana',
            'last_name' => 'Rodriguez',
            'middle_name' => 'Lopez',
            'role' => 'KAGAWAD',
            'department' => 'Council',
            'position' => 'Kagawad',
            'employee_id' => 'EMP005',
            'phone' => '+63 9123456793',
            'is_active' => true,
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);

        // Create Staff Member
        User::create([
            'username' => 'staff1',
            'email' => 'staff1@lgu.gov.ph',
            'password' => Hash::make('password123'),
            'first_name' => 'Jose',
            'last_name' => 'Mendoza',
            'middle_name' => 'Torres',
            'role' => 'STAFF',
            'department' => 'Records Office',
            'position' => 'Records Officer',
            'employee_id' => 'EMP006',
            'phone' => '+63 9123456794',
            'is_active' => true,
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);

        // Create Test User
        User::create([
            'username' => 'testuser',
            'email' => 'user@lgu.gov.ph',
            'password' => Hash::make('password123'),
            'first_name' => 'Test',
            'last_name' => 'User',
            'role' => 'USER',
            'department' => 'General Staff',
            'position' => 'General User',
            'employee_id' => 'EMP007',
            'phone' => '+63 9123456795',
            'is_active' => true,
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);

        echo "✅ Created " . User::count() . " users successfully!\n";
    }
}
