import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX, FiTrash2 } from 'react-icons/fi';
import { HouseholdsService } from '../services/households.service';
import { ResidentsService } from '../services/residents.service';
import { type HouseholdFormData, type Resident, type Household } from '../services/types';

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

interface EditHouseholdProps {
  household: Household;
  onClose: () => void;
  onSave: (householdData: HouseholdFormData) => void;
}

const EditHousehold: React.FC<EditHouseholdProps> = ({ household, onClose, onSave }) => {
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
  const [residents, setResidents] = useState<Resident[]>([]);
  const [filteredResidents, setFilteredResidents] = useState<Resident[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Resident[]>([]);

  // Dropdown visibility states
  const [showHeadDropdown, setShowHeadDropdown] = useState(false);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);

  // Form data and member selection states
  const [selectedHead, setSelectedHead] = useState<Resident | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<Array<{ resident: Resident; relationship: string }>>([]);
  const [formData, setFormData] = useState({
    household_number: '',
    household_type: '',
    barangay: '',
    street_sitio: '',
    house_number: '',
    complete_address: '',
    monthly_income: '',
    primary_income_source: '',
    house_type: '',
    ownership_status: '',
    four_ps_beneficiary: false,
    indigent_family: false,
    has_senior_citizen: false,
    has_pwd_member: false,
    has_electricity: false,
    has_water_supply: false,
    has_internet_access: false,
    remarks: '',
    created_by: 1
  });

  // Search state
  const [headSearch, setHeadSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');

  // Initialize form data with household data
  useEffect(() => {
    if (household) {
      setFormData({
        household_number: household.household_number || '',
        household_type: household.household_type || '',
        barangay: household.barangay || '',
        street_sitio: household.street_sitio || '',
        house_number: household.house_number || '',
        complete_address: household.complete_address || '',
        monthly_income: household.monthly_income || '',
        primary_income_source: household.primary_income_source || '',
        house_type: household.house_type || '',
        ownership_status: household.ownership_status || '',
        four_ps_beneficiary: household.four_ps_beneficiary || false,
        indigent_family: household.indigent_family || false,
        has_senior_citizen: household.has_senior_citizen || false,
        has_pwd_member: household.has_pwd_member || false,
        has_electricity: household.has_electricity || false,
        has_water_supply: household.has_water_supply || false,
        has_internet_access: household.has_internet_access || false,
        remarks: household.remarks || '',
        created_by: 1
      });

      // Set selected head if exists
      if (household.head_resident) {
        setSelectedHead(household.head_resident as Resident);
        setHeadSearch(`${household.head_resident.first_name} ${household.head_resident.last_name}`);
      }

      // Set selected members if exist
      if (household.members && Array.isArray(household.members)) {
        const membersWithRelationships = household.members.map(member => ({
          resident: member as Resident,
          relationship: (member as any).relationship_to_head || 'Child'
        }));
        setSelectedMembers(membersWithRelationships);
      }
    }
  }, [household]);

  // Load reference data
  useEffect(() => {
    const loadReferenceData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Load residents for search
        const residentsData = await residentsService.getResidents();
        setResidents(residentsData.data || residentsData);
        setFilteredResidents(residentsData.data || residentsData);
        setFilteredMembers(residentsData.data || residentsData);
      } catch (err) {
        setError('Failed to load residents data');
        console.error('Error loading residents:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadReferenceData();
  }, []);

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle head search
  const handleHeadSearch = (searchTerm: string) => {
    setHeadSearch(searchTerm);
    setShowHeadDropdown(true);
    if (searchTerm.trim() === '') {
      setFilteredResidents(residents);
    } else {
      const filtered = residents.filter(resident => {
        const fullName = `${resident.first_name} ${resident.last_name}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      });
      setFilteredResidents(filtered);
    }
  };

  // Handle member search
  const handleMemberSearch = (searchTerm: string) => {
    setMemberSearch(searchTerm);
    setShowMemberDropdown(true);
    if (searchTerm.trim() === '') {
      setFilteredMembers(residents);
    } else {
      const filtered = residents.filter(resident => {
        const fullName = `${resident.first_name} ${resident.last_name}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      });
      setFilteredMembers(filtered);
    }
  };

  // Select household head
  const selectHead = (resident: Resident) => {
    setSelectedHead(resident);
    setHeadSearch(`${resident.first_name} ${resident.last_name}`);
    setShowHeadDropdown(false);
    
    // Remove from members if already selected as member
    setSelectedMembers(prev => prev.filter(member => member.resident.id !== resident.id));
  };

  // Select household member
  const selectMember = (resident: Resident) => {
    // Check if already selected as head
    if (selectedHead && selectedHead.id === resident.id) {
      setError('This person is already selected as household head');
      return;
    }

    // Check if already selected as member
    if (selectedMembers.some(member => member.resident.id === resident.id)) {
      setError('This person is already selected as a member');
      return;
    }

    setSelectedMembers(prev => [...prev, { resident, relationship: 'Child' }]);
    setMemberSearch('');
    setShowMemberDropdown(false);
    setError(null);
  };

  // Remove member
  const removeMember = (residentId: number) => {
    setSelectedMembers(prev => prev.filter(member => member.resident.id !== residentId));
  };

  // Update member relationship
  const updateMemberRelationship = (residentId: number, relationship: string) => {
    setSelectedMembers(prev => prev.map(member =>
      member.resident.id === residentId
        ? { ...member, relationship }
        : member
    ));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);    // Validation
    if (!formData.complete_address.trim()) {
      setError('Please enter a complete address');
      return;
    }

    setIsSubmitting(true);
    try {      
      const householdData: HouseholdFormData = {
        householdId: formData.household_number,
        householdType: formData.household_type as any,
        barangay: formData.barangay,
        streetSitio: formData.street_sitio,
        houseNumber: formData.house_number,
        completeAddress: formData.complete_address,
        householdHeadSearch: headSearch,
        memberSearch: memberSearch,
        monthlyIncome: formData.monthly_income as any,
        primaryIncomeSource: formData.primary_income_source,
        householdClassification: {
          fourPsBeneficiary: formData.four_ps_beneficiary,
          indigentFamily: formData.indigent_family,
          hasSeniorCitizen: formData.has_senior_citizen,
          hasPwdMember: formData.has_pwd_member,
        },
        houseType: formData.house_type as any,
        ownershipStatus: formData.ownership_status as any,
        utilitiesAccess: {
          electricity: formData.has_electricity,
          waterSupply: formData.has_water_supply,
          internetAccess: formData.has_internet_access,
        },
        remarks: formData.remarks,
        headResidentId: selectedHead?.id || household.head_resident_id,
        members: selectedMembers.map(member => ({
          residentId: member.resident.id,
          relationship: member.relationship
        }))
      };

      await onSave(householdData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update household');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Click outside handler
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <main className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      {/* Header */}
      <div className="mb-2 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-darktext pl-0">Edit Household</h1>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Close"
        >
          <FiX className="w-6 h-6" />
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
            Basic Household Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-darktext mb-2">Household Number</label>
              <input
                type="text"
                name="household_number"
                value={formData.household_number}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-smblue-500 focus:border-transparent"
                placeholder="Auto-generated if empty"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-darktext mb-2">Household Type</label>
              <select
                name="household_type"
                value={formData.household_type}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-smblue-500 focus:border-transparent"
              >
                <option value="">Select Type</option>
                <option value="nuclear">Nuclear Family</option>
                <option value="extended">Extended Family</option>
                <option value="single_parent">Single Parent</option>
                <option value="single_person">Single Person</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-darktext mb-2">Barangay</label>
              <input
                type="text"
                name="barangay"
                value={formData.barangay}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-smblue-500 focus:border-transparent"
                placeholder="Enter barangay"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-darktext mb-2">Street/Sitio</label>
              <input
                type="text"
                name="street_sitio"
                value={formData.street_sitio}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-smblue-500 focus:border-transparent"
                placeholder="Enter street or sitio"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-darktext mb-2">House Number</label>
              <input
                type="text"
                name="house_number"
                value={formData.house_number}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-smblue-500 focus:border-transparent"
                placeholder="Enter house number"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-darktext mb-2">Complete Address *</label>
              <input
                type="text"
                name="complete_address"
                value={formData.complete_address}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-smblue-500 focus:border-transparent"
                placeholder="Enter complete address"
                required
              />
            </div>
          </div>
        </div>

        {/* Household Head Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
            Household Head *
          </h2>
          
          <div className="relative" ref={headSearchRef}>
            <label className="block text-sm font-medium text-darktext mb-2">Search and Select Head of Family</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={headSearch}
                onChange={(e) => handleHeadSearch(e.target.value)}
                onClick={() => setShowHeadDropdown(true)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-smblue-500 focus:border-transparent"
                placeholder="Type to search for household head..."
              />
            </div>
              {showHeadDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredResidents.length > 0 ? (
                  filteredResidents.map((resident) => (
                    <button
                      key={resident.id}
                      type="button"
                      onClick={() => selectHead(resident)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex flex-col"
                    >
                      <span className="font-medium text-darktext">
                        {resident.first_name} {resident.last_name}
                      </span>
                      {resident.mobile_number && (
                        <span className="text-sm text-gray-500">{resident.mobile_number}</span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-sm">No residents found</div>
                )}
              </div>
            )}
          </div>

          {selectedHead && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-darktext mb-2">Selected Household Head:</h3>
              <div className="flex justify-between items-center">
                <div>                  <p className="font-medium">{selectedHead.first_name} {selectedHead.last_name}</p>
                  {selectedHead.mobile_number && (
                    <p className="text-sm text-gray-600">{selectedHead.mobile_number}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedHead(null);
                    setHeadSearch('');
                  }}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Remove selection"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Household Members Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
            Household Members
          </h2>
          
          <div className="relative mb-4" ref={memberSearchRef}>
            <label className="block text-sm font-medium text-darktext mb-2">Add Family Members</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => handleMemberSearch(e.target.value)}
                onClick={() => setShowMemberDropdown(true)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-smblue-500 focus:border-transparent"
                placeholder="Type to search for family members..."
              />
            </div>
              {showMemberDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((resident) => (
                    <button
                      key={resident.id}
                      type="button"
                      onClick={() => selectMember(resident)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex flex-col"
                    >
                      <span className="font-medium text-darktext">
                        {resident.first_name} {resident.last_name}
                      </span>
                      {resident.mobile_number && (
                        <span className="text-sm text-gray-500">{resident.mobile_number}</span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-sm">No residents found</div>
                )}
              </div>
            )}
          </div>

          {selectedMembers.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Contact</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Relationship</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedMembers.map((member, index) => (
                    <tr key={member.resident.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 border-b">
                        {member.resident.first_name} {member.resident.last_name}
                      </td>                      <td className="px-4 py-3 border-b text-sm text-gray-600">
                        {member.resident.mobile_number || 'N/A'}
                      </td>
                      <td className="px-4 py-3 border-b">
                        <select
                          value={member.relationship}
                          onChange={(e) => updateMemberRelationship(member.resident.id, e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-smblue-500 focus:border-transparent"
                        >
                          {RELATIONSHIP_OPTIONS.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 border-b">
                        <button
                          type="button"
                          onClick={() => removeMember(member.resident.id)}
                          className="text-red-500 hover:text-red-700 p-1"
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

          {selectedMembers.length === 0 && (
            <p className="text-gray-500 text-sm italic">No family members added yet.</p>
          )}
        </div>

        {/* Economic Information Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
            Economic Information
          </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-darktext mb-2">Monthly Household Income</label>
              <select
                name="monthly_income"
                value={formData.monthly_income}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-smblue-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-darktext mb-2">Primary Income Source</label>
              <input
                type="text"
                name="primary_income_source"
                value={formData.primary_income_source}
                onChange={handleInputChange}
                placeholder="e.g. Employment, Business, Agriculture"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-smblue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Housing Information Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
            Housing Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-darktext mb-2">House Type</label>
              <select
                name="house_type"
                value={formData.house_type}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-smblue-500 focus:border-transparent"
              >
                <option value="">Select House Type</option>
                <option value="concrete">Concrete</option>
                <option value="semi_concrete">Semi-Concrete</option>
                <option value="wood">Wood</option>
                <option value="bamboo">Bamboo</option>
                <option value="mixed">Mixed Materials</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-darktext mb-2">Ownership Status</label>
              <select
                name="ownership_status"
                value={formData.ownership_status}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-smblue-500 focus:border-transparent"
              >
                <option value="">Select Ownership</option>
                <option value="owned">Owned</option>
                <option value="rented">Rented</option>
                <option value="shared">Shared</option>
                <option value="caretaker">Caretaker</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Classification and Programs Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
            Household Classification & Programs
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="four_ps_beneficiary"
                  checked={formData.four_ps_beneficiary}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-smblue-500 focus:ring-smblue-500"
                />
                <span className="ml-2 text-sm text-darktext">4Ps Beneficiary</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="indigent_family"
                  checked={formData.indigent_family}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-smblue-500 focus:ring-smblue-500"
                />
                <span className="ml-2 text-sm text-darktext">Indigent Family</span>
              </label>
            </div>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="has_senior_citizen"
                  checked={formData.has_senior_citizen}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-smblue-500 focus:ring-smblue-500"
                />
                <span className="ml-2 text-sm text-darktext">Has Senior Citizen</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="has_pwd_member"
                  checked={formData.has_pwd_member}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-smblue-500 focus:ring-smblue-500"
                />
                <span className="ml-2 text-sm text-darktext">Has PWD Member</span>
              </label>
            </div>
          </div>
        </div>

        {/* Utilities Access Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
            Utilities Access
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="has_electricity"
                checked={formData.has_electricity}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-smblue-500 focus:ring-smblue-500"
              />
              <span className="ml-2 text-sm text-darktext">Electricity</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="has_water_supply"
                checked={formData.has_water_supply}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-smblue-500 focus:ring-smblue-500"
              />
              <span className="ml-2 text-sm text-darktext">Water Supply</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="has_internet_access"
                checked={formData.has_internet_access}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-smblue-500 focus:ring-smblue-500"
              />
              <span className="ml-2 text-sm text-darktext">Internet Access</span>
            </label>
          </div>
        </div>

        {/* Remarks Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
            Additional Information
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-darktext mb-2">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-smblue-500 focus:border-transparent"
              placeholder="Additional notes or observations about the household..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>    
                
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-smblue-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            {isSubmitting ? 'Updating...' : 'Update Household'}
          </button>
        </div>
      </form>
    </main>
  );
};

export default EditHousehold;