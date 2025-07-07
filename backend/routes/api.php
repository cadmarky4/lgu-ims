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
use App\Http\Controllers\Api\BlotterController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\BarangayOfficialController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReportsController;
use App\Http\Controllers\Api\FileUploadController;
use App\Http\Controllers\Api\TicketController;

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
Route::prefix('residents')->name('residents.')->group(function () {
    // Statistics endpoints
    Route::get('/statistics', [ResidentController::class, 'statistics'])->name('statistics');
    Route::get('/age-groups', [ResidentController::class, 'ageGroups'])->name('age-groups');

    // Special list endpoints (matching frontend service)
    Route::get('/senior-citizens', [ResidentController::class, 'seniorCitizens'])->name('senior-citizens');
    Route::get('/pwd', [ResidentController::class, 'pwd'])->name('pwd');
    Route::get('/four-ps', [ResidentController::class, 'fourPs'])->name('four-ps');
    Route::get('/household-heads', [ResidentController::class, 'householdHeads'])->name('household-heads');
    Route::get('/indigenous', [ResidentController::class, 'indigenous'])->name('indigenous');

    // Utility endpoints
    Route::post('/check-duplicates', [ResidentController::class, 'checkDuplicates'])->name('check-duplicates');
    Route::put('/{resident}/restore', [ResidentController::class, 'restore'])->name('restore');

    // Photo upload
    Route::post('/{resident}/photo', [ResidentController::class, 'uploadPhoto'])->name('upload-photo');


    // Main CRUD operations
    Route::get('/', [ResidentController::class, 'index'])->name('index');
    Route::post('/', [ResidentController::class, 'store'])->name('store');
    Route::get('/{resident}', [ResidentController::class, 'show'])->name('show');
    Route::put('/{resident}', [ResidentController::class, 'update'])->name('update');
    Route::delete('/{resident}', [ResidentController::class, 'destroy'])->name('destroy');


});

/*
|--------------------------------------------------------------------------
| Household API Routes
|--------------------------------------------------------------------------
|
| Routes for household management that align with frontend service expectations
|
*/

Route::prefix('households')->name('households.')->group(function () {
    Route::get('/statistics', [HouseholdController::class, 'statistics'])->name('statistics');

    // Special list endpoints (matching frontend service)
    Route::get('/four-ps', [HouseholdController::class, 'fourPs'])->name('four-ps');
    Route::get('/with-senior-citizens', [HouseholdController::class, 'withSeniorCitizens'])->name('with-senior-citizens');
    Route::get('/with-pwd', [HouseholdController::class, 'withPwd'])->name('with-pwd');
    Route::get('/by-type', [HouseholdController::class, 'byType'])->name('by-type');
    Route::get('/by-ownership', [HouseholdController::class, 'byOwnership'])->name('by-ownership');

    // Utility endpoints
    Route::post('/check-duplicates', [HouseholdController::class, 'checkDuplicates'])->name('check-duplicates');

    // Member management endpoints
    Route::put('/{household}/members', [HouseholdController::class, 'updateMembers'])->name('update-members');
    Route::post('/{household}/members', [HouseholdController::class, 'addMember'])->name('add-member');
    Route::delete('/{household}/members', [HouseholdController::class, 'removeMember'])->name('remove-member');


    // Main CRUD operations
    Route::get('/', [HouseholdController::class, 'index'])->name('index');
    Route::post('/', [HouseholdController::class, 'store'])->name('store');
    Route::get('/{household}', [HouseholdController::class, 'show'])->name('show');
    Route::put('/{household}', [HouseholdController::class, 'update'])->name('update');
    Route::delete('/{household}', [HouseholdController::class, 'destroy'])->name('destroy');

    // Statistics endpoint

});

// TEMPORARY: Users routes without authentication for testing
Route::middleware(['auth:sanctum'])->prefix('users')->name('users.')->group(function () {

    // Core CRUD
    Route::get('/', [UserController::class, 'index'])->name('index');
    Route::post('/', [UserController::class, 'store'])->name('store');
    Route::get('/{id}', [UserController::class, 'show'])->name('show');
    Route::put('/{id}', [UserController::class, 'update'])->name('update');
    Route::delete('/{id}', [UserController::class, 'destroy'])->name('destroy');

    // Current User
    Route::prefix('me')->name('me.')->group(function () {
        Route::get('/', [UserController::class, 'me'])->name('show');
        Route::put('/', [UserController::class, 'updateMe'])->name('update');
        Route::post('/change-password', [UserController::class, 'changeMyPassword'])->name('change-password');
    });

    // Password Management
    Route::prefix('{id}')->group(function () {
        Route::post('/change-password', [UserController::class, 'changePassword'])->name('change-password');
        Route::post('/reset-password', [UserController::class, 'resetPassword'])->name('reset-password');
    });

    // Status Management
    Route::put('/{id}/status', [UserController::class, 'changeStatus'])->name('change-status');

    // Verification & Communication
    Route::prefix('{id}')->group(function () {
        Route::post('/verify', [UserController::class, 'verify'])->name('verify');
        Route::post('/resend-verification', [UserController::class, 'resendVerification'])->name('resend-verification');
        Route::post('/send-credentials', [UserController::class, 'sendCredentials'])->name('send-credentials');
    });

    // Validation
    Route::prefix('check')->name('check.')->group(function () {
        Route::get('/username', [UserController::class, 'checkUsername'])->name('username');
        Route::get('/email', [UserController::class, 'checkEmail'])->name('email');
    });

    // Queries
    Route::prefix('by')->name('by.')->group(function () {
        Route::get('/role/{role}', [UserController::class, 'byRole'])->name('role');
        Route::get('/department/{department}', [UserController::class, 'byDepartment'])->name('department');
    });

    // Security & Monitoring
    Route::prefix('{id}')->group(function () {
        Route::get('/activity', [UserController::class, 'activity'])->name('activity');
        Route::prefix('sessions')->name('sessions.')->group(function () {
            Route::get('/', [UserController::class, 'sessions'])->name('index');
            Route::delete('/{sessionId}', [UserController::class, 'terminateSession'])->name('terminate');
            Route::delete('/', [UserController::class, 'terminateAllSessions'])->name('terminate-all');
        });
    });

    // Bulk & Import/Export
    Route::post('/bulk-action', [UserController::class, 'bulkAction'])->name('bulk-action');
    Route::get('/export', [UserController::class, 'export'])->name('export');
    Route::post('/import', [UserController::class, 'import'])->name('import');

    // Statistics
    Route::get('/statistics', [UserController::class, 'statistics'])->name('statistics');
});
Route::apiResource('users', UserController::class);

// TEMPORARY: Barangay Officials routes without authentication for testing
Route::prefix('barangay-officials')->group(function () {
    Route::get('/statistics', [BarangayOfficialController::class, 'statistics']);
    Route::get('/active', [BarangayOfficialController::class, 'getActiveOfficials']);
    Route::get('/position/{position}', [BarangayOfficialController::class, 'getByPosition']);
    Route::get('/committee/{committee}', [BarangayOfficialController::class, 'getByCommittee']);
    Route::get('/export', [BarangayOfficialController::class, 'export']);
    Route::post('/check-duplicate', [BarangayOfficialController::class, 'checkDuplicate']);
    Route::patch('/{barangayOfficial}/performance', [BarangayOfficialController::class, 'updatePerformance']);
    Route::post('/{barangayOfficial}/archive', [BarangayOfficialController::class, 'archive']);
    Route::post('/{barangayOfficial}/reactivate', [BarangayOfficialController::class, 'reactivate']);
});
Route::apiResource('barangay-officials', BarangayOfficialController::class);

// TEMPORARY: Help Desk routes without authentication for public access
// These will be moved back under auth middleware when staff authentication is implemented

// Help Desk Routes
Route::prefix('help-desk')->group(function () {
    Route::get('/', [TicketController::class, 'index']);
    Route::get('/statistics', [TicketController::class, 'statistics']);
    Route::delete('/{id}', [TicketController::class, 'destroy']);
});

// Public Help Desk - Appointments
Route::prefix('appointments')->group(function () {
    // View specific appointment
    Route::get('/view/{id}', [AppointmentController::class, 'view']);

    // Create new appointment
    Route::post('/', [AppointmentController::class, 'store']);

    // Update appointment
    Route::put('/{id}', [AppointmentController::class, 'update']);

    // Check schedule availability
    Route::get('/check-vacancy/{schedule}', [AppointmentController::class, 'checkScheduleVacancy']);
});
// Route::apiResource('appointments', AppointmentController::class)->only(['index', 'store', 'show', 'update']);

Route::prefix('blotter')->group(function () {
    Route::get('/view/{id}', [BlotterController::class, 'view']);
    Route::post('/', [BlotterController::class, 'store']);
    Route::put('/{id}', [BlotterController::class, 'update']);
    Route::post('/{id}/photo', [BlotterController::class, 'uploadPhoto']);
});
// Public Help Desk - Blotter Cases

// Public Help Desk - Complaints
Route::prefix('complaint')->group(function () {
    Route::get('/view/{id}', [ComplaintController::class, 'view']);
    Route::post('/', [ComplaintController::class, 'store']);
    Route::put('/{id}', [ComplaintController::class, 'update']);
});
// Route::apiResource('complaints', ComplaintController::class)->only(['index', 'store', 'show', 'update']);

// Public Help Desk - Suggestions
Route::prefix('suggestion')->group(function () {
    Route::get('/view/{id}', [SuggestionController::class, 'view']);
    Route::post('/', [SuggestionController::class, 'store']);
    Route::put('/{id}', [SuggestionController::class, 'update']);
});
// Route::apiResource('suggestions', SuggestionController::class)->only(['index', 'store', 'show', 'update']);

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
    // Route::prefix('complaints')->group(function () {
    //     Route::get('/statistics', [ComplaintController::class, 'statistics']);
    //     Route::post('/{complaint}/acknowledge', [ComplaintController::class, 'acknowledge']);
    //     Route::post('/{complaint}/assign', [ComplaintController::class, 'assign']);
    //     Route::post('/{complaint}/resolve', [ComplaintController::class, 'resolve']);
    //     Route::post('/{complaint}/feedback', [ComplaintController::class, 'submitFeedback']);
    // });
    // Route::apiResource('complaints', ComplaintController::class);

    // Help Desk - Suggestions - Specific routes BEFORE apiResource
    // Route::prefix('suggestions')->group(function () {
    //     Route::get('/statistics', [SuggestionController::class, 'statistics']);
    //     Route::post('/{suggestion}/review', [SuggestionController::class, 'review']);
    //     Route::post('/{suggestion}/vote', [SuggestionController::class, 'vote']);
    //     Route::patch('/{suggestion}/implementation', [SuggestionController::class, 'updateImplementation']);
    // });
    // Route::apiResource('suggestions', SuggestionController::class);

    // Help Desk - Blotter Cases - Specific routes BEFORE apiResource
    // Route::prefix('blotter-cases')->group(function () {
    //     Route::get('/statistics', [BlotterCaseController::class, 'statistics']);
    //     Route::post('/{blotterCase}/assign-investigator', [BlotterCaseController::class, 'assignInvestigator']);
    //     Route::post('/{blotterCase}/schedule-mediation', [BlotterCaseController::class, 'scheduleMediation']);
    //     Route::post('/{blotterCase}/complete-mediation', [BlotterCaseController::class, 'completeMediation']);
    //     Route::patch('/{blotterCase}/compliance', [BlotterCaseController::class, 'updateCompliance']);
    //     Route::post('/{blotterCase}/close', [BlotterCaseController::class, 'closeCase']);
    // });
    // Route::apiResource('blotter-cases', BlotterCaseController::class);

    // Help Desk - Appointments - Specific routes BEFORE apiResource
    // Route::prefix('appointments')->group(function () {
    //     Route::get('/statistics', [AppointmentController::class, 'statistics']);
    //     Route::get('/available-slots', [AppointmentController::class, 'getAvailableSlots']);
    //     Route::post('/{appointment}/confirm', [AppointmentController::class, 'confirm']);
    //     Route::post('/{appointment}/cancel', [AppointmentController::class, 'cancel']);
    //     Route::post('/{appointment}/complete', [AppointmentController::class, 'complete']);
    //     Route::post('/{appointment}/reschedule', [AppointmentController::class, 'reschedule']);
    //     Route::post('/{appointment}/follow-up', [AppointmentController::class, 'addFollowUp']);
    // });
    // Route::apiResource('appointments', AppointmentController::class);

    // Barangay Officials - Specific routes BEFORE apiResource
    Route::prefix('barangay-officials')->group(function () {
        Route::get('/statistics', [BarangayOfficialController::class, 'statistics']);
        Route::get('/active', [BarangayOfficialController::class, 'getActiveOfficials']);
        Route::get('/position/{position}', [BarangayOfficialController::class, 'getByPosition']);
        Route::get('/committee/{committee}', [BarangayOfficialController::class, 'getByCommittee']);
        Route::get('/export', [BarangayOfficialController::class, 'export']);
        Route::patch('/{barangayOfficial}/performance', [BarangayOfficialController::class, 'updatePerformance']);
        Route::post('/{barangayOfficial}/archive', [BarangayOfficialController::class, 'archive']);
        Route::post('/{barangayOfficial}/reactivate', [BarangayOfficialController::class, 'reactivate']);
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