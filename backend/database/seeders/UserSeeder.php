// ============================================================================
// Seeder for Default Users
// ============================================================================

// Create UserSeeder
// php artisan make:seeder UserSeeder

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Super Admin
        User::create([
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'email' => 'superadmin@barangay.local',
            'username' => 'superadmin',
            'phone' => '09123456789',
            'password' => Hash::make('password123'),
            'role' => 'SUPER_ADMIN',
            'department' => 'ADMINISTRATION',
            'position' => 'System Administrator',
            'employee_id' => 'EMP001',
            'is_active' => true,
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);

        // Create Barangay Captain
        User::create([
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
            'middle_name' => 'Santos',
            'email' => 'captain@barangay.local',
            'username' => 'captain',
            'phone' => '09123456788',
            'password' => Hash::make('password123'),
            'role' => 'BARANGAY_CAPTAIN',
            'department' => 'ADMINISTRATION',
            'position' => 'Barangay Captain',
            'employee_id' => 'CAP001',
            'is_active' => true,
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);

        // Create Barangay Secretary
        User::create([
            'first_name' => 'Maria',
            'last_name' => 'Garcia',
            'middle_name' => 'Lopez',
            'email' => 'secretary@barangay.local',
            'username' => 'secretary',
            'phone' => '09123456787',
            'password' => Hash::make('password123'),
            'role' => 'BARANGAY_SECRETARY',
            'department' => 'ADMINISTRATION',
            'position' => 'Barangay Secretary',
            'employee_id' => 'SEC001',
            'is_active' => true,
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);

        // Create additional test users for different roles
        $roles = [
            'BARANGAY_TREASURER' => 'FINANCE_TREASURY',
            'BARANGAY_COUNCILOR' => 'ADMINISTRATION',
            'HEALTH_WORKER' => 'HEALTH_SERVICES',
            'SOCIAL_WORKER' => 'SOCIAL_SERVICES',
            'DATA_ENCODER' => 'RECORDS_MANAGEMENT',
        ];

        $counter = 4;
        foreach ($roles as $role => $department) {
            User::create([
                'first_name' => 'Test',
                'last_name' => str_replace('_', ' ', $role),
                'email' => strtolower(str_replace('_', '', $role)) . '@barangay.local',
                'username' => strtolower(str_replace('_', '', $role)),
                'phone' => '0912345678' . $counter,
                'password' => Hash::make('password123'),
                'role' => $role,
                'department' => $department,
                'employee_id' => 'EMP' . str_pad($counter, 3, '0', STR_PAD_LEFT),
                'is_active' => true,
                'is_verified' => true,
                'email_verified_at' => now(),
            ]);
            $counter++;
        }
    }
}