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
import Breadcrumb from "../global/Breadcrumb";

export default function ReportsPage() {
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [selectedQuarter, setSelectedQuarter] =
    useState<string>("All Quarters");
  const [selectedPurok, setSelectedPurok] = useState<string>("Purok 1");
  const [isLoaded, setIsLoaded] = useState(false);

  const yearOptions = Array.from({ length: 2025 - 2010 + 1 }, (_, i) =>
    (2010 + i).toString()
  );
  // hardcoded muna hihihi
  const quarterOptions = ["Q1", "Q2", "Q3", "Q4", "All Quarters"];
  const purokOptions = ["Purok 1", "Purok 2", "Purok 3", "Purok 4"];

  // Animation trigger on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const statisticsOverviewData = [
    {
      label: "Total Residents",
      value: 40199,
      icon: FaUsers,
    },
    {
      label: "Total Household",
      value: 20148,
      icon: FaHouseUser,
    },
    {
      label: "Active Barangay Officials",
      value: 20,
      icon: FaUserCheck,
    },
    {
      label: "Total Blotter Cases",
      value: 5,
      icon: FaPen,
    },
    {
      label: "Total Issued Clearance",
      value: 3,
      icon: FaStamp,
    },
    {
      label: "Ongoing Projects",
      value: 1,
      icon: FaClipboardList,
    },
  ];

  const ageGroupDistributionData = [
    { name: "Children (0-7)", percentage: 32 },
    { name: "Adults (18-59)", percentage: 24 },
    { name: "Senior Citizens (60+)", percentage: 44 },
  ];

  const specialPopulationRegistryData = [
    { name: "Senior Citizens", percentage: 42 },
    { name: "PWD", percentage: 12 },
    { name: "Solo Parents", percentage: 26 },
    { name: "4Ps Beneficiaries", percentage: 20 },
  ];

  const revenueData = Array.from({ length: 12 }, (_, index) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return {
      timeLabel: months[index],
      value: Math.floor(Math.random() * (42000 - 15000 + 1)) + 15000,
    };
  });

  const populationDistributionByPurokData = Array.from(
    { length: 4 },
    (_, index) => {
      return {
        label: `Purok ${index + 1}`,
        value: Math.floor(Math.random() * (8000 - 4000 + 1)) + 4000,
      };
    }
  );

  const documentsIssuedData = [
    { label: "Barangay Clearance", value: 120 },
    { label: "Certificate of Residency", value: 85 },
    { label: "Certificate of Indigency", value: 60 },
    { label: "Business Permit", value: 45 },
    { label: "Other Documents", value: 30 },
  ];

  const mostRequestedServicesData = [
    {
      service: "Barangay Clearance",
      requested: 150,
      completed: 140,
      avgProcessingTimeInDays: 2,
      feesCollected: 7500,
    },
    {
      service: "Certificate of Residency",
      requested: 120,
      completed: 115,
      avgProcessingTimeInDays: 3,
      feesCollected: 6000,
    },
    {
      service: "Certificate of Indigency",
      requested: 90,
      completed: 85,
      avgProcessingTimeInDays: 1,
      feesCollected: 4500,
    },
    {
      service: "Business Permit",
      requested: 60,
      completed: 55,
      avgProcessingTimeInDays: 5,
      feesCollected: 12000,
    },
    {
      service: "Other Documents",
      requested: 40,
      completed: 35,
      avgProcessingTimeInDays: 4,
      feesCollected: 2000,
    },
  ];

  return (
    //FIGMA BG
    // <div className="p-6 bg-smblue-50 min-h-screen">

    // AI BG
    <main className="@container/main p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      {/* Breadcrumb */}
      <Breadcrumb isLoaded={isLoaded} />

      {/* Header */}
      <div className={`mb-2 transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <h1 className="text-2xl font-bold text-darktext pl-0">Reports</h1>
      </div>

      {/* Filter options */}
      <section className={`@container/filter w-full rounded-2xl grid grid-col-1 items-end gap-4 p-6 bg-white shadow-sm border-gray-100 border transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ transitionDelay: '100ms' }}>
        {/* Dropdowns */}
        <section className="grid grid-cols-2 @lg/filter:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <h4>Year</h4>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 h-10"
              title="Filter year"
            >
              {yearOptions.map((year) => (
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
            >
              {quarterOptions.map((quarter) => (
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
            >
              {purokOptions.map((purok) => (
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
      <section className={`w-full bg-white flex flex-col gap-3 border p-6 rounded-2xl border-gray-100 shadow-sm transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ transitionDelay: '200ms' }}>
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
          <h3 className={`text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4 transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '300ms' }}>
            Age Group Distribution
          </h3>

          <HorizontalStackedBarChart
            data={ageGroupDistributionData}
            showPercentage={true}
          />
        </article>

        <article className="w-full flex flex-col shadow-sm rounded-2xl border border-gray-100 p-6 bg-white">
          <h3 className={`text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4 transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '350ms' }}>
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
          <h3 className={`text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4 transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '400ms' }}>
            Monthly Revenue Collection
          </h3>

          <ResponsiveAreaChart data={revenueData} />
        </article>

        <article className="flex flex-col shadow-sm rounded-2xl border border-gray-100 p-6 bg-white col-span-2 min-h-[450px] @xl/main:col-span-1">
          <h3 className={`text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4 transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '450ms' }}>
            Population Distribution by Purok/Sitio
          </h3>

          <ResponsiveBarGraph data={populationDistributionByPurokData} />
        </article>

        <article className="flex flex-col shadow-sm rounded-2xl border border-gray-100 p-6 bg-white min-h-[450px] col-span-2 @4xl/main:order-3 @xl/main:col-span-1">
          <h3 className={`text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4 transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '500ms' }}>
            Document Types Issued
          </h3>

          <ResponsivePieChart data={documentsIssuedData} />
        </article>
      </section>

      {/* Table of Most Requested Services */}
      <section className="flex flex-col shadow-sm rounded-2xl border border-gray-100 p-6 bg-white">
        <h3 className={`text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4 transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '550ms' }}>
          Most Requested Services
        </h3>

        <ResponsiveServicesTable data={mostRequestedServicesData} />
      </section>
    </main>
  );
}