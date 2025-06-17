<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use App\Models\Schemas\ResidentSchema;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class ResidentController extends Controller
{
    /**
     * Display a listing of residents
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Resident::query();

            // Apply filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('purok')) {
                $query->where('purok', $request->purok);
            }

            if ($request->has('barangay')) {
                $query->where('barangay', $request->barangay);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere('middle_name', 'like', "%{$search}%");
                });
            }

            // Special classifications filters
            if ($request->boolean('senior_citizen')) {
                $query->where('senior_citizen', true);
            }

            if ($request->boolean('person_with_disability')) {
                $query->where('person_with_disability', true);
            }

            if ($request->boolean('four_ps_beneficiary')) {
                $query->where('four_ps_beneficiary', true);
            }

            if ($request->boolean('is_household_head')) {
                $query->where('is_household_head', true);
            }

            // Include relationships
            $query->with([
                'household',
                'createdBy:id,first_name,last_name',
                'updatedBy:id,first_name,last_name'
            ]);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $residents = $query->orderBy('last_name')
                             ->orderBy('first_name')
                             ->paginate($perPage);

            return response()->json($residents);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve residents',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resident
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validate using schema rules - excluding household relationship fields
            $validatedData = $request->validate(ResidentSchema::getResidentCreateValidationRules());

            // Set created_by if user is authenticated
            if (auth('sanctum')->check()) {
                $validatedData['created_by'] = auth('sanctum')->id();
            }

            // Create the resident
            $resident = Resident::create($validatedData);

            // Load relationships for response
            $resident->load([
                'household',
                'createdBy:id,first_name,last_name'
            ]);

            return response()->json([
                'message' => 'Resident created successfully',
                'data' => $resident
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create resident',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resident
     */
    public function show(Resident $resident): JsonResponse
    {
        try {
            $resident->load([
                'household',
                'documents',
                'complaints',
                'suggestions',
                'appointments',
                'createdBy:id,first_name,last_name',
                'updatedBy:id,first_name,last_name'
            ]);

            return response()->json([
                'data' => $resident
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve resident',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resident
     */
    public function update(Request $request, Resident $resident): JsonResponse
    {
        try {
            // Validate using schema rules - excluding household relationship fields
            $validatedData = $request->validate(ResidentSchema::getResidentUpdateValidationRules());

            // Set updated_by if user is authenticated
            if (auth('sanctum')->check()) {
                $validatedData['updated_by'] = auth('sanctum')->id();
            }

            // Update the resident
            $resident->update($validatedData);

            // Load relationships for response
            $resident->load([
                'household',
                'updatedBy:id,first_name,last_name'
            ]);

            return response()->json([
                'message' => 'Resident updated successfully',
                'data' => $resident
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update resident',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resident
     */
    public function destroy(Resident $resident): JsonResponse
    {
        try {
            // Soft delete by changing status instead of actual deletion
            $resident->update(['status' => 'INACTIVE']);

            return response()->json([
                'message' => 'Resident deactivated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to deactivate resident',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check for duplicate residents
     */
    public function checkDuplicates(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'first_name' => 'required|string',
                'last_name' => 'required|string',
                'birth_date' => 'required|date'
            ]);

            $duplicates = Resident::where('first_name', 'like', '%' . $request->first_name . '%')
                                ->where('last_name', 'like', '%' . $request->last_name . '%')
                                ->where('birth_date', $request->birth_date)
                                ->where('status', '!=', 'INACTIVE')
                                ->get(['id', 'first_name', 'last_name', 'middle_name', 'birth_date', 'complete_address']);

            return response()->json($duplicates);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to check duplicates',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get residents statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            // Base query for active residents
            $activeResidents = Resident::where('status', 'ACTIVE');
            
            // Age group calculations - SQLite compatible
            $currentDate = now()->format('Y-m-d');
            $ageGroups = [
                'children' => (clone $activeResidents)->whereRaw("(julianday('{$currentDate}') - julianday(birth_date)) / 365.25 < 18")->count(),
                'youth' => (clone $activeResidents)->whereRaw("(julianday('{$currentDate}') - julianday(birth_date)) / 365.25 BETWEEN 18 AND 35")->count(),
                'adults' => (clone $activeResidents)->whereRaw("(julianday('{$currentDate}') - julianday(birth_date)) / 365.25 BETWEEN 36 AND 59")->count(),
                'seniors' => (clone $activeResidents)->whereRaw("(julianday('{$currentDate}') - julianday(birth_date)) / 365.25 >= 60")->count(),
            ];

            // Get employed residents count
            $employedResidents = (clone $activeResidents)->whereIn('employment_status', ['EMPLOYED', 'SELF_EMPLOYED', 'GOVERNMENT_EMPLOYEE', 'PRIVATE_EMPLOYEE'])->count();

            // Get purok distribution
            $residentsByPurok = (clone $activeResidents)
                ->selectRaw('purok, COUNT(*) as count')
                ->whereNotNull('purok')
                ->groupBy('purok')
                ->pluck('count', 'purok')
                ->toArray();

            // Get civil status distribution  
            $residentsByCivilStatus = (clone $activeResidents)
                ->selectRaw('civil_status, COUNT(*) as count')
                ->whereNotNull('civil_status')
                ->groupBy('civil_status')
                ->pluck('count', 'civil_status')
                ->toArray();

            // Calculate average household size
            $totalHouseholds = \App\Models\Household::where('status', 'ACTIVE')->count();
            $totalActiveResidents = (clone $activeResidents)->count();
            $averageHouseholdSize = $totalHouseholds > 0 ? round($totalActiveResidents / $totalHouseholds, 2) : 0;

            // Get counts for the main statistics
            $totalResidents = $totalActiveResidents;
            $maleResidents = (clone $activeResidents)->where('gender', 'MALE')->count();
            $femaleResidents = (clone $activeResidents)->where('gender', 'FEMALE')->count();
            $seniorCitizens = (clone $activeResidents)->where('senior_citizen', true)->count();
            $personsWithDisability = (clone $activeResidents)->where('person_with_disability', true)->count();
            $fourPsBeneficiaries = (clone $activeResidents)->where('four_ps_beneficiary', true)->count();
            $indigenousPeople = (clone $activeResidents)->where('indigenous_people', true)->count();
            $householdHeads = (clone $activeResidents)->where('is_household_head', true)->count();
            $registeredVoters = (clone $activeResidents)->where('voter_status', 'REGISTERED')->count();

            $stats = [
                // Basic counts - matching frontend expectations exactly
                'total_residents' => $totalResidents,
                'active_residents' => $totalResidents,
                'male_residents' => $maleResidents,
                'female_residents' => $femaleResidents,
                
                // Special categories - matching frontend field names
                'senior_citizens' => $seniorCitizens,
                'persons_with_disability' => $personsWithDisability,
                'pwd_count' => $personsWithDisability, // Alias for frontend compatibility
                'four_ps_beneficiaries' => $fourPsBeneficiaries,
                'indigenous_people' => $indigenousPeople,
                'household_heads' => $householdHeads,
                
                // Employment and voter status
                'registered_voters' => $registeredVoters,
                'employed_residents' => $employedResidents,
                
                // Age groups - matching frontend structure
                'residents_by_age_group' => $ageGroups,
                'children_count' => $ageGroups['children'], // Direct field for frontend
                
                // Geographic distribution
                'residents_by_purok' => $residentsByPurok,
                
                // Demographic breakdowns
                'residents_by_civil_status' => $residentsByCivilStatus,
                'by_gender' => [
                    'male' => $maleResidents,
                    'female' => $femaleResidents,
                ],
                'by_civil_status' => $residentsByCivilStatus, // Alias for backward compatibility
                'by_employment_status' => (clone $activeResidents)
                    ->whereNotNull('employment_status')
                    ->selectRaw('employment_status, COUNT(*) as count')
                    ->groupBy('employment_status')
                    ->pluck('count', 'employment_status')
                    ->toArray(),
                
                // Household statistics
                'average_household_size' => $averageHouseholdSize,
                'total_households' => $totalHouseholds,
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Restore a deactivated resident
     */
    public function restore(Resident $resident): JsonResponse
    {
        try {
            $resident->update(['status' => 'ACTIVE']);

            return response()->json([
                'message' => 'Resident restored successfully',
                'data' => $resident
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to restore resident',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get residents by purok
     */
    public function getByPurok(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'purok' => 'required|string'
            ]);

            $residents = Resident::where('status', 'ACTIVE')
                ->where('purok', $request->purok)
                ->with(['household'])
                ->orderBy('last_name')
                ->orderBy('first_name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $residents
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get residents by purok',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get senior citizens
     */
    public function getSeniorCitizens(Request $request): JsonResponse
    {
        try {
            $query = Resident::where('status', 'ACTIVE')
                ->where('senior_citizen', true);

            if ($request->has('purok')) {
                $query->where('purok', $request->purok);
            }

            $residents = $query->with(['household'])
                ->orderBy('last_name')
                ->orderBy('first_name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $residents,
                'count' => $residents->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get senior citizens',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get persons with disability (PWD)
     */
    public function getPWD(Request $request): JsonResponse
    {
        try {
            $query = Resident::where('status', 'ACTIVE')
                ->where('person_with_disability', true);

            if ($request->has('purok')) {
                $query->where('purok', $request->purok);
            }

            $residents = $query->with(['household'])
                ->orderBy('last_name')
                ->orderBy('first_name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $residents,
                'count' => $residents->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get PWD residents',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get 4Ps beneficiaries
     */
    public function getFourPs(Request $request): JsonResponse
    {
        try {
            $query = Resident::where('status', 'ACTIVE')
                ->where('four_ps_beneficiary', true);

            if ($request->has('purok')) {
                $query->where('purok', $request->purok);
            }

            $residents = $query->with(['household'])
                ->orderBy('last_name')
                ->orderBy('first_name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $residents,
                'count' => $residents->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get 4Ps beneficiaries',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get household heads
     */
    public function getHouseholdHeads(Request $request): JsonResponse
    {
        try {
            $query = Resident::where('status', 'ACTIVE')
                ->where('is_household_head', true);

            if ($request->has('purok')) {
                $query->where('purok', $request->purok);
            }

            $residents = $query->with(['household'])
                ->orderBy('last_name')
                ->orderBy('first_name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $residents,
                'count' => $residents->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get household heads',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get age group statistics with details
     */
    public function getAgeGroupStatistics(): JsonResponse
    {
        try {
            $currentDate = now()->format('Y-m-d');
            
            $ageGroups = [
                'children' => [
                    'count' => Resident::where('status', 'ACTIVE')
                        ->whereRaw("(julianday('{$currentDate}') - julianday(birth_date)) / 365.25 < 18")
                        ->count(),
                    'age_range' => '0-17 years',
                    'description' => 'Children and Minors'
                ],
                'youth' => [
                    'count' => Resident::where('status', 'ACTIVE')
                        ->whereRaw("(julianday('{$currentDate}') - julianday(birth_date)) / 365.25 BETWEEN 18 AND 35")
                        ->count(),
                    'age_range' => '18-35 years',
                    'description' => 'Youth and Young Adults'
                ],
                'adults' => [
                    'count' => Resident::where('status', 'ACTIVE')
                        ->whereRaw("(julianday('{$currentDate}') - julianday(birth_date)) / 365.25 BETWEEN 36 AND 59")
                        ->count(),
                    'age_range' => '36-59 years',
                    'description' => 'Working Age Adults'
                ],
                'seniors' => [
                    'count' => Resident::where('status', 'ACTIVE')
                        ->whereRaw("(julianday('{$currentDate}') - julianday(birth_date)) / 365.25 >= 60")
                        ->count(),
                    'age_range' => '60+ years',
                    'description' => 'Senior Citizens'
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $ageGroups
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get age group statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
