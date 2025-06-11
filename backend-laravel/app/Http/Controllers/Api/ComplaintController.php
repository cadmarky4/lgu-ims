<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Carbon\Carbon;

class ComplaintController extends Controller
{
    /**
     * Display a listing of complaints.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Complaint::with(['resident', 'assignedTo', 'investigatedBy']);

        // Apply filters
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        if ($request->has('date_from')) {
            $query->whereDate('date_received', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('date_received', '<=', $request->date_to);
        }

        if ($request->has('is_anonymous')) {
            $query->where('is_anonymous', $request->boolean('is_anonymous'));
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'date_received');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $complaints = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $complaints,
            'message' => 'Complaints retrieved successfully'
        ]);
    }

    /**
     * Store a newly created complaint.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'subject' => 'required|string|max:255',
                'description' => 'required|string',
                'category' => 'required|in:INFRASTRUCTURE,PUBLIC_SERVICE,HEALTH_SANITATION,PEACE_ORDER,ENVIRONMENT,CORRUPTION,DISCRIMINATION,NOISE_COMPLAINT,GARBAGE_COLLECTION,WATER_SUPPLY,ELECTRICAL,ROAD_MAINTENANCE,OTHER',
                'priority' => 'sometimes|in:LOW,NORMAL,HIGH,URGENT',
                'resident_id' => 'nullable|exists:residents,id',
                'complainant_name' => 'required|string|max:255',
                'complainant_contact' => 'nullable|string|max:20',
                'complainant_email' => 'nullable|email',
                'complainant_address' => 'nullable|string',
                'is_anonymous' => 'boolean',
                'incident_location' => 'nullable|string',
                'incident_date' => 'nullable|date|before_or_equal:today',
                'incident_time' => 'nullable|date_format:H:i',
                'persons_involved' => 'nullable|string',
                'witnesses' => 'nullable|string',
                'attachments' => 'nullable|array',
                'remarks' => 'nullable|string'
            ]);

            $validated['created_by'] = auth()->id();
            
            $complaint = Complaint::create($validated);
            $complaint->load(['resident', 'createdBy']);

            return response()->json([
                'success' => true,
                'data' => $complaint,
                'message' => 'Complaint submitted successfully'
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
                'message' => 'Failed to submit complaint: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified complaint.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $complaint = Complaint::with([
                'resident',
                'assignedTo',
                'investigatedBy',
                'createdBy',
                'updatedBy'
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $complaint,
                'message' => 'Complaint retrieved successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Complaint not found'
            ], 404);
        }
    }

    /**
     * Update the specified complaint.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $complaint = Complaint::findOrFail($id);

            $validated = $request->validate([
                'subject' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'category' => 'sometimes|in:INFRASTRUCTURE,PUBLIC_SERVICE,HEALTH_SANITATION,PEACE_ORDER,ENVIRONMENT,CORRUPTION,DISCRIMINATION,NOISE_COMPLAINT,GARBAGE_COLLECTION,WATER_SUPPLY,ELECTRICAL,ROAD_MAINTENANCE,OTHER',
                'priority' => 'sometimes|in:LOW,NORMAL,HIGH,URGENT',
                'complainant_contact' => 'nullable|string|max:20',
                'complainant_email' => 'nullable|email',
                'complainant_address' => 'nullable|string',
                'incident_location' => 'nullable|string',
                'incident_date' => 'nullable|date|before_or_equal:today',
                'incident_time' => 'nullable|date_format:H:i',
                'persons_involved' => 'nullable|string',
                'witnesses' => 'nullable|string',
                'remarks' => 'nullable|string'
            ]);

            $validated['updated_by'] = auth()->id();
            
            $complaint->update($validated);
            $complaint->load(['resident', 'assignedTo']);

            return response()->json([
                'success' => true,
                'data' => $complaint,
                'message' => 'Complaint updated successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Complaint not found'
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
                'message' => 'Failed to update complaint: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified complaint.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $complaint = Complaint::findOrFail($id);
            
            // Only allow deletion of pending complaints
            if (!in_array($complaint->status, ['PENDING', 'REJECTED'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete complaint that is being processed'
                ], 422);
            }

            $complaint->delete();

            return response()->json([
                'success' => true,
                'message' => 'Complaint deleted successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Complaint not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete complaint: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get complaint statistics.
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_complaints' => Complaint::count(),
                'by_status' => Complaint::selectRaw('status, COUNT(*) as count')
                    ->groupBy('status')
                    ->get(),
                'by_category' => Complaint::selectRaw('category, COUNT(*) as count')
                    ->groupBy('category')
                    ->orderBy('count', 'desc')
                    ->get(),
                'by_priority' => Complaint::selectRaw('priority, COUNT(*) as count')
                    ->groupBy('priority')
                    ->get(),
                'pending_count' => Complaint::pending()->count(),
                'resolved_count' => Complaint::resolved()->count(),
                'overdue_count' => Complaint::overdue()->count(),
                'high_priority_count' => Complaint::highPriority()->count(),
                'anonymous_count' => Complaint::anonymous()->count(),
                'average_resolution_time' => Complaint::whereNotNull('actual_resolution_date')
                    ->selectRaw('AVG(julianday(actual_resolution_date) - julianday(date_received)) as avg_days')
                    ->value('avg_days') ?? 0,
                'satisfaction_ratings' => [
                    'average_rating' => Complaint::whereNotNull('satisfaction_rating')->avg('satisfaction_rating'),
                    'total_responses' => Complaint::where('is_feedback_received', true)->count()
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Complaint statistics retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Acknowledge a complaint.
     */
    public function acknowledge(Request $request, string $id): JsonResponse
    {
        try {
            $complaint = Complaint::findOrFail($id);
            
            $request->validate([
                'target_resolution_date' => 'nullable|date|after:today'
            ]);

            if ($complaint->status !== 'PENDING') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only pending complaints can be acknowledged'
                ], 422);
            }

            $targetDate = $request->target_resolution_date ? 
                Carbon::parse($request->target_resolution_date) : null;

            $complaint->acknowledge(auth()->id(), $targetDate);

            return response()->json([
                'success' => true,
                'data' => $complaint,
                'message' => 'Complaint acknowledged successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Complaint not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to acknowledge complaint: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Assign a complaint.
     */
    public function assign(Request $request, string $id): JsonResponse
    {
        try {
            $complaint = Complaint::findOrFail($id);
            
            $request->validate([
                'assigned_to' => 'required|exists:users,id',
                'assigned_department' => 'nullable|string'
            ]);

            $complaint->assign($request->assigned_to, $request->assigned_department);
            $complaint->load(['assignedTo']);

            return response()->json([
                'success' => true,
                'data' => $complaint,
                'message' => 'Complaint assigned successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Complaint not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to assign complaint: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Resolve a complaint.
     */
    public function resolve(Request $request, string $id): JsonResponse
    {
        try {
            $complaint = Complaint::findOrFail($id);
            
            $request->validate([
                'resolution_details' => 'required|string',
                'resolution_type' => 'required|in:RESOLVED,REFERRED_TO_AUTHORITIES,MEDIATED,NO_ACTION_REQUIRED,INSUFFICIENT_EVIDENCE,WITHDRAWN,OTHER',
                'recommendations' => 'nullable|string'
            ]);

            if (!$complaint->canBeResolved()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Complaint cannot be resolved at this time'
                ], 422);
            }

            $complaint->resolve(
                $request->resolution_details,
                $request->resolution_type,
                auth()->id()
            );

            if ($request->recommendations) {
                $complaint->addRecommendation($request->recommendations);
            }

            return response()->json([
                'success' => true,
                'data' => $complaint,
                'message' => 'Complaint resolved successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Complaint not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to resolve complaint: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Submit feedback for a complaint.
     */
    public function submitFeedback(Request $request, string $id): JsonResponse
    {
        try {
            $complaint = Complaint::findOrFail($id);
            
            $request->validate([
                'satisfaction_rating' => 'required|integer|min:1|max:5',
                'feedback' => 'nullable|string'
            ]);

            if (!in_array($complaint->status, ['RESOLVED', 'CLOSED'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Feedback can only be submitted for resolved complaints'
                ], 422);
            }

            $complaint->submitFeedback($request->satisfaction_rating, $request->feedback);

            return response()->json([
                'success' => true,
                'data' => $complaint,
                'message' => 'Feedback submitted successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Complaint not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit feedback: ' . $e->getMessage()
            ], 500);
        }
    }
}
