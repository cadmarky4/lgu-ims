import React from 'react';
import { FiX, FiUser, FiPhone, FiMapPin, FiFileText, FiHeart, FiUsers } from 'react-icons/fi';

interface ViewResidentProps {
  resident: any;
  onClose: () => void;
}

const ViewResident: React.FC<ViewResidentProps> = ({ resident, onClose }) => {
  return (
    <main className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      {/* Header */}
      <div className="mb-2 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-darktext pl-0">View Resident Profile</h1>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Close"
        >
          <FiX className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Profile Header */}
        <div className="flex items-center mb-8 pb-6 border-b border-gray-200">
          <img
            src={resident.photo}
            alt={resident.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-smblue-100"
          />
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-darktext">{resident.name}</h2>
            <p className="text-lg text-gray-600">{resident.age} years old, {resident.gender}</p>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-2 ${
              resident.status === 'Active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {resident.status}
            </span>
          </div>
        </div>

        {/* Basic Information */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4 flex items-center">
            <FiUser className="mr-2" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              <p className="text-gray-900">{resident.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Age</label>
              <p className="text-gray-900">{resident.age} years old</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
              <p className="text-gray-900">{resident.gender}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
              <p className="text-gray-900">{resident.category}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
              <p className="text-gray-900">{resident.status}</p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4 flex items-center">
            <FiPhone className="mr-2" />
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Mobile Number</label>
              <p className="text-gray-900">{resident.phone || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
              <p className="text-gray-900">{resident.email || 'Not provided'}</p>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
              <p className="text-gray-900">{resident.address}</p>
            </div>
          </div>
        </section>

        {/* Family Information */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4 flex items-center">
            <FiUsers className="mr-2" />
            Family Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Household Head</label>
              <p className="text-gray-900">Not specified</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Household ID</label>
              <p className="text-gray-900">Not specified</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Relationship to Head</label>
              <p className="text-gray-900">Not specified</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Mother's Name</label>
              <p className="text-gray-900">Not specified</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Father's Name</label>
              <p className="text-gray-900">Not specified</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Emergency Contact</label>
              <p className="text-gray-900">Not specified</p>
            </div>
          </div>
        </section>

        {/* Government IDs */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4 flex items-center">
            <FiFileText className="mr-2" />
            Government IDs & Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Primary ID Type</label>
              <p className="text-gray-900">Not specified</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">ID Number</label>
              <p className="text-gray-900">Not specified</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">PhilHealth Number</label>
              <p className="text-gray-900">Not specified</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">SSS Number</label>
              <p className="text-gray-900">Not specified</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">TIN Number</label>
              <p className="text-gray-900">Not specified</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Voter's ID Number</label>
              <p className="text-gray-900">Not specified</p>
            </div>
          </div>
        </section>

        {/* Health Information */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4 flex items-center">
            <FiHeart className="mr-2" />
            Health & Medical Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Medical Conditions</label>
              <p className="text-gray-900">Not specified</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Allergies</label>
              <p className="text-gray-900">Not specified</p>
            </div>
          </div>
        </section>

        {/* Special Classifications */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4 flex items-center">
            <FiMapPin className="mr-2" />
            Special Classifications
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                resident.category === 'Senior Citizen' ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <span className="text-sm text-gray-900">Senior Citizen</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2 bg-gray-300"></div>
              <span className="text-sm text-gray-900">Person with Disability</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2 bg-gray-300"></div>
              <span className="text-sm text-gray-900">Indigenous People</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2 bg-gray-300"></div>
              <span className="text-sm text-gray-900">4Ps Beneficiary</span>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </main>
  );
};

export default ViewResident; 