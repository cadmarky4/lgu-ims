import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { FaUsers, FaWheelchair, FaUserFriends, FaChild } from "react-icons/fa";
import StatCard from "../global/StatCard";
import Breadcrumb from "../global/Breadcrumb";
import { residentsService } from "../../services";
import { STORAGE_BASE_URL } from "../../services/storage.service";
import { useNotificationHelpers } from "../global/NotificationSystem";
import type { Resident, CreateResidentData, UpdateResidentData, ResidentFormData } from "../../services/resident.types";

interface MappedResident {
  id: number
  name: string,
  age: number,
  gender: string,
  phone: string,
  email: string,
  address: string,
  category: string,
  status: string,
  // Keep original resident data for editing
  originalData: Resident,
}

const ResidentManagement: React.FC = () => {
  const navigate = useNavigate();
  const { showDeleteSuccess, showDeleteError } = useNotificationHelpers();
  
  // API integration states
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [residents, setResidents] = useState<MappedResident[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewForm, setShowViewForm] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({
    total_residents: 0,
    pwd_count: 0,
    senior_citizens: 0,
    children_count: 0,
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

  // Load residents data on component mount and when filters change
  useEffect(() => {
    loadResidents();
    loadStatistics();
  }, [currentPage]);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (currentPage === 1) {
        loadResidents();
      } else {
        setCurrentPage(1); // Reset to first page when searching
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const loadResidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await residentsService.getResidents({
        page: currentPage,
        per_page: 15,
        search: searchTerm,
      });

      console.log("Residents loaded successfully:", response);
      
      // Map the backend data to the expected format
      const mappedResidents = response.data.map((resident: Resident) => ({
        id: resident.id,
        name: `${resident.first_name} ${resident.middle_name ? resident.middle_name + ' ' : ''}${resident.last_name}${resident.suffix ? ', ' + resident.suffix : ''}`,
        age: resident.age || (resident.birth_date ? new Date().getFullYear() - new Date(resident.birth_date).getFullYear() : 0),
        gender: resident.gender === 'MALE' ? 'Male' : 'Female',
        phone: resident.mobile_number || resident.telephone_number || 'N/A',
        email: resident.email_address || 'N/A',
        address: resident.complete_address || 'N/A',
        category: getResidentCategory(resident),
        status: resident.status,
        // Keep original resident data for editing
        originalData: resident,
      }));
      
      // Sort residents by status and then by name
      setResidents(mappedResidents.sort((a, b) => a.status.localeCompare(b.status) || a.name.localeCompare(b.name)));
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
      });
    } catch (error: unknown) {
      console.error("Failed to load residents:", error);
      setError("Failed to load residents. Please try again.");
      // Clear residents on error
      setResidents([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine resident category
  const getResidentCategory = (resident: Resident): string => {
    const categories = [];
    if (resident.senior_citizen) categories.push("Senior Citizen");
    if (resident.person_with_disability) categories.push("PWD");
    if (resident.four_ps_beneficiary) categories.push("4Ps");
    if (resident.is_household_head) categories.push("Household Head");
    if (resident.indigenous_people) categories.push("Indigenous");
    
    return categories.length > 0 ? categories.join(", ") : "Regular";
  };

  const loadStatistics = async () => {
    try {
      const stats = await residentsService.getStatistics();
      
      setStatistics({
        total_residents: stats.total_residents || 0,
        pwd_count: stats.pwd_count || stats.persons_with_disability || 0,
        senior_citizens: stats.senior_citizens || 0,
        children_count: stats.children_count || stats.residents_by_age_group?.children || 0,
      });
    } catch (error) {
      console.error("Failed to load statistics:", error);
      setError("Failed to load statistics.");
      // Keep current values as fallback
    }
  };

  const handleAddResident = async (residentData: CreateResidentData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newResident = await residentsService.createResident(residentData);
      console.log("New resident created successfully:", newResident);
      
      // Reload residents to get updated data
      await loadResidents();
      await loadStatistics();
      setShowAddForm(false);
    } catch (error: unknown) {
      console.error("Failed to create resident:", error);
      if (error instanceof Error) {
        setError(error.message || "Failed to create resident. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditResident = async (residentData: Resident) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedResident = await residentsService.updateResident(residentData.id, residentData);
      console.log("Resident updated successfully:", updatedResident);
      
      // Reload residents to get updated data
      await loadResidents();
      await loadStatistics();
      setShowEditForm(false);
      setSelectedResident(null);
    } catch (error: unknown) {
      console.error("Failed to update resident:", error);

      if (error instanceof Error) {
        setError(error.message || "Failed to update resident. Please try again.");
      }
      
    } finally {
      setIsLoading(false);
    }
  };
    const handleDeleteResident = async (residentId: number) => {
    const residentToDelete = residents.find(r => r.id === residentId);
    const residentName = residentToDelete ? residentToDelete.name : 'Resident';
    
    if (
      window.confirm(
        "Are you sure you want to deactivate this resident? This will change their status to inactive."
      )
    ) {
      setIsDeleting(residentId);
      setError(null);
      try {
        await residentsService.deleteResident(residentId);
        console.log("Resident deactivated successfully");
        
        // Show success notification
        showDeleteSuccess('Resident', residentName);
        
        // Reload residents to get updated data
        await loadResidents();
        await loadStatistics();
      } catch (error: unknown) {
        console.error("Failed to deactivate resident:", error);

        let errorMessage = "Failed to deactivate resident. Please try again.";
        if (error instanceof Error) {
          errorMessage = error.message || errorMessage;
        }
        
        // Show error notification
        showDeleteError('Resident', errorMessage);
        setError(errorMessage);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const openAddForm = () => {
    navigate('/residents/add');
  }

  const openEditForm = (resident: any) => {
    navigate(`/residents/edit/${resident.id}`);
  };

  const openViewForm = (resident: any) => {
    navigate(`/residents/view/${resident.id}`);
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
          Resident Management
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
          <p className="text-blue-800 text-sm">Loading residents...</p>
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
            { title: "Total Residents", value: statistics.total_residents || 0, icon: FaUsers },
            { title: "PWD", value: statistics.pwd_count || 0, icon: FaWheelchair },
            { title: "Senior Citizens", value: statistics.senior_citizens || 0, icon: FaUserFriends },
            { title: "Children", value: statistics.children_count || 0, icon: FaChild }
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

      {/* Residents Section */}
      <section className={`bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ transitionDelay: '850ms' }}>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">
            Residents
          </h3>

          {/* Search and Add Button */}
          <div className="flex justify-between items-center">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Residents by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>
            <button
              onClick={openAddForm}
              disabled={loading}
              className="ml-4 bg-smblue-400 hover:bg-smblue-300 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer no-underline"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add New Resident</span>
            </button>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-smblue-400"></div>
              <span className="ml-2 text-gray-600">Loading residents...</span>
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resident
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Information
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
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
                {residents.length === 0 && !loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      {searchTerm
                        ? `No residents found matching "${searchTerm}"`
                        : "No residents found"}
                    </td>
                  </tr>
                ) : (
                  residents.map((resident) => (
                    <tr key={resident.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={
                              resident.originalData.profile_photo_url
                                ? `${STORAGE_BASE_URL}/${resident.originalData.profile_photo_url}`
                                : "https://placehold.co/80"
                            }
                            alt={
                              resident.name ||
                              `${resident.name}`
                            }
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {resident.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {resident.age} {" "}
                              years old, {resident.gender}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {resident.phone}
                        </div>
                        <div className="text-sm text-gray-500">
                          {resident.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {resident.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {resident.category || "Regular"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${resident.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                            }`}
                        >
                          {resident.status ||
                            (resident.status ? "Active" : "Inactive")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            className="text-smblue-400 hover:text-smblue-300 cursor-pointer no-underline"
                            title="View resident details"
                            onClick={() => openViewForm(resident)}
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            className="text-smblue-400 hover:text-smblue-300 cursor-pointer no-underline"
                            title="Edit resident"
                            onClick={() => openEditForm(resident)}
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            className={`text-red-600 hover:text-red-900 cursor-pointer no-underline${isDeleting === resident.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={isDeleting === resident.id ? "Deactivating..." : "Deactivate resident"}
                            onClick={() => handleDeleteResident(resident.id)}
                            disabled={isDeleting === resident.id || isLoading}
                          >
                            {isDeleting === resident.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
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
                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 cursor-pointer no-underline"
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
                      className={`px-3 py-1 text-sm rounded ${isCurrentPage
                          ? "bg-smblue-400 text-white"
                          : "text-gray-700 hover:bg-gray-100"
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
                className="px-3 py-1 text-sm bg-smblue-400 text-white rounded hover:bg-smblue-300 disabled:opacity-50 cursor-pointer no-underline"
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

export default ResidentManagement;