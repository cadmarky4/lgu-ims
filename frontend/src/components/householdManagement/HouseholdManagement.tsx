import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { FaUsers, FaHome, FaUserFriends, FaDollarSign } from 'react-icons/fa';
import StatCard from '../global/StatCard';
import Breadcrumb from '../global/Breadcrumb';
import { HouseholdsService } from '../../services/households.service';
import { useNotificationHelpers } from '../global/NotificationSystem';
import { type Household, type HouseholdFormData } from '../../services/household.types';

interface MappedHousehold {
  id: number,
  householdNumber: string,
  headName: string,
  address: string,
  barangay: string,
  memberCount: number,
  monthlyIncome: string,
  houseType: string,
  ownershipStatus: string,
  programs: string[],
  status: string,
  // Keep original household data for editing
  originalData: Household,
}

const HouseholdManagement: React.FC = () => {
  const navigate = useNavigate();
  const { showDeleteSuccess, showDeleteError } = useNotificationHelpers();
  
  // API integration states
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Form states
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('All Households');
  const [showAdvanceFilter, setShowAdvanceFilter] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);

  // Data states
  const [households, setHouseholds] = useState<MappedHousehold[]>([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({
    total_households: 0,
    four_ps_beneficiaries: 0,
    with_senior_citizens: 0,
    indigent_families: 0,
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  // Animation trigger on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const openAddHousehold = () => {
    navigate('/household/add');
  };
  
  // Initialize service
  const householdsService = new HouseholdsService();
  // Load households data on component mount and when filters change
  useEffect(() => {
    loadHouseholds();
    loadStatistics();
  }, [currentPage]);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (currentPage === 1) {
        loadHouseholds();
      } else {
        setCurrentPage(1); // Reset to first page when searching
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const loadHouseholds = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await householdsService.getHouseholds({
        page: currentPage,
        per_page: 15,
        search: searchTerm,
      });

      console.log("Loaded households:", response);
      
      // Map the backend data to the expected format
      const mappedHouseholds = response.data.map((household: Household) => ({
        id: household.id,
        householdNumber: household.household_number,
        headName: household.head_resident 
          ? `${household.head_resident.first_name} ${household.head_resident.last_name}`
          : 'No Head Assigned',
        address: household.complete_address,
        barangay: household.barangay,
        memberCount: household.members ? household.members.length : 0,
        monthlyIncome: household.monthly_income || 'Not specified',
        houseType: household.house_type || 'Not specified',
        ownershipStatus: household.ownership_status || 'Not specified',
        programs: getHouseholdPrograms(household),
        status: 'Active', // Assume active for now
        // Keep original household data for editing
        originalData: household,
      }));
      
      setHouseholds(mappedHouseholds);
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
      });
    } catch (error: unknown) {
      console.error("Failed to load households:", error);
      setError("Failed to load households. Please try again.");
      // Clear households on error
      setHouseholds([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine household programs
  const getHouseholdPrograms = (household: Household): string[] => {
    const programs = [];
    if (household.four_ps_beneficiary) programs.push("4Ps");
    if (household.has_senior_citizen) programs.push("Senior Citizen");
    if (household.indigent_family) programs.push("Indigent Family");
    if (household.has_pwd_member) programs.push("PWD Support");
    
    return programs;
  };

  const loadStatistics = async () => {
    try {
      const stats = await householdsService.getStatistics();
      
      setStatistics({
        total_households: stats.total_households || 0,
        four_ps_beneficiaries: stats.classifications?.four_ps_beneficiaries || 0,
        with_senior_citizens: stats.classifications?.with_senior_citizens || 0,
        indigent_families: stats.classifications?.indigent_families || 0,
      });
    } catch (error) {
      console.error("Failed to load statistics:", error);
      setError("Failed to load statistics.");
      // Keep current values as fallback
    }
  };

  const handleAddHousehold = async (householdData: HouseholdFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Reload households to get updated data
      await loadHouseholds();
      await loadStatistics();
    } catch (error: unknown) {
      console.error("Failed to create household:", error);
      if (error instanceof Error) {
        setError(error.message || "Failed to create household. Please try again.");
      }
      
    } finally {
      setIsLoading(false);
    }
  };  
  const handleDeleteHousehold = async (householdId: number) => {
    const householdToDelete = households.find(h => h.id === householdId);
    const householdName = householdToDelete ? householdToDelete.householdNumber : 'Household';
    
    if (
      window.confirm(
        "Are you sure you want to delete this household? This action cannot be undone."
      )
    ) {
      setIsDeleting(householdId);
      setError(null);
      try {
        await householdsService.deleteHousehold(householdId);
        console.log("Household deleted successfully");
        
        // Show success notification
        showDeleteSuccess('Household', householdName);
        
        // Reload households to get updated data
        await loadHouseholds();
        await loadStatistics();
      } catch (error: unknown) {
        console.error("Failed to delete household:", error);
        
        let errorMessage = "Failed to delete household. Please try again.";
        if (error instanceof Error) {
          errorMessage = error.message || errorMessage;
        }
        
        // Show error notification
        showDeleteError('Household', errorMessage);
        setError(errorMessage);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const openEditForm = (household: any) => {
    navigate(`/household/edit/${household.id}`);
  };

  const openViewForm = (household: any) => {
    navigate(`/household/view/${household.id}`);
  };

  const getProgramBadgeColor = (program: string) => {
    switch (program) {
      case '4Ps':
        return 'bg-green-100 text-green-800';
      case 'Senior Citizen':
        return 'bg-blue-100 text-blue-800';
      case 'Indigent Family':
        return 'bg-yellow-100 text-yellow-800';
      case 'PWD Support':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      {/* Automatic Breadcrumbs */}
      <Breadcrumb isLoaded={isLoaded} />

      {/* Page Header */}
      <div className={`mb-2 transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <h1 className="text-2xl font-bold text-darktext pl-0">
          Household Management
        </h1>
      </div>

      {/* Error Display */}
      {error && (
        <div className={`bg-red-50 border border-red-200 rounded-lg p-4 mb-4 transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ transitionDelay: '200ms' }}>
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ transitionDelay: '250ms' }}>
          <p className="text-blue-800 text-sm">Loading households...</p>
        </div>
      )}

      {/* Statistics Overview */}
      <section className={`w-full bg-white flex flex-col gap-3 border p-6 rounded-2xl border-gray-100 shadow-sm transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ transitionDelay: '300ms' }}>
        <h3 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
          Statistics Overview
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { title: "Total Households", value: statistics.total_households || 0, icon: FaHome },
            { title: "4Ps Beneficiaries", value: statistics.four_ps_beneficiaries || 0, icon: FaUsers },
            { title: "Senior Citizen Households", value: statistics.with_senior_citizens || 0, icon: FaUserFriends },
            { title: "Indigent Families", value: statistics.indigent_families || 0, icon: FaDollarSign }
          ].map((stat, index) => (
            <div
              key={stat.title}
              className={`transition-all duration-700 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
              }`}
              style={{ 
                transitionDelay: `${450 + (index * 100)}ms`,
                transformOrigin: 'center bottom'
              }}
            >
              <StatCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Households Section */}
      <section className={`bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ transitionDelay: '850ms' }}>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">
            Households
          </h3>

          {/* Search and Add Button */}
          <div className="flex justify-between items-center">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Households by number, head name, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>
            
            {/* Add Button */}
            <button 
              onClick={openAddHousehold}
              className="cursor-pointer no-underline bg-smblue-400 hover:bg-smblue-300 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors whitespace-nowrap"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add New Household</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-smblue-400"></div>
              <span className="ml-2 text-gray-600">Loading households...</span>
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Household
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Head & Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Members & Income
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {households.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No households found. Try adjusting your search or add a new household.
                    </td>
                  </tr>
                ) : (
                  households.map((household) => (
                    <tr key={household.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {household.householdNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {household.houseType} • {household.ownershipStatus}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {household.headName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {household.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {household.memberCount} members
                        </div>
                        <div className="text-sm text-gray-500">
                          Income: {household.monthlyIncome?.replace('-', ' - ₱').replace('below-', 'Below ₱').replace('above-', 'Above ₱')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {household.programs.length > 0 ? (
                            household.programs.map((program: string, index: number) => (
                              <span
                                key={index}
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getProgramBadgeColor(program)}`}
                              >
                                {program}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">None</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {household.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => openViewForm(household)}
                            className="cursor-pointer no-underline text-smblue-400 hover:text-smblue-300"
                            title="View household details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openEditForm(household)}
                            className="cursor-pointer no-underline text-yellow-600 hover:text-yellow-900"
                            title="Edit household"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteHousehold(household.id)}
                            className="cursor-pointer no-underline text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            title="Delete household"
                            disabled={isDeleting === household.id}
                          >
                            {isDeleting === household.id ? (
                              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <FiTrash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(pagination.current_page - 1) * pagination.per_page + 1}{" "}
              to{" "}
              {Math.min(
                pagination.current_page * pagination.per_page,
                pagination.total
              )}{" "}
              of {pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </button>
              {Array.from(
                { length: Math.min(5, pagination.last_page) },
                (_, i) => {
                  const pageNum = i + 1;
                  const isCurrentPage = currentPage === pageNum;

                  return (
                    <button
                      key={pageNum}
                      className={`px-3 py-1 text-sm rounded ${
                        isCurrentPage
                          ? "bg-smblue-400 text-white"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setCurrentPage(pageNum)}
                      disabled={loading}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}
              <button
                className="px-3 py-1 text-sm bg-smblue-400 text-white rounded hover:bg-smblue-300 disabled:opacity-50"
                onClick={() =>
                  setCurrentPage(
                    Math.min(pagination.last_page, currentPage + 1)
                  )
                }
                disabled={currentPage === pagination.last_page || loading}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HouseholdManagement;