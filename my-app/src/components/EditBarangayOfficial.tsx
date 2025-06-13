import React, { useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';

interface EditBarangayOfficialProps {
  onClose: () => void;
  onSave: (officialData: any) => void;
  official?: any;
}

const EditBarangayOfficial: React.FC<EditBarangayOfficialProps> = ({ onClose, onSave, official }) => {
  const [formData, setFormData] = useState({
    prefix: official?.prefix || 'Mr.',
    firstName: official?.firstName || 'Juan',
    middleName: official?.middleName || 'Perez',
    lastName: official?.lastName || 'Dela Cruz',
    gender: official?.gender || 'Male',
    birthDate: official?.birthDate || '1985-06-16',
    contactNumber: official?.contactNumber || '+63 912 345 6789',
    emailAddress: official?.emailAddress || 'sanmiguel.pasig@gmail.com',
    completeAddress: official?.completeAddress || 'Filipino',
    civilStatus: official?.civilStatus || 'Married',
    educationalBackground: official?.educationalBackground || 'Bachelor in Public Administration',
    committeeAssignment: official?.committeeAssignment || 'Married',
    termStart: official?.termStart || '2022-05-05',
    termEnd: official?.termEnd || '2025-05-10'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-darktext pl-0">Edit Barangay Official</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Basic Information */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Basic Information</h2>
          <div className="border-b border-gray-200 mb-6"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Profile Photo */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-3">
                  <FiUpload className="w-8 h-8 text-gray-400" />
                </div>
                <button
                  type="button"
                  className="text-smblue-400 hover:text-smblue-300 text-sm font-medium"
                >
                  Upload Profile Photo
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prefix
                </label>
                <select
                  name="prefix"
                  value={formData.prefix}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                  title="Select prefix"
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Hon.">Hon.</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Middle Name *
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                  title="Select gender"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birthdate
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complete Address
                </label>
                <input
                  type="text"
                  name="completeAddress"
                  value={formData.completeAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Civil Status
                </label>
                <select
                  name="civilStatus"
                  value={formData.civilStatus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                  title="Select civil status"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Educational Background
                </label>
                <input
                  type="text"
                  name="educationalBackground"
                  value={formData.educationalBackground}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Term Information */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Term Information</h2>
          <div className="border-b border-gray-200 mb-6"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Committee Assignment
              </label>
              <select
                name="committeeAssignment"
                value={formData.committeeAssignment}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                title="Select committee assignment"
              >
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Public Safety">Public Safety</option>
                <option value="Environment">Environment</option>
                <option value="Peace and Order">Peace and Order</option>
                <option value="Sports and Recreation">Sports and Recreation</option>
                <option value="Women and Family">Women and Family</option>
                <option value="Senior Citizens">Senior Citizens</option>
                <option value="Married">Married</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Term Start
              </label>
              <input
                type="date"
                name="termStart"
                value={formData.termStart}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Term End
              </label>
              <input
                type="date"
                name="termEnd"
                value={formData.termEnd}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>
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
            className="px-6 py-2 bg-smblue-400 hover:bg-smblue-300 text-white rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </main>
  );
};

export default EditBarangayOfficial; 