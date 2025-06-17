import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiX, FiHome, FiUsers, FiDollarSign, FiMapPin, FiFileText, FiEdit } from 'react-icons/fi';
import type { Household } from '../services/household.types';

const ViewHousehold: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [household, setHousehold] = useState<Household | null>(null);
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
        const mockHousehold: Household = {
          id: 1,
          household_number: `HH-${id}`,
          household_type: 'nuclear',
          house_number: '123',
          street_sitio: 'Purok 1',
          complete_address: 'Block 2, San Miguel',
          barangay: 'San Miguel',
          ownership_status: 'informal-settler',
          monthly_income: '10000-25000',
          primary_income_source: 'Employment',
          head_resident: {
            id: 1,
            first_name: 'Mock',
            last_name: 'Head',
            contact_number: '09123456789'
          },
          members: [],
          house_type: 'bamboo',
          has_electricity: true,
          has_water_supply: true,
          has_internet_access: false,
          four_ps_beneficiary: true,
          indigent_family: false,
          has_senior_citizen: true,
          has_pwd_member: false,
          remarks: '', 
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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
            <h2 className="text-2xl font-bold text-darktext">{household.household_number || `HH-${household.id}`}</h2>
            <p className="text-lg text-gray-600">
              Head: {household.head_resident 
                ? `${household.head_resident.first_name} ${household.head_resident.last_name}`
                : 'No Head Assigned'
              }
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {household.members?.length} member{household.members?.length !== 1 ? 's' : ''} • {household.ownership_status || 'Not specified'}
            </p>
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
              <label className="block text-sm font-medium text-gray-500 mb-1">Household Number</label>
              <p className="text-gray-900">{household.household_number || 'Auto-generated'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Head of Family</label>
              <p className="text-gray-900">
                {household.head_resident 
                  ? `${household.head_resident.first_name} ${household.head_resident.last_name}`
                  : 'No Head Assigned'
                }
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Total Members</label>
              <p className="text-gray-900">{household.members?.length} member{household.members?.length !== 1 ? 's' : ''}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Household Type</label>
              <p className="text-gray-900">{household.household_type || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Ownership Status</label>
              <p className="text-gray-900">{household.ownership_status || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Barangay</label>
              <p className="text-gray-900">{household.barangay || 'Not specified'}</p>
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
              <p className="text-gray-900">{household.complete_address || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Street/Sitio</label>
              <p className="text-gray-900">{household.street_sitio || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">House Number</label>
              <p className="text-gray-900">{household.house_number || 'Not specified'}</p>
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
              <p className="text-gray-900">
                {household.monthly_income ? `₱${Number(household.monthly_income).toLocaleString()}` : 'Not specified'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Primary Income Source</label>
              <p className="text-gray-900">{household.primary_income_source || 'Not specified'}</p>
            </div>
          </div>
        </section>

        {/* Household Members */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4 flex items-center">
            <FiUsers className="mr-2" />
            Household Members
          </h3>
          
          {/* Household Head */}
          {household.head_resident && (
            <div className="mb-4">
              <h4 className="font-medium text-darktext mb-2">Household Head:</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-darktext">
                      {household.head_resident.first_name} {household.head_resident.last_name}
                    </p>
                    {household.head_resident.contact_number && (
                      <p className="text-sm text-gray-600">{household.head_resident.contact_number}</p>
                    )}
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    HOUSEHOLD HEAD
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Other Members */}
          {household.members && household.members.length > 0 ? (
            <div>
              <h4 className="font-medium text-darktext mb-2">Other Members:</h4>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Contact</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Relationship</th>
                    </tr>
                  </thead>
                  <tbody>
                    {household.members.map((member, index) => (
                      <tr key={member.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 border-b">
                          {member.first_name} {member.last_name}
                        </td>
                        <td className="px-4 py-3 border-b text-sm text-gray-600">
                          {member.relationship || 'N/A'}
                        </td>
                        <td className="px-4 py-3 border-b">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                            {(member as any).relationship_to_head || 'Member'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-center">
                {household.head_resident ? 'No additional members registered' : 'No members registered yet'}
              </p>
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-600">
            Total household size: {household.members?.length} member{household.members?.length !== 1 ? 's' : ''}
          </div>
        </section>

        {/* Programs & Benefits
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">
            Programs & Benefits
          </h3>
          <div className="flex flex-wrap gap-2">
            {household.length > 0 ? (
              programs.map((program, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                >
                  {program}
                </span>
              ))
            ) : (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                No programs enrolled
              </span>
            )}
          </div>
        </section> */}

        {/* Housing Information */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4 flex items-center">
            <FiHome className="mr-2" />
            Housing Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">House Type</label>
              <p className="text-gray-900">{household.house_type || 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Ownership Status</label>
              <p className="text-gray-900">{household.ownership_status || 'Not specified'}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-500 mb-2">Utilities Access</label>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${household.has_electricity ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm text-gray-700">Electricity</span>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${household.has_water_supply ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm text-gray-700">Water Supply</span>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${household.has_internet_access ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm text-gray-700">Internet Access</span>
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
              <div className={`w-3 h-3 rounded-full mr-2 ${household.four_ps_beneficiary ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm text-gray-700">4Ps Beneficiary</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${household.indigent_family ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm text-gray-700">Indigent Family</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${household.has_senior_citizen ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm text-gray-700">Has Senior Citizen</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${household.has_pwd_member ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm text-gray-700">Has PWD Member</span>
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
            <p className="text-gray-900">{household.remarks || 'No additional remarks'}</p>
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

