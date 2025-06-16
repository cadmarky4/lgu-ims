<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Household;
use App\Models\Schemas\HouseholdSchema;
use App\Models\Resident;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Household Management API Controller
 * 
 * This controller handles all household-related operations including:
 * - Creating households with head resident and members
 * - Updating household information and member relationships
 * - Retrieving household data with filtering and search
 * - Managing household statistics
 * 
 * Expected Frontend Data Structure (from AddNewHousehold.tsx):
 * {
 *   "household_number": "string|optional", // Auto-generated if not provided
 *   "household_type": "nuclear|extended|single|single-parent|other",
 *   "head_resident_id": "number|optional",
 *   "house_number": "string|required",
 *   "street_sitio": "string|required", 
 *   "barangay": "string|required",
 *   "complete_address": "string|required",
 *   "monthly_income": "below-10000|10000-25000|25000-50000|50000-100000|above-100000|optional",
 *   "primary_income_source": "string|optional",
 *   "four_ps_beneficiary": "boolean",
 *   "indigent_family": "boolean",
 *   "has_senior_citizen": "boolean", 
 *   "has_pwd_member": "boolean",
 *   "house_type": "concrete|semi-concrete|wood|bamboo|mixed|optional",
 *   "ownership_status": "owned|rented|shared|informal-settler|optional",
 *   "has_electricity": "boolean",
 *   "has_water_supply": "boolean",
 *   "has_internet_access": "boolean",
 *   "remarks": "string|optional",
 *   "member_ids": [
 *     {
 *       "resident_id": "number",
 *       "relationship": "string"
 *     }
 *   ]
 * }
 */
class HouseholdController extends Controller
{
    /**
     * Display a listing of households.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Household::with(['headResident', 'members']);

            // Apply search functionality similar to ResidentController
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('complete_address', 'LIKE', "%{$search}%")
                      ->orWhere('barangay', 'LIKE', "%{$search}%")
                      ->orWhere('household_number', 'LIKE', "%{$search}%")
                      ->orWhere('street_sitio', 'LIKE', "%{$search}%")
                      ->orWhereHas('headResident', function ($subQuery) use ($search) {
                          $subQuery->where('first_name', 'LIKE', "%{$search}%")
                                   ->orWhere('last_name', 'LIKE', "%{$search}%");
                      });
                });
            }

            // Apply filters based on the new schema
            if ($request->has('barangay')) {
                $query->where('barangay', $request->barangay);
            }

            if ($request->has('household_type')) {
                $query->where('household_type', $request->household_type);
            }

            if ($request->has('monthly_income')) {
                $query->where('monthly_income', $request->monthly_income);
            }

            if ($request->boolean('four_ps_beneficiary')) {
                $query->where('four_ps_beneficiary', true);
            }

            if ($request->boolean('indigent_family')) {
                $query->where('indigent_family', true);
            }

            if ($request->boolean('has_pwd_member')) {
                $query->where('has_pwd_member', true);
            }

            if ($request->boolean('has_senior_citizen')) {
                $query->where('has_senior_citizen', true);
            }

            if ($request->has('house_type')) {
                $query->where('house_type', $request->house_type);
            }

            if ($request->has('ownership_status')) {
                $query->where('ownership_status', $request->ownership_status);
            }

            // Apply sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination - match ResidentController format
            $perPage = $request->get('per_page', 15);
            $households = $query->paginate($perPage);

            // Return direct paginated data to match ResidentController
            return response()->json($households);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve households',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created household.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            Log::info("Household creation request received", ['request_data' => $request->all()]);
            
            // Use validation rules from schema
            $validated = $request->validate(HouseholdSchema::getCreateValidationRules());

            // Generate unique household number if not provided
            if (!isset($validated['household_number']) || empty($validated['household_number'])) {
                $validated['household_number'] = $this->generateHouseholdNumber();
            }

            // Ensure head_resident_id is properly handled
            if (isset($validated['head_resident_id'])) {
                $headResident = Resident::find($validated['head_resident_id']);
                if (!$headResident) {
                    return response()->json([
                        'message' => 'Validation failed',
                        'errors' => ['head_resident_id' => ['The selected head resident is invalid.']]
                    ], 422);
                }
                
                // Check if resident is already assigned to another household
                if ($headResident->household_id && $headResident->household_id !== null) {
                    return response()->json([
                        'message' => 'Validation failed',
                        'errors' => ['head_resident_id' => ['This resident is already assigned to another household.']]
                    ], 422);
                }
            }

            // Add created_by if user is authenticated (optional)
            if (auth('sanctum')->check()) {
                $validated['created_by'] = auth('sanctum')->id();
            }
            
            // Use database transaction to ensure data integrity
            $household = DB::transaction(function () use ($validated, $request) {
                $household = Household::create($validated);
                
                // If a head resident is specified, update their household relationship
                if (isset($validated['head_resident_id']) && $validated['head_resident_id']) {
                    $headResident = Resident::find($validated['head_resident_id']);
                    if ($headResident) {
                        $headResident->update([
                            'household_id' => $household->id,
                            'is_household_head' => true,
                            'relationship_to_head' => 'Self'
                        ]);
                    }
                }
                
                // If member IDs are provided, update their household relationships
                if ($request->has('member_ids') && is_array($request->member_ids)) {
                    Log::info("Processing member IDs", ['member_ids' => $request->member_ids]);
                    
                    foreach ($request->member_ids as $memberData) {
                        if (isset($memberData['resident_id']) && isset($memberData['relationship'])) {
                            $member = Resident::find($memberData['resident_id']);
                            if ($member && $member->id != $validated['head_resident_id']) {
                                // Check if member is already assigned to another household
                                if ($member->household_id && $member->household_id !== null) {
                                    Log::warning("Member {$member->id} is already assigned to household {$member->household_id}");
                                    continue; // Skip this member but don't fail the entire operation
                                }
                                
                                Log::info("Assigning member to household", [
                                    'member_id' => $member->id,
                                    'household_id' => $household->id,
                                    'relationship' => $memberData['relationship']
                                ]);
                                
                                $member->update([
                                    'household_id' => $household->id,
                                    'is_household_head' => false,
                                    'relationship_to_head' => $memberData['relationship']
                                ]);
                            } else {
                                Log::warning("Member not found or is head resident", [
                                    'member_id' => $memberData['resident_id'],
                                    'head_resident_id' => $validated['head_resident_id']
                                ]);
                            }
                        } else {
                            Log::warning("Invalid member data structure", ['member_data' => $memberData]);
                        }
                    }
                } else {
                    Log::info("No member IDs provided or member_ids is not an array", [
                        'has_member_ids' => $request->has('member_ids'),
                        'member_ids' => $request->get('member_ids')
                    ]);
                }
                
                return $household;
            });
            
            // Load relationships for response similar to ResidentController
            $household->load([
                'headResident',
                'members',
                'createdBy:id,first_name,last_name'
            ]);

            Log::info("Household created successfully", ['household_id' => $household->id, 'household_number' => $household->household_number]);

            return response()->json([
                'message' => 'Household created successfully',
                'data' => $household
            ], 201);

        } catch (ValidationException $e) {
            Log::warning("Household creation validation failed", ['errors' => $e->errors(), 'request_data' => $request->all()]);
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error("Household creation failed", ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'message' => 'Failed to create household',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified household.
     */
    public function show(Household $household): JsonResponse
    {
        try {
            $household->load(['headResident', 'members', 'createdBy:id,first_name,last_name', 'updatedBy:id,first_name,last_name']);

            return response()->json([
                'data' => $household
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve household',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified household.
     */
    public function update(Request $request, Household $household): JsonResponse
    {
        try {
            // Use validation rules from schema for updates
            $validated = $request->validate(HouseholdSchema::getUpdateValidationRules());

            // Validate head_resident_id if provided
            if (isset($validated['head_resident_id'])) {
                $headResident = Resident::find($validated['head_resident_id']);
                if (!$headResident) {
                    return response()->json([
                        'message' => 'Validation failed',
                        'errors' => ['head_resident_id' => ['The selected head resident is invalid.']]
                    ], 422);
                }
                
                // Check if resident is already assigned to another household (excluding current household)
                if ($headResident->household_id && $headResident->household_id !== $household->id && $headResident->household_id !== null) {
                    return response()->json([
                        'message' => 'Validation failed',
                        'errors' => ['head_resident_id' => ['This resident is already assigned to another household.']]
                    ], 422);
                }
            }

            // Add updated_by if user is authenticated (optional)
            if (auth('sanctum')->check()) {
                $validated['updated_by'] = auth('sanctum')->id();
            }
            
            // Use database transaction for data integrity
            $updatedHousehold = DB::transaction(function () use ($validated, $request, $household) {
                // Store old head resident id to clear previous relationships
                $oldHeadResidentId = $household->head_resident_id;
                
                $household->update($validated);
                
                // Update head resident relationship if changed
                if (isset($validated['head_resident_id']) && $validated['head_resident_id'] != $oldHeadResidentId) {
                    // Clear old head relationship
                    if ($oldHeadResidentId) {
                        $oldHead = Resident::find($oldHeadResidentId);
                        if ($oldHead) {
                            $oldHead->update([
                                'household_id' => null,
                                'is_household_head' => false,
                                'relationship_to_head' => null
                            ]);
                        }
                    }
                    
                    // Set new head relationship
                    if ($validated['head_resident_id']) {
                        $newHead = Resident::find($validated['head_resident_id']);
                        if ($newHead) {
                            $newHead->update([
                                'household_id' => $household->id,
                                'is_household_head' => true,
                                'relationship_to_head' => 'Self'
                            ]);
                        }
                    }
                }
                
                // Handle member updates if provided
                if ($request->has('member_ids') && is_array($request->member_ids)) {
                    // Clear existing member relationships (except head)
                    Resident::where('household_id', $household->id)
                        ->where('is_household_head', false)
                        ->update([
                            'household_id' => null,
                            'relationship_to_head' => null
                        ]);
                        
                    // Add new member relationships
                    foreach ($request->member_ids as $memberData) {
                        if (isset($memberData['resident_id']) && isset($memberData['relationship'])) {
                            $member = Resident::find($memberData['resident_id']);
                            if ($member && $member->id != $household->head_resident_id) {
                                // Check if member is already assigned to another household
                                if ($member->household_id && $member->household_id !== $household->id && $member->household_id !== null) {
                                    Log::warning("Member {$member->id} is already assigned to household {$member->household_id}");
                                    continue; // Skip this member but don't fail the entire operation
                                }
                                
                                $member->update([
                                    'household_id' => $household->id,
                                    'is_household_head' => false,
                                    'relationship_to_head' => $memberData['relationship']
                                ]);
                            }
                        }
                    }
                }
                
                return $household;
            });
            
            $updatedHousehold->load(['headResident', 'members', 'updatedBy:id,first_name,last_name']);

            Log::info("Household updated successfully", ['household_id' => $updatedHousehold->id, 'household_number' => $updatedHousehold->household_number]);

            return response()->json([
                'message' => 'Household updated successfully',
                'data' => $updatedHousehold
            ]);

        } catch (ValidationException $e) {
            Log::warning("Household update validation failed", ['household_id' => $household->id, 'errors' => $e->errors()]);
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error("Household update failed", ['household_id' => $household->id, 'error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Failed to update household',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified household.
     */
    public function destroy(Household $household): JsonResponse
    {
        try {
            $householdNumber = $household->household_number;
            $householdId = $household->id;
            
            // Use database transaction for data integrity
            DB::transaction(function () use ($household) {
                // Clear all resident relationships to this household
                Resident::where('household_id', $household->id)
                    ->update([
                        'household_id' => null,
                        'is_household_head' => false,
                        'relationship_to_head' => null
                    ]);
                    
                $household->delete();
            });

            Log::info("Household deleted successfully", ['household_id' => $householdId, 'household_number' => $householdNumber]);

            return response()->json([
                'message' => 'Household deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error("Household deletion failed", ['household_id' => $household->id, 'error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Failed to delete household',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get household statistics.
     */
    public function statistics(): JsonResponse
    {
        try {
            // Basic counts
            $totalHouseholds = Household::count();
            $fourPsBeneficiaries = Household::where('four_ps_beneficiary', true)->count();
            $indigentFamilies = Household::where('indigent_family', true)->count();
            $withSeniorCitizens = Household::where('has_senior_citizen', true)->count();
            $withPwdMembers = Household::where('has_pwd_member', true)->count();

            // Utility access
            $withElectricity = Household::where('has_electricity', true)->count();
            $withWaterSupply = Household::where('has_water_supply', true)->count();
            $withInternetAccess = Household::where('has_internet_access', true)->count();

            // Distribution by categories
            $householdsByBarangay = Household::selectRaw('barangay, COUNT(*) as count')
                ->whereNotNull('barangay')
                ->groupBy('barangay')
                ->pluck('count', 'barangay')
                ->toArray();

            $householdsByType = Household::selectRaw('household_type, COUNT(*) as count')
                ->whereNotNull('household_type')
                ->groupBy('household_type')
                ->pluck('count', 'household_type')
                ->toArray();

            $householdsByHouseType = Household::selectRaw('house_type, COUNT(*) as count')
                ->whereNotNull('house_type')
                ->groupBy('house_type')
                ->pluck('count', 'house_type')
                ->toArray();

            $householdsByOwnershipStatus = Household::selectRaw('ownership_status, COUNT(*) as count')
                ->whereNotNull('ownership_status')
                ->groupBy('ownership_status')
                ->pluck('count', 'ownership_status')
                ->toArray();

            $householdsByMonthlyIncome = Household::selectRaw('monthly_income, COUNT(*) as count')
                ->whereNotNull('monthly_income')
                ->groupBy('monthly_income')
                ->pluck('count', 'monthly_income')
                ->toArray();

            $stats = [
                // Basic counts - matching frontend expectations exactly
                'total_households' => $totalHouseholds,
                
                // Special categories - matching frontend field names
                'four_ps_beneficiaries' => $fourPsBeneficiaries,
                'indigent_families' => $indigentFamilies,
                'with_senior_citizens' => $withSeniorCitizens,
                'with_pwd_members' => $withPwdMembers,
                
                // Utility access
                'with_electricity' => $withElectricity,
                'with_water_supply' => $withWaterSupply,
                'with_internet_access' => $withInternetAccess,
                
                // Geographic and demographic distribution
                'households_by_barangay' => $householdsByBarangay,
                'households_by_type' => $householdsByType,
                'households_by_house_type' => $householdsByHouseType,
                'households_by_ownership_status' => $householdsByOwnershipStatus,
                'households_by_monthly_income' => $householdsByMonthlyIncome,
                
                // Grouped data for compatibility
                'by_barangay' => $householdsByBarangay,
                'by_household_type' => $householdsByType,
                'by_house_type' => $householdsByHouseType,
                'by_ownership_status' => $householdsByOwnershipStatus,
                'by_monthly_income' => $householdsByMonthlyIncome,
                
                // Classifications grouped
                'classifications' => [
                    'four_ps_beneficiaries' => $fourPsBeneficiaries,
                    'indigent_families' => $indigentFamilies,
                    'with_senior_citizens' => $withSeniorCitizens,
                    'with_pwd_members' => $withPwdMembers,
                ],
                
                // Utilities grouped
                'utilities' => [
                    'with_electricity' => $withElectricity,
                    'with_water_supply' => $withWaterSupply,
                    'with_internet_access' => $withInternetAccess,
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get household statistics',
                'error' => $e->getMessage()
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

        $households = Household::with(['headResident'])
            ->where(function ($q) use ($query) {
                $q->where('complete_address', 'LIKE', "%{$query}%")
                  ->orWhere('barangay', 'LIKE', "%{$query}%")
                  ->orWhere('household_number', 'LIKE', "%{$query}%")
                  ->orWhere('street_sitio', 'LIKE', "%{$query}%")
                  ->orWhereHas('headResident', function ($subQuery) use ($query) {
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
     * Get households by barangay.
     */
    public function byBarangay(string $barangay): JsonResponse
    {
        $households = Household::with(['headResident'])
            ->where('barangay', $barangay)
            ->orderBy('complete_address')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $households,
            'message' => "Households in Barangay {$barangay} retrieved successfully"
        ]);
    }

    /**
     * Check for duplicate households.
     */
    public function checkDuplicates(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'complete_address' => 'required|string',
                'barangay' => 'required|string'
            ]);

            $duplicates = Household::where('complete_address', 'like', '%' . $request->complete_address . '%')
                                ->where('barangay', $request->barangay)
                                ->get(['id', 'household_number', 'complete_address', 'barangay', 'head_resident_id']);

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
     * Get households with Four Ps beneficiaries.
     */
    public function getFourPsBeneficiaries(Request $request): JsonResponse
    {
        try {
            $households = Household::with(['headResident'])
                ->where('four_ps_beneficiary', true)
                ->orderBy('complete_address')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $households
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get Four Ps beneficiary households',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get households with PWD members.
     */
    public function getWithPWDMembers(Request $request): JsonResponse
    {
        try {
            $households = Household::with(['headResident'])
                ->where('has_pwd_member', true)
                ->orderBy('complete_address')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $households
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get households with PWD members',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get households with senior citizen members.
     */
    public function getWithSeniorCitizens(Request $request): JsonResponse
    {
        try {
            $households = Household::with(['headResident'])
                ->where('has_senior_citizen', true)
                ->orderBy('complete_address')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $households
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get households with senior citizens',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get indigent families.
     */
    public function getIndigentFamilies(Request $request): JsonResponse
    {
        try {
            $households = Household::with(['headResident'])
                ->where('indigent_family', true)
                ->orderBy('complete_address')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $households
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get indigent families',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update household members.
     */
    public function updateMembers(Request $request, Household $household): JsonResponse
    {
        try {
            $request->validate([
                'head_resident_id' => 'required|integer|exists:residents,id',
                'member_ids' => 'sometimes|array',
                'member_ids.*.resident_id' => 'required|integer|exists:residents,id',
                'member_ids.*.relationship' => 'required|string|max:100'
            ]);

            // Remove all current household members
            Resident::where('household_id', $household->id)->update([
                'household_id' => null,
                'is_household_head' => false,
                'relationship_to_head' => null
            ]);

            // Set the new head resident
            $headResident = Resident::find($request->head_resident_id);
            if ($headResident) {
                $headResident->update([
                    'household_id' => $household->id,
                    'is_household_head' => true,
                    'relationship_to_head' => 'Self'
                ]);
                
                // Update the household's head_resident_id
                $household->update(['head_resident_id' => $request->head_resident_id]);
            }

            // Add new members
            if ($request->has('member_ids') && is_array($request->member_ids)) {
                foreach ($request->member_ids as $memberData) {
                    if (isset($memberData['resident_id']) && isset($memberData['relationship'])) {
                        $member = Resident::find($memberData['resident_id']);
                        if ($member && $member->id != $request->head_resident_id) {
                            $member->update([
                                'household_id' => $household->id,
                                'is_household_head' => false,
                                'relationship_to_head' => $memberData['relationship']
                            ]);
                        }
                    }
                }
            }

            // Load updated relationships
            $household->load(['headResident', 'members']);

            return response()->json([
                'message' => 'Household members updated successfully',
                'data' => $household
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update household members',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate a unique household number.
     */
    private function generateHouseholdNumber(): string
    {
        $prefix = 'HH';
        $year = date('Y');
        
        // Get the last household number for this year
        $lastHousehold = Household::where('household_number', 'LIKE', "{$prefix}{$year}%")
            ->orderBy('household_number', 'desc')
            ->first();
        
        if ($lastHousehold) {
            // Extract the sequence number and increment
            $lastNumber = intval(substr($lastHousehold->household_number, -4));
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }
        
        return $prefix . $year . str_pad($newNumber, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Validate that residents can be assigned to household
     */
    private function validateResidentAssignment(array $residentIds, ?int $excludeHouseholdId = null): array
    {
        $errors = [];
        
        foreach ($residentIds as $residentId) {
            $resident = Resident::find($residentId);
            
            if (!$resident) {
                $errors[] = "Resident with ID {$residentId} not found";
                continue;
            }
            
            // Check if resident is already assigned to another household
            if ($resident->household_id && 
                ($excludeHouseholdId === null || $resident->household_id !== $excludeHouseholdId)) {
                $errors[] = "Resident {$resident->first_name} {$resident->last_name} is already assigned to another household";
            }
        }
        
        return $errors;
    }

    /**
     * Bulk update resident household assignments
     */
    private function updateResidentHouseholdAssignments(int $householdId, array $memberData, ?int $headResidentId = null): void
    {
        foreach ($memberData as $member) {
            if (!isset($member['resident_id']) || !isset($member['relationship'])) {
                continue;
            }
            
            $resident = Resident::find($member['resident_id']);
            if (!$resident || $resident->id === $headResidentId) {
                continue;
            }
            
            // Skip if already assigned to another household
            if ($resident->household_id && $resident->household_id !== $householdId) {
                Log::warning("Skipping resident assignment - already assigned to another household", [
                    'resident_id' => $resident->id,
                    'current_household' => $resident->household_id,
                    'target_household' => $householdId
                ]);
                continue;
            }
            
            $resident->update([
                'household_id' => $householdId,
                'is_household_head' => false,
                'relationship_to_head' => $member['relationship']
            ]);
        }
    }
}
