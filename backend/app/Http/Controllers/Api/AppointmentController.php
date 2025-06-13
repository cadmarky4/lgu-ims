<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Appointment::with(['resident', 'assignedOfficial']);

        // Apply filters
        if ($request->has('appointment_type')) {
            $query->where('appointment_type', $request->appointment_type);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('date_from')) {
            $query->whereDate('appointment_date', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('appointment_date', '<=', $request->date_to);
        }

        if ($request->has('assigned_official_id')) {
            $query->where('assigned_official_id', $request->assigned_official_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('applicant_name', 'like', "%{$search}%")
                  ->orWhere('applicant_contact', 'like', "%{$search}%")
                  ->orWhere('purpose', 'like', "%{$search}%");
            });
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'appointment_date');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $appointments = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $appointments,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'resident_id' => 'nullable|exists:residents,id',
            'applicant_name' => 'required|string|max:255',
            'applicant_contact' => 'required|string|max:255',
            'applicant_email' => 'nullable|email|max:255',
            'applicant_address' => 'nullable|string',
            'appointment_type' => 'required|in:CONSULTATION,DOCUMENT_REQUEST,COMPLAINT_FILING,BUSINESS_PERMIT,CERTIFICATION_REQUEST,MEETING,OTHER',
            'purpose' => 'required|string',
            'appointment_date' => 'required|date|after:today',
            'appointment_time' => 'required|string',
            'assigned_official_id' => 'nullable|exists:users,id',
            'priority_level' => 'nullable|in:LOW,MEDIUM,HIGH,URGENT',
            'special_requirements' => 'nullable|string',
            'estimated_duration' => 'nullable|integer|min:15|max:480', // 15 mins to 8 hours
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check for scheduling conflicts
        if ($this->hasSchedulingConflict($request->appointment_date, $request->appointment_time, $request->assigned_official_id)) {
            return response()->json([
                'success' => false,
                'message' => 'Scheduling conflict detected for the selected time slot'
            ], 422);
        }

        $appointment = Appointment::create(array_merge($validator->validated(), [
            'status' => 'SCHEDULED',
            'scheduled_by' => auth()->id(),
        ]));

        $appointment->load(['resident', 'assignedOfficial']);

        return response()->json([
            'success' => true,
            'message' => 'Appointment scheduled successfully',
            'data' => $appointment
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Appointment $appointment): JsonResponse
    {
        $appointment->load(['resident', 'assignedOfficial', 'followUps']);

        return response()->json([
            'success' => true,
            'data' => $appointment
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Appointment $appointment): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'applicant_name' => 'sometimes|string|max:255',
            'applicant_contact' => 'sometimes|string|max:255',
            'applicant_email' => 'nullable|email|max:255',
            'applicant_address' => 'nullable|string',
            'appointment_type' => 'sometimes|in:CONSULTATION,DOCUMENT_REQUEST,COMPLAINT_FILING,BUSINESS_PERMIT,CERTIFICATION_REQUEST,MEETING,OTHER',
            'purpose' => 'sometimes|string',
            'appointment_date' => 'sometimes|date',
            'appointment_time' => 'sometimes|string',
            'assigned_official_id' => 'nullable|exists:users,id',
            'priority_level' => 'nullable|in:LOW,MEDIUM,HIGH,URGENT',
            'special_requirements' => 'nullable|string',
            'estimated_duration' => 'nullable|integer|min:15|max:480',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check for scheduling conflicts if date/time is being updated
        if (($request->has('appointment_date') || $request->has('appointment_time') || $request->has('assigned_official_id')) &&
            $this->hasSchedulingConflict(
                $request->get('appointment_date', $appointment->appointment_date),
                $request->get('appointment_time', $appointment->appointment_time),
                $request->get('assigned_official_id', $appointment->assigned_official_id),
                $appointment->id
            )) {
            return response()->json([
                'success' => false,
                'message' => 'Scheduling conflict detected for the selected time slot'
            ], 422);
        }

        $appointment->update($validator->validated());
        $appointment->load(['resident', 'assignedOfficial']);

        return response()->json([
            'success' => true,
            'message' => 'Appointment updated successfully',
            'data' => $appointment
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Appointment $appointment): JsonResponse
    {
        $appointment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Appointment deleted successfully'
        ]);
    }

    /**
     * Confirm appointment
     */
    public function confirm(Request $request, Appointment $appointment): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'confirmation_notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $appointment->update([
            'status' => 'CONFIRMED',
            'confirmation_notes' => $request->confirmation_notes,
            'confirmed_at' => now(),
            'confirmed_by' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Appointment confirmed successfully',
            'data' => $appointment->fresh(['resident', 'assignedOfficial'])
        ]);
    }

    /**
     * Cancel appointment
     */
    public function cancel(Request $request, Appointment $appointment): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'cancellation_reason' => 'required|string',
            'cancelled_by_client' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $appointment->update([
            'status' => 'CANCELLED',
            'cancellation_reason' => $request->cancellation_reason,
            'cancelled_by_client' => $request->get('cancelled_by_client', false),
            'cancelled_at' => now(),
            'cancelled_by' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Appointment cancelled successfully',
            'data' => $appointment->fresh(['resident', 'assignedOfficial'])
        ]);
    }

    /**
     * Complete appointment
     */
    public function complete(Request $request, Appointment $appointment): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'outcome_summary' => 'required|string',
            'client_satisfaction' => 'nullable|integer|min:1|max:5',
            'follow_up_required' => 'nullable|boolean',
            'follow_up_notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $appointment->update([
            'status' => 'COMPLETED',
            'outcome_summary' => $request->outcome_summary,
            'client_satisfaction' => $request->client_satisfaction,
            'follow_up_required' => $request->get('follow_up_required', false),
            'follow_up_notes' => $request->follow_up_notes,
            'completed_at' => now(),
            'completed_by' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Appointment completed successfully',
            'data' => $appointment->fresh(['resident', 'assignedOfficial'])
        ]);
    }

    /**
     * Reschedule appointment
     */
    public function reschedule(Request $request, Appointment $appointment): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'new_appointment_date' => 'required|date|after:today',
            'new_appointment_time' => 'required|string',
            'reschedule_reason' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check for scheduling conflicts
        if ($this->hasSchedulingConflict($request->new_appointment_date, $request->new_appointment_time, $appointment->assigned_official_id, $appointment->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Scheduling conflict detected for the new time slot'
            ], 422);
        }

        $appointment->update([
            'appointment_date' => $request->new_appointment_date,
            'appointment_time' => $request->new_appointment_time,
            'reschedule_reason' => $request->reschedule_reason,
            'reschedule_count' => $appointment->reschedule_count + 1,
            'rescheduled_at' => now(),
            'rescheduled_by' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Appointment rescheduled successfully',
            'data' => $appointment->fresh(['resident', 'assignedOfficial'])
        ]);
    }

    /**
     * Add follow-up
     */
    public function addFollowUp(Request $request, Appointment $appointment): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'follow_up_date' => 'required|date',
            'follow_up_type' => 'required|in:PHONE_CALL,EMAIL,IN_PERSON,DOCUMENT_SUBMISSION',
            'follow_up_notes' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $appointment->followUps()->create(array_merge($validator->validated(), [
            'created_by' => auth()->id(),
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Follow-up added successfully',
            'data' => $appointment->fresh(['resident', 'assignedOfficial', 'followUps'])
        ]);
    }

    /**
     * Get available time slots
     */
    public function getAvailableSlots(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date|after:today',
            'official_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $date = $request->date;
        $officialId = $request->official_id;

        // Define working hours (8 AM to 5 PM)
        $workingHours = [
            '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
        ];

        // Get booked slots
        $bookedQuery = Appointment::whereDate('appointment_date', $date)
            ->whereIn('status', ['SCHEDULED', 'CONFIRMED']);

        if ($officialId) {
            $bookedQuery->where('assigned_official_id', $officialId);
        }

        $bookedSlots = $bookedQuery->pluck('appointment_time')->toArray();

        // Filter available slots
        $availableSlots = array_diff($workingHours, $bookedSlots);

        return response()->json([
            'success' => true,
            'data' => [
                'date' => $date,
                'available_slots' => array_values($availableSlots),
                'booked_slots' => $bookedSlots,
            ]
        ]);
    }

    /**
     * Get appointment statistics
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total_appointments' => Appointment::count(),
            'scheduled_appointments' => Appointment::where('status', 'SCHEDULED')->count(),
            'confirmed_appointments' => Appointment::where('status', 'CONFIRMED')->count(),
            'completed_appointments' => Appointment::where('status', 'COMPLETED')->count(),
            'cancelled_appointments' => Appointment::where('status', 'CANCELLED')->count(),
            'by_appointment_type' => Appointment::selectRaw('appointment_type, COUNT(*) as count')
                ->groupBy('appointment_type')
                ->pluck('count', 'appointment_type'),
            'by_status' => Appointment::selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status'),
            'average_satisfaction' => Appointment::whereNotNull('client_satisfaction')
                ->avg('client_satisfaction'),
            'completion_rate' => Appointment::where('status', 'COMPLETED')->count() / max(Appointment::count(), 1) * 100,
            'cancellation_rate' => Appointment::where('status', 'CANCELLED')->count() / max(Appointment::count(), 1) * 100,
            'today_appointments' => Appointment::whereDate('appointment_date', today())->count(),
            'this_week_appointments' => Appointment::whereBetween('appointment_date', [
                now()->startOfWeek(),
                now()->endOfWeek()
            ])->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Check for scheduling conflicts
     */
    private function hasSchedulingConflict(string $date, string $time, ?int $officialId, ?int $excludeAppointmentId = null): bool
    {
        if (!$officialId) {
            return false;
        }

        $query = Appointment::where('appointment_date', $date)
            ->where('appointment_time', $time)
            ->where('assigned_official_id', $officialId)
            ->whereIn('status', ['SCHEDULED', 'CONFIRMED']);

        if ($excludeAppointmentId) {
            $query->where('id', '!=', $excludeAppointmentId);
        }

        return $query->exists();
    }
}
