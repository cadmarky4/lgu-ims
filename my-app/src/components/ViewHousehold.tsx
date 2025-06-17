import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiX, FiHome, FiUsers, FiDollarSign, FiMapPin, FiFileText, FiEdit } from 'react-icons/fi';

const ViewHousehold: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [household, setHousehold] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load household data when component mounts
  useEffect(() => {
    const loadHousehold = async () => {
      if (!id) {
        setError('Household ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // TODO: Backend developer - replace with actual endpoint
        // const response = await fetch(`/api/households/${id}`);
        // const householdData = await response.json();
        
        // For now, using mock data - would need to get from API
        const mockHousehold = {
          id: id,
          headName: 'Mock Household Head',
          address: 'Purok 1, Block 2, San Miguel',
          ownership: 'Owned',
          members: 5,
          income: 25000,
          programs: ['4Ps', 'Senior Citizen Assistance']
        };
        
        setHousehold(mockHousehold);
      } catch (error) {
        console.error('Failed to load household:', error);
        setError('Failed to load household data');
      } finally {
        setLoading(false);
      }
    };

    loadHousehold();
  }, [id]);

  const handleClose = () => {
    navigate('/household');
  };

  const handleEdit = () => {
    navigate(`/household/edit/${id}`);
  };

  if (loading) {
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
            onClick={handleClose}
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
        <h1 className="text-2xl font-bold text-darktext pl-0">View Household Profile</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="p-2 text-smblue-400 hover:text-smblue-300 hover:bg-smblue-50 rounded-lg transition-colors"
            title="Edit Household"
          >
            <FiEdit className="w-6 h-6" />
          </button>
          <button
            onClick={handleClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Household Header */}
        <div className="flex items-center mb-8 pb-6 border-b border-gray-200">
          <div className="w-24 h-24 bg-smblue-100 rounded-full flex items-center justify-center border-4 border-smblue-200">
            <FiHome className="w-12 h-12 text-smblue-400" />
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-darktext">{household.id}</h2>
            <p className="text-lg text-gray-600">Head: {household.headName}</p>
            <p className="text-sm text-gray-500 mt-1">{household.members} members • {household.ownership}</p>
          </div>
        </div>

        {/* Basic Information */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4 flex items-center">
            <FiFileText className="mr-2" />
            Household Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Household ID</label>
              <p className="text-gray-900">{household.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Head of Family</label>
              <p className="text-gray-900">{household.headName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Total Members</label>
              <p className="text-gray-900">{household.members} members</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Ownership Status</label>
              <p className="text-gray-900">{household.ownership}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Household Type</label>
              <p className="text-gray-900">Not specified</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Barangay</label>
              <p className="text-gray-900">Not specified</p>
            </div>
          </div>
        </section>

        {/* Address Information */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4 flex items-center">
            <FiMapPin className="mr-2" />
            Address Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Complete Address</label>
              <p className="text-gray-900">{household.address}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Street/Sitio</label>
              <p className="text-gray-900">Not specified</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">House Number</label>
              <p className="text-gray-900">Not specified</p>
            </div>
          </div>
        </section>

        {/* Economic Information */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4 flex items-center">
            <FiDollarSign className="mr-2" />
            Economic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Monthly Income</label>
              <p className="text-gray-900">₱{household.income?.toLocaleString() || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Primary Income Source</label>
              <p className="text-gray-900">Not specified</p>
            </div>
          </div>
        </section>

        {/* Household Members */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4 flex items-center">
            <FiUsers className="mr-2" />
            Household Members
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 text-center">
              Total of {household.members} registered members
            </p>
            <p className="text-sm text-gray-500 text-center mt-2">
              Member details would be displayed here in a full implementation
            </p>
          </div>
        </section>

        {/* Programs & Benefits */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">
            Programs & Benefits
          </h3>
          <div className="flex flex-wrap gap-2">
            {household.programs?.map((program: string, index: number) => (
              <span
                key={index}
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  program === '4Ps' 
                    ? 'bg-green-100 text-green-800'
                    : program === 'Senior Citizen Assistance'
                    ? 'bg-blue-100 text-blue-800'
                    : program === 'Educational Assistance'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {program}
              </span>
            ))}
            {(!household.programs || household.programs.length === 0) && (
              <p className="text-gray-500">No programs registered</p>
            )}
          </div>
        </section>

        {/* Housing Information */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4 flex items-center">
            <FiHome className="mr-2" />
            Housing Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">House Type</label>
              <p className="text-gray-900">Not specified</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Ownership Status</label>
              <p className="text-gray-900">{household.ownership}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-500 mb-2">Utilities Access</label>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-gray-300"></div>
                <span className="text-sm text-gray-900">Electricity</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-gray-300"></div>
                <span className="text-sm text-gray-900">Water Supply</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-gray-300"></div>
                <span className="text-sm text-gray-900">Internet Access</span>
              </div>
            </div>
          </div>
        </section>

        {/* Household Classification */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">
            Household Classification
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                household.programs?.includes('4Ps') ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <span className="text-sm text-gray-900">4Ps Beneficiary</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2 bg-gray-300"></div>
              <span className="text-sm text-gray-900">Indigent Family</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                household.programs?.includes('Senior Citizen Assistance') ? 'bg-blue-500' : 'bg-gray-300'
              }`}></div>
              <span className="text-sm text-gray-900">Has Senior Citizen</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2 bg-gray-300"></div>
              <span className="text-sm text-gray-900">Has PWD Member</span>
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">
            Additional Information
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Remarks</label>
            <p className="text-gray-900">No additional remarks</p>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            onClick={handleEdit}
            className="px-6 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300 transition-colors"
          >
            Edit Household
          </button>
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </main>
  );
};

export default ViewHousehold; 