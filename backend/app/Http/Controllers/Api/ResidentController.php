<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use App\Models\Household;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ResidentController extends Controller
{
    /**
     * Display a listing of residents with pagination and filtering
     */
    public function index(Request $request): JsonResponse
    {
        $query = Resident::with(['household']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('middle_name', 'like', "%{$search}%")
                    ->orWhere('complete_address', 'like', "%{$search}%")
                    ->orWhere('mobile_number', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by gender
        if ($request->has('gender')) {
            $query->where('gender', $request->gender);
        }

        // Filter by purok
        if ($request->has('purok')) {
            $query->where('purok', $request->purok);
        }

        // Filter by civil status
        if ($request->has('civil_status')) {
            $query->where('civil_status', $request->civil_status);
        }

        // Filter by special classifications
        if ($request->has('senior_citizen') && $request->senior_citizen !== null) {
            $query->where('senior_citizen', $request->boolean('senior_citizen'));
        }

        if ($request->has('person_with_disability') && $request->person_with_disability !== null) {
            $query->where('person_with_disability', $request->boolean('person_with_disability'));
        }

        if ($request->has('four_ps_beneficiary') && $request->four_ps_beneficiary !== null) {
            $query->where('four_ps_beneficiary', $request->boolean('four_ps_beneficiary'));
        }

        if ($request->has('is_household_head') && $request->is_household_head !== null) {
            $query->where('is_household_head', $request->boolean('is_household_head'));
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $residents = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $residents,
            'message' => 'Residents retrieved successfully'
        ]);
    }

    /**
     * Store a newly created resident
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'suffix' => 'nullable|string|max:10',
            'birth_date' => 'required|date|before:today',
            'birth_place' => 'required|string|max:255',
            'gender' => 'required|in:MALE,FEMALE',
            'civil_status' => 'required|in:SINGLE,MARRIED,WIDOWED,DIVORCED,SEPARATED',
            'nationality' => 'required|string|max:100',
            'religion' => 'nullable|string|max:100',
            'mobile_number' => 'nullable|string|max:20',
            'telephone_number' => 'nullable|string|max:20',
            'email_address' => 'nullable|email|max:255',
            'complete_address' => 'required|string',
            'purok' => 'nullable|string|max:100',
            'household_id' => 'nullable|exists:households,id',
            'is_household_head' => 'boolean',
            'relationship_to_head' => 'nullable|string|max:100',
            'occupation' => 'nullable|string|max:255',
            'employer' => 'nullable|string|max:255',
            'monthly_income' => 'nullable|numeric|min:0',
            'employment_status' => 'nullable|in:EMPLOYED,UNEMPLOYED,SELF_EMPLOYED,RETIRED,STUDENT,OFW',
            'educational_attainment' => 'nullable|string',
            'senior_citizen' => 'boolean',
            'person_with_disability' => 'boolean',
            'disability_type' => 'nullable|string|max:255',
            'indigenous_people' => 'boolean',
            'indigenous_group' => 'nullable|string|max:255',
            'four_ps_beneficiary' => 'boolean',
            'four_ps_household_id' => 'nullable|string|max:50',
            'voter_status' => 'required|in:REGISTERED,NOT_REGISTERED,DECEASED,TRANSFERRED',
            'precinct_number' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $resident = Resident::create([
                ...$validator->validated(),
                'created_by' => Auth::id(),
                'status' => 'ACTIVE'
            ]);

            // Update household member counts if household is specified
            if ($resident->household_id) {
                $resident->household->updateMemberCounts();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $resident->load(['household']),
                'message' => 'Resident created successfully'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create resident',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resident
     */
    public function show(string $id): JsonResponse
    {
        $resident = Resident::with([
            'household',
            'documents',
            'complaints',
            'suggestions',
            'appointments'
        ])->find($id);

        if (!$resident) {
            return response()->json([
                'success' => false,
                'message' => 'Resident not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $resident,
            'message' => 'Resident retrieved successfully'
        ]);
    }

    /**
     * Update the specified resident
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $resident = Resident::find($id);

        if (!$resident) {
            return response()->json([
                'success' => false,
                'message' => 'Resident not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'suffix' => 'nullable|string|max:10',
            'birth_date' => 'sometimes|required|date|before:today',
            'birth_place' => 'sometimes|required|string|max:255',
            'gender' => 'sometimes|required|in:MALE,FEMALE',
            'civil_status' => 'sometimes|required|in:SINGLE,MARRIED,WIDOWED,DIVORCED,SEPARATED',
            'nationality' => 'sometimes|required|string|max:100',
            'religion' => 'nullable|string|max:100',
            'mobile_number' => 'nullable|string|max:20',
            'telephone_number' => 'nullable|string|max:20',
            'email_address' => 'nullable|email|max:255',
            'complete_address' => 'sometimes|required|string',
            'purok' => 'nullable|string|max:100',
            'household_id' => 'nullable|exists:households,id',
            'is_household_head' => 'boolean',
            'relationship_to_head' => 'nullable|string|max:100',
            'occupation' => 'nullable|string|max:255',
            'employer' => 'nullable|string|max:255',
            'monthly_income' => 'nullable|numeric|min:0',
            'employment_status' => 'nullable|in:EMPLOYED,UNEMPLOYED,SELF_EMPLOYED,RETIRED,STUDENT,OFW',
            'educational_attainment' => 'nullable|string',
            'senior_citizen' => 'boolean',
            'person_with_disability' => 'boolean',
            'disability_type' => 'nullable|string|max:255',
            'indigenous_people' => 'boolean',
            'indigenous_group' => 'nullable|string|max:255',
            'four_ps_beneficiary' => 'boolean',
            'four_ps_household_id' => 'nullable|string|max:50',
            'voter_status' => 'sometimes|required|in:REGISTERED,NOT_REGISTERED,DECEASED,TRANSFERRED',
            'precinct_number' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $oldHouseholdId = $resident->household_id;

            $resident->update([
                ...$validator->validated(),
                'updated_by' => Auth::id()
            ]);

            // Update member counts for old and new households
            if ($oldHouseholdId && $oldHouseholdId !== $resident->household_id) {
                $oldHousehold = Household::find($oldHouseholdId);
                if ($oldHousehold) {
                    $oldHousehold->updateMemberCounts();
                }
            }

            if ($resident->household_id) {
                $resident->household->updateMemberCounts();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $resident->load(['household']),
                'message' => 'Resident updated successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update resident',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resident
     */
    public function destroy(string $id): JsonResponse
    {
        $resident = Resident::find($id);

        if (!$resident) {
            return response()->json([
                'success' => false,
                'message' => 'Resident not found'
            ], 404);
        }

        // Check if resident is a household head
        if ($resident->is_household_head && $resident->householdsAsHead()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete resident who is a household head'
            ], 422);
        }

        try {
            DB::beginTransaction();

            $householdId = $resident->household_id;
            $resident->delete();

            // Update household member counts
            if ($householdId) {
                $household = Household::find($householdId);
                if ($household) {
                    $household->updateMemberCounts();
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Resident deleted successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete resident',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get resident statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_residents' => Resident::count(),
                'male_residents' => Resident::where('gender', 'MALE')->count(),
                'female_residents' => Resident::where('gender', 'FEMALE')->count(),
                'senior_citizens' => Resident::where('birth_date', '<=', Carbon::now()->subYears(60))->count(),
                'registered_voters' => Resident::where('voter_status', 'REGISTERED')->count(),
                'by_civil_status' => Resident::selectRaw('civil_status, COUNT(*) as count')
                    ->groupBy('civil_status')
                    ->pluck('count', 'civil_status'),
                'by_purok' => Resident::selectRaw('purok, COUNT(*) as count')
                    ->whereNotNull('purok')
                    ->groupBy('purok')
                    ->pluck('count', 'purok'),
                'age_groups' => [
                    'children_0_12' => Resident::where('birth_date', '>', Carbon::now()->subYears(12))->count(),
                    'teens_13_17' => Resident::whereBetween('birth_date', [Carbon::now()->subYears(17), Carbon::now()->subYears(13)])->count(),
                    'adults_18_59' => Resident::whereBetween('birth_date', [Carbon::now()->subYears(59), Carbon::now()->subYears(18)])->count(),
                    'seniors_60_plus' => Resident::where('birth_date', '<=', Carbon::now()->subYears(60))->count(),
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Resident statistics retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search residents
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q', '');

        if (strlen($query) < 2) {
            return response()->json([
                'success' => true,
                'data' => [],
                'message' => 'Query too short'
            ]);
        }

        $residents = Resident::where('status', 'ACTIVE')
            ->where(function ($q) use ($query) {
                $q->where('first_name', 'like', "%{$query}%")
                    ->orWhere('last_name', 'like', "%{$query}%")
                    ->orWhere('middle_name', 'like', "%{$query}%")
                    ->orWhere('complete_address', 'like', "%{$query}%")
                    ->orWhere('mobile_number', 'like', "%{$query}%");
            })
            ->with('household')
            ->limit(20)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $residents,
            'message' => 'Search results retrieved successfully'
        ]);
    }

    /**
     * Get household heads
     */
    public function householdHeads(): JsonResponse
    {
        $householdHeads = Resident::where('status', 'ACTIVE')
            ->where('is_household_head', true)
            ->with('household')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $householdHeads,
            'message' => 'Household heads retrieved successfully'
        ]);
    }

    /**
     * Get residents by purok
     */
    public function byPurok(string $purok): JsonResponse
    {
        $residents = Resident::where('status', 'ACTIVE')
            ->where('purok', $purok)
            ->with('household')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $residents,
            'message' => "Residents in Purok {$purok} retrieved successfully"
        ]);
    }

    /**
     * Check for potential duplicate residents
     */
    public function checkDuplicates(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'birth_date' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $firstName = $request->input('first_name');
        $lastName = $request->input('last_name');
        $birthDate = $request->input('birth_date');

        $duplicates = Resident::where('first_name', 'LIKE', "%{$firstName}%")
            ->where('last_name', 'LIKE', "%{$lastName}%")
            ->whereDate('birth_date', $birthDate)
            ->where('status', 'ACTIVE')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $duplicates,
            'message' => 'Duplicate check completed'
        ]);
    }
}
