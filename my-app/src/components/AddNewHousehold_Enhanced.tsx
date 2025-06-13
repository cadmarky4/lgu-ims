import React, { useState } from 'react';
import { FiPlus, FiSearch, FiAlertCircle } from 'react-icons/fi';
import { apiService } from '../services/api';

interface AddNewHouseholdProps {
  onClose: () => void;
  onSave?: (householdData: any) => void;
}

interface FieldError {
  [key: string]: string;
}

const AddNewHousehold: React.FC<AddNewHouseholdProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    household_head_id: '',
    purok: '',
    address: '',
    housing_type: '',
    monthly_income_bracket: '',
    source_of_income: '',
    has_electricity: false,
    has_water_supply: false,
    has_toilet: false,
    has_internet: false,
    vehicle_owned: '',
    remarks: '',
    // Missing fields from database schema
    house_number: '',
    street: '',
    complete_address: '',
    estimated_monthly_income: '',
    income_classification: '',
    four_ps_beneficiary: false,
    four_ps_household_id: '',
    house_ownership: '',
    house_type: '',
    roof_material: '',
    wall_material: '',
    number_of_rooms: '',
    water_source: '',
    toilet_type: '',
    government_programs: [] as string[],
    livelihood_programs: '',
    health_programs: '',
    // For UI search functionality
    household_head_search: '',
    member_search: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldError>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (field: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field] as boolean
    }));
  };

  const handleArrayChange = (field: 'government_programs', value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const validateForm = (): boolean => {
    const errors: FieldError = {};
    
    // Required fields validation
    if (!formData.household_head_id.trim()) {
      errors.household_head_id = "Household head is required";
    }
    
    if (!formData.purok.trim()) {
      errors.purok = "Purok is required";
    }
    
    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }
    
    if (!formData.housing_type.trim()) {
      errors.housing_type = "Housing type is required";
    }
    
    if (!formData.monthly_income_bracket.trim()) {
      errors.monthly_income_bracket = "Monthly income bracket is required";
    }
    
    // Validate income bracket values
    if (formData.monthly_income_bracket && !["BELOW_5000", "5000_10000", "10001_15000", "15001_20000", "20001_30000", "30001_50000", "ABOVE_50000"].includes(formData.monthly_income_bracket)) {
      errors.monthly_income_bracket = "Please select a valid income bracket";
    }
    
    // Validate housing type
    if (formData.housing_type && !['OWNED', 'RENTED', 'SHARED', 'INFORMAL_SETTLER'].includes(formData.housing_type)) {
      errors.housing_type = "Please select a valid housing type";
    }

    // Validate house ownership
    if (formData.house_ownership && !['OWNED', 'RENTED', 'SHARED', 'CARETAKER', 'OTHER'].includes(formData.house_ownership)) {
      errors.house_ownership = "Please select a valid house ownership type";
    }

    // Validate house type
    if (formData.house_type && !['CONCRETE', 'SEMI_CONCRETE', 'WOOD', 'BAMBOO', 'MIXED', 'OTHER'].includes(formData.house_type)) {
      errors.house_type = "Please select a valid house type";
    }

    // Validate income classification
    if (formData.income_classification && !['VERY_POOR', 'POOR', 'LOW_INCOME', 'LOWER_MIDDLE', 'MIDDLE', 'UPPER_MIDDLE', 'UPPER'].includes(formData.income_classification)) {
      errors.income_classification = "Please select a valid income classification";
    }

    // Validate estimated monthly income if provided
    if (formData.estimated_monthly_income && (isNaN(Number(formData.estimated_monthly_income)) || Number(formData.estimated_monthly_income) < 0)) {
      errors.estimated_monthly_income = "Please enter a valid income amount";
    }

    // Validate number of rooms if provided
    if (formData.number_of_rooms && (isNaN(Number(formData.number_of_rooms)) || Number(formData.number_of_rooms) < 1)) {
      errors.number_of_rooms = "Please enter a valid number of rooms";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double-click submission
    if (loading) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setFieldErrors({});
    
    // Validate the form first
    if (!validateForm()) {
      setLoading(false);
      setError("Please fix the highlighted errors below.");
      return;
    }

    try {
      // Transform form data to match backend API structure with all fields
      const householdData = {
        household_head_id: formData.household_head_id,
        purok: formData.purok.trim(),
        address: formData.address.trim(),
        housing_type: formData.housing_type,
        monthly_income_bracket: formData.monthly_income_bracket,
        source_of_income: formData.source_of_income ? formData.source_of_income.trim() : null,
        has_electricity: formData.has_electricity,
        has_water_supply: formData.has_water_supply,
        has_toilet: formData.has_toilet,
        has_internet: formData.has_internet,
        vehicle_owned: formData.vehicle_owned ? formData.vehicle_owned.trim() : null,
        remarks: formData.remarks ? formData.remarks.trim() : null,
        // Additional fields from expanded form
        house_number: formData.house_number ? formData.house_number.trim() : null,
        street: formData.street ? formData.street.trim() : null,
        complete_address: formData.complete_address ? formData.complete_address.trim() : formData.address.trim(),
        estimated_monthly_income: formData.estimated_monthly_income ? Number(formData.estimated_monthly_income) : null,
        income_classification: formData.income_classification || null,
        four_ps_beneficiary: formData.four_ps_beneficiary,
        four_ps_household_id: formData.four_ps_household_id ? formData.four_ps_household_id.trim() : null,
        house_ownership: formData.house_ownership || null,
        house_type: formData.house_type || null,
        roof_material: formData.roof_material || null,
        wall_material: formData.wall_material || null,
        number_of_rooms: formData.number_of_rooms ? Number(formData.number_of_rooms) : null,
        water_source: formData.water_source || null,
        toilet_type: formData.toilet_type || null,
        government_programs: formData.government_programs.length > 0 ? formData.government_programs : null,
        livelihood_programs: formData.livelihood_programs ? formData.livelihood_programs.trim() : null,
        health_programs: formData.health_programs ? formData.health_programs.trim() : null
      };

      await apiService.createHousehold(householdData);
      
      // Call the optional onSave callback if provided
      if (onSave) {
        onSave(householdData);
      }
      
      onClose();
    } catch (err: any) {
      console.error('Error creating household:', err);
      
      // Handle API validation errors if available
      if (err.response && err.response.data && err.response.data.errors) {
        const apiErrors: FieldError = {};
        const errData = err.response.data.errors;
        
        // Map backend errors to form fields
        if (errData.household_head_id) apiErrors.household_head_id = errData.household_head_id[0];
        if (errData.purok) apiErrors.purok = errData.purok[0];
        if (errData.address) apiErrors.address = errData.address[0];
        if (errData.housing_type) apiErrors.housing_type = errData.housing_type[0];
        if (errData.monthly_income_bracket) apiErrors.monthly_income_bracket = errData.monthly_income_bracket[0];
        if (errData.source_of_income) apiErrors.source_of_income = errData.source_of_income[0];
        if (errData.house_ownership) apiErrors.house_ownership = errData.house_ownership[0];
        if (errData.house_type) apiErrors.house_type = errData.house_type[0];
        if (errData.income_classification) apiErrors.income_classification = errData.income_classification[0];
        if (errData.estimated_monthly_income) apiErrors.estimated_monthly_income = errData.estimated_monthly_income[0];
        if (errData.number_of_rooms) apiErrors.number_of_rooms = errData.number_of_rooms[0];
        
        setFieldErrors(apiErrors);
        setError('Please correct the errors below.');
      } else {
        setError(`Failed to create household: ${err.message || 'Unknown error occurred'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewResident = () => {
    console.log('Add new resident clicked');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-4">Add New Household Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <FiAlertCircle className="text-red-600 h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 font-medium text-sm">There was a problem</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              {Object.keys(fieldErrors).length > 0 && (
                <ul className="list-disc list-inside mt-2 text-sm text-red-600 pl-2">
                  {Object.entries(fieldErrors).map(([field, message]) => (
                    <li key={field}>
                      <span className="font-medium">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>: {message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Household Head Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Household Head Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Existing Resident as Head *
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="household_head_search"
                  value={formData.household_head_search}
                  onChange={handleInputChange}
                  placeholder="Enter name, ID, or phone number"
                  className={`w-full pl-10 pr-4 py-2 border ${fieldErrors.household_head_id ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              {fieldErrors.household_head_id && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="w-3 h-3 mr-1" /> {fieldErrors.household_head_id}
                </p>
              )}
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
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add New Resident</span>
              </button>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Location Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                House Number
              </label>
              <input
                type="text"
                name="house_number"
                value={formData.house_number}
                onChange={handleInputChange}
                placeholder="e.g., 123, 45-A"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="Enter street name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purok *
              </label>
              <input
                type="text"
                name="purok"
                value={formData.purok}
                onChange={handleInputChange}
                placeholder="Enter purok name"
                className={`w-full px-3 py-2 border ${fieldErrors.purok ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {fieldErrors.purok && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="w-3 h-3 mr-1" /> {fieldErrors.purok}
                </p>
              )}
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complete Address
              </label>
              <textarea
                name="complete_address"
                value={formData.complete_address}
                onChange={handleInputChange}
                placeholder="Enter complete household address (will use basic address if left empty)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Basic Address (Legacy) *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter basic household address"
                rows={2}
                className={`w-full px-3 py-2 border ${fieldErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {fieldErrors.address && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="w-3 h-3 mr-1" /> {fieldErrors.address}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Housing Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Detailed Housing Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                House Ownership
              </label>
              <select
                name="house_ownership"
                value={formData.house_ownership}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${fieldErrors.house_ownership ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="">Select House Ownership</option>
                <option value="OWNED">Owned</option>
                <option value="RENTED">Rented</option>
                <option value="SHARED">Shared</option>
                <option value="CARETAKER">Caretaker</option>
                <option value="OTHER">Other</option>
              </select>
              {fieldErrors.house_ownership && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="w-3 h-3 mr-1" /> {fieldErrors.house_ownership}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                House Type
              </label>
              <select
                name="house_type"
                value={formData.house_type}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${fieldErrors.house_type ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="">Select House Type</option>
                <option value="CONCRETE">Concrete</option>
                <option value="SEMI_CONCRETE">Semi-Concrete</option>
                <option value="WOOD">Wood</option>
                <option value="BAMBOO">Bamboo</option>
                <option value="MIXED">Mixed Materials</option>
                <option value="OTHER">Other</option>
              </select>
              {fieldErrors.house_type && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="w-3 h-3 mr-1" /> {fieldErrors.house_type}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roof Material
              </label>
              <select
                name="roof_material"
                value={formData.roof_material}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Roof Material</option>
                <option value="CONCRETE">Concrete</option>
                <option value="GALVANIZED_IRON">Galvanized Iron</option>
                <option value="ASBESTOS">Asbestos</option>
                <option value="TILE">Tile</option>
                <option value="BAMBOO">Bamboo</option>
                <option value="NIPA">Nipa</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wall Material
              </label>
              <select
                name="wall_material"
                value={formData.wall_material}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Wall Material</option>
                <option value="CONCRETE">Concrete</option>
                <option value="HOLLOW_BLOCKS">Hollow Blocks</option>
                <option value="WOOD">Wood</option>
                <option value="BAMBOO">Bamboo</option>
                <option value="MIXED">Mixed Materials</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Rooms
              </label>
              <input
                type="number"
                name="number_of_rooms"
                value={formData.number_of_rooms}
                onChange={handleInputChange}
                placeholder="Enter number of rooms"
                min="1"
                className={`w-full px-3 py-2 border ${fieldErrors.number_of_rooms ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
              {fieldErrors.number_of_rooms && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="w-3 h-3 mr-1" /> {fieldErrors.number_of_rooms}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Owned
              </label>
              <input
                type="text"
                name="vehicle_owned"
                value={formData.vehicle_owned}
                onChange={handleInputChange}
                placeholder="e.g., Motorcycle, Tricycle, Car"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Water and Sanitation */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Water and Sanitation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Water Source
              </label>
              <select
                name="water_source"
                value={formData.water_source}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Water Source</option>
                <option value="NAWASA">NAWASA</option>
                <option value="DEEP_WELL">Deep Well</option>
                <option value="SHALLOW_WELL">Shallow Well</option>
                <option value="SPRING">Spring</option>
                <option value="RIVER">River</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Toilet Type
              </label>
              <select
                name="toilet_type"
                value={formData.toilet_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Toilet Type</option>
                <option value="FLUSH">Flush Toilet</option>
                <option value="POUR_FLUSH">Pour Flush</option>
                <option value="PIT_LATRINE">Pit Latrine</option>
                <option value="NONE">None</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Utilities (Check all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.has_electricity}
                  onChange={() => handleCheckboxChange('has_electricity')}
                  className="mr-2"
                />
                Has Electricity
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.has_water_supply}
                  onChange={() => handleCheckboxChange('has_water_supply')}
                  className="mr-2"
                />
                Has Water Supply
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.has_toilet}
                  onChange={() => handleCheckboxChange('has_toilet')}
                  className="mr-2"
                />
                Has Toilet
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.has_internet}
                  onChange={() => handleCheckboxChange('has_internet')}
                  className="mr-2"
                />
                Has Internet
              </label>
            </div>
          </div>
        </div>

        {/* Economic Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Economic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Monthly Income (₱)
              </label>
              <input
                type="number"
                name="estimated_monthly_income"
                value={formData.estimated_monthly_income}
                onChange={handleInputChange}
                placeholder="Enter exact income amount"
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border ${fieldErrors.estimated_monthly_income ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
              {fieldErrors.estimated_monthly_income && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="w-3 h-3 mr-1" /> {fieldErrors.estimated_monthly_income}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Income Bracket *
              </label>
              <select
                name="monthly_income_bracket"
                value={formData.monthly_income_bracket}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${fieldErrors.monthly_income_bracket ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                required
              >
                <option value="">Select Income Bracket</option>
                <option value="BELOW_5000">Below ₱5,000</option>
                <option value="5000_10000">₱5,000 - ₱10,000</option>
                <option value="10001_15000">₱10,001 - ₱15,000</option>
                <option value="15001_20000">₱15,001 - ₱20,000</option>
                <option value="20001_30000">₱20,001 - ₱30,000</option>
                <option value="30001_50000">₱30,001 - ₱50,000</option>
                <option value="ABOVE_50000">Above ₱50,000</option>
              </select>
              {fieldErrors.monthly_income_bracket && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="w-3 h-3 mr-1" /> {fieldErrors.monthly_income_bracket}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Income Classification
              </label>
              <select
                name="income_classification"
                value={formData.income_classification}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${fieldErrors.income_classification ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="">Select Income Classification</option>
                <option value="VERY_POOR">Very Poor</option>
                <option value="POOR">Poor</option>
                <option value="LOW_INCOME">Low Income</option>
                <option value="LOWER_MIDDLE">Lower Middle Class</option>
                <option value="MIDDLE">Middle Class</option>
                <option value="UPPER_MIDDLE">Upper Middle Class</option>
                <option value="UPPER">Upper Class</option>
              </select>
              {fieldErrors.income_classification && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="w-3 h-3 mr-1" /> {fieldErrors.income_classification}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source of Income
              </label>
              <select
                name="source_of_income"
                value={formData.source_of_income}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${fieldErrors.source_of_income ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="">Select Income Source</option>
                <option value="employment">Employment</option>
                <option value="business">Business</option>
                <option value="agriculture">Agriculture</option>
                <option value="remittance">Remittance</option>
                <option value="pension">Pension</option>
                <option value="other">Other</option>
              </select>
              {fieldErrors.source_of_income && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="w-3 h-3 mr-1" /> {fieldErrors.source_of_income}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Government Programs */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Government Programs</h2>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.four_ps_beneficiary}
                  onChange={() => handleCheckboxChange('four_ps_beneficiary')}
                  className="mr-2"
                />
                4Ps Beneficiary
              </label>
              
              {formData.four_ps_beneficiary && (
                <div className="flex-1">
                  <input
                    type="text"
                    name="four_ps_household_id"
                    value={formData.four_ps_household_id}
                    onChange={handleInputChange}
                    placeholder="Enter 4Ps Household ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Other Government Programs (Check all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'DSWD Social Pension',
                  'PhilHealth',
                  'SSS',
                  'GSIS',
                  'Conditional Cash Transfer',
                  'Livelihood Program',
                  'Housing Program',
                  'Scholarship Program',
                  'Health Program',
                  'Skills Training'
                ].map((program) => (
                  <label key={program} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.government_programs.includes(program)}
                      onChange={(e) => handleArrayChange('government_programs', program, e.target.checked)}
                      className="mr-2"
                    />
                    {program}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Livelihood Programs
                </label>
                <textarea
                  name="livelihood_programs"
                  value={formData.livelihood_programs}
                  onChange={handleInputChange}
                  placeholder="Describe livelihood programs household is enrolled in"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health Programs
                </label>
                <textarea
                  name="health_programs"
                  value={formData.health_programs}
                  onChange={handleInputChange}
                  placeholder="Describe health programs household is enrolled in"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Legacy Housing Information - keeping for backward compatibility */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Legacy Housing Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Housing Type (Legacy) *
              </label>
              <select
                name="housing_type"
                value={formData.housing_type}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${fieldErrors.housing_type ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                required
              >
                <option value="">Select Housing Type</option>
                <option value="OWNED">Owned</option>
                <option value="RENTED">Rented</option>
                <option value="SHARED">Shared</option>
                <option value="INFORMAL_SETTLER">Informal Settler</option>
              </select>
              {fieldErrors.housing_type && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="w-3 h-3 mr-1" /> {fieldErrors.housing_type}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Additional Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              placeholder="Enter any additional remarks or notes"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            disabled={loading}
          >
            {loading && (
              <svg className="animate-spin h-4 w-4 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{loading ? 'Saving Household...' : 'Save Household'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewHousehold;
