<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlotterCase;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BlotterCaseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = BlotterCase::with(['complainant', 'respondent', 'investigator', 'mediator']);

        // Apply filters
        if ($request->has('case_type')) {
            $query->where('case_type', $request->case_type);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('date_from')) {
            $query->whereDate('incident_date', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('incident_date', '<=', $request->date_to);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('case_number', 'like', "%{$search}%")
                  ->orWhere('incident_description', 'like', "%{$search}%")
                  ->orWhere('complainant_name', 'like', "%{$search}%")
                  ->orWhere('respondent_name', 'like', "%{$search}%");
            });
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $cases = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $cases,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'complainant_id' => 'nullable|exists:residents,id',
            'complainant_name' => 'required|string|max:255',
            'complainant_address' => 'nullable|string',
            'complainant_contact' => 'nullable|string|max:255', 
            'respondent_id' => 'nullable|exists:residents,id',
            'respondent_name' => 'required|string|max:255',
            'respondent_address' => 'nullable|string',
            'respondent_contact' => 'nullable|string|max:255',
            'case_type' => 'required|in:NOISE_COMPLAINT,PROPERTY_DISPUTE,FAMILY_DISPUTE,ASSAULT,HARASSMENT,THEFT,VANDALISM,TRESPASSING,NEIGHBOR_DISPUTE,OTHER',
            'incident_date' => 'required|date',
            'incident_time' => 'nullable|string',
            'incident_location' => 'required|string',
            'incident_description' => 'required|string',
            'priority' => 'required|in:LOW,NORMAL,HIGH,URGENT',
            'witnesses' => 'nullable|string',
            'evidence_description' => 'nullable|string',
            'initial_action_taken' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();
        
        // Generate case number
        $validated['case_number'] = $this->generateCaseNumber();
        $validated['status'] = 'FILED';
        $validated['filed_by'] = auth()->id();

        $blotterCase = BlotterCase::create($validated);
        $blotterCase->load(['complainant', 'respondent']);

        return response()->json([
            'success' => true,
            'message' => 'Blotter case filed successfully',
            'data' => $blotterCase
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(BlotterCase $blotterCase): JsonResponse
    {
        $blotterCase->load(['complainant', 'respondent', 'investigator', 'mediator', 'hearings']);

        return response()->json([
            'success' => true,
            'data' => $blotterCase
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BlotterCase $blotterCase): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'complainant_name' => 'sometimes|string|max:255',
            'complainant_address' => 'nullable|string',
            'complainant_contact' => 'nullable|string|max:255',
            'respondent_name' => 'sometimes|string|max:255',
            'respondent_address' => 'nullable|string',
            'respondent_contact' => 'nullable|string|max:255',
            'case_type' => 'sometimes|in:NOISE_COMPLAINT,PROPERTY_DISPUTE,FAMILY_DISPUTE,ASSAULT,HARASSMENT,THEFT,VANDALISM,TRESPASSING,NEIGHBOR_DISPUTE,OTHER',
            'incident_date' => 'sometimes|date',
            'incident_time' => 'nullable|string',
            'incident_location' => 'sometimes|string',
            'incident_description' => 'sometimes|string',
            'priority' => 'sometimes|in:LOW,NORMAL,HIGH,URGENT',
            'witnesses' => 'nullable|string',
            'evidence_description' => 'nullable|string',
            'initial_action_taken' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $blotterCase->update($validator->validated());
        $blotterCase->load(['complainant', 'respondent']);

        return response()->json([
            'success' => true,
            'message' => 'Blotter case updated successfully',
            'data' => $blotterCase
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BlotterCase $blotterCase): JsonResponse
    {
        $blotterCase->delete();

        return response()->json([
            'success' => true,
            'message' => 'Blotter case deleted successfully'
        ]);
    }

    /**
     * Assign investigator to case
     */
    public function assignInvestigator(Request $request, BlotterCase $blotterCase): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'investigator_id' => 'required|exists:users,id',
            'investigation_notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $blotterCase->update([
            'investigator_id' => $request->investigator_id,
            'investigation_notes' => $request->investigation_notes,
            'status' => 'UNDER_INVESTIGATION',
            'investigation_start_date' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Investigator assigned successfully',
            'data' => $blotterCase->fresh(['complainant', 'respondent', 'investigator'])
        ]);
    }

    /**
     * Schedule mediation
     */
    public function scheduleMediation(Request $request, BlotterCase $blotterCase): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'mediator_id' => 'required|exists:users,id',
            'mediation_date' => 'required|date|after:today',
            'mediation_time' => 'required|string',
            'mediation_venue' => 'required|string|max:255',
            'mediation_notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors', 
                'errors' => $validator->errors()
            ], 422);
        }

        $blotterCase->update(array_merge($validator->validated(), [
            'status' => 'MEDIATION_SCHEDULED',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Mediation scheduled successfully',
            'data' => $blotterCase->fresh(['complainant', 'respondent', 'mediator'])
        ]);
    }

    /**
     * Complete mediation
     */
    public function completeMediation(Request $request, BlotterCase $blotterCase): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'mediation_outcome' => 'required|in:SETTLED,FAILED,PARTIAL_SETTLEMENT',
            'settlement_terms' => 'nullable|string',
            'mediation_summary' => 'required|string',
            'next_action' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $updateData = $validator->validated();
        $updateData['mediation_completed_at'] = now();

        // Update status based on outcome
        if ($request->mediation_outcome === 'SETTLED') {
            $updateData['status'] = 'SETTLED';
            $updateData['settlement_date'] = now();
        } elseif ($request->mediation_outcome === 'FAILED') {
            $updateData['status'] = 'ESCALATED';
        } else {
            $updateData['status'] = 'PENDING_COMPLIANCE';
        }

        $blotterCase->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Mediation completed successfully',
            'data' => $blotterCase->fresh(['complainant', 'respondent', 'mediator'])
        ]);
    }

    /**
     * Update compliance status
     */
    public function updateCompliance(Request $request, BlotterCase $blotterCase): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'compliance_status' => 'required|in:COMPLIANT,NON_COMPLIANT,PARTIAL_COMPLIANCE',
            'compliance_notes' => 'nullable|string',
            'monitoring_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $updateData = $validator->validated();
          if ($request->compliance_status === 'COMPLIANT') {
            $updateData['status'] = 'CLOSED';
            $updateData['settlement_date'] = now();
        }

        $blotterCase->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Compliance status updated successfully',
            'data' => $blotterCase->fresh(['complainant', 'respondent'])
        ]);
    }

    /**
     * Close case
     */
    public function closeCase(Request $request, BlotterCase $blotterCase): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'closure_reason' => 'required|in:SETTLED,DISMISSED,WITHDRAWN,RESOLVED',
            'closure_notes' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }        $blotterCase->update([
            'status' => 'CLOSED',
            'closure_reason' => $request->closure_reason,
            'closure_notes' => $request->closure_notes,
            'settlement_date' => now(),
            'closed_by' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Case closed successfully',
            'data' => $blotterCase->fresh(['complainant', 'respondent'])
        ]);
    }

    /**
     * Get case statistics
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total_cases' => BlotterCase::count(),
            'filed_cases' => BlotterCase::where('status', 'FILED')->count(),
            'under_investigation' => BlotterCase::where('status', 'UNDER_INVESTIGATION')->count(),
            'mediation_scheduled' => BlotterCase::where('status', 'MEDIATION_SCHEDULED')->count(),
            'settled_cases' => BlotterCase::where('status', 'SETTLED')->count(),
            'closed_cases' => BlotterCase::where('status', 'CLOSED')->count(),
            'by_case_type' => BlotterCase::selectRaw('case_type, COUNT(*) as count')
                ->groupBy('case_type')
                ->pluck('count', 'case_type'),            'by_priority' => BlotterCase::selectRaw('priority, COUNT(*) as count')
                ->groupBy('priority')
                ->pluck('count', 'priority'),            'average_resolution_days' => BlotterCase::whereNotNull('settlement_date')
                ->selectRaw('AVG(julianday(settlement_date) - julianday(created_at)) as avg_days')
                ->value('avg_days'),
            'monthly_cases' => BlotterCase::selectRaw('strftime("%m", created_at) as month, COUNT(*) as count')
                ->whereYear('created_at', date('Y'))
                ->groupBy('month')
                ->pluck('count', 'month'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Generate unique case number
     */
    private function generateCaseNumber(): string
    {
        $year = date('Y');
        $month = date('m');
          // Get the last case number for this month
        $lastCase = BlotterCase::whereYear('created_at', $year)
            ->whereRaw('strftime("%m", created_at) = ?', [$month])
            ->orderBy('case_number', 'desc')
            ->first();

        if ($lastCase) {
            // Extract sequence number from last case number
            $parts = explode('-', $lastCase->case_number);
            $sequence = intval($parts[2]) + 1;
        } else {
            $sequence = 1;
        }

        return sprintf('BLT-%s%s-%04d', $year, $month, $sequence);
    }
}
