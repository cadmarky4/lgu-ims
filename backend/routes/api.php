<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ResidentController;
use App\Http\Controllers\Api\HouseholdController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ComplaintController;
use App\Http\Controllers\Api\SuggestionController;
use App\Http\Controllers\Api\BlotterCaseController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\BarangayOfficialController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReportsController;
use App\Http\Controllers\Api\FileUploadController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// TEMPORARY: Residents routes without authentication for testing
Route::prefix('residents')->group(function () {
    Route::get('/statistics', [ResidentController::class, 'statistics']);
    Route::get('/age-groups', [ResidentController::class, 'getAgeGroupStatistics']);
    Route::get('/by-purok', [ResidentController::class, 'getByPurok']);
    Route::get('/senior-citizens', [ResidentController::class, 'getSeniorCitizens']);
    Route::get('/pwd', [ResidentController::class, 'getPWD']);
    Route::get('/four-ps', [ResidentController::class, 'getFourPs']);
    Route::get('/household-heads', [ResidentController::class, 'getHouseholdHeads']);
    Route::post('/check-duplicates', [ResidentController::class, 'checkDuplicates']);
    Route::post('/{resident}/restore', [ResidentController::class, 'restore']);
});
Route::apiResource('residents', ResidentController::class);

// TEMPORARY: Households routes without authentication for testing
Route::prefix('households')->group(function () {
    Route::get('/statistics', [HouseholdController::class, 'statistics']);
    Route::get('/search', [HouseholdController::class, 'search']);
    Route::get('/by-barangay/{barangay}', [HouseholdController::class, 'byBarangay']);
    Route::get('/four-ps-beneficiaries', [HouseholdController::class, 'getFourPsBeneficiaries']);
    Route::get('/with-pwd-members', [HouseholdController::class, 'getWithPWDMembers']);
    Route::get('/with-senior-citizens', [HouseholdController::class, 'getWithSeniorCitizens']);
    Route::get('/indigent-families', [HouseholdController::class, 'getIndigentFamilies']);
    Route::post('/check-duplicates', [HouseholdController::class, 'checkDuplicates']);
    Route::patch('/{household}/members', [HouseholdController::class, 'updateMembers']);
});
Route::apiResource('households', HouseholdController::class);

// TEMPORARY: Users routes without authentication for testing
Route::prefix('users')->group(function () {
    Route::get('/statistics', [UserController::class, 'statistics']);
    Route::patch('/{user}/toggle-status', [UserController::class, 'toggleStatus']);
    Route::post('/{user}/reset-password', [UserController::class, 'resetPassword']);
    Route::get('/by-role/{role}', [UserController::class, 'byRole']);
    Route::get('/by-department/{department}', [UserController::class, 'byDepartment']);
});
Route::apiResource('users', UserController::class);

// TEMPORARY: Help Desk routes without authentication for public access
// These will be moved back under auth middleware when staff authentication is implemented

// Public Help Desk - Appointments
Route::prefix('appointments')->group(function () {
    Route::get('/statistics', [AppointmentController::class, 'statistics']);
    Route::get('/available-slots', [AppointmentController::class, 'getAvailableSlots']);
    Route::post('/{appointment}/confirm', [AppointmentController::class, 'confirm']);
    Route::post('/{appointment}/cancel', [AppointmentController::class, 'cancel']);
    Route::post('/{appointment}/complete', [AppointmentController::class, 'complete']);
    Route::post('/{appointment}/reschedule', [AppointmentController::class, 'reschedule']);
});
Route::apiResource('appointments', AppointmentController::class)->only(['index', 'store', 'show', 'update']);

// Public Help Desk - Complaints
Route::prefix('complaints')->group(function () {
    Route::get('/statistics', [ComplaintController::class, 'statistics']);
    Route::post('/{complaint}/assign', [ComplaintController::class, 'assign']);
    Route::post('/{complaint}/investigate', [ComplaintController::class, 'investigate']);
    Route::post('/{complaint}/resolve', [ComplaintController::class, 'resolve']);
    Route::post('/{complaint}/close', [ComplaintController::class, 'close']);
});
Route::apiResource('complaints', ComplaintController::class)->only(['index', 'store', 'show', 'update']);

// Public Help Desk - Suggestions
Route::prefix('suggestions')->group(function () {
    Route::get('/statistics', [SuggestionController::class, 'statistics']);
    Route::post('/{suggestion}/review', [SuggestionController::class, 'review']);
    Route::post('/{suggestion}/approve', [SuggestionController::class, 'approve']);
    Route::post('/{suggestion}/implement', [SuggestionController::class, 'implement']);
    Route::post('/{suggestion}/reject', [SuggestionController::class, 'reject']);
});
Route::apiResource('suggestions', SuggestionController::class)->only(['index', 'store', 'show', 'update']);

// Public Help Desk - Blotter Cases
Route::prefix('blotter-cases')->group(function () {
    Route::get('/statistics', [BlotterCaseController::class, 'statistics']);
    Route::post('/{blotterCase}/assign-investigator', [BlotterCaseController::class, 'assignInvestigator']);
    Route::post('/{blotterCase}/investigate', [BlotterCaseController::class, 'investigate']);
    Route::post('/{blotterCase}/mediate', [BlotterCaseController::class, 'mediate']);
    Route::post('/{blotterCase}/settle', [BlotterCaseController::class, 'settle']);
    Route::post('/{blotterCase}/close', [BlotterCaseController::class, 'closeCase']);
});
Route::apiResource('blotter-cases', BlotterCaseController::class)->only(['index', 'store', 'show', 'update']);

// Settings - System Configuration (temporarily outside auth for testing)
Route::get('settings', [SettingController::class, 'index']);
Route::put('settings', [SettingController::class, 'update']);
Route::post('settings/reset', [SettingController::class, 'reset']);

// Dashboard routes (temporarily outside auth for testing)
Route::get('dashboard/statistics', [DashboardController::class, 'statistics']);
Route::get('dashboard/demographics', [DashboardController::class, 'demographics']);
Route::get('dashboard/notifications', [DashboardController::class, 'notifications']);
Route::get('dashboard/activities', [DashboardController::class, 'activities']);
Route::get('dashboard/barangay-officials', [DashboardController::class, 'barangayOfficials']);

// Projects routes (temporarily outside auth for testing)  
Route::get('projects/test', function () {
    return response()->json(['message' => 'Projects API working']);
});
Route::get('projects/statistics', [ProjectController::class, 'statistics']);
Route::apiResource('projects', ProjectController::class);

// Reports routes (temporarily outside auth for testing)
Route::prefix('reports')->group(function () {
    Route::get('/statistics-overview', [ReportsController::class, 'getStatisticsOverview']);
    Route::get('/age-group-distribution', [ReportsController::class, 'getAgeGroupDistribution']);
    Route::get('/special-population-registry', [ReportsController::class, 'getSpecialPopulationRegistry']);
    Route::get('/monthly-revenue', [ReportsController::class, 'getMonthlyRevenue']);
    Route::get('/population-distribution-by-purok', [ReportsController::class, 'getPopulationDistributionByPurok']);
    Route::get('/document-types-issued', [ReportsController::class, 'getDocumentTypesIssued']);
    Route::get('/most-requested-services', [ReportsController::class, 'getMostRequestedServices']);
    Route::get('/filter-options', [ReportsController::class, 'getFilterOptions']);
});

Route::prefix('documents')->group(function () {
    Route::get('/', [DocumentController::class, 'index']);
    Route::post('/', [DocumentController::class, 'store']);
    Route::get('/statistics', [DocumentController::class, 'statistics']);
    Route::get('/overdue', [DocumentController::class, 'overdue']);
    Route::get('/pending', [DocumentController::class, 'pending']);
    Route::get('/{id}', [DocumentController::class, 'show']);
    Route::put('/{id}', [DocumentController::class, 'update']);
    Route::delete('/{id}', [DocumentController::class, 'destroy']);
    Route::get('/{id}/tracking', [DocumentController::class, 'tracking']);
    Route::get('/{id}/history', [DocumentController::class, 'history']);
    Route::get('/{id}/pdf', [DocumentController::class, 'pdf']);
    Route::post('/{id}/process', [DocumentController::class, 'process']);
    Route::post('/{id}/reject', [DocumentController::class, 'reject']);
    Route::post('/{id}/release', [DocumentController::class, 'release']);
    Route::post('/{id}/cancel', [DocumentController::class, 'cancel']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });

    // NOTE: Households routes are temporarily moved outside auth middleware for testing
    // They will be moved back here when authentication is properly implemented in frontend

    // Documents - Specific routes BEFORE apiResource
    Route::prefix('documents')->group(function () {
        Route::get('/', [DocumentController::class, 'index']);
        Route::post('/', [DocumentController::class, 'store']);
        Route::get('/statistics', [DocumentController::class, 'statistics']);
        Route::get('/overdue', [DocumentController::class, 'overdue']);
        Route::get('/pending', [DocumentController::class, 'pending']);
        Route::get('/{id}', [DocumentController::class, 'show']);
        Route::put('/{id}', [DocumentController::class, 'update']);
        Route::delete('/{id}', [DocumentController::class, 'destroy']);
        Route::get('/{id}/tracking', [DocumentController::class, 'tracking']);
        Route::get('/{id}/history', [DocumentController::class, 'history']);
        Route::get('/{id}/pdf', [DocumentController::class, 'pdf']);
        Route::post('/{id}/process', [DocumentController::class, 'process']);
        Route::post('/{id}/reject', [DocumentController::class, 'reject']);
        Route::post('/{id}/release', [DocumentController::class, 'release']);
        Route::post('/{id}/cancel', [DocumentController::class, 'cancel']);
    });
    Route::apiResource('documents', DocumentController::class);
    
    // Help Desk - Complaints - Specific routes BEFORE apiResource
    Route::prefix('complaints')->group(function () {
        Route::get('/statistics', [ComplaintController::class, 'statistics']);
        Route::post('/{complaint}/acknowledge', [ComplaintController::class, 'acknowledge']);
        Route::post('/{complaint}/assign', [ComplaintController::class, 'assign']);
        Route::post('/{complaint}/resolve', [ComplaintController::class, 'resolve']);
        Route::post('/{complaint}/feedback', [ComplaintController::class, 'submitFeedback']);
    });
    Route::apiResource('complaints', ComplaintController::class);

    // Help Desk - Suggestions - Specific routes BEFORE apiResource
    Route::prefix('suggestions')->group(function () {
        Route::get('/statistics', [SuggestionController::class, 'statistics']);
        Route::post('/{suggestion}/review', [SuggestionController::class, 'review']);
        Route::post('/{suggestion}/vote', [SuggestionController::class, 'vote']);
        Route::patch('/{suggestion}/implementation', [SuggestionController::class, 'updateImplementation']);
    });
    Route::apiResource('suggestions', SuggestionController::class);

    // Help Desk - Blotter Cases - Specific routes BEFORE apiResource
    Route::prefix('blotter-cases')->group(function () {
        Route::get('/statistics', [BlotterCaseController::class, 'statistics']);
        Route::post('/{blotterCase}/assign-investigator', [BlotterCaseController::class, 'assignInvestigator']);
        Route::post('/{blotterCase}/schedule-mediation', [BlotterCaseController::class, 'scheduleMediation']);
        Route::post('/{blotterCase}/complete-mediation', [BlotterCaseController::class, 'completeMediation']);
        Route::patch('/{blotterCase}/compliance', [BlotterCaseController::class, 'updateCompliance']);
        Route::post('/{blotterCase}/close', [BlotterCaseController::class, 'closeCase']);
    });
    Route::apiResource('blotter-cases', BlotterCaseController::class);

    // Help Desk - Appointments - Specific routes BEFORE apiResource
    Route::prefix('appointments')->group(function () {
        Route::get('/statistics', [AppointmentController::class, 'statistics']);
        Route::get('/available-slots', [AppointmentController::class, 'getAvailableSlots']);
        Route::post('/{appointment}/confirm', [AppointmentController::class, 'confirm']);
        Route::post('/{appointment}/cancel', [AppointmentController::class, 'cancel']);
        Route::post('/{appointment}/complete', [AppointmentController::class, 'complete']);
        Route::post('/{appointment}/reschedule', [AppointmentController::class, 'reschedule']);
        Route::post('/{appointment}/follow-up', [AppointmentController::class, 'addFollowUp']);
    });
    Route::apiResource('appointments', AppointmentController::class);

    // Barangay Officials - Specific routes BEFORE apiResource
    Route::prefix('barangay-officials')->group(function () {
        Route::get('/statistics', [BarangayOfficialController::class, 'statistics']);
        Route::get('/active', [BarangayOfficialController::class, 'getActiveOfficials']);
        Route::get('/position/{position}', [BarangayOfficialController::class, 'getByPosition']);
        Route::get('/committee/{committee}', [BarangayOfficialController::class, 'getByCommittee']);
        Route::get('/export', [BarangayOfficialController::class, 'export']);
        Route::patch('/{barangayOfficial}/performance', [BarangayOfficialController::class, 'updatePerformance']);
        Route::post('/{barangayOfficial}/archive', [BarangayOfficialController::class, 'archive']);
        Route::post('/{barangayOfficial}/reactivate', [BaramgayOfficialController::class, 'reactivate']);
    });
    Route::apiResource('barangay-officials', BarangayOfficialController::class);

    // File Upload route
    Route::post('/upload', [FileUploadController::class, 'upload']);

    // Temporary test route
    Route::get('/test-appointment-model', function () {
        try {
            $appointment = new App\Models\Appointment();
            return response()->json([
                'success' => true,
                'message' => 'Model created successfully',
                'fillable' => $appointment->getFillable(),
                'casts' => $appointment->getCasts()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Model creation failed',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    });
});
