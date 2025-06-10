import React, { useState } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';

interface AddNewHouseholdProps {
  onClose: () => void;
  onSave: (householdData: any) => void;
}

const AddNewHousehold: React.FC<AddNewHouseholdProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
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
    householdBenefits: {
      fourPsBeneficiary: false,
      indigentFamily: false,
      hasSeniorCitizen: false,
      hasPwdMember: false
    },
    houseType: '',
    ownershipStatus: '',
    housingBenefits: {
      fourPsBeneficiary: false,
      indigentFamily: false,
      hasSeniorCitizen: false,
      hasPwdMember: false
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (section: 'householdBenefits' | 'housingBenefits', field: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field as keyof typeof prev[section]]
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
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
        {/* Household Identification */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Household Identification</h2>
          
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                title="Select barangay"
              >
                <option value="">Select Barangay</option>
                <option value="san-miguel">San Miguel</option>
                <option value="poblacion">Poblacion</option>
                <option value="santo-domingo">Santo Domingo</option>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Household Head Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Household Head Information</h2>
          
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
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
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add New Resident</span>
              </button>
            </div>
          </div>
        </div>

        {/* Household Members */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Household Members</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Members from Residents
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="memberSearch"
                  value={formData.memberSearch}
                  onChange={handleInputChange}
                  placeholder="Enter name, ID, or phone number"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

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
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add New Resident</span>
              </button>
            </div>
          </div>
        </div>

        {/* Socioeconomic Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Socioeconomic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Household Income
              </label>
              <select
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <select
                name="primaryIncomeSource"
                value={formData.primaryIncomeSource}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title="Select primary income source"
              >
                <option value="">e.g. Employment, Business, Agriculture</option>
                <option value="employment">Employment</option>
                <option value="business">Business</option>
                <option value="agriculture">Agriculture</option>
                <option value="remittance">Remittance</option>
                <option value="pension">Pension</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Monthly Household Income (Check all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.householdBenefits.fourPsBeneficiary}
                  onChange={() => handleCheckboxChange('householdBenefits', 'fourPsBeneficiary')}
                  className="mr-2"
                />
                4Ps Beneficiary
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.householdBenefits.indigentFamily}
                  onChange={() => handleCheckboxChange('householdBenefits', 'indigentFamily')}
                  className="mr-2"
                />
                Indigent Family
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.householdBenefits.hasSeniorCitizen}
                  onChange={() => handleCheckboxChange('householdBenefits', 'hasSeniorCitizen')}
                  className="mr-2"
                />
                Has Senior Citizen
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.householdBenefits.hasPwdMember}
                  onChange={() => handleCheckboxChange('householdBenefits', 'hasPwdMember')}
                  className="mr-2"
                />
                Has PWD member
              </label>
            </div>
          </div>
        </div>

        {/* Housing Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Housing Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                House Type
              </label>
              <select
                name="houseType"
                value={formData.houseType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              Monthly Household Income (Check all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.housingBenefits.fourPsBeneficiary}
                  onChange={() => handleCheckboxChange('housingBenefits', 'fourPsBeneficiary')}
                  className="mr-2"
                />
                4Ps Beneficiary
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.housingBenefits.indigentFamily}
                  onChange={() => handleCheckboxChange('housingBenefits', 'indigentFamily')}
                  className="mr-2"
                />
                Indigent Family
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.housingBenefits.hasSeniorCitizen}
                  onChange={() => handleCheckboxChange('housingBenefits', 'hasSeniorCitizen')}
                  className="mr-2"
                />
                Has Senior Citizen
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.housingBenefits.hasPwdMember}
                  onChange={() => handleCheckboxChange('housingBenefits', 'hasPwdMember')}
                  className="mr-2"
                />
                Has PWD member
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Household
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewHousehold; 