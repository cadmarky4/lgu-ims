<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Household;
use App\Models\Resident;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class HouseholdController extends Controller
{
    /**
     * Display a listing of households.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Household::with(['householdHead']);

        // Apply filters
        if ($request->has('purok')) {
            $query->where('purok', $request->purok);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('income_bracket')) {
            $query->where('monthly_income_bracket', $request->income_bracket);
        }

        if ($request->has('has_pwd')) {
            $query->where('pwd_members_count', '>', 0);
        }

        if ($request->has('has_senior')) {
            $query->where('senior_citizen_count', '>', 0);
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $households = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $households,
            'message' => 'Households retrieved successfully'
        ]);
    }

    /**
     * Store a newly created household.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                // Basic info
                'household_head_id' => 'required|exists:residents,id',
                'household_type' => 'required|in:OWNED,RENTED,SHARED,INFORMAL_SETTLER',
                'house_number' => 'nullable|string|max:20',
                'street' => 'nullable|string|max:100',
                'barangay' => 'nullable|string|max:100',
                'complete_address' => 'nullable|string',
                
                // Economic information
                'monthly_income_bracket' => 'required|in:BELOW_5000,5000_10000,10001_15000,15001_20000,20001_30000,30001_50000,ABOVE_50000',
                'source_of_income' => 'nullable|string',
                'four_ps_beneficiary' => 'boolean',
                'indigent_family' => 'boolean',
                'has_senior_citizen' => 'boolean',
                'has_pwd_member' => 'boolean',
                
                // Utilities and facilities
                'has_electricity' => 'boolean',
                'has_water_supply' => 'boolean',
                'has_internet' => 'boolean',
                
                // Other
                'remarks' => 'nullable|string'
            ]);

            // Set default values and generate household number
            $validated['household_number'] = 'HH-' . date('Y') . '-' . str_pad(Household::count() + 1, 6, '0', STR_PAD_LEFT);
            $validated['head_resident_id'] = $validated['household_head_id'];
            $validated['created_by'] = Auth::id();
            
            // Remove the alias field
            unset($validated['household_head_id']);
            
            // Use complete address if provided, otherwise use basic address
            if (empty($validated['complete_address'])) {
                $validated['complete_address'] = $validated['address'] ?? '';
            }
            
            $household = Household::create($validated);
            $household->load(['headResident', 'members']);

            return response()->json([
                'success' => true,
                'data' => $household,
                'message' => 'Household created successfully'
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create household: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified household.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $household = Household::with(['householdHead', 'members', 'createdBy'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $household,
                'message' => 'Household retrieved successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Household not found'
            ], 404);
        }
    }

    /**
     * Update the specified household.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $household = Household::findOrFail($id);

            $validated = $request->validate([
                // Basic info
                'household_head_id' => 'sometimes|required|exists:residents,id',
                'household_type' => 'sometimes|required|in:OWNED,RENTED,SHARED,INFORMAL_SETTLER',
                'house_number' => 'nullable|string|max:20',
                'street' => 'nullable|string|max:100',
                'barangay' => 'nullable|string|max:100',
                'complete_address' => 'nullable|string',
                
                // Economic information
                'monthly_income_bracket' => 'sometimes|required|in:BELOW_5000,5000_10000,10001_15000,15001_20000,20001_30000,30001_50000,ABOVE_50000',
                'source_of_income' => 'nullable|string',
                'four_ps_beneficiary' => 'boolean',
                'indigent_family' => 'boolean',
                'has_senior_citizen' => 'boolean',
                'has_pwd_member' => 'boolean',
                
                // Utilities and facilities
                'has_electricity' => 'boolean',
                'has_water_supply' => 'boolean',
                'has_internet' => 'boolean',
                
                // Other
                'remarks' => 'nullable|string'
            ]);

            // Update head_resident_id if household_head_id is provided
            if (isset($validated['household_head_id'])) {
                $validated['head_resident_id'] = $validated['household_head_id'];
                unset($validated['household_head_id']); // Remove the alias field
            }

            $validated['updated_by'] = Auth::id();
            
            $household->update($validated);
            $household->load(['headResident', 'members']);

            return response()->json([
                'success' => true,
                'data' => $household,
                'message' => 'Household updated successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Household not found'
            ], 404);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update household: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified household.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $household = Household::findOrFail($id);
            $household->delete();

            return response()->json([
                'success' => true,
                'message' => 'Household deleted successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Household not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete household: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get household statistics.
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_households' => Household::count(),
                'active_households' => Household::where('status', 'ACTIVE')->count(),
                'by_purok' => Household::selectRaw('purok, COUNT(*) as count')
                    ->groupBy('purok')
                    ->orderBy('purok')
                    ->get(),
                'by_housing_type' => Household::selectRaw('house_type, COUNT(*) as count')
                    ->groupBy('house_type')
                    ->get(),
                'by_income_bracket' => Household::selectRaw('income_classification, COUNT(*) as count')
                    ->whereNotNull('income_classification')
                    ->groupBy('income_classification')
                    ->get(),
                'with_pwd_members' => Household::where('pwd_members_count', '>', 0)->count(),
                'with_senior_citizens' => Household::where('senior_citizen_count', '>', 0)->count(),
                'average_household_size' => Household::avg('total_members'),
                'utilities' => [
                    'with_electricity' => Household::where('has_electricity', true)->count(),
                    'with_water_supply' => Household::where('has_water_supply', true)->count(),
                    'with_toilet' => Household::where('has_toilet', true)->count(),
                    'with_internet' => Household::where('has_internet', true)->count(),
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Household statistics retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search households.
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'query' => 'required|string|min:2',
            'per_page' => 'sometimes|integer|min:1|max:100'
        ]);

        $query = $request->get('query');
        $perPage = $request->get('per_page', 15);

        $households = Household::with(['householdHead'])
            ->where(function ($q) use ($query) {
                $q->where('address', 'LIKE', "%{$query}%")
                  ->orWhere('purok', 'LIKE', "%{$query}%")
                  ->orWhereHas('householdHead', function ($subQuery) use ($query) {
                      $subQuery->where('first_name', 'LIKE', "%{$query}%")
                               ->orWhere('last_name', 'LIKE', "%{$query}%");
                  });
            })
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $households,
            'message' => 'Household search completed successfully'
        ]);
    }

    /**
     * Get households by purok.
     */
    public function byPurok(string $purok): JsonResponse
    {
        $households = Household::with(['householdHead'])
            ->where('purok', $purok)
            ->orderBy('address')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $households,
            'message' => "Households in Purok {$purok} retrieved successfully"
        ]);
    }

    /**
     * Update household member counts.
     */
    public function updateMemberCounts(Request $request, string $id): JsonResponse
    {
        try {
            $household = Household::findOrFail($id);
            
            $validated = $request->validate([
                'total_members' => 'required|integer|min:1',
                'male_count' => 'required|integer|min:0',
                'female_count' => 'required|integer|min:0',
                'children_count' => 'required|integer|min:0',
                'pwd_members_count' => 'required|integer|min:0',
                'senior_citizen_count' => 'required|integer|min:0',
                'employed_count' => 'required|integer|min:0',
                'student_count' => 'required|integer|min:0'
            ]);

            $household->update($validated);

            return response()->json([
                'success' => true,
                'data' => $household,
                'message' => 'Household member counts updated successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Household not found'
            ], 404);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update member counts: ' . $e->getMessage()
            ], 500);
        }
    }
}
