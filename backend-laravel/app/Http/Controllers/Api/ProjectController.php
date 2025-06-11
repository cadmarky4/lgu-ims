<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectMilestone;
use App\Models\ProjectTeamMember;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Carbon\Carbon;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Project::with(['projectManager', 'milestones', 'teamMembers']);

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

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('manager_id')) {
            $query->where('project_manager_id', $request->manager_id);
        }

        if ($request->has('budget_min')) {
            $query->where('total_budget', '>=', $request->budget_min);
        }

        if ($request->has('budget_max')) {
            $query->where('total_budget', '<=', $request->budget_max);
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $projects = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $projects,
            'message' => 'Projects retrieved successfully'
        ]);
    }

    /**
     * Store a newly created project.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'objectives' => 'nullable|string',
                'expected_outcomes' => 'nullable|string',
                'category' => 'required|in:INFRASTRUCTURE,HEALTH,EDUCATION,SOCIAL_SERVICES,ENVIRONMENT,LIVELIHOOD,DISASTER_PREPAREDNESS,YOUTH_DEVELOPMENT,SENIOR_CITIZEN_PROGRAM,WOMEN_EMPOWERMENT,OTHER',
                'type' => 'sometimes|in:REGULAR,SPECIAL,EMERGENCY,FUNDED,DONATION',
                'priority' => 'sometimes|in:LOW,NORMAL,HIGH,CRITICAL',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
                'total_budget' => 'required|numeric|min:0',
                'allocated_budget' => 'required|numeric|min:0|lte:total_budget',
                'funding_source' => 'nullable|string',
                'funding_agency' => 'nullable|string',
                'location' => 'nullable|string',
                'target_puroks' => 'nullable|array',
                'target_beneficiaries' => 'nullable|integer|min:0',
                'beneficiary_criteria' => 'nullable|string',
                'project_manager_id' => 'nullable|exists:users,id',
                'remarks' => 'nullable|string'
            ]);

            $validated['created_by'] = auth()->id();
            
            $project = Project::create($validated);
            $project->load(['projectManager', 'createdBy']);

            return response()->json([
                'success' => true,
                'data' => $project,
                'message' => 'Project created successfully'
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
                'message' => 'Failed to create project: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified project.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $project = Project::with([
                'projectManager',
                'approvingOfficial',
                'milestones.responsibleUser',
                'teamMembers.user',
                'createdBy',
                'updatedBy'
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $project,
                'message' => 'Project retrieved successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        }
    }

    /**
     * Update the specified project.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $project = Project::findOrFail($id);

            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'objectives' => 'nullable|string',
                'expected_outcomes' => 'nullable|string',
                'category' => 'sometimes|in:INFRASTRUCTURE,HEALTH,EDUCATION,SOCIAL_SERVICES,ENVIRONMENT,LIVELIHOOD,DISASTER_PREPAREDNESS,YOUTH_DEVELOPMENT,SENIOR_CITIZEN_PROGRAM,WOMEN_EMPOWERMENT,OTHER',
                'type' => 'sometimes|in:REGULAR,SPECIAL,EMERGENCY,FUNDED,DONATION',
                'priority' => 'sometimes|in:LOW,NORMAL,HIGH,CRITICAL',
                'start_date' => 'sometimes|date',
                'end_date' => 'sometimes|date|after:start_date',
                'total_budget' => 'sometimes|numeric|min:0',
                'allocated_budget' => 'sometimes|numeric|min:0',
                'funding_source' => 'nullable|string',
                'funding_agency' => 'nullable|string',
                'location' => 'nullable|string',
                'target_puroks' => 'nullable|array',
                'target_beneficiaries' => 'nullable|integer|min:0',
                'beneficiary_criteria' => 'nullable|string',
                'project_manager_id' => 'nullable|exists:users,id',
                'progress_percentage' => 'sometimes|integer|min:0|max:100',
                'actual_beneficiaries' => 'nullable|integer|min:0',
                'remarks' => 'nullable|string'
            ]);

            $validated['updated_by'] = auth()->id();
            
            $project->update($validated);
            $project->load(['projectManager', 'milestones', 'teamMembers']);

            return response()->json([
                'success' => true,
                'data' => $project,
                'message' => 'Project updated successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
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
                'message' => 'Failed to update project: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified project.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $project = Project::findOrFail($id);
            
            // Only allow deletion of projects that haven't started
            if (in_array($project->status, ['IN_PROGRESS', 'COMPLETED'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete project that is in progress or completed'
                ], 422);
            }

            $project->delete();

            return response()->json([
                'success' => true,
                'message' => 'Project deleted successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete project: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get project statistics.
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_projects' => Project::count(),
                'by_status' => Project::selectRaw('status, COUNT(*) as count')
                    ->groupBy('status')
                    ->get(),
                'by_category' => Project::selectRaw('category, COUNT(*) as count')
                    ->groupBy('category')
                    ->orderBy('count', 'desc')
                    ->get(),
                'by_priority' => Project::selectRaw('priority, COUNT(*) as count')
                    ->groupBy('priority')
                    ->get(),
                'active_projects' => Project::active()->count(),
                'completed_projects' => Project::completed()->count(),
                'overdue_projects' => Project::overdue()->count(),
                'budget_summary' => [
                    'total_budget' => Project::sum('total_budget'),
                    'allocated_budget' => Project::sum('allocated_budget'),
                    'utilized_budget' => Project::sum('utilized_budget'),
                    'average_budget' => Project::avg('total_budget')
                ],
                'beneficiaries' => [
                    'target_total' => Project::sum('target_beneficiaries'),
                    'actual_total' => Project::sum('actual_beneficiaries'),
                    'completion_rate' => Project::whereNotNull('actual_beneficiaries')
                        ->avg(\DB::raw('(actual_beneficiaries / NULLIF(target_beneficiaries, 0)) * 100'))
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Project statistics retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Approve a project.
     */
    public function approve(Request $request, string $id): JsonResponse
    {
        try {
            $project = Project::findOrFail($id);
            
            if ($project->status !== 'PLANNING') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only projects in planning status can be approved'
                ], 422);
            }

            $project->approve(auth()->id());
            $project->load(['approvingOfficial']);

            return response()->json([
                'success' => true,
                'data' => $project,
                'message' => 'Project approved successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve project: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Start a project.
     */
    public function start(Request $request, string $id): JsonResponse
    {
        try {
            $project = Project::findOrFail($id);
            
            if ($project->status !== 'APPROVED') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only approved projects can be started'
                ], 422);
            }

            $project->start();

            return response()->json([
                'success' => true,
                'data' => $project,
                'message' => 'Project started successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to start project: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Complete a project.
     */
    public function complete(Request $request, string $id): JsonResponse
    {
        try {
            $project = Project::findOrFail($id);
            
            $request->validate([
                'completion_report' => 'nullable|string'
            ]);

            if ($project->status !== 'IN_PROGRESS') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only projects in progress can be completed'
                ], 422);
            }

            $project->complete($request->completion_report);

            return response()->json([
                'success' => true,
                'data' => $project,
                'message' => 'Project completed successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete project: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update project progress.
     */
    public function updateProgress(Request $request, string $id): JsonResponse
    {
        try {
            $project = Project::findOrFail($id);
            
            $request->validate([
                'progress_percentage' => 'required|integer|min:0|max:100'
            ]);

            $project->updateProgress($request->progress_percentage);

            return response()->json([
                'success' => true,
                'data' => $project,
                'message' => 'Project progress updated successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update progress: ' . $e->getMessage()
            ], 500);
        }
    }
}
