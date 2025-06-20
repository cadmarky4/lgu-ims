import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiX, FiTrash2 } from 'react-icons/fi';
import Breadcrumb from '../global/Breadcrumb';
import { HouseholdsService } from '../../services/households.service';
import { ResidentsService } from '../../services/residents.service';
import { useNotificationHelpers } from '../global/NotificationSystem';
import { type HouseholdFormData } from '../../services/household.types';
import { type Resident } from '../../services/resident.types';
import { type Barangay } from '../../services/types';

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

const AddNewHousehold: React.FC = () => {
  const navigate = useNavigate();
  const { showCreateSuccess, showCreateError, showSuccess, showError } = useNotificationHelpers();
  
  // Refs for dropdown click-outside detection
  const headSearchRef = useRef<HTMLDivElement>(null);
  const memberSearchRef = useRef<HTMLDivElement>(null);

  // Loading and error states for API calls
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Animation trigger on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Services
  const householdsService = new HouseholdsService();
  const residentsService = new ResidentsService();

  // Reference data from backend
  const [, setBarangays] = useState<Barangay[]>([]);
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

  // Household members state
  const [householdMembers, setHouseholdMembers] = useState<{
      id: number,
      resident: Resident,
      relationship_to_head: string,
      is_household_head: boolean
    }[]>([]);
  const [selectedHouseholdHead, setSelectedHouseholdHead] = useState<Resident | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [memberSearchResults, setMemberSearchResults] = useState<Resident[]>([]);
  const [selectedMemberResident, setSelectedMemberResident] = useState<Resident | null>(null);
  const [memberRelationship, setMemberRelationship] = useState('');

  const relationshipOptions = [
    'Spouse',
    'Son',
    'Daughter',
    'Father',
    'Mother',
    'Brother',
    'Sister',
    'Grandson',
    'Granddaughter',
    'Grandfather',
    'Grandmother',
    'Uncle',
    'Aunt',
    'Nephew',
    'Niece',
    'Cousin',
    'Son-in-law',
    'Daughter-in-law',
    'Father-in-law',
    'Mother-in-law',
    'Brother-in-law',
    'Sister-in-law',
    'Other'
  ];

  // Load draft data from localStorage
  const loadDraftData = () => {
    try {
      const savedDraft = localStorage.getItem('householdDraft');
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        setFormData(draftData.formData || draftData);
        if (draftData.selectedHouseholdHead) {
          setSelectedHouseholdHead(draftData.selectedHouseholdHead);
        }
        if (draftData.householdMembers) {
          setHouseholdMembers(draftData.householdMembers);
        }
      }
    } catch (error) {
      console.error('Failed to load draft data:', error);
    }
  };

  // Save draft to localStorage
  const handleSaveDraft = () => {
    setIsSavingDraft(true);
    try {
      const draftData = {
        formData,
        selectedHouseholdHead,
        householdMembers
      };
      localStorage.setItem('householdDraft', JSON.stringify(draftData));
      setError(null);
      showSuccess('Draft saved successfully!');
    } catch (error) {
      showError('Failed to save draft. Please try again.');
      console.error('Failed to save draft:', error);
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Clear draft from localStorage
  // const clearDraft = () => {
  //   try {
  //     localStorage.removeItem('householdDraft');
  //   } catch (error) {
  //     console.error('Failed to clear draft:', error);
  //   }
  // };

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [field]: !(prev[section] as any)[field]
      }
    }));
  }; 
  
  // Click outside handler for dropdowns
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
    loadDraftData();
  }, []);

  // Filter residents based on search input
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
      
      // Show success notification
      const householdName = result.household_number || `Household #${result.id}`;
      showCreateSuccess('Household', householdName);
      
      // Navigate back to household list after a short delay
      setTimeout(() => {
        navigate('/household');
      }, 1000);
      
      // onSave(formData); // Still call onSave for parent component to refresh list
      // onClose();
    } catch (err) {
      console.error('Error creating household:', err);
      
      let errorMessage = 'Failed to save household. Please try again.';
      if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      }
      
      // Show error notification
      showCreateError('Household', errorMessage);
      setIsErrorInfo(false);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (JSON.stringify(formData) !== JSON.stringify({
      householdId: 'Auto-generated',
      householdType: '',
      barangay: '',
      streetSitio: '',
      houseNumber: '',
      completeAddress: '',
      householdHeadSearch: '',
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
      remarks: ''
    })) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/household');
      }
    } else {
      navigate('/household');
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

  // Member search functionality
  useEffect(() => {
    if (memberSearchTerm.trim()) {
      const filtered = residents.filter(resident =>
        `${resident.first_name} ${resident.middle_name} ${resident.last_name}`.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
        resident.mobile_number?.includes(memberSearchTerm)
      ).filter(resident =>
        // Exclude household head and existing members
        resident.id !== selectedHouseholdHead?.id &&
        !householdMembers.some(member => member.resident.id === resident.id)
      );
      setMemberSearchResults(filtered);
    } else {
      setMemberSearchResults([]);
    }
  }, [memberSearchTerm, residents, selectedHouseholdHead, householdMembers]);

  // const handleSelectHouseholdHead = (resident: { name: string }) => {
  //   setSelectedHouseholdHead(resident);
  //   setFormData(prev => ({ ...prev, householdHeadSearch: resident.name }));
  //   setFilteredResidents([]);
  // };

  const handleAddMember = () => {
    if (!selectedMemberResident || !memberRelationship) {
      setError('Please select a resident and relationship');
      return;
    }

    const newMember = {
      id: Date.now(),
      resident: selectedMemberResident,
      relationship_to_head: memberRelationship,
      is_household_head: false
    };

    setHouseholdMembers(prev => [...prev, newMember]);

    // Reset member form
    setSelectedMemberResident(null);
    setMemberRelationship('');
    setMemberSearchTerm('');
    setMemberSearchResults([]);
    setShowAddMember(false);
    setError(null);
  };

  const handleRemoveMember = (memberId: number) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      setHouseholdMembers(prev => prev.filter(member => member.id !== memberId)); 
    }
  };

  const handleSelectMemberResident = (resident: Resident) => {
    setSelectedMemberResident(resident);
    setMemberSearchTerm(`${resident.first_name} ${resident.middle_name || ''} ${resident.last_name}`);
    setMemberSearchResults([]);
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      {/* Automatic Breadcrumbs */}
      <Breadcrumb isLoaded={isLoaded} />

      {/* Header */}
      <div className={`mb-2 transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <h1 className="text-2xl font-bold text-darktext pl-0">Add New Household Profile</h1>
        {localStorage.getItem('householdDraft') && (
          <p className="text-sm text-gray-600 mt-1">
            📝 Draft data loaded from previous session
          </p>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className={`border rounded-lg p-4 mb-4 transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } ${isErrorInfo
          ? 'bg-blue-50 border-blue-200'
          : 'bg-red-50 border-red-200'
          }`} style={{ transitionDelay: '200ms' }}>
          <p className={`text-sm ${isErrorInfo ? 'text-blue-800' : 'text-red-800'
            }`}>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ transitionDelay: '250ms' }}>
          <p className="text-blue-800 text-sm">Loading reference data...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ transitionDelay: '300ms' }}>
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

          <div className="space-y-4">
            <div>
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
            </div>

            {/* Selected Household Head Preview */}
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
        </section>

        {/* Household Members */}
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
            </div>
          </div>

          {/* Display added members */}
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

          {/* Add Member Button */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              {householdMembers.length} member{householdMembers.length !== 1 ? 's' : ''} added
            </p>
            <button
              type="button"
              onClick={() => setShowAddMember(true)}
              disabled={!selectedHouseholdHead}
              className="bg-smblue-400 hover:bg-smblue-300 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          </div>

          {!selectedHouseholdHead && (
            <div className="bg-yellow-50 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> Please select a household head first before adding members.
              </p>
            </div>
          )}

          {/* Add Member Form */}
          {showAddMember && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-4">Add New Member</h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Resident
                  </label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={memberSearchTerm}
                      onChange={(e) => setMemberSearchTerm(e.target.value)}
                      placeholder="Search by name or phone number"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                    />

                    {/* Member Search Results */}
                    {memberSearchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {memberSearchResults.map((resident) => (
                          <div
                            key={resident.id}
                            className={`px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${selectedMemberResident?.id === resident.id ? 'bg-smblue-50' : ''
                              }`}
                            onClick={() => handleSelectMemberResident(resident)}
                          >
                            <p className="font-medium text-gray-900">{`${resident.first_name} ${resident.last_name}`}</p>
                            <p className="text-sm text-gray-600">{resident.mobile_number}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {selectedMemberResident && (
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="font-medium text-gray-900">
                      Selected: {`${selectedMemberResident.first_name} ${selectedMemberResident.last_name}`}
                    </p>
                    <p className="text-sm text-gray-600">{selectedMemberResident.mobile_number}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship to Household Head *
                  </label>
                  <select
                    value={memberRelationship}
                    onChange={(e) => setMemberRelationship(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                    required
                  >
                    <option value="">Select Relationship</option>
                    {relationshipOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleAddMember}
                    disabled={!selectedMemberResident || !memberRelationship}
                    className="bg-smblue-400 hover:bg-smblue-300 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Member
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddMember(false);
                      setSelectedMemberResident(null);
                      setMemberRelationship('');
                      setMemberSearchTerm('');
                      setMemberSearchResults([]);
                      setError(null);
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Members Table */}
          {householdMembers.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Phone</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Relationship</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {householdMembers.map((member) => (
                    <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{`${member.resident.first_name} ${member.resident.last_name}`}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {member.resident.mobile_number}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {member.relationship_to_head}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Remove member"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSavingDraft || isSubmitting}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSavingDraft && (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>{isSavingDraft ? "Saving Draft..." : "Save Draft"}</span>
          </button>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleClose}
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
        </div>
      </form >    </main >
  );
};

export default AddNewHousehold;