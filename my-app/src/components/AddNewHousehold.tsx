import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiSearch, FiX } from 'react-icons/fi';
import { HouseholdsService } from '../services/households.service';
import { ResidentsService } from '../services/residents.service';
import { type HouseholdFormData, type Resident, type Barangay } from '../services/types';

// Common relationship options
const RELATIONSHIP_OPTIONS = [
  'Spouse',
  'Child',
  'Parent',
  'Sibling',
  'Grandparent',
  'Grandchild',
  'In-law',
  'Cousin',
  'Nephew/Niece',
  'Uncle/Aunt',
  'Other Relative',
  'Non-relative'
];

interface AddNewHouseholdProps {
  onClose: () => void;
  onSave: (householdData: HouseholdFormData) => void;
}

const AddNewHousehold: React.FC<AddNewHouseholdProps> = ({ onClose, onSave }) => {
  // Refs for dropdown click-outside detection
  const headSearchRef = useRef<HTMLDivElement>(null);
  const memberSearchRef = useRef<HTMLDivElement>(null);

  // Loading and error states for API calls
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Services
  const householdsService = new HouseholdsService();
  const residentsService = new ResidentsService();

  // Reference data from backend
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [filteredResidents, setFilteredResidents] = useState<Resident[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Resident[]>([]);
  const [isSearchingResidents, setIsSearchingResidents] = useState(false);
  const [isSearchingMembers, setIsSearchingMembers] = useState(false);  // Dropdown visibility states
  const [showHeadDropdown, setShowHeadDropdown] = useState(false);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);

  // Error and notification states  
  const [isErrorInfo, setIsErrorInfo] = useState(false); // To distinguish between error and info messages

  const [formData, setFormData] = useState<HouseholdFormData>({
    householdId: 'Auto-generated',
    householdType: '',
    barangay: '',
    streetSitio: '',
    houseNumber: '',
    completeAddress: '',
    householdHeadSearch: '',
    memberSearch: '',
    monthlyIncome: '',
    primaryIncomeSource: '',
    householdClassification: {
      fourPsBeneficiary: false,
      indigentFamily: false,
      hasSeniorCitizen: false,
      hasPwdMember: false
    },
    houseType: '',
    ownershipStatus: '',
    utilitiesAccess: {
      electricity: false,
      waterSupply: false,
      internetAccess: false
    },
    remarks: '',
    members: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (section: 'householdClassification' | 'utilitiesAccess', field: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !(prev[section] as any)[field]
      }
    }));
  };  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headSearchRef.current && !headSearchRef.current.contains(event.target as Node)) {
        setShowHeadDropdown(false);
      }
      if (memberSearchRef.current && !memberSearchRef.current.contains(event.target as Node)) {
        setShowMemberDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch reference data on component mount
  useEffect(() => {
    const fetchReferenceData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch barangays
        const barangayData = await householdsService.getBarangays();
        setBarangays(barangayData);

        // Fetch initial list of residents for search functionality
        const residentsData = await residentsService.getResidents({ per_page: 100 });
        setResidents(residentsData.data);

      } catch (err) {
        setError('Failed to load reference data');
        console.error('Error fetching reference data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferenceData();
  }, []);  // Filter residents based on search input using backend search
  useEffect(() => {
    const searchResidents = async () => {
      if (formData.householdHeadSearch.trim()) {
        setIsSearchingResidents(true);
        try {
          // Use backend search for better performance and accuracy
          const searchResults = await residentsService.searchResidents(formData.householdHeadSearch, 10);
          setFilteredResidents(searchResults);
          setShowHeadDropdown(searchResults.length > 0);
        } catch (err) {
          console.error('Error searching residents:', err);
          // Fallback to local search if backend search fails
          const filtered = residents.filter(resident => {
            const fullName = `${resident.first_name} ${resident.last_name}`.toLowerCase();
            const searchTerm = formData.householdHeadSearch.toLowerCase();
            return fullName.includes(searchTerm) ||
              (resident.mobile_number && resident.mobile_number.includes(formData.householdHeadSearch));
          });
          setFilteredResidents(filtered);
          setShowHeadDropdown(filtered.length > 0);
        } finally {
          setIsSearchingResidents(false);
        }
      } else {
        setFilteredResidents([]);
        setIsSearchingResidents(false);
        setShowHeadDropdown(false);
      }
    };

    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(searchResidents, 300);
    return () => clearTimeout(timeoutId);
  }, [formData.householdHeadSearch, residents, residentsService]);  // Filter members based on search input using backend search
  useEffect(() => {
    const searchMembers = async () => {
      console.log('Member search effect triggered, search term:', formData.memberSearch);
      if (formData.memberSearch.trim()) {
        setIsSearchingMembers(true);
        try {
          // Use backend search for better performance and accuracy
          const searchResults = await residentsService.searchResidents(formData.memberSearch, 10);
          console.log('Backend search results:', searchResults);

          // Filter out already selected members and head
          const availableResidents = searchResults.filter(resident =>
            resident.id !== formData.headResidentId &&
            !formData.members?.some(member => member.residentId === resident.id)
          );
          console.log('Available residents after filtering:', availableResidents);

          setFilteredMembers(availableResidents);
          setShowMemberDropdown(availableResidents.length > 0);
        } catch (err) {
          console.error('Error searching members:', err);
          // Fallback to local search if backend search fails
          const filtered = residents.filter(resident => {
            const fullName = `${resident.first_name} ${resident.last_name}`.toLowerCase();
            const searchTerm = formData.memberSearch.toLowerCase();
            return (fullName.includes(searchTerm) ||
              (resident.mobile_number && resident.mobile_number.includes(formData.memberSearch))) &&
              resident.id !== formData.headResidentId &&
              !formData.members?.some(member => member.residentId === resident.id);
          });
          console.log('Fallback search results:', filtered);
          setFilteredMembers(filtered);
          setShowMemberDropdown(filtered.length > 0);
        } finally {
          setIsSearchingMembers(false);
        }
      } else {
        setFilteredMembers([]);
        setIsSearchingMembers(false);
        setShowMemberDropdown(false);
      }
    };

    // Debounce the search to avoid too many API calls    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(searchMembers, 300);
    return () => clearTimeout(timeoutId);
  }, [formData.memberSearch, formData.headResidentId, formData.members, residents, residentsService]); const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setIsErrorInfo(false);

    // Validation: Ensure household head is selected
    if (!formData.headResidentId) {
      setIsErrorInfo(false);
      setError('Please select a household head before saving.');
      setIsSubmitting(false);
      return;
    }

    console.log('Form submission - formData:', formData);
    console.log('Members to be sent:', formData.members);

    try {
      // Use the service to create household
      const result = await householdsService.createHousehold(formData);
      console.log('Household created successfully:', result);
      onSave(formData); // Still call onSave for parent component to refresh list
      onClose();
    } catch (err: any) {
      console.error('Error creating household:', err);
      setIsErrorInfo(false);
      setError('Failed to save household. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleAddNewResident = () => {
    console.log('Add new resident clicked');
  };  // Helper functions for managing members
  const addMemberToHousehold = (resident: Resident, relationship: string) => {
    console.log('addMemberToHousehold called with:', { resident, relationship });

    if (!relationship.trim()) {
      setError('Please specify the relationship to household head');
      return;
    }    // Validation: Check if this person is already the household head
    if (formData.headResidentId === resident.id) {
      setIsErrorInfo(false);
      setError(`${resident.first_name} ${resident.last_name} is already selected as the household head and cannot be added as a member.`);
      // Clear error after 5 seconds
      setTimeout(() => {
        setError(null);
        setIsErrorInfo(false);
      }, 5000);
      return;
    }

    // Validation: Check if this person is already a member
    if (formData.members?.some(member => member.residentId === resident.id)) {
      setIsErrorInfo(false);
      setError(`${resident.first_name} ${resident.last_name} is already a member of this household.`);
      // Clear error after 5 seconds
      setTimeout(() => {
        setError(null);
        setIsErrorInfo(false);
      }, 5000);
      return;
    }

    const newMember = {
      residentId: resident.id,
      relationship: relationship.trim()
    };

    console.log('Adding new member:', newMember);

    setFormData(prev => {
      const updatedData = {
        ...prev,
        members: [...(prev.members || []), newMember],
        memberSearch: '', // Clear search after adding
      };
      console.log('Updated formData members:', updatedData.members);
      return updatedData;
    });

    setShowMemberDropdown(false);
    setError(null);
  };
  const removeMemberFromHousehold = (residentId: number) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members?.filter(member => member.residentId !== residentId) || []
    }));
  };

  // Update member relationship
  const updateMemberRelationship = (residentId: number, newRelationship: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members?.map(member =>
        member.residentId === residentId
          ? { ...member, relationship: newRelationship }
          : member
      ) || []
    }));
  };

  // Get resident details for display
  const getResidentById = (id: number): Resident | undefined => {
    return residents.find(resident => resident.id === id);
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-darktext pl-0">Add New Household Profile</h1>
      </div>      {/* Error/Info Display */}
      {error && (
        <div className={`border rounded-lg p-4 mb-4 ${isErrorInfo
          ? 'bg-blue-50 border-blue-200'
          : 'bg-red-50 border-red-200'
          }`}>
          <p className={`text-sm ${isErrorInfo ? 'text-blue-800' : 'text-red-800'
            }`}>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800 text-sm">Loading reference data...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Household Identification */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Household Identification</h2>
          <div className="border-b border-gray-200 mb-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Household ID *
              </label>
              <input
                type="text"
                name="householdId"
                value={formData.householdId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Household Type *
              </label>
              <select
                name="householdType"
                value={formData.householdType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                required
                title="Select household type"
              >
                <option value="">Select Household Type</option>
                <option value="nuclear">Nuclear Family</option>
                <option value="extended">Extended Family</option>
                <option value="single">Single Person</option>
                <option value="single-parent">Single Parent</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Barangay *
              </label>
              <input
                type="text"
                name="barangay"
                value={formData.barangay}
                onChange={handleInputChange}
                placeholder="Enter barangay name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street/Sitio *
              </label>
              <input
                type="text"
                name="streetSitio"
                value={formData.streetSitio}
                onChange={handleInputChange}
                placeholder="Enter street or sitio name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                House Number *
              </label>
              <input
                type="text"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleInputChange}
                placeholder="Enter house number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complete Address *
              </label>
              <textarea
                name="completeAddress"
                value={formData.completeAddress}
                onChange={handleInputChange}
                placeholder="Enter complete household address"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                required
              />
            </div>
          </div>
        </section>

        {/* Household Head Information */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Household Head Information</h2>
          <div className="border-b border-gray-200 mb-6"></div>

          <div className="space-y-4">            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Existing Resident as Head
            </label>
            <div className="relative" ref={headSearchRef}>
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />                <input
                type="text"
                name="householdHeadSearch"
                value={formData.householdHeadSearch}
                onChange={handleInputChange}
                onFocus={() => {
                  if (formData.householdHeadSearch.trim() && filteredResidents.length > 0) {
                    setShowHeadDropdown(true);
                  }
                }}
                placeholder="Enter name, ID, or phone number"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                disabled={isLoading}
              />

              {/* Loading indicator for search */}
              {isSearchingResidents && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-smblue-400"></div>
                </div>
              )}

              {/* Search Results Dropdown */}
              {showHeadDropdown && filteredResidents.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {filteredResidents.map((resident) => (
                    <div
                      key={resident.id}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0" onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const fullName = `${resident.first_name} ${resident.last_name}`;

                        // Check if this person is already a member and remove them
                        const isCurrentMember = formData.members?.some(member => member.residentId === resident.id);

                        setFormData(prev => ({
                          ...prev,
                          householdHeadSearch: fullName,
                          headResidentId: resident.id,
                          // Remove from members if they were already added as a member
                          members: isCurrentMember
                            ? prev.members?.filter(member => member.residentId !== resident.id) || []
                            : prev.members || []
                        }));

                        setShowHeadDropdown(false);
                        // Show notification if person was removed from members
                        if (isCurrentMember) {
                          console.log(`${fullName} was removed from household members as they are now the household head`);
                          setIsErrorInfo(true);
                          setError(`${fullName} was moved from household members to household head.`);
                          // Clear notification after 3 seconds
                          setTimeout(() => {
                            setError(null);
                            setIsErrorInfo(false);
                          }, 3000);
                        } else {
                          // Clear any existing errors
                          setError(null);
                          setIsErrorInfo(false);
                        }
                      }}
                    >
                      <p className="font-medium text-gray-900">{`${resident.first_name} ${resident.last_name}`}</p>
                      <p className="text-sm text-gray-600">{resident.mobile_number || 'No phone'}</p>
                    </div>
                  ))}
                </div>
              )}
              {/* No results message */}
              {showHeadDropdown && formData.householdHeadSearch.trim() && !isSearchingResidents && filteredResidents.length === 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                  <p className="text-gray-500 text-sm">No residents found matching "{formData.householdHeadSearch}"</p>
                </div>
              )}
            </div>
          </div>            {/* Selected Household Head Preview */}
            {formData.headResidentId && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Selected Household Head:</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          Contact
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          Role
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(() => {
                        const headResident = getResidentById(formData.headResidentId);
                        return (
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {headResident ? `${headResident.first_name} ${headResident.last_name}` : formData.householdHeadSearch || 'Unknown Resident'}
                              </div>
                              {headResident?.id && (
                                <div className="text-sm text-gray-500">ID: {headResident.id}</div>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {headResident?.mobile_number || 'No contact'}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                Household Head
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    householdHeadSearch: '',
                                    headResidentId: undefined
                                  }));
                                }}
                                className="text-red-600 hover:text-red-900 hover:bg-red-100 p-1 rounded"
                                title="Remove household head"
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="text-center">
              <span className="text-gray-500 font-medium">OR</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add New Resident as Head
              </label>
              <button
                type="button"
                onClick={handleAddNewResident}
                className="bg-smblue-400 hover:bg-smblue-300 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add New Resident</span>
              </button>
            </div>
          </div>
        </section>        {/* Household Members */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Household Members</h2>
          <div className="border-b border-gray-200 mb-6"></div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Members from Residents
              </label>
              <div className="relative" ref={memberSearchRef}>
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />                <input
                  type="text"
                  name="memberSearch"
                  value={formData.memberSearch}
                  onChange={handleInputChange}
                  onFocus={() => {
                    console.log('Member search focused, current value:', formData.memberSearch);
                    if (formData.memberSearch.trim()) {
                      setShowMemberDropdown(true);
                    }
                  }}
                  placeholder="Enter name, ID, or phone number to search for members"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                />

                {/* Loading indicator for member search */}
                {isSearchingMembers && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-smblue-400"></div>
                  </div>
                )}

                {/* Search Results Dropdown for members */}
                {showMemberDropdown && filteredMembers.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredMembers.map((resident) => (
                      <div
                        key={resident.id}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0" onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Adding member:', resident);
                          setShowMemberDropdown(false);
                          // Add member with default relationship that can be edited later
                          addMemberToHousehold(resident, 'Child');
                        }}
                      >
                        <p className="font-medium text-gray-900">{`${resident.first_name} ${resident.last_name}`}</p>
                        <p className="text-sm text-gray-600">{resident.mobile_number || 'No phone'}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* No results message for members */}
                {showMemberDropdown && formData.memberSearch.trim() && !isSearchingMembers && filteredMembers.length === 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                    <p className="text-gray-500 text-sm">No available residents found matching "{formData.memberSearch}"</p>
                  </div>)}
              </div>
            </div>            {/* Display added members */}
            {formData.members && formData.members.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Household Members:</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          Contact
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          Relationship to Head
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.members.map((member, index) => {
                        const resident = getResidentById(member.residentId);
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {resident ? `${resident.first_name} ${resident.last_name}` : 'Unknown Resident'}
                              </div>
                              {resident?.id && (
                                <div className="text-sm text-gray-500">ID: {resident.id}</div>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {resident?.mobile_number || 'No contact'}
                              </div>
                            </td>                            <td className="px-4 py-3 whitespace-nowrap">
                              <select
                                value={member.relationship}
                                onChange={(e) => updateMemberRelationship(member.residentId, e.target.value)}
                                className="text-sm bg-white border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                              >
                                {RELATIONSHIP_OPTIONS.map(option => (
                                  <option key={option} value={option}>{option}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                type="button"
                                onClick={() => removeMemberFromHousehold(member.residentId)}
                                className="text-red-600 hover:text-red-900 hover:bg-red-100 p-1 rounded"
                                title="Remove member"
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="text-center">
              <span className="text-gray-500 font-medium">OR</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add New Resident as Member
              </label>
              <button
                type="button"
                onClick={handleAddNewResident}
                className="bg-smblue-400 hover:bg-smblue-300 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add New Resident</span>
              </button>
            </div>
          </div>
        </section>

        {/* Socioeconomic Information */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Socioeconomic Information</h2>
          <div className="border-b border-gray-200 mb-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Household Income
              </label>
              <select
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                title="Select income range"
              >
                <option value="">Select Income Range</option>
                <option value="below-10000">Below ₱10,000</option>
                <option value="10000-25000">₱10,000 - ₱25,000</option>
                <option value="25000-50000">₱25,000 - ₱50,000</option>
                <option value="50000-100000">₱50,000 - ₱100,000</option>
                <option value="above-100000">Above ₱100,000</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Income Source
              </label>
              <input
                type="text"
                name="primaryIncomeSource"
                value={formData.primaryIncomeSource}
                onChange={handleInputChange}
                placeholder="e.g. Employment, Business, Agriculture"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Household Classification
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.householdClassification.fourPsBeneficiary}
                  onChange={() => handleCheckboxChange('householdClassification', 'fourPsBeneficiary')}
                  className="mr-2"
                />
                4Ps Beneficiary
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.householdClassification.indigentFamily}
                  onChange={() => handleCheckboxChange('householdClassification', 'indigentFamily')}
                  className="mr-2"
                />
                Indigent Family
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.householdClassification.hasSeniorCitizen}
                  onChange={() => handleCheckboxChange('householdClassification', 'hasSeniorCitizen')}
                  className="mr-2"
                />
                Has Senior Citizen
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.householdClassification.hasPwdMember}
                  onChange={() => handleCheckboxChange('householdClassification', 'hasPwdMember')}
                  className="mr-2"
                />
                Has PWD member
              </label>
            </div>
          </div>
        </section>

        {/* Housing Information */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Housing Information</h2>
          <div className="border-b border-gray-200 mb-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                House Type
              </label>
              <select
                name="houseType"
                value={formData.houseType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                title="Select house type"
              >
                <option value="">Select House Type</option>
                <option value="concrete">Concrete</option>
                <option value="semi-concrete">Semi-Concrete</option>
                <option value="wood">Wood</option>
                <option value="bamboo">Bamboo</option>
                <option value="mixed">Mixed Materials</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ownership Status
              </label>
              <select
                name="ownershipStatus"
                value={formData.ownershipStatus}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                title="Select ownership status"
              >
                <option value="">Select Ownership</option>
                <option value="owned">Owned</option>
                <option value="rented">Rented</option>
                <option value="shared">Shared</option>
                <option value="informal-settler">Informal Settler</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Utilities access
            </label>
            <div className="grid grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.utilitiesAccess.electricity}
                  onChange={() => handleCheckboxChange('utilitiesAccess', 'electricity')}
                  className="mr-2"
                />
                Electricity
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.utilitiesAccess.waterSupply}
                  onChange={() => handleCheckboxChange('utilitiesAccess', 'waterSupply')}
                  className="mr-2"
                />
                Water Supply
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.utilitiesAccess.internetAccess}
                  onChange={() => handleCheckboxChange('utilitiesAccess', 'internetAccess')}
                  className="mr-2"
                />
                Internet Access
              </label>
            </div>
          </div>
        </section>

        {/* Remarks */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Remarks</h2>
          <div className="border-b border-gray-200 mb-6"></div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes or Comments
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              placeholder="Enter any additional information, notes, or special circumstances about this household..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
            />
          </div>
        </section>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{isSubmitting ? 'Saving...' : 'Save Household'}</span>
          </button>
        </div>
      </form>
    </main>
  );
};

export default AddNewHousehold;