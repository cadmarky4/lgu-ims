import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiX, FiUser, FiPhone, FiMapPin, FiFileText, FiHeart, FiUsers, FiEdit } from 'react-icons/fi';
import { residentsService } from '../../services';
import type { Resident } from '../../services/resident.types';

interface ViewResidentProps {
}

const ViewResident: React.FC<ViewResidentProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [resident, setResident] = useState<Resident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load resident data when component mounts
  useEffect(() => {
    const loadResident = async () => {
      if (!id) {
        setError('Resident ID not provided');
        setLoading(false);
        return;
}

      try {
        setLoading(true);
        // For now, we'll use the getResidents method and filter by ID
        // TODO: Backend should provide a getResident(id) method
        const residentsData = await residentsService.getResidents({});
        const residentData = residentsData.data?.find((r: any) => r.id === parseInt(id));
        
        if (!residentData) {
          setError('Resident not found');
          setLoading(false);
          return;
        }
        
        setResident(residentData);
      } catch (error) {
        console.error('Failed to load resident:', error);
        setError('Failed to load resident data');
      } finally {
        setLoading(false);
      }
    };

    loadResident();
  }, [id]);

  const handleClose = () => {
    navigate('/residents');
  };

  const handleEdit = () => {
    navigate(`/residents/edit/${id}`);
  };

  if (loading) {
    return (
      <main className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-smblue-400 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading resident data...</p>
        </div>
      </main>
    );
  }

  if (error || !resident) {
    return (
      <main className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Resident not found'}</p>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300"
          >
            Back to Residents
          </button>
        </div>
      </main>
    );
  }

  // Helper function to format display values
  const formatValue = (value: string | number | boolean | null | undefined): string => {
    if (value === null || value === undefined || value === '') {
      return 'Not specified';
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return String(value);
  };

  // Helper function to format full name
  const getFullName = (): string => {
    const parts = [
      resident.first_name,
      resident.middle_name,
      resident.last_name,
      resident.suffix
    ].filter(Boolean);
    return parts.join(' ');
  };

  // Helper function to get age display
  const getAgeDisplay = (): string => {
    if (resident.age) {
      return `${resident.age} years old`;
    }
    // Calculate age from birth_date if age is not provided
    if (resident.birth_date) {
      const birthDate = new Date(resident.birth_date);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return `${age} years old`;
    }
    return 'Not specified';
  };

  // Helper function to format gender display
  const formatGender = (gender: string): string => {
    const genderMap: Record<string, string> = {
      'MALE': 'Male',
      'FEMALE': 'Female'
    };
    return genderMap[gender] || gender;
  };

  // Helper function to format civil status
  const formatCivilStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      'SINGLE': 'Single',
      'MARRIED': 'Married',
      'WIDOWED': 'Widowed',
      'DIVORCED': 'Divorced',
      'SEPARATED': 'Separated'
    };
    return statusMap[status] || status;
  };

  // Helper function to format employment status
  const formatEmploymentStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      'EMPLOYED': 'Employed',
      'UNEMPLOYED': 'Unemployed',
      'SELF_EMPLOYED': 'Self Employed',
      'RETIRED': 'Retired',
      'STUDENT': 'Student',
      'OFW': 'OFW'
    };
    return statusMap[status] || status;
  };

  // Helper function to format voter status
  const formatVoterStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      'NOT_REGISTERED': 'Not Registered',
      'REGISTERED': 'Registered',
      'DECEASED': 'Deceased',
      'TRANSFERRED': 'Transferred'
    };
    return statusMap[status] || status;
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      {/* Header */}
      <div className="mb-2 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-darktext pl-0">View Resident Profile</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="p-2 text-smblue-400 hover:text-smblue-300 hover:bg-smblue-50 rounded-lg transition-colors"
            title="Edit Resident"
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
        {/* Profile Header */}
        <div className="flex items-center mb-8 pb-6 border-b border-gray-200">
          <img
            src={resident.profile_photo_url || '/default-avatar.png'}
            alt={getFullName()}
            className="w-24 h-24 rounded-full object-cover border-4 border-smblue-100"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/default-avatar.png';
            }}
          />
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-darktext">{getFullName()}</h2>
            <p className="text-lg text-gray-600">{getAgeDisplay()}, {formatGender(resident.gender)}</p>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-2 ${
              resident.status === 'ACTIVE' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {resident.status === 'ACTIVE' ? 'Active' : 'Inactive'}
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
              <p className="text-gray-900">{getFullName()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Age</label>
              <p className="text-gray-900">{getAgeDisplay()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
              <p className="text-gray-900">{formatGender(resident.gender)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Birth Date</label>
              <p className="text-gray-900">{resident.birth_date ? new Date(resident.birth_date).toLocaleDateString() : 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Birth Place</label>
              <p className="text-gray-900">{formatValue(resident.birth_place)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Civil Status</label>
              <p className="text-gray-900">{formatCivilStatus(resident.civil_status)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Nationality</label>
              <p className="text-gray-900">{formatValue(resident.nationality)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Religion</label>
              <p className="text-gray-900">{formatValue(resident.religion)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Employment Status</label>
              <p className="text-gray-900">{resident.employment_status ? formatEmploymentStatus(resident.employment_status) : 'Not specified'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Educational Attainment</label>
              <p className="text-gray-900">{formatValue(resident.educational_attainment)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Occupation</label>
              <p className="text-gray-900">{formatValue(resident.occupation)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Employer</label>
              <p className="text-gray-900">{formatValue(resident.employer)}</p>
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
              <p className="text-gray-900">{formatValue(resident.mobile_number)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Telephone Number</label>
              <p className="text-gray-900">{formatValue(resident.telephone_number)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
              <p className="text-gray-900">{formatValue(resident.email_address)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">House/Unit Number</label>
              <p className="text-gray-900">{formatValue(resident.house_number)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Street</label>
              <p className="text-gray-900">{formatValue(resident.street)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Purok</label>
              <p className="text-gray-900">{formatValue(resident.purok)}</p>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-500 mb-1">Complete Address</label>
              <p className="text-gray-900">{formatValue(resident.complete_address)}</p>
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
              <label className="block text-sm font-medium text-gray-500 mb-1">Household ID</label>
              <p className="text-gray-900">{formatValue(resident.household_id)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Household Head</label>
              <p className="text-gray-900">{formatValue(resident.is_household_head)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Relationship to Head</label>
              <p className="text-gray-900">{formatValue(resident.relationship_to_head)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Mother's Name</label>
              <p className="text-gray-900">{formatValue(resident.mother_name)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Father's Name</label>
              <p className="text-gray-900">{formatValue(resident.father_name)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Emergency Contact Name</label>
              <p className="text-gray-900">{formatValue(resident.emergency_contact_name)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Emergency Contact Number</label>
              <p className="text-gray-900">{formatValue(resident.emergency_contact_number)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Emergency Contact Relationship</label>
              <p className="text-gray-900">{formatValue(resident.emergency_contact_relationship)}</p>
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
              <p className="text-gray-900">{formatValue(resident.primary_id_type)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">ID Number</label>
              <p className="text-gray-900">{formatValue(resident.id_number)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">PhilHealth Number</label>
              <p className="text-gray-900">{formatValue(resident.philhealth_number)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">SSS Number</label>
              <p className="text-gray-900">{formatValue(resident.sss_number)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">TIN Number</label>
              <p className="text-gray-900">{formatValue(resident.tin_number)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Voter's ID Number</label>
              <p className="text-gray-900">{formatValue(resident.voters_id_number)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Voter Status</label>
              <p className="text-gray-900">{formatVoterStatus(resident.voter_status)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Precinct Number</label>
              <p className="text-gray-900">{formatValue(resident.precinct_number)}</p>
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
              <p className="text-gray-900 whitespace-pre-wrap">{formatValue(resident.medical_conditions)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Allergies</label>
              <p className="text-gray-900 whitespace-pre-wrap">{formatValue(resident.allergies)}</p>
            </div>
          </div>
        </section>

        {/* Special Classifications */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4 flex items-center">
            <FiMapPin className="mr-2" />
            Special Classifications
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                resident.senior_citizen ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <span className="text-sm text-gray-900">Senior Citizen</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                resident.person_with_disability ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <span className="text-sm text-gray-900">Person with Disability</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                resident.indigenous_people ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <span className="text-sm text-gray-900">Indigenous People</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                resident.four_ps_beneficiary ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <span className="text-sm text-gray-900">4Ps Beneficiary</span>
            </div>
          </div>

          {/* Additional details for special classifications */}
          {(resident.person_with_disability && resident.disability_type) && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">Disability Type</label>
              <p className="text-gray-900">{resident.disability_type}</p>
            </div>
          )}

          {(resident.indigenous_people && resident.indigenous_group) && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">Indigenous Group</label>
              <p className="text-gray-900">{resident.indigenous_group}</p>
            </div>
          )}

          {(resident.four_ps_beneficiary && resident.four_ps_household_id) && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500 mb-1">4Ps Household ID</label>
              <p className="text-gray-900">{resident.four_ps_household_id}</p>
            </div>
          )}
        </section>

        {/* System Information */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">
            System Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
              <p className="text-gray-900">{new Date(resident.created_at).toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
              <p className="text-gray-900">{new Date(resident.updated_at).toLocaleString()}</p>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            onClick={handleEdit}
            className="px-6 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300 transition-colors"
          >
            Edit Resident
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

export default ViewResident;

