import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiX, FiCheck } from 'react-icons/fi';

const EditHousehold: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Loading and error states for API calls
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingHousehold, setIsFetchingHousehold] = useState(false);
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
  
  const [household, setHousehold] = useState<any>(null);

  const [formData, setFormData] = useState({
    householdId: '',
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
    remarks: ''
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
  };

  // Fetch reference data and fresh household data on component mount
  useEffect(() => {
    const fetchData = async () => {
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

    // Fetch fresh household data
    const fetchHouseholdData = async () => {
      if (!id) return;
      
      setIsFetchingHousehold(true);
      try {
        // TODO: Backend developer - replace with actual endpoint
        // const response = await fetch(`/api/households/${id}`);
        // const householdData = await response.json();
        
        // For now, using mock data - would need to get from API
        // This is a simplified example - you would get this from the API
        const mockHousehold = {
          id: id,
          headName: 'Mock Head',
          address: 'Mock Address',
          ownership: 'Owned',
          income: 25000,
          programs: ['4Ps']
        };
        
        setHousehold(mockHousehold);
        
        // Populate form with household data
        setFormData(prev => ({
          ...prev,
          householdId: mockHousehold.id,
          completeAddress: mockHousehold.address,
          householdHeadSearch: mockHousehold.headName,
          monthlyIncome: mockHousehold.income?.toString() || '',
          ownershipStatus: mockHousehold.ownership,
          householdClassification: {
            ...prev.householdClassification,
            fourPsBeneficiary: mockHousehold.programs?.includes('4Ps') || false,
            hasSeniorCitizen: mockHousehold.programs?.includes('Senior Citizen Assistance') || false,
          }
        }));
      } catch (error) {
        console.error('Failed to load household:', error);
        setError('Failed to load household data');
      } finally {
        setIsFetchingHousehold(false);
      }
    };

    fetchData();
    fetchHouseholdData();
  }, [id]);

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
      // const response = await fetch(`/api/households/${id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData)
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to update household');
      // }

      // const updatedHousehold = await response.json();
      
      console.log('Household updated:', formData);
      showToast('Household updated successfully!', 'success');
      
      // Navigate back to households list after a short delay to show the toast
      setTimeout(() => {
        navigate('/household');
      }, 1500);
    } catch (err) {
      setError('Failed to update household. Please try again.');
      showToast('Failed to update household. Please try again.', 'error');
      console.error('Error updating household:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (window.confirm('Any unsaved changes will be lost. Are you sure you want to leave?')) {
      navigate('/household');
    }
  };

  if (isLoading) {
    return (
      <main className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-smblue-400 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading household data...</p>
        </div>
      </main>
    );
  }

  if (error || !household) {
    return (
      <main className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Household not found'}</p>
          <button
            onClick={() => navigate('/household')}
            className="px-4 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300"
          >
            Back to Households
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      {/* Header */}
      <div className="mb-2 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-darktext pl-0">Edit Household Profile</h1>
        <button
          onClick={handleClose}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Close"
        >
          <FiX className="w-6 h-6" />
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {(isLoading || isFetchingHousehold) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800 text-sm">
            {isFetchingHousehold ? 'Loading household data...' : 'Loading reference data...'}
          </p>
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
                disabled={isLoading || isFetchingHousehold}
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
                  disabled={isLoading || isFetchingHousehold}
                />
                {/* Search Results Dropdown */}
                {filteredResidents.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredResidents.map((resident) => (
                      <div
                        key={resident.id}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => setFormData(prev => ({ ...prev, householdHeadSearch: resident.name }))}
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
              <button
                type="button"
                onClick={() => console.log('Add new resident clicked')}
                className="text-smblue-400 hover:text-smblue-300 font-medium flex items-center justify-center space-x-2 mx-auto"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add New Resident as Head</span>
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
                Search and Add Members
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="memberSearch"
                  value={formData.memberSearch}
                  onChange={handleInputChange}
                  placeholder="Search residents to add as members"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                />
              </div>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => console.log('Add new resident clicked')}
                className="text-smblue-400 hover:text-smblue-300 font-medium flex items-center justify-center space-x-2 mx-auto"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add New Resident as Member</span>
              </button>
            </div>
          </div>
        </section>

        {/* Economic Information */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Economic Information</h2>
          <div className="border-b border-gray-200 mb-6"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Household Income *
              </label>
              <input
                type="number"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleInputChange}
                placeholder="Enter monthly income in PHP"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Income Source *
              </label>
              <select
                name="primaryIncomeSource"
                value={formData.primaryIncomeSource}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                required
              >
                <option value="">Select Income Source</option>
                <option value="employment">Employment</option>
                <option value="business">Business</option>
                <option value="agriculture">Agriculture</option>
                <option value="remittance">Remittance (OFW)</option>
                <option value="pension">Pension</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </section>

        {/* Household Classification */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Household Classification</h2>
          <div className="border-b border-gray-200 mb-6"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.householdClassification.fourPsBeneficiary}
                onChange={() => handleCheckboxChange('householdClassification', 'fourPsBeneficiary')}
                className="mr-3 h-4 w-4 text-smblue-400 focus:ring-smblue-200 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">4Ps Beneficiary Family</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.householdClassification.indigentFamily}
                onChange={() => handleCheckboxChange('householdClassification', 'indigentFamily')}
                className="mr-3 h-4 w-4 text-smblue-400 focus:ring-smblue-200 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Indigent Family</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.householdClassification.hasSeniorCitizen}
                onChange={() => handleCheckboxChange('householdClassification', 'hasSeniorCitizen')}
                className="mr-3 h-4 w-4 text-smblue-400 focus:ring-smblue-200 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Has Senior Citizen Member</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.householdClassification.hasPwdMember}
                onChange={() => handleCheckboxChange('householdClassification', 'hasPwdMember')}
                className="mr-3 h-4 w-4 text-smblue-400 focus:ring-smblue-200 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Has PWD Member</span>
            </label>
          </div>
        </section>

        {/* Housing Information */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Housing Information</h2>
          <div className="border-b border-gray-200 mb-6"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                House Type *
              </label>
              <select
                name="houseType"
                value={formData.houseType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                required
              >
                <option value="">Select House Type</option>
                <option value="concrete">Concrete</option>
                <option value="wood">Wood</option>
                <option value="mixed">Mixed (Concrete & Wood)</option>
                <option value="bamboo">Bamboo/Nipa</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ownership Status *
              </label>
              <select
                name="ownershipStatus"
                value={formData.ownershipStatus}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                required
              >
                <option value="">Select Ownership</option>
                <option value="Owned">Owned</option>
                <option value="Rented">Rented</option>
                <option value="Shared">Shared</option>
                <option value="Caretaker">Caretaker</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Utilities Access</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.utilitiesAccess.electricity}
                  onChange={() => handleCheckboxChange('utilitiesAccess', 'electricity')}
                  className="mr-3 h-4 w-4 text-smblue-400 focus:ring-smblue-200 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Electricity</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.utilitiesAccess.waterSupply}
                  onChange={() => handleCheckboxChange('utilitiesAccess', 'waterSupply')}
                  className="mr-3 h-4 w-4 text-smblue-400 focus:ring-smblue-200 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Water Supply</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.utilitiesAccess.internetAccess}
                  onChange={() => handleCheckboxChange('utilitiesAccess', 'internetAccess')}
                  className="mr-3 h-4 w-4 text-smblue-400 focus:ring-smblue-200 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Internet Access</span>
              </label>
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Additional Information</h2>
          <div className="border-b border-gray-200 mb-6"></div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              placeholder="Any additional notes or remarks about this household"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
            />
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
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
            disabled={isLoading || isFetchingHousehold || isSubmitting}
          >
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>{isSubmitting ? 'Updating...' : 'Update Household'}</span>
          </button>
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

export default EditHousehold;