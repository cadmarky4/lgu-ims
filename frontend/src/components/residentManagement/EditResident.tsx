import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { FiUpload, FiX, FiUser, FiPhone, FiMail, FiMapPin, FiCalendar, FiFileText, FiCheck } from 'react-icons/fi';

import { residentsService } from '../../services';

import {
  type Purok,
  type Resident,
  type ResidentFormData,
} from '../../services/resident.types';

interface EditResidentProps {
  resident: Resident;
  onClose: () => void;
  onSave: (residentData: Resident) => void;
}


const EditResident: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Loading and error states for API calls
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingResident, setIsFetchingResident] = useState(false);
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
  const [puroks, setPuroks] = useState<Purok[]>([]);

  const [resident, setResident] = useState<Resident | null>(null);

  // Helper function to convert API resident data to form data
  const convertResidentToFormData = (residentData: Resident | null): ResidentFormData => {
    if (residentData == null) {
      throw new Error("Resident form is empty");
    }

    return {
      // Basic Information
      firstName: residentData.first_name || '',
      lastName: residentData.last_name || '',
      middleName: residentData.middle_name || '',
      suffix: residentData.suffix || '',
      birthDate: residentData.birth_date || '',
      age: residentData.age?.toString() || '',
      birthPlace: residentData.birth_place || '',
      gender: residentData.gender || '',
      civilStatus: residentData.civil_status || '',
      nationality: residentData.nationality || 'Filipino',
      religion: residentData.religion || '',
      employmentStatus: residentData.employment_status || '',
      educationalAttainment: residentData.educational_attainment || '',

      // Contact Information
      mobileNumber: residentData.mobile_number || '',
      landlineNumber: residentData.telephone_number || '',
      emailAddress: residentData.email_address || '',
      houseNumber: residentData.house_number || '',
      street: residentData.street || '',
      purok: residentData.purok || '',
      completeAddress: residentData.complete_address || '',
      // Family Information - household relationship fields removed
      // These will be managed by the Household module
      motherName: residentData.mother_name || '',
      fatherName: residentData.father_name || '',
      emergencyContactName: residentData.emergency_contact_name || '',
      emergencyContactNumber: residentData.emergency_contact_number || '',
      emergencyContactRelationship: residentData.emergency_contact_relationship || '',

      // Government IDs & Documents
      primaryIdType: residentData.primary_id_type || '',
      idNumber: residentData.id_number || '',
      philhealthNumber: residentData.philhealth_number || '',
      sssNumber: residentData.sss_number || '',
      tinNumber: residentData.tin_number || '',
      votersIdNumber: residentData.voters_id_number || '',
      voterStatus: residentData.voter_status || 'NOT_REGISTERED',
      precinctNumber: residentData.precinct_number || '',      // Employment Information
      occupation: residentData.occupation || '',
      employer: residentData.employer || '',
      monthlyIncome: (residentData as any).monthly_income?.toString() || '',

      // Health & Medical Information
      medicalConditions: residentData.medical_conditions || '',
      allergies: residentData.allergies || '',

      // Special Classifications
      specialClassifications: {
        seniorCitizen: residentData.senior_citizen || false,
        personWithDisability: residentData.person_with_disability || false,
        disabilityType: residentData.disability_type || '',
        indigenousPeople: residentData.indigenous_people || false,
        indigenousGroup: residentData.indigenous_group || '',
        fourPsBeneficiary: residentData.four_ps_beneficiary || false,
        fourPsHouseholdId: residentData.four_ps_household_id || ''
      }
    };
  };

  // Initialize form data with resident data
  const [formData, setFormData] = useState<ResidentFormData>(
    convertResidentToFormData(resident)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      specialClassifications: {
        ...prev.specialClassifications,
        [name]: checked
      }
    }));
  };

  const handleSpecialFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      specialClassifications: {
        ...prev.specialClassifications,
        [name]: value
      }
    }));
  };

  // Load resident data when component mounts
  useEffect(() => {
    const loadResident = async () => {
      if (!id) {
        setError('Resident ID not provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // For now, we'll use the getResidents method and filter by ID
        // TODO: Backend should provide a getResident(id) method
        const residentsData = await residentsService.getResidents({});
        const residentData = residentsData.data?.find((r: any) => r.id === parseInt(id));
        
        if (!residentData) {
          setError('Resident not found');
          setIsLoading(false);
          return;
        }
        
        setResident(residentData);

        // Populate form with resident data - only update fields that exist in formData
        if (residentData) {
          setFormData(prev => ({
            ...prev,
            firstName: residentData.first_name || '',
            lastName: residentData.last_name || '',
            middleName: residentData.middle_name || '',
            suffix: residentData.suffix || '',
            birthDate: residentData.birth_date || '',
            age: residentData.age?.toString() || '',
            birthPlace: residentData.birth_place || '',
            gender: residentData.gender || '',
            civilStatus: residentData.civil_status || '',
            nationality: residentData.nationality || 'Filipino',
            religion: residentData.religion || '',
            employmentStatus: residentData.employment_status || '',
            educationalAttainment: residentData.educational_attainment || '',
            mobileNumber: residentData.mobile_number || '',
            landlineNumber: residentData.telephone_number || '',
            emailAddress: residentData.email_address || '',
            houseNumber: residentData.house_number || '',
            street: residentData.street || '',
            purok: residentData.purok || '',
            completeAddress: residentData.complete_address ||  '',
            emergencyContactName: residentData.emergency_contact_name || '',
            emergencyContactNumber: residentData.emergency_contact_number || '',
            emergencyContactRelationship: residentData.emergency_contact_relationship || '',
            primaryIdType: residentData.primary_id_type || '',
            idNumber: residentData.id_number || '',
            philhealthNumber: residentData.philhealth_number || '',
            sssNumber: residentData.sss_number || '',
            tinNumber: residentData.tin_number || '',
            votersIdNumber: residentData.voters_id_number || '',
            voterStatus: residentData.voter_status || 'NOT_REGISTERED',
            precinctNumber: residentData.precinct_number || '',
            medicalConditions: residentData.medical_conditions || '',
            allergies: residentData.allergies || '',
            specialClassifications: {
              seniorCitizen: residentData.senior_citizen || false,
              personWithDisability: residentData.person_with_disability || false,
              disabilityType: residentData.disability_type || '',
              indigenousPeople: residentData.indigenous_people || false,
              indigenousGroup: residentData.indigenous_group || '',
              fourPsBeneficiary: residentData.four_ps_beneficiary || false,
              fourPsHouseholdId: residentData.four_ps_household_id || '',
            },
          }));
        }
      } catch (error) {
        console.error('Failed to load resident:', error);
        setError('Failed to load resident data');
      }
    }}, []);

  // Auto-calculate age when birth date changes
  useEffect(() => {
    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      setFormData((prev) => ({ ...prev, age: age.toString() }));
    }
  }, [formData.birthDate]);

  // Fetch reference data and fresh resident data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch reference data
        // Future API calls would be:
        // const purokResponse = await apiService.getPuroks();
        // setPuroks(purokResponse);

        // For now, using mock data
        setPuroks([
          { id: 1, name: 'Purok 1' },
          { id: 2, name: 'Purok 2' },
          { id: 3, name: 'Purok 3' },
          { id: 4, name: 'Purok 4' }
        ]);

        // Fetch fresh resident data
        setIsFetchingResident(true);
        try {
          const freshResident = await residentsService.getResident(resident?.id ?? 1);
          setFormData(convertResidentToFormData(freshResident));
        } catch (err) {
          console.error('Failed to fetch resident data:', err);
          // Continue with existing data if fetch fails
        }
      } catch (err) {
        setError('Failed to load reference data');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!resident) {
      setError('No resident data available');
      setIsSubmitting(false);
      return;
    }

    try {
      // Use the service's transform method to convert form data to API format
      const updateData = residentsService.transformFormDataToApiFormat(formData);

      // Remove the status field as it shouldn't be updated through this form
      delete (updateData as any).status;

      // Use the API service to update the resident
      await residentsService.updateResident(resident.id, updateData);
      
      console.log("Resident updated successfully");
      showToast('Resident updated successfully!', 'success');
      
      // Navigate back to residents list after a short delay to show the toast
      setTimeout(() => {
        navigate('/residents');
      }, 1500);
    } catch (err: unknown) {
      console.error('Error updating resident:', err);

      // Handle different types of errors
      if (err instanceof Error) {
        try {
          // Try to parse JSON error message
          const errorData = JSON.parse(err.message);
          if (errorData.errors) {
            const errorMessages = Object.values(errorData.errors).flat();
            setError(`Validation failed: ${errorMessages.join(', ')}`);
          } else {
            setError(errorData.message || 'Failed to update resident');
          }
        } catch {
          // If not JSON, use the message as is
          setError(err.message);
        }
      } else {
        setError('Failed to update resident. Please try again.');
      }
      showToast('Failed to update resident. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (window.confirm('Any unsaved changes will be lost. Are you sure you want to leave?')) {
      navigate('/residents');
    }
  };

  if (isLoading) {
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
          <p className="text-red-600 mb-4">{JSON.stringify(error) || 'Resident not found'}</p>
          <button
            onClick={() => navigate('/residents')}
            className="px-4 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300"
          >
            Back to Residents
          </button>
        </div>
      </main>
    );
  }

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && resident.id) {
      try {
        await residentsService.uploadProfilePhoto(resident.id, file);
        // You might want to refresh the resident data after upload
      } catch (err) {
        console.error('Failed to upload profile photo:', err);
      }
    }
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      {/* Header */}
      <div className="mb-2 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-darktext pl-0">Edit Resident Profile</h1>
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
          <p className="text-red-800 text-sm">{JSON.stringify(error)}</p>
        </div>
      )}

      {/* Loading State */}
      {(isLoading || isFetchingResident) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800 text-sm">
            {isFetchingResident ? 'Loading resident data...' : 'Loading reference data...'}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Basic Information */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Basic Information</h2>
          <div className="border-b border-gray-200 mb-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter first name here..."
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
                placeholder="Enter last name here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Middle Name
              </label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
                placeholder="N/A if not applicable"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

            <div>
              <label htmlFor="suffix" className="block text-sm font-medium text-gray-700 mb-2">
                Suffix
              </label>
              <select
                id="suffix"
                name="suffix"
                value={formData.suffix}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              >
                <option value="">Select Suffix</option>
                <option value="Jr.">Jr.</option>
                <option value="Sr.">Sr.</option>
                <option value="II">II</option>
                <option value="III">III</option>
                <option value="IV">IV</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Household ID
              </label>
              <input
                type="text"
                value={resident.household?.household_number || 'No Household Assigned'}
                readOnly
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                placeholder="No Household Assigned"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Birth Date *
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age (will be automatically calculated)
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Birth Place *
              </label>
              <input
                type="text"
                name="birthPlace"
                value={formData.birthPlace}
                onChange={handleInputChange}
                placeholder="Enter birth place here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                required
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                required
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            <div>
              <label htmlFor="civilStatus" className="block text-sm font-medium text-gray-700 mb-2">
                Civil Status *
              </label>
              <select
                id="civilStatus"
                name="civilStatus"
                value={formData.civilStatus}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                required
              >
                <option value="">Select Civil Status</option>
                <option value="SINGLE">Single</option>
                <option value="MARRIED">Married</option>
                <option value="WIDOWED">Widowed</option>
                <option value="DIVORCED">Divorced</option>
                <option value="SEPARATED">Separated</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nationality *
              </label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                placeholder="Enter nationality..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Religion
              </label>
              <input
                type="text"
                name="religion"
                value={formData.religion}
                onChange={handleInputChange}
                placeholder="Enter religion here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

            <div>
              <label htmlFor="employmentStatus" className="block text-sm font-medium text-gray-700 mb-2">
                Employment Status
              </label>
              <select
                id="employmentStatus"
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              >
                <option value="">Select Employment Status</option>
                <option value="EMPLOYED">Employed</option>
                <option value="UNEMPLOYED">Unemployed</option>
                <option value="SELF_EMPLOYED">Self Employed</option>
                <option value="RETIRED">Retired</option>
                <option value="STUDENT">Student</option>
                <option value="OFW">OFW</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Educational Attainment
              </label>
              <input
                type="text"
                name="educationalAttainment"
                value={formData.educationalAttainment}
                onChange={handleInputChange}
                placeholder="e.g. High School Graduate, College Graduate..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Occupation
              </label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                placeholder="e.g. Teacher, Engineer, Farmer..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employer
              </label>
              <input
                type="text"
                name="employer"
                value={formData.employer}
                onChange={handleInputChange}
                placeholder="Name of employer/company..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Income (PHP)
              </label>
              <input
                type="number"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleInputChange}
                placeholder="Enter monthly income..."
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Contact Information</h2>
          <div className="border-b border-gray-200 mb-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                placeholder="+63 XXX XXX XXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Landline Number
              </label>
              <input
                type="tel"
                name="landlineNumber"
                value={formData.landlineNumber}
                onChange={handleInputChange}
                placeholder="(02) XXXX-XXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleInputChange}
                placeholder="resident@gmail.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                House/Unit Number
              </label>
              <input
                type="text"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleInputChange}
                placeholder="e.g. 123, Blk 4 Lot 5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
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
                placeholder="e.g. Rizal Street"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purok
              </label>
              <select
                name="purok"
                value={formData.purok}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                disabled={isLoading || isFetchingResident}
              >
                <option value="">Select Purok</option>
                {puroks.map((purok) => (
                  <option key={purok.id} value={purok.name}>
                    {purok.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complete Address *
              </label>
              <textarea
                name="completeAddress"
                value={formData.completeAddress}
                onChange={handleInputChange}
                placeholder="Enter complete address..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                required
              />
            </div>
          </div>
        </section>

        {/* Family Information */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Family Information</h2>          <div className="border-b border-gray-200 mb-6"></div>

          {/* Household relationship fields removed - managed by Household module */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mother's Name
              </label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleInputChange}
                placeholder="Search existing residents or enter new"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Father's Name
              </label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleInputChange}
                placeholder="Search existing residents or enter new"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact Name
              </label>
              <input
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleInputChange}
                placeholder="Full Name of emergency contact"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact Number
              </label>
              <input
                type="tel"
                name="emergencyContactNumber"
                value={formData.emergencyContactNumber}
                onChange={handleInputChange}
                placeholder="+63 XXX XXX XXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact Relationship
              </label>
              <input
                type="text"
                name="emergencyContactRelationship"
                value={formData.emergencyContactRelationship}
                onChange={handleInputChange}
                placeholder="e.g. Sibling, Friend, Relative..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>
          </div>
        </section>

        {/* Government IDs & Documents */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Government IDs & Documents</h2>
          <div className="border-b border-gray-200 mb-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary ID Type
              </label>
              <select
                name="primaryIdType"
                value={formData.primaryIdType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              >
                <option value="">Select ID Type</option>
                <option value="National ID">National ID</option>
                <option value="Passport">Passport</option>
                <option value="Driver's License">Driver's License</option>
                <option value="Voter's ID">Voter's ID</option>
                <option value="PhilHealth ID">PhilHealth ID</option>
                <option value="SSS ID">SSS ID</option>
                <option value="UMID">UMID</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Number
              </label>
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleInputChange}
                placeholder="Enter ID Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PhilHealth Number
              </label>
              <input
                type="text"
                name="philhealthNumber"
                value={formData.philhealthNumber}
                onChange={handleInputChange}
                placeholder="XX-XXXXXXXXX-X"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SSS Number
              </label>
              <input
                type="text"
                name="sssNumber"
                value={formData.sssNumber}
                onChange={handleInputChange}
                placeholder="XX-XXXXXXX-X"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TIN Number
              </label>
              <input
                type="text"
                name="tinNumber"
                value={formData.tinNumber}
                onChange={handleInputChange}
                placeholder="XXX-XXX-XXX-XXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voter's ID Number
              </label>
              <input
                type="text"
                name="votersIdNumber"
                value={formData.votersIdNumber}
                onChange={handleInputChange}
                placeholder="Enter Voter's ID Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voter Status *
              </label>
              <select
                name="voterStatus"
                value={formData.voterStatus}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                required
              >
                <option value="NOT_REGISTERED">Not Registered</option>
                <option value="REGISTERED">Registered</option>
                <option value="DECEASED">Deceased</option>
                <option value="TRANSFERRED">Transferred</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precinct Number
              </label>
              <input
                type="text"
                name="precinctNumber"
                value={formData.precinctNumber}
                onChange={handleInputChange}
                placeholder="Enter precinct number..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>
          </div>
        </section>

        {/* Health & Medical Information */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Health & Medical Information</h2>
          <div className="border-b border-gray-200 mb-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Conditions
              </label>
              <textarea
                name="medicalConditions"
                value={formData.medicalConditions}
                onChange={handleInputChange}
                placeholder="List any medical conditions, medications, or health concerns..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allergies
              </label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
                placeholder="List any known allergies (food, medication, environmental)..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>
          </div>
        </section>

        {/* Special Classifications */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Special Classifications</h2>
          <div className="border-b border-gray-200 mb-6"></div>
          <p className="text-sm text-gray-600 mb-4">Check all that apply:</p>

          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="seniorCitizen"
                  checked={formData.specialClassifications.seniorCitizen}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                Senior Citizen (60+)
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="personWithDisability"
                  checked={formData.specialClassifications.personWithDisability}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                Person with Disability
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="indigenousPeople"
                  checked={formData.specialClassifications.indigenousPeople}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                Indigenous People
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="fourPsBeneficiary"
                  checked={formData.specialClassifications.fourPsBeneficiary}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                4Ps Beneficiary
              </label>
            </div>

            {/* Conditional Fields */}
            {formData.specialClassifications.personWithDisability && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disability Type
                </label>
                <input
                  type="text"
                  name="disabilityType"
                  value={formData.specialClassifications.disabilityType}
                  onChange={handleSpecialFieldChange}
                  placeholder="Specify type of disability..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                />
              </div>
            )}

            {formData.specialClassifications.indigenousPeople && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Indigenous Group
                </label>
                <input
                  type="text"
                  name="indigenousGroup"
                  value={formData.specialClassifications.indigenousGroup}
                  onChange={handleSpecialFieldChange}
                  placeholder="Specify indigenous group..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                />
              </div>
            )}

            {formData.specialClassifications.fourPsBeneficiary && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  4Ps Household ID
                </label>
                <input
                  type="text"
                  name="fourPsHouseholdId"
                  value={formData.specialClassifications.fourPsHouseholdId}
                  onChange={handleSpecialFieldChange}
                  placeholder="Enter 4Ps Household ID..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                />
              </div>
            )}
          </div>
        </section>

        {/* Profile Photo */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Profile Photo</h2>
          <div className="border-b border-gray-200 mb-6"></div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <FiUpload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">Upload Profile Photo</p>
            <p className="text-sm text-gray-500">Click to browse or drag and drop</p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="profilePhoto"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="profilePhoto"
              className="cursor-pointer"
            >
            </label>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="px-6 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>{isSubmitting ? 'Updating...' : 'Update Resident'}</span>
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

export default EditResident;

