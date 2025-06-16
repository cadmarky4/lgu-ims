import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

interface AddNewHouseholdProps {
  onClose: () => void;
  onSave: (householdData: any) => void;
}

const AddNewHousehold: React.FC<AddNewHouseholdProps> = ({ onClose, onSave }) => {
  // Loading and error states for API calls
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Toast state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  // Toast utility function
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Reference data from backend
  const [barangays, setBarangays] = useState<any[]>([]);
  const [residents, setResidents] = useState<any[]>([]);
  const [filteredResidents, setFilteredResidents] = useState<any[]>([]);

  const [formData, setFormData] = useState({
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
  });

  // Household members state
  const [householdMembers, setHouseholdMembers] = useState<any[]>([]);
  const [selectedHouseholdHead, setSelectedHouseholdHead] = useState<any>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [memberSearchResults, setMemberSearchResults] = useState<any[]>([]);
  const [selectedMemberResident, setSelectedMemberResident] = useState<any>(null);
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
      showToast('Draft saved successfully!', 'success');
    } catch (error) {
      showToast('Failed to save draft. Please try again.', 'error');
      console.error('Failed to save draft:', error);
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Clear draft from localStorage
  const clearDraft = () => {
    try {
      localStorage.removeItem('householdDraft');
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  };

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
  };

  // Fetch reference data on component mount
  useEffect(() => {
    const fetchReferenceData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Backend developer - replace with actual endpoints
        // Fetch barangays
        // const barangayResponse = await fetch('/api/barangays');
        // const barangayData = await barangayResponse.json();
        // setBarangays(barangayData);

        // Fetch residents for search functionality
        // const residentsResponse = await fetch('/api/residents');
        // const residentsData = await residentsResponse.json();
        // setResidents(residentsData);

        // For now, using mock data
        setBarangays([
          { id: 1, name: 'San Miguel', value: 'san-miguel' },
          { id: 2, name: 'Poblacion', value: 'poblacion' },
          { id: 3, name: 'Santo Domingo', value: 'santo-domingo' }
        ]);

        setResidents([
          { id: 1, name: 'Maria Santos', phone: '+63-945-890-9999' },
          { id: 2, name: 'Juan Dela Cruz', phone: '+63-917-123-4567' },
          { id: 3, name: 'Ana Reyes', phone: '+63-922-987-6543' },
          { id: 4, name: 'Roberto Garcia', phone: '+63-939-555-7890' }
        ]);

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
    if (formData.householdHeadSearch.trim()) {
      const filtered = residents.filter(resident =>
        resident.name.toLowerCase().includes(formData.householdHeadSearch.toLowerCase()) ||
        resident.phone.includes(formData.householdHeadSearch)
      );
      setFilteredResidents(filtered);
    } else {
      setFilteredResidents([]);
    }
  }, [formData.householdHeadSearch, residents]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Backend developer - replace with actual endpoint
      // const response = await fetch('/api/households', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData)
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to create household');
      // }

      // const newHousehold = await response.json();
      
      // Include household members in the data
      const householdData = {
        ...formData,
        householdHead: selectedHouseholdHead,
        members: householdMembers,
        totalMembers: householdMembers.length + (selectedHouseholdHead ? 1 : 0)
      };

      // Clear the draft since household was successfully created
      clearDraft();
      
      // Show success toast
      showToast('Household created successfully!', 'success');

      // For now, using the existing client-side save
      onSave(householdData);
      onClose();
    } catch (err) {
      setError('Failed to save household. Please try again.');
      console.error('Error saving household:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNewResident = () => {
    console.log('Add new resident clicked');
  };

  // Member search functionality
  useEffect(() => {
    if (memberSearchTerm.trim()) {
      const filtered = residents.filter(resident =>
        resident.name.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
        resident.phone.includes(memberSearchTerm)
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

  const handleSelectHouseholdHead = (resident: any) => {
    setSelectedHouseholdHead(resident);
    setFormData(prev => ({ ...prev, householdHeadSearch: resident.name }));
    setFilteredResidents([]);
  };

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

  const handleRemoveMember = (memberId: string) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      setHouseholdMembers(prev => prev.filter(member => member.id !== memberId));
    }
  };

  const handleSelectMemberResident = (resident: any) => {
    setSelectedMemberResident(resident);
    setMemberSearchTerm(resident.name);
    setMemberSearchResults([]);
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-darktext pl-0">Add New Household Profile</h1>
        {localStorage.getItem('householdDraft') && (
          <p className="text-sm text-gray-600 mt-1">
            📝 Draft data loaded from previous session
          </p>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
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
              <select
                name="barangay"
                value={formData.barangay}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                required
                title="Select barangay"
                disabled={isLoading}
              >
                <option value="">Select Barangay</option>
                {barangays.map((barangay) => (
                  <option key={barangay.id} value={barangay.value}>
                    {barangay.name}
                  </option>
                ))}
              </select>
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
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="householdHeadSearch"
                  value={formData.householdHeadSearch}
                  onChange={handleInputChange}
                  placeholder="Enter name, ID, or phone number"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                  disabled={isLoading}
                />
                {/* Search Results Dropdown */}
                {filteredResidents.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredResidents.map((resident) => (
                      <div
                        key={resident.id}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handleSelectHouseholdHead(resident)}
                      >
                        <p className="font-medium text-gray-900">{resident.name}</p>
                        <p className="text-sm text-gray-600">{resident.phone}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

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
          
          {/* Household Head Display */}
          {selectedHouseholdHead && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-blue-900 mb-2">Household Head</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-800">{selectedHouseholdHead.name}</p>
                  <p className="text-sm text-blue-600">{selectedHouseholdHead.phone}</p>
                </div>
                <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  HEAD
                </span>
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
                            className={`px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                              selectedMemberResident?.id === resident.id ? 'bg-smblue-50' : ''
                            }`}
                            onClick={() => handleSelectMemberResident(resident)}
                          >
                            <p className="font-medium text-gray-900">{resident.name}</p>
                            <p className="text-sm text-gray-600">{resident.phone}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {selectedMemberResident && (
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="font-medium text-gray-900">
                      Selected: {selectedMemberResident.name}
                    </p>
                    <p className="text-sm text-gray-600">{selectedMemberResident.phone}</p>
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
                        <p className="font-medium text-gray-900">{member.resident.name}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {member.resident.phone}
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
        </div>
      </form>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg border ${
            toast.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {toast.type === 'success' ? (
              <FiCheck className="w-5 h-5 text-green-600" />
            ) : (
              <FiX className="w-5 h-5 text-red-600" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => setToast({ show: false, message: '', type: 'success' })}
              className="ml-2 text-gray-400 hover:text-gray-600"
              title="Close notification"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default AddNewHousehold; 