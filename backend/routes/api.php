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
        Route::get('/statistics', [DocumentController::class, 'statistics']);
        Route::get('/search', [DocumentController::class, 'search']);
        Route::get('/by-type/{type}', [DocumentController::class, 'byType']);
        Route::post('/{document}/approve', [DocumentController::class, 'approve']);
        Route::post('/{document}/reject', [DocumentController::class, 'reject']);
        Route::post('/{document}/release', [DocumentController::class, 'release']);
        Route::get('/{document}/track', [DocumentController::class, 'track']);
        Route::get('/{document}/generate-qr', [DocumentController::class, 'generateQR']);
    });
    Route::apiResource('documents', DocumentController::class);

    // Projects - Specific routes BEFORE apiResource
    Route::prefix('projects')->group(function () {
        Route::get('/statistics', [ProjectController::class, 'statistics']);
        Route::post('/{project}/approve', [ProjectController::class, 'approve']);
        Route::post('/{project}/start', [ProjectController::class, 'start']);
        Route::post('/{project}/complete', [ProjectController::class, 'complete']);
        Route::patch('/{project}/progress', [ProjectController::class, 'updateProgress']);
    });
    Route::apiResource('projects', ProjectController::class);
    
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
    Route::apiResource('barangay-officials', BarangayOfficialController::class);// General utility routes
    Route::get('/dashboard/statistics', function () {
        return response()->json([
            'residents' => \App\Models\Resident::count(),
            'households' => \App\Models\Household::count(),
            'documents' => \App\Models\Document::count(),
            'pending_documents' => \App\Models\Document::where('status', 'PENDING')->count(),
            'projects' => \App\Models\Project::count(),
            'active_projects' => \App\Models\Project::where('status', 'IN_PROGRESS')->count(),
            'complaints' => \App\Models\Complaint::count(),
            'pending_complaints' => \App\Models\Complaint::where('status', 'PENDING')->count(),
            'total_budget' => \App\Models\Project::sum('total_budget'),
            'utilized_budget' => \App\Models\Project::sum('utilized_budget'),
        ]);
    });
});
