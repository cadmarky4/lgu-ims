<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Schemas\UserSchema;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = User::query();

            // Apply filters
            if ($request->has('role')) {
                $query->where('role', $request->role);
            }

            if ($request->has('department')) {
                $query->where('department', $request->department);
            }

            if ($request->has('is_active')) {
                $query->where('is_active', $request->boolean('is_active'));
            }

            if ($request->has('is_verified')) {
                $query->where('is_verified', $request->boolean('is_verified'));
            }

            // Search functionality
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere('username', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('employee_id', 'like', "%{$search}%");
                });
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $users = $query->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'data' => $users,
                'message' => 'Users retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve users: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Get validation rules from schema
            $rules = UserSchema::getCreateValidationRules();
            
            // Add confirm password validation
            $rules['confirm_password'] = 'required|same:password';
            
            $validatedData = $request->validate($rules);
            
            // Remove confirm_password from data to be saved
            unset($validatedData['confirm_password']);
            
            // Hash the password
            $validatedData['password'] = Hash::make($validatedData['password']);
            
            // Set created_by if authenticated
            if (Auth::check()) {
                $validatedData['created_by'] = Auth::id();
            }

            $user = User::create($validatedData);

            return response()->json([
                'status' => 'success',
                'data' => $user->fresh(),
                'message' => 'User created successfully'
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified user.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            return response()->json([
                'status' => 'success',
                'data' => $user,
                'message' => 'User retrieved successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            // Get validation rules from schema for updates
            $rules = UserSchema::getUpdateValidationRules();
            
            // Handle unique validation for current user
            if (isset($rules['username'])) {
                $rules['username'] = str_replace('{id}', $id, $rules['username']);
            }
            if (isset($rules['email'])) {
                $rules['email'] = str_replace('{id}', $id, $rules['email']);
            }
            
            // Add password confirmation if password is being updated
            if ($request->has('password')) {
                $rules['confirm_password'] = 'required|same:password';
            }

            $validatedData = $request->validate($rules);
            
            // Remove confirm_password from data to be saved
            if (isset($validatedData['confirm_password'])) {
                unset($validatedData['confirm_password']);
            }
            
            // Hash password if provided
            if (isset($validatedData['password'])) {
                $validatedData['password'] = Hash::make($validatedData['password']);
            }

            // Set updated_by if authenticated
            if (Auth::check()) {
                $validatedData['updated_by'] = Auth::id();
            }

            $user->update($validatedData);

            return response()->json([
                'status' => 'success',
                'data' => $user->fresh(),
                'message' => 'User updated successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);
            
            // Prevent deletion of current user
            if (Auth::check() && Auth::id() == $id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cannot delete your own account'
                ], 403);
            }

            $user->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'User deleted successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user statistics.
     */
    public function statistics(): JsonResponse
    {
        try {
            $totalUsers = User::count();
            $activeUsers = User::where('is_active', true)->count();
            $verifiedUsers = User::where('is_verified', true)->count();
            $adminUsers = User::whereIn('role', ['SUPER_ADMIN', 'ADMIN'])->count();
            
            // Users by role
            $usersByRole = User::select('role')
                ->selectRaw('count(*) as count')
                ->groupBy('role')
                ->get()
                ->pluck('count', 'role');

            // Users by department
            $usersByDepartment = User::select('department')
                ->selectRaw('count(*) as count')
                ->groupBy('department')
                ->get()
                ->pluck('count', 'department');

            // Recent users (last 30 days)
            $recentUsers = User::where('created_at', '>=', now()->subDays(30))->count();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'total_users' => $totalUsers,
                    'active_users' => $activeUsers,
                    'verified_users' => $verifiedUsers,
                    'admin_users' => $adminUsers,
                    'recent_users' => $recentUsers,
                    'users_by_role' => $usersByRole,
                    'users_by_department' => $usersByDepartment,
                ],
                'message' => 'User statistics retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve statistics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle user active status.
     */
    public function toggleStatus(string $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);
            
            // Prevent deactivating current user
            if (Auth::check() && Auth::id() == $id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cannot deactivate your own account'
                ], 403);
            }

            $user->update(['is_active' => !$user->is_active]);

            return response()->json([
                'status' => 'success',
                'data' => $user->fresh(),
                'message' => 'User status updated successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update user status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reset user password.
     */
    public function resetPassword(Request $request, string $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            $request->validate([
                'password' => 'required|string|min:8|confirmed',
            ]);

            $user->update([
                'password' => Hash::make($request->password),
                'updated_by' => Auth::id()
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Password reset successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to reset password: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get users by role.
     */
    public function byRole(string $role): JsonResponse
    {
        try {
            $users = User::where('role', $role)->get();

            return response()->json([
                'status' => 'success',
                'data' => $users,
                'message' => "Users with role '{$role}' retrieved successfully"
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve users: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get users by department.
     */
    public function byDepartment(string $department): JsonResponse
    {
        try {
            $users = User::where('department', $department)->get();

            return response()->json([
                'status' => 'success',
                'data' => $users,
                'message' => "Users in department '{$department}' retrieved successfully"
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve users: ' . $e->getMessage()
            ], 500);
        }
    }
}
