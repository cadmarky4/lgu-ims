import React, { useState, useEffect } from 'react';
import { FiUpload } from 'react-icons/fi';
import { apiService } from '../services/api';

interface AddNewResidentProps {
  onClose: () => void;
  onSave: (residentData: any) => void;
}

const AddNewResident: React.FC<AddNewResidentProps> = ({ onClose, onSave }) => {
  // Loading and error states for API calls
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [duplicateResidents, setDuplicateResidents] = useState<any[]>([]);
  // Reference data from backend
  const [puroks, setPuroks] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: '',
    lastName: '',
    middleName: '',
    suffix: '',
    birthDate: '',
    age: '',
    birthPlace: '',
    gender: '',
    civilStatus: '',
    nationality: 'Filipino',
    religion: '',
    employmentStatus: '',
    educationalAttainment: '',
    // Contact Information
    mobileNumber: '',
    landlineNumber: '',
    emailAddress: '',
    houseNumber: '',
    street: '',
    purok: '',
    completeAddress: '',
    // Family Information
    householdId: '',
    isHouseholdHead: '',
    relationshipToHead: '',
    motherName: '',
    fatherName: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    emergencyContactRelationship: '',
    // Government IDs & Documents
    primaryIdType: '',
    idNumber: '',
    philhealthNumber: '',
    sssNumber: '',
    tinNumber: '',
    votersIdNumber: '',
    // Required fields that were missing
    occupation: '',
    employer: '',
    monthlyIncome: '',
    voterStatus: 'NOT_REGISTERED',
    precinctNumber: '',
    // Health & Medical Information
    medicalConditions: '',
    allergies: '',
    // Special Classifications
    specialClassifications: {
      seniorCitizen: false,
      personWithDisability: false,
      disabilityType: '',
      indigenousPeople: false,
      indigenousGroup: '',
      fourPsBeneficiary: false,
      fourPsHouseholdId: ''
    }
  });

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
  // Auto-calculate age when birth date changes
  useEffect(() => {
    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  }, [formData.birthDate]);

  // Check for duplicate residents when key fields change
  useEffect(() => {
    const checkDuplicates = async () => {
      if (formData.firstName && formData.lastName && formData.birthDate) {
        try {
          const duplicates = await apiService.checkDuplicateResident(
            formData.firstName,
            formData.lastName,
            formData.birthDate
          );

          if (duplicates.length > 0) {
            setDuplicateWarning(`Found ${duplicates.length} potential duplicate(s). Please verify this is not a duplicate entry.`);
            setDuplicateResidents(duplicates);
          } else {
            setDuplicateWarning(null);
            setDuplicateResidents([]);
          }
        } catch (error) {
          console.error('Failed to check duplicates:', error);
        }
      }
    };

    const delayedCheck = setTimeout(checkDuplicates, 1000);
    return () => clearTimeout(delayedCheck);
  }, [formData.firstName, formData.lastName, formData.birthDate]);  // Fetch reference data on component mount
  useEffect(() => {
    const fetchReferenceData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // In a real implementation, you would have endpoints for reference data
        // For now, using mock data as the backend might not have these endpoints yet
        // 
        // Future API calls would be:
        // const purokResponse = await apiService.getPuroks();
        // setPuroks(purokResponse);

        // Mock data for now
        setPuroks([
          { id: 1, name: 'Purok 1' },
          { id: 2, name: 'Purok 2' },
          { id: 3, name: 'Purok 3' },
          { id: 4, name: 'Purok 4' }
        ]);
      } catch (err) {
        setError('Failed to load reference data');
        console.error('Error fetching reference data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferenceData();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {      // Transform form data to match backend API expectations
      const residentData = {
        // Basic Information
        first_name: formData.firstName,
        last_name: formData.lastName,
        middle_name: formData.middleName || null,
        suffix: formData.suffix || null,
        birth_date: formData.birthDate,
        birth_place: formData.birthPlace,
        gender: formData.gender,
        civil_status: formData.civilStatus,
        nationality: formData.nationality,
        religion: formData.religion || null,
        employment_status: formData.employmentStatus || null,
        educational_attainment: formData.educationalAttainment || null,
        
        // Contact Information
        mobile_number: formData.mobileNumber || null,
        telephone_number: formData.landlineNumber || null,
        email_address: formData.emailAddress || null,
        complete_address: formData.completeAddress,
        house_number: formData.houseNumber || null,
        street: formData.street || null,
        purok: formData.purok || null,
        
        // Family Information
        household_id: formData.householdId || null,
        is_household_head: formData.isHouseholdHead === 'yes',
        relationship_to_head: formData.relationshipToHead || null,
        emergency_contact_name: formData.emergencyContactName || null,
        emergency_contact_number: formData.emergencyContactNumber || null,
        emergency_contact_relationship: formData.emergencyContactRelationship || null,
          // Government IDs
        philhealth_number: formData.philhealthNumber || null,
        sss_number: formData.sssNumber || null,
        tin_number: formData.tinNumber || null,
        voters_id_number: formData.votersIdNumber || null,
        voter_status: formData.voterStatus || 'NOT_REGISTERED',
        precinct_number: formData.precinctNumber || null,
        
        // Employment Information
        occupation: formData.occupation || null,
        employer: formData.employer || null,
        monthly_income: formData.monthlyIncome ? parseFloat(formData.monthlyIncome) : null,
        
        // Health & Medical
        medical_conditions: formData.medicalConditions || null,
        allergies: formData.allergies || null,
        
        // Special Classifications
        senior_citizen: formData.specialClassifications.seniorCitizen,
        person_with_disability: formData.specialClassifications.personWithDisability,
        disability_type: formData.specialClassifications.disabilityType || null,
        indigenous_people: formData.specialClassifications.indigenousPeople,
        indigenous_group: formData.specialClassifications.indigenousGroup || null,
        four_ps_beneficiary: formData.specialClassifications.fourPsBeneficiary,
        four_ps_household_id: formData.specialClassifications.fourPsHouseholdId || null,
        
        // Default values
        status: 'ACTIVE'
      };

      // Use the API service to create the resident
      const newResident = await apiService.createResident(residentData);

      console.log('New resident created successfully:', newResident);

      // Call the parent component's onSave callback
      onSave(newResident);
      onClose();
    } catch (err: any) {
      console.error('Error saving resident:', err);

      // Handle validation errors
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat();
        setError(`Validation failed: ${errorMessages.join(', ')}`);
      } else {
        setError(err.message || 'Failed to save resident. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-darktext pl-0">Add New Resident Profile</h1>
      </div>      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Duplicate Warning */}
      {duplicateWarning && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-800 text-sm font-medium">⚠️ {duplicateWarning}</p>
          {duplicateResidents.length > 0 && (
            <div className="mt-2">
              <p className="text-yellow-700 text-xs mb-2">Similar residents found:</p>
              <ul className="text-yellow-700 text-xs space-y-1">
                {duplicateResidents.slice(0, 3).map((resident, index) => (
                  <li key={index}>
                    • {resident.first_name} {resident.last_name} - {resident.birth_date} - {resident.complete_address}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800 text-sm">Loading reference data...</p>
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
                placeholder="Enter birth place..."
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
            </div>            <div>
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
            </div>

            <div>
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
                Monthly Income
              </label>
              <input
                type="number"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleInputChange}
                placeholder="0.00"
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
                disabled={isLoading}
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
          <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Family Information</h2>
          <div className="border-b border-gray-200 mb-6"></div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Are you the household head? *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isHouseholdHead"
                  value="yes"
                  checked={formData.isHouseholdHead === 'yes'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isHouseholdHead"
                  value="no"
                  checked={formData.isHouseholdHead === 'no'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Household ID
              </label>
              <input
                type="text"
                name="householdId"
                value={formData.householdId}
                onChange={handleInputChange}
                placeholder="Enter household ID if applicable"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship to Head
              </label>
              <input
                type="text"
                name="relationshipToHead"
                value={formData.relationshipToHead}
                onChange={handleInputChange}
                placeholder="e.g. Son, Daughter, Spouse..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

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
            </div>            <div>
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
            />
            <label
              htmlFor="profilePhoto"
              className="cursor-pointer"
            >
            </label>
          </div>
        </section>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
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
            <span>{isSubmitting ? 'Saving...' : 'Register Resident'}</span>
          </button>
        </div>
      </form>
    </main>
  );
};

export default AddNewResident; 