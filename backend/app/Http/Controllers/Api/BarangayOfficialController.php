<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BarangayOfficial;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class BarangayOfficialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = BarangayOfficial::query();

        // Apply filters
        if ($request->has('position')) {
            $query->where('position', $request->position);
        }

        if ($request->has('committee')) {
            $query->where('committee', $request->committee);
        }

        if ($request->has('is_active')) {
            $isActive = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN);
            $query->where('is_active', $isActive);
        }

        if ($request->has('current_term')) {
            $currentTerm = filter_var($request->current_term, FILTER_VALIDATE_BOOLEAN);
            if ($currentTerm) {
                $query->where('term_start', '<=', now())
                      ->where('term_end', '>=', now());
            }
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('middle_name', 'like', "%{$search}%")
                  ->orWhere('position', 'like', "%{$search}%")
                  ->orWhere('committee', 'like', "%{$search}%");
            });
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'position');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $officials = $query->paginate($request->get('per_page', 15));

        // Return Laravel pagination structure directly (frontend expects this format)
        return response()->json($officials);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        // Transform frontend data format if needed
        $requestData = $this->transformFrontendToBackend($request->all());
        
        $validator = Validator::make($requestData, [
            // Personal Information (based on frontend form)
            'prefix' => 'nullable|string|in:Mr.,Ms.,Mrs.,Dr.,Hon.',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'gender' => 'required|in:Male,Female',
            'birth_date' => 'nullable|date',
            'contact_number' => 'required|string|max:255',
            'email_address' => 'nullable|email|max:255',
            'complete_address' => 'nullable|string',
            'civil_status' => 'nullable|in:Single,Married,Divorced,Widowed',
            'educational_background' => 'nullable|string',
            
            // Position Information
            'position' => 'required|in:BARANGAY_CAPTAIN,BARANGAY_SECRETARY,BARANGAY_TREASURER,KAGAWAD,SK_CHAIRPERSON,SK_KAGAWAD,BARANGAY_CLERK,BARANGAY_TANOD',
            'position_title' => 'nullable|string|max:255',
            'committee_assignment' => 'nullable|in:Health,Education,Public Safety,Environment,Peace and Order,Sports and Recreation,Women and Family,Senior Citizens',
            
            // Term Information
            'term_start' => 'required|date',
            'term_end' => 'required|date|after:term_start',
            'term_number' => 'nullable|integer|min:1',
            'is_current_term' => 'nullable|boolean',
            
            // Election Information
            'election_date' => 'nullable|date',
            'votes_received' => 'nullable|integer|min:0',
            'is_elected' => 'nullable|boolean',
            'appointment_document' => 'nullable|string|max:500',
            
            // Status
            'status' => 'nullable|in:ACTIVE,INACTIVE,SUSPENDED,RESIGNED,TERMINATED,DECEASED',
            'status_date' => 'nullable|date',
            'status_reason' => 'nullable|string',
            
            // Additional fields
            'work_experience' => 'nullable|string',
            'skills_expertise' => 'nullable|string',
            'trainings_attended' => 'nullable|array',
            'certifications' => 'nullable|array',
            'major_accomplishments' => 'nullable|string',
            'projects_initiated' => 'nullable|array',
            'performance_notes' => 'nullable|string',
            'performance_rating' => 'nullable|integer|min:1|max:5',
            
            // Emergency Contact
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_number' => 'nullable|string|max:20',
            'emergency_contact_relationship' => 'nullable|string|max:100',
            
            // Files
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'documents' => 'nullable|array',
            
            // Oath Information
            'oath_taking_date' => 'nullable|date',
            'oath_taking_notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        // Handle photo upload
        if ($request->hasFile('profile_photo')) {
            $photoPath = $request->file('profile_photo')->store('officials/photos', 'public');
            $validated['profile_photo'] = $photoPath;
        }

        $validated['is_active'] = true;

        $official = BarangayOfficial::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Barangay official created successfully',
            'data' => $official
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(BarangayOfficial $barangayOfficial): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $barangayOfficial
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BarangayOfficial $barangayOfficial): JsonResponse
    {
        // Transform frontend data format if needed
        $requestData = $this->transformFrontendToBackend($request->all());
        
        $validator = Validator::make($requestData, [
            // Personal Information (based on frontend form) - using 'sometimes' for updates
            'prefix' => 'nullable|string|in:Mr.,Ms.,Mrs.,Dr.,Hon.',
            'first_name' => 'sometimes|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'gender' => 'sometimes|in:Male,Female',
            'birth_date' => 'nullable|date',
            'contact_number' => 'sometimes|string|max:255',
            'email_address' => 'nullable|email|max:255',
            'complete_address' => 'nullable|string',
            'civil_status' => 'nullable|in:Single,Married,Divorced,Widowed',
            'educational_background' => 'nullable|string',
            
            // Position Information
            'position' => 'sometimes|in:BARANGAY_CAPTAIN,BARANGAY_SECRETARY,BARANGAY_TREASURER,KAGAWAD,SK_CHAIRPERSON,SK_KAGAWAD,BARANGAY_CLERK,BARANGAY_TANOD',
            'position_title' => 'nullable|string|max:255',
            'committee_assignment' => 'nullable|in:Health,Education,Public Safety,Environment,Peace and Order,Sports and Recreation,Women and Family,Senior Citizens',
            
            // Term Information
            'term_start' => 'sometimes|date',
            'term_end' => 'sometimes|date|after:term_start',
            'term_number' => 'nullable|integer|min:1',
            'is_current_term' => 'nullable|boolean',
            
            // Election Information
            'election_date' => 'nullable|date',
            'votes_received' => 'nullable|integer|min:0',
            'is_elected' => 'nullable|boolean',
            'appointment_document' => 'nullable|string|max:500',
            
            // Status
            'status' => 'nullable|in:ACTIVE,INACTIVE,SUSPENDED,RESIGNED,TERMINATED,DECEASED',
            'status_date' => 'nullable|date',
            'status_reason' => 'nullable|string',
            
            // Additional fields
            'work_experience' => 'nullable|string',
            'skills_expertise' => 'nullable|string',
            'trainings_attended' => 'nullable|array',
            'certifications' => 'nullable|array',
            'major_accomplishments' => 'nullable|string',
            'projects_initiated' => 'nullable|array',
            'performance_notes' => 'nullable|string',
            'performance_rating' => 'nullable|integer|min:1|max:5',
            
            // Emergency Contact
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_number' => 'nullable|string|max:20',
            'emergency_contact_relationship' => 'nullable|string|max:100',
            
            // Files
            'profile_photo' => 'nullable|string|max:500',
            'documents' => 'nullable|array',
            
            // Oath Information
            'oath_taking_date' => 'nullable|date',
            'oath_taking_notes' => 'nullable|string',
            
            // System
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        // Handle photo upload
        if ($request->hasFile('profile_photo')) {
            // Delete old photo if exists
            if ($barangayOfficial->profile_photo) {
                Storage::disk('public')->delete($barangayOfficial->profile_photo);
            }
            
            $photoPath = $request->file('profile_photo')->store('officials/photos', 'public');
            $validated['profile_photo'] = $photoPath;
        }

        $barangayOfficial->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Barangay official updated successfully',
            'data' => $barangayOfficial
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BarangayOfficial $barangayOfficial): JsonResponse
    {
        // Delete photo if exists
        if ($barangayOfficial->profile_photo) {
            Storage::disk('public')->delete($barangayOfficial->profile_photo);
        }

        $barangayOfficial->delete();

        return response()->json([
            'success' => true,
            'message' => 'Barangay official deleted successfully'
        ]);
    }

    /**
     * Get active officials
     */
    public function getActiveOfficials(): JsonResponse
    {
        $officials = BarangayOfficial::where('is_active', true)
            ->where('term_start', '<=', now())
            ->where('term_end', '>=', now())
            ->orderBy('position')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $officials
        ]);
    }

    /**
     * Get officials by position
     */
    public function getByPosition(Request $request, string $position): JsonResponse
    {
        $officials = BarangayOfficial::where('position', strtoupper($position))
            ->when($request->get('active_only'), function ($query) {
                $query->where('is_active', true)
                      ->where('term_start', '<=', now())
                      ->where('term_end', '>=', now());
            })
            ->orderBy('last_name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $officials
        ]);
    }

    /**
     * Get officials by committee
     */
    public function getByCommittee(Request $request, string $committee): JsonResponse
    {
        $officials = BarangayOfficial::where('committee', strtoupper($committee))
            ->when($request->get('active_only'), function ($query) {
                $query->where('is_active', true)
                      ->where('term_start', '<=', now())
                      ->where('term_end', '>=', now());
            })
            ->orderBy('position')
            ->orderBy('last_name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $officials
        ]);
    }

    /**
     * Update performance rating
     */
    public function updatePerformance(Request $request, BarangayOfficial $barangayOfficial): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'performance_rating' => 'required|numeric|min:1|max:5',
            'performance_notes' => 'nullable|string',
            'evaluation_period' => 'required|string|max:255',
            'evaluated_by' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $barangayOfficial->update([
            'performance_rating' => $request->performance_rating,
            'performance_notes' => $request->performance_notes,
            'last_evaluation_date' => now(),
            'evaluated_by' => $request->get('evaluated_by', null),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Performance rating updated successfully',
            'data' => $barangayOfficial
        ]);
    }

    /**
     * Archive official (end term)
     */
    public function archive(Request $request, BarangayOfficial $barangayOfficial): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'end_reason' => 'required|in:TERM_ENDED,RESIGNED,TERMINATED,DECEASED,TRANSFERRED',
            'end_notes' => 'nullable|string',
            'effective_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $barangayOfficial->update([
            'is_active' => false,
            'term_end' => $request->effective_date,
            'end_reason' => $request->end_reason,
            'end_notes' => $request->end_notes,
            'archived_at' => now(),
            'archived_by' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Official archived successfully',
            'data' => $barangayOfficial
        ]);
    }

    /**
     * Reactivate official
     */
    public function reactivate(Request $request, BarangayOfficial $barangayOfficial): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'new_term_start' => 'required|date',
            'new_term_end' => 'required|date|after:new_term_start',
            'reactivation_notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $barangayOfficial->update([
            'is_active' => true,
            'term_start' => $request->new_term_start,
            'term_end' => $request->new_term_end,
            'end_reason' => null,
            'end_notes' => $request->reactivation_notes,
            'archived_at' => null,
            'archived_by' => null,
            'reactivated_at' => now(),
            'reactivated_by' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Official reactivated successfully',
            'data' => $barangayOfficial
        ]);
    }

    /**
     * Get official statistics
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total_officials' => BarangayOfficial::count(),
            'active_officials' => BarangayOfficial::where('is_active', true)->count(),
            'current_term_officials' => BarangayOfficial::where('term_start', '<=', now())
                ->where('term_end', '>=', now())
                ->count(),            'by_position' => BarangayOfficial::selectRaw('position, COUNT(*) as count')
                ->where('is_active', true)
                ->groupBy('position')
                ->pluck('count', 'position'),
            'by_gender' => BarangayOfficial::selectRaw('gender, COUNT(*) as count')
                ->where('is_active', true)
                ->whereNotNull('gender')
                ->groupBy('gender')
                ->pluck('count', 'gender'),
            'average_performance' => BarangayOfficial::where('is_active', true)
                ->whereNotNull('performance_rating')
                ->avg('performance_rating'),
            'average_tenure' => BarangayOfficial::where('is_active', true)
                ->selectRaw('AVG(julianday(date("now")) - julianday(term_start)) as avg_days')
                ->value('avg_days'),
            'upcoming_term_endings' => BarangayOfficial::where('is_active', true)
                ->where('term_end', '<=', now()->addMonths(6))
                ->where('term_end', '>=', now())
                ->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Export officials data
     */
    public function export(Request $request): JsonResponse
    {
        $query = BarangayOfficial::query();

        // Apply same filters as index
        if ($request->has('position')) {
            $query->where('position', $request->position);
        }

        if ($request->has('is_active')) {
            $isActive = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN);
            $query->where('is_active', $isActive);
        }

        $officials = $query->orderBy('position')->orderBy('last_name')->get();

        // Format data for export
        $exportData = $officials->map(function ($official) {
            return [
                'full_name' => $official->full_name,
                'position' => $official->position,
                'committee' => $official->committee,
                'contact_number' => $official->contact_number,
                'email_address' => $official->email_address,
                'term_start' => $official->term_start?->format('Y-m-d'),
                'term_end' => $official->term_end?->format('Y-m-d'),
                'is_active' => $official->is_active ? 'Yes' : 'No',
                'tenure_months' => $official->tenure_months,
                'performance_rating' => $official->performance_rating,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $exportData,
            'filename' => 'barangay_officials_' . now()->format('Y_m_d_H_i_s') . '.csv'
        ]);
    }

    /**
     * Transform frontend form data to backend API format
     */
    private function transformFrontendToBackend(array $data): array
    {
        $transformed = [];
        
        // Map frontend field names to backend field names
        $fieldMapping = [
            'firstName' => 'first_name',
            'middleName' => 'middle_name', 
            'lastName' => 'last_name',
            'birthDate' => 'birth_date',
            'contactNumber' => 'contact_number',
            'emailAddress' => 'email_address',
            'completeAddress' => 'complete_address',
            'civilStatus' => 'civil_status',
            'educationalBackground' => 'educational_background',
            'committeeAssignment' => 'committee_assignment',
            'termStart' => 'term_start',
            'termEnd' => 'term_end',
            'oathTakingDate' => 'oath_taking_date',
            'oathTakingNotes' => 'oath_taking_notes',
        ];
        
        // Transform field names
        foreach ($data as $key => $value) {
            $backendKey = $fieldMapping[$key] ?? $key;
            $transformed[$backendKey] = $value;
        }
        
        // Set defaults
        if (!isset($transformed['status'])) {
            $transformed['status'] = 'ACTIVE';
        }
        
        if (!isset($transformed['is_active'])) {
            $transformed['is_active'] = true;
        }
        
        return $transformed;
    }
}
