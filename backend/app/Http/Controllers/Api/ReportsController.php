<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use App\Models\Household;
use App\Models\BarangayOfficial;
use App\Models\BlotterCase;
use App\Models\Document;
use App\Models\Project;
use App\Models\Appointment;
use App\Models\Complaint;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportsController extends Controller
{
    /**
     * Get statistics overview data
     */
    public function getStatisticsOverview(Request $request): JsonResponse
    {
        try {
            $year = $request->get('year');
            $quarter = $request->get('quarter');
            $purok = $request->get('purok');

            // Build date filters
            $dateFilter = $this->buildDateFilter($year, $quarter);

            $stats = [
                'totalResidents' => $this->getTotalResidents($purok, $dateFilter),
                'totalHouseholds' => $this->getTotalHouseholds($purok, $dateFilter),
                'activeBarangayOfficials' => $this->getActiveBarangayOfficials($dateFilter),
                'totalBlotterCases' => $this->getTotalBlotterCases($purok, $dateFilter),
                'totalIssuedClearance' => $this->getTotalIssuedDocuments($dateFilter),
                'ongoingProjects' => $this->getOngoingProjects($dateFilter),
            ];

            return response()->json([
                'message' => 'Statistics overview retrieved successfully',
                'data' => $stats,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve statistics overview',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get age group distribution data
     */
    public function getAgeGroupDistribution(Request $request): JsonResponse
    {
        try {
            $purok = $request->get('purok');
            
            $query = Resident::query();
            
            if ($purok && $purok !== 'All') {
                $query->where('purok', $purok);
            }

            $residents = $query->whereNotNull('birth_date')->get();
            $totalResidents = $residents->count();

            if ($totalResidents === 0) {
                return response()->json([
                    'message' => 'Age group distribution retrieved successfully',
                    'data' => [],
                ]);
            }

            $ageGroups = [
                'Children (0-17)' => 0,
                'Adults (18-59)' => 0,
                'Senior Citizens (60+)' => 0,
            ];

            foreach ($residents as $resident) {
                $age = Carbon::parse($resident->birth_date)->age;
                
                if ($age <= 17) {
                    $ageGroups['Children (0-17)']++;
                } elseif ($age <= 59) {
                    $ageGroups['Adults (18-59)']++;
                } else {
                    $ageGroups['Senior Citizens (60+)']++;
                }
            }

            $data = [];
            foreach ($ageGroups as $name => $count) {
                $data[] = [
                    'name' => $name,
                    'percentage' => round(($count / $totalResidents) * 100),
                ];
            }

            return response()->json([
                'message' => 'Age group distribution retrieved successfully',
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve age group distribution',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get special population registry data
     */
    public function getSpecialPopulationRegistry(Request $request): JsonResponse
    {
        try {
            $purok = $request->get('purok');
            
            $query = Resident::query();
            
            if ($purok && $purok !== 'All') {
                $query->where('purok', $purok);
            }

            $totalResidents = $query->count();

            if ($totalResidents === 0) {
                return response()->json([
                    'message' => 'Special population registry retrieved successfully',
                    'data' => [],
                ]);
            }

            $specialPopulation = [
                'Senior Citizens' => $query->where('senior_citizen', 'Yes')->count(),
                'PWD' => $query->where('pwd_status', 'PWD')->count(),
                'Solo Parents' => $query->where('civil_status', 'Single')->where('is_household_head', true)->count(),
                '4Ps Beneficiaries' => $query->where('four_ps_beneficiary', true)->count(),
            ];

            $data = [];
            foreach ($specialPopulation as $name => $count) {
                $data[] = [
                    'name' => $name,
                    'percentage' => $totalResidents > 0 ? round(($count / $totalResidents) * 100) : 0,
                ];
            }

            return response()->json([
                'message' => 'Special population registry retrieved successfully',
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve special population registry',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get monthly revenue collection data
     */
    public function getMonthlyRevenue(Request $request): JsonResponse
    {
        try {
            $year = $request->get('year', date('Y'));
            
            $months = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];

            $data = [];
            for ($month = 1; $month <= 12; $month++) {
                // Calculate revenue from documents issued (assuming there's a fee structure)
                $revenue = Document::whereYear('created_at', $year)
                    ->whereMonth('created_at', $month)
                    ->count() * 100; // Assuming average fee of 100 pesos per document

                $data[] = [
                    'timeLabel' => $months[$month - 1],
                    'value' => $revenue,
                ];
            }

            return response()->json([
                'message' => 'Monthly revenue data retrieved successfully',
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve monthly revenue data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get population distribution by purok/sitio
     */
    public function getPopulationDistributionByPurok(Request $request): JsonResponse
    {
        try {
            $year = $request->get('year');
            $dateFilter = $this->buildDateFilter($year, null);

            $query = Resident::query();
            
            if ($dateFilter) {
                $query->whereYear('created_at', '<=', $year);
            }

            $purokData = $query->select('purok', DB::raw('count(*) as total'))
                ->whereNotNull('purok')
                ->groupBy('purok')
                ->orderBy('purok')
                ->get();

            $data = $purokData->map(function ($item) {
                return [
                    'label' => $item->purok,
                    'value' => $item->total,
                ];
            })->toArray();

            return response()->json([
                'message' => 'Population distribution by purok retrieved successfully',
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve population distribution by purok',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get document types issued data
     */
    public function getDocumentTypesIssued(Request $request): JsonResponse
    {
        try {
            $year = $request->get('year');
            $quarter = $request->get('quarter');
            $dateFilter = $this->buildDateFilter($year, $quarter);

            $query = Document::query();
            
            if ($dateFilter) {
                if (isset($dateFilter['start']) && isset($dateFilter['end'])) {
                    $query->whereBetween('created_at', [$dateFilter['start'], $dateFilter['end']]);
                } elseif (isset($dateFilter['year'])) {
                    $query->whereYear('created_at', $dateFilter['year']);
                }
            }

            $documentsData = $query->select('document_type', DB::raw('count(*) as total'))
                ->groupBy('document_type')
                ->orderBy('total', 'desc')
                ->get();

            $data = $documentsData->map(function ($item) {
                return [
                    'label' => $item->document_type,
                    'value' => $item->total,
                ];
            })->toArray();

            return response()->json([
                'message' => 'Document types issued retrieved successfully',
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve document types issued',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get most requested services data
     */
    public function getMostRequestedServices(Request $request): JsonResponse
    {
        try {
            $year = $request->get('year');
            $quarter = $request->get('quarter');
            $dateFilter = $this->buildDateFilter($year, $quarter);

            // Get appointment data (service requests)
            $appointmentQuery = Appointment::query();
            
            if ($dateFilter) {
                if (isset($dateFilter['start']) && isset($dateFilter['end'])) {
                    $appointmentQuery->whereBetween('created_at', [$dateFilter['start'], $dateFilter['end']]);
                } elseif (isset($dateFilter['year'])) {
                    $appointmentQuery->whereYear('created_at', $dateFilter['year']);
                }
            }

            $servicesData = $appointmentQuery->select(
                'service_type as service',
                DB::raw('count(*) as requested'),
                DB::raw('sum(case when status = "Completed" then 1 else 0 end) as completed'),
                DB::raw('avg(case when status = "Completed" and completed_at is not null then datediff(completed_at, created_at) else null end) as avg_processing_time'),
                DB::raw('count(*) * 100 as fees_collected') // Assuming 100 pesos per service
            )
            ->groupBy('service_type')
            ->orderBy('requested', 'desc')
            ->limit(5)
            ->get();

            $data = $servicesData->map(function ($item) {
                return [
                    'service' => $item->service,
                    'requested' => $item->requested,
                    'completed' => $item->completed,
                    'avgProcessingTimeInDays' => round($item->avg_processing_time ?? 0),
                    'feesCollected' => $item->fees_collected,
                ];
            })->toArray();

            return response()->json([
                'message' => 'Most requested services retrieved successfully',
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve most requested services',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available filter options
     */
    public function getFilterOptions(): JsonResponse
    {
        try {
            $currentYear = date('Y');
            $years = range($currentYear - 10, $currentYear);
            
            $quarters = ['Q1', 'Q2', 'Q3', 'Q4', 'All Quarters'];
            
            $puroks = Resident::select('purok')
                ->whereNotNull('purok')
                ->distinct()
                ->orderBy('purok')
                ->pluck('purok')
                ->toArray();

            return response()->json([
                'message' => 'Filter options retrieved successfully',
                'data' => [
                    'years' => $years,
                    'quarters' => $quarters,
                    'puroks' => $puroks,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve filter options',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Helper methods

    private function buildDateFilter($year, $quarter)
    {
        if (!$year) {
            return null;
        }

        if (!$quarter || $quarter === 'All Quarters') {
            return ['year' => $year];
        }

        $quarterMap = [
            'Q1' => ['start' => "$year-01-01", 'end' => "$year-03-31"],
            'Q2' => ['start' => "$year-04-01", 'end' => "$year-06-30"],
            'Q3' => ['start' => "$year-07-01", 'end' => "$year-09-30"],
            'Q4' => ['start' => "$year-10-01", 'end' => "$year-12-31"],
        ];

        return $quarterMap[$quarter] ?? null;
    }

    private function getTotalResidents($purok, $dateFilter)
    {
        $query = Resident::query();
        
        if ($purok && $purok !== 'All') {
            $query->where('purok', $purok);
        }
        
        if ($dateFilter && isset($dateFilter['year'])) {
            $query->whereYear('created_at', '<=', $dateFilter['year']);
        }
        
        return $query->count();
    }

    private function getTotalHouseholds($purok, $dateFilter)
    {
        $query = Household::query();
        
        if ($purok && $purok !== 'All') {
            $query->where('purok', $purok);
        }
        
        if ($dateFilter && isset($dateFilter['year'])) {
            $query->whereYear('created_at', '<=', $dateFilter['year']);
        }
        
        return $query->count();
    }

    private function getActiveBarangayOfficials($dateFilter)
    {
        $query = BarangayOfficial::where('status', 'ACTIVE');
        
        if ($dateFilter && isset($dateFilter['year'])) {
            $query->whereYear('created_at', '<=', $dateFilter['year']);
        }
        
        return $query->count();
    }

    private function getTotalBlotterCases($purok, $dateFilter)
    {
        $query = BlotterCase::query();
        
        if ($purok && $purok !== 'All') {
            // Assuming blotter cases have purok field or related to residents
            $query->where('purok', $purok);
        }
        
        if ($dateFilter) {
            if (isset($dateFilter['start']) && isset($dateFilter['end'])) {
                $query->whereBetween('created_at', [$dateFilter['start'], $dateFilter['end']]);
            } elseif (isset($dateFilter['year'])) {
                $query->whereYear('created_at', $dateFilter['year']);
            }
        }
        
        return $query->count();
    }

    private function getTotalIssuedDocuments($dateFilter)
    {
        $query = Document::query();
        
        if ($dateFilter) {
            if (isset($dateFilter['start']) && isset($dateFilter['end'])) {
                $query->whereBetween('created_at', [$dateFilter['start'], $dateFilter['end']]);
            } elseif (isset($dateFilter['year'])) {
                $query->whereYear('created_at', $dateFilter['year']);
            }
        }
        
        return $query->count();
    }

    private function getOngoingProjects($dateFilter)
    {
        $query = Project::where('status', 'Active');
        
        if ($dateFilter && isset($dateFilter['year'])) {
            $query->whereYear('created_at', '<=', $dateFilter['year']);
        }
        
        return $query->count();
    }
}
