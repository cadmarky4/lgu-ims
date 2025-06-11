<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Suggestion;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class SuggestionController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Suggestion::with('resident');

        // Apply filters
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('implementation_status')) {
            $query->where('implementation_status', $request->implementation_status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('suggester_name', 'like', "%{$search}%");
            });
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $suggestions = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $suggestions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'resident_id' => 'nullable|exists:residents,id',
            'suggester_name' => 'required|string|max:255',
            'suggestor_contact' => 'nullable|string|max:255',
            'suggestor_email' => 'nullable|email|max:255',
            'suggestor_address' => 'nullable|string',
            'category' => 'required|in:INFRASTRUCTURE,SERVICES,PROGRAMS,POLICIES,FACILITIES,TECHNOLOGY,OTHER',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority_level' => 'nullable|in:LOW,MEDIUM,HIGH,URGENT',
            'expected_impact' => 'nullable|string',
            'estimated_cost' => 'nullable|numeric|min:0',
            'target_department' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $suggestion = Suggestion::create(array_merge($validator->validated(), [
            'status' => 'PENDING',
            'implementation_status' => 'NOT_STARTED',
            'votes_count' => 0,
            'submitted_by' => auth()->id(),
        ]));

        $suggestion->load('resident');

        return response()->json([
            'success' => true,
            'message' => 'Suggestion submitted successfully',
            'data' => $suggestion
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Suggestion $suggestion): JsonResponse
    {
        $suggestion->load(['resident', 'votes']);

        return response()->json([
            'success' => true,
            'data' => $suggestion
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Suggestion $suggestion): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'suggester_name' => 'sometimes|string|max:255',
            'suggestor_contact' => 'nullable|string|max:255',
            'suggestor_email' => 'nullable|email|max:255',
            'suggestor_address' => 'nullable|string',
            'category' => 'sometimes|in:INFRASTRUCTURE,SERVICES,PROGRAMS,POLICIES,FACILITIES,TECHNOLOGY,OTHER',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'priority_level' => 'nullable|in:LOW,MEDIUM,HIGH,URGENT',
            'expected_impact' => 'nullable|string',
            'estimated_cost' => 'nullable|numeric|min:0',
            'target_department' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $suggestion->update($validator->validated());
        $suggestion->load('resident');

        return response()->json([
            'success' => true,
            'message' => 'Suggestion updated successfully',
            'data' => $suggestion
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Suggestion $suggestion): JsonResponse
    {
        $suggestion->delete();

        return response()->json([
            'success' => true,
            'message' => 'Suggestion deleted successfully'
        ]);
    }

    /**
     * Review a suggestion
     */
    public function review(Request $request, Suggestion $suggestion): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:UNDER_REVIEW,APPROVED,REJECTED,IMPLEMENTED',
            'review_notes' => 'nullable|string',
            'estimated_budget' => 'nullable|numeric|min:0',
            'target_completion_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $suggestion->update(array_merge($validator->validated(), [
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Suggestion reviewed successfully',
            'data' => $suggestion->fresh(['resident'])
        ]);
    }

    /**
     * Vote on a suggestion
     */
    public function vote(Request $request, Suggestion $suggestion): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'vote_type' => 'required|in:UPVOTE,DOWNVOTE',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if user already voted
        $existingVote = $suggestion->votes()->where('user_id', auth()->id())->first();

        if ($existingVote) {
            // Update existing vote
            $existingVote->update(['vote_type' => $request->vote_type]);
        } else {
            // Create new vote
            $suggestion->votes()->create([
                'user_id' => auth()->id(),
                'vote_type' => $request->vote_type,
            ]);
        }

        // Update vote counts
        $suggestion->updateVoteCounts();

        return response()->json([
            'success' => true,
            'message' => 'Vote recorded successfully',
            'data' => $suggestion->fresh(['resident', 'votes'])
        ]);
    }

    /**
     * Update implementation status
     */
    public function updateImplementation(Request $request, Suggestion $suggestion): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'implementation_status' => 'required|in:NOT_STARTED,IN_PROGRESS,COMPLETED,ON_HOLD,CANCELLED',
            'implementation_notes' => 'nullable|string',
            'actual_cost' => 'nullable|numeric|min:0',
            'completion_percentage' => 'nullable|integer|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $updateData = $validator->validated();
        
        if ($request->implementation_status === 'COMPLETED') {
            $updateData['implemented_at'] = now();
            $updateData['completion_percentage'] = 100;
        }

        $suggestion->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Implementation status updated successfully',
            'data' => $suggestion->fresh(['resident'])
        ]);
    }

    /**
     * Get suggestion statistics
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total_suggestions' => Suggestion::count(),
            'pending_suggestions' => Suggestion::where('status', 'PENDING')->count(),
            'under_review' => Suggestion::where('status', 'UNDER_REVIEW')->count(),
            'approved_suggestions' => Suggestion::where('status', 'APPROVED')->count(),
            'implemented_suggestions' => Suggestion::where('status', 'IMPLEMENTED')->count(),
            'rejected_suggestions' => Suggestion::where('status', 'REJECTED')->count(),
            'by_category' => Suggestion::selectRaw('category, COUNT(*) as count')
                ->groupBy('category')
                ->pluck('count', 'category'),            'by_implementation_status' => Suggestion::selectRaw('implementation_status, COUNT(*) as count')
                ->groupBy('implementation_status')
                ->pluck('count', 'implementation_status'),
            'average_votes' => Suggestion::avg('votes_count'),
            'total_estimated_cost' => Suggestion::sum('estimated_cost'),
            'total_actual_cost' => Suggestion::sum('actual_cost'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
