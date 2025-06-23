import { useState, useEffect } from "react";
import { FiDownload } from "react-icons/fi";
import {
  FaUsers,
  FaHouseUser,
  FaStamp,
  FaPen,
  FaClipboardList,
  FaUserCheck,
} from "react-icons/fa";
import HorizontalStackedBarChart from "./HorizontalStackedBarChart";
import ResponsiveAreaChart from "./ResponsiveAreaChart";
import ResponsiveBarGraph from "./ResponsiveBarGraph";
import ResponsivePieChart from "./ResponsivePieChart";
import ResponsiveServicesTable from "./ResponsiveServicesTable";
import { ReportsService } from "../../services/reports.service";
import type {
  AgeGroupDistribution,
  SpecialPopulationRegistry,
  MonthlyRevenue,
  PopulationDistributionByPurok,
  DocumentTypesIssued,
  MostRequestedService,
  FilterOptions,
} from "../../services/reports.types";

export default function ReportsPage() {
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [selectedQuarter, setSelectedQuarter] = useState<string>("All Quarters");
  const [selectedPurok, setSelectedPurok] = useState<string>("All");

  // State for data
  const [statisticsOverviewData, setStatisticsOverviewData] = useState<any[]>([]);
  const [ageGroupDistributionData, setAgeGroupDistributionData] = useState<AgeGroupDistribution[]>([]);
  const [specialPopulationRegistryData, setSpecialPopulationRegistryData] = useState<SpecialPopulationRegistry[]>([]);
  const [revenueData, setRevenueData] = useState<MonthlyRevenue[]>([]);
  const [populationDistributionByPurokData, setPopulationDistributionByPurokData] = useState<PopulationDistributionByPurok[]>([]);
  const [documentsIssuedData, setDocumentsIssuedData] = useState<DocumentTypesIssued[]>([]);
  const [mostRequestedServicesData, setMostRequestedServicesData] = useState<MostRequestedService[]>([]);
  
  // State for filter options
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    years: [],
    quarters: ["Q1", "Q2", "Q3", "Q4", "All Quarters"],
    puroks: []
  });

  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Service instance
  const reportsService = new ReportsService();

  // Load filter options on component mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const response = await reportsService.getFilterOptions();
        if (response.data) {
          setFilterOptions(response.data);
          // Add "All" option to puroks
          response.data.puroks.unshift("All");
        }
      } catch (err) {
        console.error('Error loading filter options:', err);
      }
    };

    loadFilterOptions();
  }, []);

  // Load data when filters change
  useEffect(() => {
    const loadReportsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const filters = {
          year: selectedYear,
          quarter: selectedQuarter === "All Quarters" ? undefined : selectedQuarter,
          purok: selectedPurok === "All" ? undefined : selectedPurok,
        };

        // Load all reports data in parallel
        const [
          statisticsResponse,
          ageGroupResponse,
          specialPopulationResponse,
          revenueResponse,
          populationDistResponse,
          documentsResponse,
          servicesResponse,
        ] = await Promise.all([
          reportsService.getStatisticsOverview(filters),
          reportsService.getAgeGroupDistribution(filters),
          reportsService.getSpecialPopulationRegistry(filters),
          reportsService.getMonthlyRevenue(filters),
          reportsService.getPopulationDistributionByPurok(filters),
          reportsService.getDocumentTypesIssued(filters),
          reportsService.getMostRequestedServices(filters),
        ]);

        // Transform statistics overview to the format expected by the UI
        if (statisticsResponse.data) {
          const stats = statisticsResponse.data;
          setStatisticsOverviewData([
            {
              label: "Total Residents",
              value: stats.totalResidents,
              icon: FaUsers,
            },
            {
              label: "Total Household",
              value: stats.totalHouseholds,
              icon: FaHouseUser,
            },
            {
              label: "Active Barangay Officials",
              value: stats.activeBarangayOfficials,
              icon: FaUserCheck,
            },
            {
              label: "Total Blotter Cases",
              value: stats.totalBlotterCases,
              icon: FaPen,
            },
            {
              label: "Total Issued Clearance",
              value: stats.totalIssuedClearance,
              icon: FaStamp,
            },
            {
              label: "Ongoing Projects",
              value: stats.ongoingProjects,
              icon: FaClipboardList,
            },
          ]);
        }

        // Set other data
        if (ageGroupResponse.data) setAgeGroupDistributionData(ageGroupResponse.data);
        if (specialPopulationResponse.data) setSpecialPopulationRegistryData(specialPopulationResponse.data);
        if (revenueResponse.data) setRevenueData(revenueResponse.data);
        if (populationDistResponse.data) setPopulationDistributionByPurokData(populationDistResponse.data);
        if (documentsResponse.data) setDocumentsIssuedData(documentsResponse.data);
        if (servicesResponse.data) setMostRequestedServicesData(servicesResponse.data);

      } catch (err) {
        console.error('Error loading reports data:', err);
        setError('Failed to load reports data');
      } finally {
        setLoading(false);
      }
    };

    // Only load data if we have filter options
    if (filterOptions.years.length > 0) {
      loadReportsData();
    }
  }, [selectedYear, selectedQuarter, selectedPurok, filterOptions.years.length]);
  return (
    //FIGMA BG
    // <div className="p-6 bg-smblue-50 min-h-screen">

    // AI BG
    <main className="@container/main p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-darktext pl-0">Reports</h1>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-smblue-400"></div>
          <span className="ml-2 text-gray-600">Loading reports data...</span>
        </div>
      )}

      {/* Content - only show when not loading */}
      {!loading && (
        <>
          {/* Filter options */}
      <section className="@container/filter w-full rounded-2xl grid grid-col-1 items-end gap-4 p-6 bg-white shadow-sm border-gray-100 border">
        {/* Dropdowns */}
        <section className="grid grid-cols-2 @lg/filter:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <h4>Year</h4>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 h-10"
              title="Filter year"
            >              {filterOptions.years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <h4>Quarter</h4>
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 h-10"
              title="Filter quarter"
            >              {filterOptions.quarters.map((quarter) => (
                <option key={quarter} value={quarter}>
                  {quarter}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2 @lg/filter:col-span-1 flex flex-col gap-1">
            <h4>Purok/Sitio</h4>
            <select
              value={selectedPurok}
              onChange={(e) => setSelectedPurok(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 h-10"
              title="Filter purok"
            >              {filterOptions.puroks.map((purok) => (
                <option key={purok} value={purok}>
                  {purok}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Buttons */}
        <section className="@sm/filter:grid-cols-2 grid grid-cols-1 gap-4">
          <button className="text-center text-white bg-smblue-400 hover:bg-smblue-300 px-3 py-2 cursor-pointer rounded-lg h-10">
            Filter Reports
          </button>
          <button className="gap-2 flex justify-center items-center text-center text-smblue-400 hover:bg-smblue-400/20 border-smblue-400 border px-3 py-2 cursor-pointer rounded-lg h-10">
            <FiDownload />
            Export Report
          </button>
        </section>
      </section>

      {/* Stats overview */}
      <section className="w-full bg-white flex flex-col gap-3 border p-6 rounded-2xl border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
          Statistics Overview
        </h3>
        <div className="grid grid-cols-1 @md:grid-cols-2 @xl/main:grid-cols-3 gap-4">
          {statisticsOverviewData.map((stat, index) => (
            <article
              key={index}
              className="flex p-4 bg-stats-card rounded-xl justify-between items-center"
            >
              <section className="flex flex-col gap-1.5">
                <h5 className="text-sm text-smblue-400">{stat.label}</h5>
                <h2 className="text-2xl font-bold">
                  {stat.value.toLocaleString()}
                </h2>
              </section>
              <stat.icon className={"text-2xl text-smblue-400"} />
            </article>
          ))}
        </div>
      </section>

      {/* Population stats */}
      <section className="grid grid-cols-1 @xl/main:grid-cols-2 gap-4">
        <article className="w-full flex flex-col shadow-sm rounded-2xl border border-gray-100 p-6 bg-white">
          <h3 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
            Age Group Distribution
          </h3>

          <HorizontalStackedBarChart
            data={ageGroupDistributionData}
            showPercentage={true}
          />
        </article>

        <article className="w-full flex flex-col shadow-sm rounded-2xl border border-gray-100 p-6 bg-white">
          <h3 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
            Special Population Registry
          </h3>

          <HorizontalStackedBarChart
            data={specialPopulationRegistryData}
            showPercentage={true}
          />
        </article>
      </section>

      {/* Financial data and Population Dist by Purok/Sitio */}
      <section className="min-h-[450px] w-full grid gap-4 grid-cols-2 @4xl/main:grid-cols-[2fr_3fr_2fr]">
        {/* Tailwind is mobile-first, i may have to keep reminding myself that :) */}
        <article className="@4xl/main:flex @4xl/main:flex-col shadow-sm rounded-2xl border col-span-2 border-gray-100 p-6 bg-white @4xl/main:order-1 @4xl/main:col-span-1">
          <h3 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
            Monthly Revenue Collection
          </h3>

          <ResponsiveAreaChart data={revenueData} />
        </article>

        <article className="flex flex-col shadow-sm rounded-2xl border border-gray-100 p-6 bg-white col-span-2 min-h-[450px] @xl/main:col-span-1">
          <h3 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
            Population Distribution by Purok/Sitio
          </h3>

          <ResponsiveBarGraph data={populationDistributionByPurokData} />
        </article>

        <article className="flex flex-col shadow-sm rounded-2xl border border-gray-100 p-6 bg-white min-h-[450px] col-span-2 @4xl/main:order-3 @xl/main:col-span-1">
          <h3 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
            Document Types Issued
          </h3>

          <ResponsivePieChart data={documentsIssuedData} />
        </article>
      </section>      {/* Table of Most Requested Services */}
      <section className="flex flex-col shadow-sm rounded-2xl border border-gray-100 p-6 bg-white">
        <h3 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
          Most Requested Services
        </h3>        <ResponsiveServicesTable data={mostRequestedServicesData} />
      </section>
        </>
      )}
    </main>
  );
}