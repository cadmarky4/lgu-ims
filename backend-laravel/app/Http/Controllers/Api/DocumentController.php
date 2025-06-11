<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\Resident;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Carbon\Carbon;

class DocumentController extends Controller
{
    /**
     * Display a listing of documents.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Document::with(['resident', 'processedBy', 'approvedBy', 'releasedBy']);

        // Apply filters
        if ($request->has('document_type')) {
            $query->where('document_type', $request->document_type);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->has('date_from')) {
            $query->whereDate('requested_date', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('requested_date', '<=', $request->date_to);
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'requested_date');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $documents = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $documents,
            'message' => 'Documents retrieved successfully'
        ]);
    }

    /**
     * Store a newly created document.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'document_type' => 'required|in:BARANGAY_CLEARANCE,CERTIFICATE_OF_RESIDENCY,CERTIFICATE_OF_INDIGENCY,BUSINESS_PERMIT,BUILDING_PERMIT,ELECTRICAL_PERMIT,SANITARY_PERMIT,FENCING_PERMIT,EXCAVATION_PERMIT,CERTIFICATE_OF_GOOD_MORAL,FIRST_TIME_JOB_SEEKER,SOLO_PARENT_CERTIFICATE,SENIOR_CITIZEN_ID,PWD_ID,CERTIFICATE_OF_COHABITATION,DEATH_CERTIFICATE,BIRTH_CERTIFICATE_COPY,MARRIAGE_CONTRACT_COPY,OTHER',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'resident_id' => 'required|exists:residents,id',
                'applicant_name' => 'required|string|max:255',
                'applicant_address' => 'nullable|string',
                'applicant_contact' => 'nullable|string|max:20',
                'purpose' => 'required|string',
                'needed_date' => 'nullable|date|after_or_equal:today',
                'priority' => 'sometimes|in:LOW,NORMAL,HIGH,URGENT',
                'processing_fee' => 'sometimes|numeric|min:0',
                'requirements_submitted' => 'nullable|array',
                'remarks' => 'nullable|string'
            ]);

            $validated['created_by'] = auth()->id();
            
            $document = Document::create($validated);
            $document->load(['resident', 'createdBy']);

            return response()->json([
                'success' => true,
                'data' => $document,
                'message' => 'Document request created successfully'
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
                'message' => 'Failed to create document request: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified document.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $document = Document::with([
                'resident', 
                'processedBy', 
                'approvedBy', 
                'releasedBy', 
                'createdBy', 
                'updatedBy'
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $document,
                'message' => 'Document retrieved successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found'
            ], 404);
        }
    }

    /**
     * Update the specified document.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $document = Document::findOrFail($id);

            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'applicant_name' => 'sometimes|string|max:255',
                'applicant_address' => 'nullable|string',
                'applicant_contact' => 'nullable|string|max:20',
                'purpose' => 'sometimes|string',
                'needed_date' => 'nullable|date',
                'priority' => 'sometimes|in:LOW,NORMAL,HIGH,URGENT',
                'processing_fee' => 'sometimes|numeric|min:0',
                'requirements_submitted' => 'nullable|array',
                'remarks' => 'nullable|string'
            ]);

            $validated['updated_by'] = auth()->id();
            
            $document->update($validated);
            $document->load(['resident', 'processedBy', 'approvedBy']);

            return response()->json([
                'success' => true,
                'data' => $document,
                'message' => 'Document updated successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found'
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
                'message' => 'Failed to update document: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified document.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $document = Document::findOrFail($id);
            
            // Only allow deletion of pending documents
            if (!in_array($document->status, ['PENDING', 'CANCELLED'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete document that is already being processed'
                ], 422);
            }

            $document->delete();

            return response()->json([
                'success' => true,
                'message' => 'Document deleted successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete document: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get document statistics.
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_documents' => Document::count(),
                'by_status' => Document::selectRaw('status, COUNT(*) as count')
                    ->groupBy('status')
                    ->get(),
                'by_type' => Document::selectRaw('document_type, COUNT(*) as count')
                    ->groupBy('document_type')
                    ->orderBy('count', 'desc')
                    ->get(),
                'by_priority' => Document::selectRaw('priority, COUNT(*) as count')
                    ->groupBy('priority')
                    ->get(),
                'pending_count' => Document::whereIn('status', ['PENDING', 'UNDER_REVIEW'])->count(),
                'overdue_count' => Document::where('needed_date', '<', now())
                    ->whereNotIn('status', ['RELEASED', 'REJECTED', 'CANCELLED'])
                    ->count(),
                'revenue' => [
                    'total_fees' => Document::sum('processing_fee'),
                    'collected' => Document::where('payment_status', 'PAID')->sum('amount_paid'),
                    'pending' => Document::where('payment_status', 'UNPAID')->sum('processing_fee')
                ],
                'processing_times' => [
                    'average_days' => Document::whereNotNull('released_date')
                        ->selectRaw('AVG(julianday(released_date) - julianday(requested_date)) as avg_days')
                        ->value('avg_days') ?? 0
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Document statistics retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search documents.
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'query' => 'required|string|min:2',
            'per_page' => 'sometimes|integer|min:1|max:100'
        ]);

        $query = $request->get('query');
        $perPage = $request->get('per_page', 15);

        $documents = Document::with(['resident', 'processedBy'])
            ->where(function ($q) use ($query) {
                $q->where('document_number', 'LIKE', "%{$query}%")
                  ->orWhere('title', 'LIKE', "%{$query}%")
                  ->orWhere('applicant_name', 'LIKE', "%{$query}%")
                  ->orWhereHas('resident', function ($subQuery) use ($query) {
                      $subQuery->where('first_name', 'LIKE', "%{$query}%")
                               ->orWhere('last_name', 'LIKE', "%{$query}%");
                  });
            })
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $documents,
            'message' => 'Document search completed successfully'
        ]);
    }

    /**
     * Get documents by type.
     */
    public function byType(string $type): JsonResponse
    {
        $documents = Document::with(['resident', 'processedBy'])
            ->where('document_type', strtoupper($type))
            ->orderBy('requested_date', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $documents,
            'message' => "Documents of type {$type} retrieved successfully"
        ]);
    }

    /**
     * Approve a document.
     */
    public function approve(Request $request, string $id): JsonResponse
    {
        try {
            $document = Document::findOrFail($id);
            
            $request->validate([
                'expiry_date' => 'nullable|date|after:today',
                'remarks' => 'nullable|string'
            ]);

            if (!$document->canBeApproved()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Document cannot be approved. Check payment status and current status.'
                ], 422);
            }

            $expiryDate = $request->expiry_date ? Carbon::parse($request->expiry_date) : null;
            $document->approve(auth()->id(), $expiryDate);

            if ($request->remarks) {
                $document->update(['remarks' => $request->remarks]);
            }

            $document->load(['resident', 'approvedBy']);

            return response()->json([
                'success' => true,
                'data' => $document,
                'message' => 'Document approved successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve document: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reject a document.
     */
    public function reject(Request $request, string $id): JsonResponse
    {
        try {
            $document = Document::findOrFail($id);
            
            $request->validate([
                'reason' => 'required|string'
            ]);

            $document->reject(auth()->id(), $request->reason);
            $document->load(['resident']);

            return response()->json([
                'success' => true,
                'data' => $document,
                'message' => 'Document rejected successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found'
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
                'message' => 'Failed to reject document: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Release a document.
     */
    public function release(Request $request, string $id): JsonResponse
    {
        try {
            $document = Document::findOrFail($id);

            if (!$document->canBeReleased()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Document cannot be released. Check approval and payment status.'
                ], 422);
            }

            $document->release(auth()->id());
            $document->load(['resident', 'releasedBy']);

            return response()->json([
                'success' => true,
                'data' => $document,
                'message' => 'Document released successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to release document: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Track a document.
     */
    public function track(string $id): JsonResponse
    {
        try {
            $document = Document::with([
                'resident', 
                'processedBy', 
                'approvedBy', 
                'releasedBy'
            ])->findOrFail($id);

            $timeline = [
                [
                    'status' => 'PENDING',
                    'date' => $document->requested_date,
                    'completed' => true,
                    'description' => 'Document request submitted'
                ],
                [
                    'status' => 'UNDER_REVIEW',
                    'date' => $document->processedBy ? $document->updated_at : null,
                    'completed' => in_array($document->status, ['UNDER_REVIEW', 'APPROVED', 'READY_FOR_PICKUP', 'RELEASED']),
                    'description' => 'Document under review',
                    'staff' => $document->processedBy?->first_name . ' ' . $document->processedBy?->last_name
                ],
                [
                    'status' => 'APPROVED',
                    'date' => $document->approved_date,
                    'completed' => in_array($document->status, ['APPROVED', 'READY_FOR_PICKUP', 'RELEASED']),
                    'description' => 'Document approved',
                    'staff' => $document->approvedBy?->first_name . ' ' . $document->approvedBy?->last_name
                ],
                [
                    'status' => 'READY_FOR_PICKUP',
                    'date' => $document->status === 'READY_FOR_PICKUP' ? $document->updated_at : null,
                    'completed' => in_array($document->status, ['READY_FOR_PICKUP', 'RELEASED']),
                    'description' => 'Document ready for pickup'
                ],
                [
                    'status' => 'RELEASED',
                    'date' => $document->released_date,
                    'completed' => $document->status === 'RELEASED',
                    'description' => 'Document released',
                    'staff' => $document->releasedBy?->first_name . ' ' . $document->releasedBy?->last_name
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'document' => $document,
                    'timeline' => $timeline,
                    'estimated_completion' => $document->needed_date,
                    'qr_code' => $document->qr_code,
                    'verification_code' => $document->verification_code
                ],
                'message' => 'Document tracking information retrieved successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found'
            ], 404);
        }
    }

    /**
     * Generate QR code for a document.
     */
    public function generateQR(string $id): JsonResponse
    {
        try {
            $document = Document::findOrFail($id);

            if (empty($document->qr_code)) {
                $document->update([
                    'qr_code' => $document->generateQRCode()
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'qr_code' => $document->qr_code,
                    'verification_code' => $document->verification_code,
                    'document_number' => $document->document_number
                ],
                'message' => 'QR code generated successfully'
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found'
            ], 404);
        }
    }
}
