import React, { useState } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';

interface EditHouseholdProps {
  household: any;
  onClose: () => void;
  onSave: (householdData: any) => void;
}

const EditHousehold: React.FC<EditHouseholdProps> = ({ household, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    householdId: household.id || 'Auto-generated',
    householdType: '',
    barangay: '',
    streetSitio: '',
    houseNumber: '',
    completeAddress: household.address || '',
    householdHeadSearch: household.headName || '',
    memberSearch: '',
    monthlyIncome: household.income?.toString() || '',
    primaryIncomeSource: '',
    householdClassification: {
      fourPsBeneficiary: household.programs?.includes('4Ps') || false,
      indigentFamily: false,
      hasSeniorCitizen: household.programs?.includes('Senior Citizen Assistance') || false,
      hasPwdMember: false
    },
    houseType: '',
    ownershipStatus: household.ownership || '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: household.id });
    onClose();
  };

  const handleAddNewResident = () => {
    console.log('Add new resident clicked');
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-darktext pl-0">Edit Household Profile</h1>
      </div>

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
                />
              </div>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleAddNewResident}
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
                onClick={handleAddNewResident}
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
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300 transition-colors"
          >
            Update Household
          </button>
        </div>
      </form>
    </main>
  );
};

export default EditHousehold;