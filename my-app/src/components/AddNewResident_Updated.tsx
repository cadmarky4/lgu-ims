import React, { useState } from 'react';
import { apiService } from '../services/api';

interface AddNewResidentProps {
  onClose: () => void;
  onSave?: (residentData: any) => void;
}

const AddNewResident: React.FC<AddNewResidentProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',    suffix: '',
    birthDate: '',
    birthPlace: '',
    age: '',
    gender: '',
    civilStatus: '',
    nationality: 'Filipino',
    religion: '',
    houseNumber: '',
    street: '',
    purok: '',
    completeAddress: '',
    mobileNumber: '',
    telephoneNumber: '',
    emailAddress: '',
    isHouseholdHead: '',
    relationshipToHead: '',
    occupation: '',
    employer: '',
    monthlyIncome: '',
    employmentStatus: '',
    educationalAttainment: '',    emergencyContactName: '',
    emergencyContactNumber: '',
    emergencyContactRelationship: '',
    motherName: '',
    fatherName: '',
    primaryIdType: '',
    idNumber: '',
    philhealthNumber: '',
    sssNumber: '',
    tinNumber: '',
    votersIdNumber: '',
    voterStatus: 'NOT_REGISTERED',
    precinctNumber: '',
    medicalConditions: '',
    allergies: '',
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate age from birth date
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age.toString();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Auto-calculate age when birth date changes
      if (name === 'birthDate' && value) {
        newData.age = calculateAge(value);
      }
      
      return newData;
    });
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

  const handleSpecialFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      specialClassifications: {
        ...prev.specialClassifications,
        [name]: value
      }
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double-click submission
    if (loading) {
      return;
    }
    
    setLoading(true);
    setError(null);    try {
      // Check for potential duplicates first
      if (formData.firstName && formData.lastName && formData.birthDate) {
        const duplicates = await apiService.checkDuplicateResident(
          formData.firstName,
          formData.lastName,
          formData.birthDate
        );
        
        if (duplicates.length > 0) {
          const confirmed = window.confirm(
            `A resident with similar details already exists:\n\n` +
            `${duplicates[0].full_name}\n` +
            `Birth Date: ${new Date(duplicates[0].birth_date).toLocaleDateString()}\n` +
            `Address: ${duplicates[0].complete_address}\n\n` +
            `Do you want to continue creating this record anyway?`
          );
          
          if (!confirmed) {
            setLoading(false);
            return;
          }
        }
      }

      // Transform form data to match backend API structure
      const residentData = {
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
        mobile_number: formData.mobileNumber || null,
        telephone_number: formData.telephoneNumber || null,
        email_address: formData.emailAddress || null,
        house_number: formData.houseNumber || null,
        street: formData.street || null,
        purok: formData.purok || null,
        complete_address: formData.completeAddress,
        philhealth_number: formData.philhealthNumber || null,
        sss_number: formData.sssNumber || null,
        tin_number: formData.tinNumber || null,
        voters_id_number: formData.votersIdNumber || null,
        is_household_head: formData.isHouseholdHead === 'yes',
        relationship_to_head: formData.relationshipToHead || null,
        occupation: formData.occupation || null,
        employer: formData.employer || null,
        monthly_income: formData.monthlyIncome ? parseFloat(formData.monthlyIncome) : null,
        employment_status: formData.employmentStatus || null,
        educational_attainment: formData.educationalAttainment || null,        emergency_contact_name: formData.emergencyContactName || null,
        emergency_contact_number: formData.emergencyContactNumber || null,
        emergency_contact_relationship: formData.emergencyContactRelationship || null,
        mother_name: formData.motherName || null,
        father_name: formData.fatherName || null,        primary_id_type: formData.primaryIdType || null,
        id_number: formData.idNumber || null,
        age: formData.age ? parseInt(formData.age) : null,
        voter_status: formData.voterStatus,
        precinct_number: formData.precinctNumber || null,
        medical_conditions: formData.medicalConditions || null,
        allergies: formData.allergies || null,
        senior_citizen: formData.specialClassifications.seniorCitizen,
        person_with_disability: formData.specialClassifications.personWithDisability,
        disability_type: formData.specialClassifications.disabilityType || null,
        indigenous_people: formData.specialClassifications.indigenousPeople,
        indigenous_group: formData.specialClassifications.indigenousGroup || null,        four_ps_beneficiary: formData.specialClassifications.fourPsBeneficiary,
        four_ps_household_id: formData.specialClassifications.fourPsHouseholdId || null
      };

      await apiService.createResident(residentData);
      
      if (onSave) {
        onSave(residentData);
      }
      
      onClose();    } catch (err: any) {
      console.error('Error creating resident:', err);
      
      // Handle specific error cases
      if (err.response?.status === 422) {
        const errorData = err.response.data;
        if (errorData.message?.includes('duplicate') || errorData.message?.includes('already exists')) {
          setError('A resident with these details already exists. Please check the information and try again.');
        } else if (errorData.errors) {
          // Handle validation errors
          const errorMessages = Object.values(errorData.errors).flat();
          setError(`Validation errors: ${errorMessages.join(', ')}`);
        } else {
          setError(errorData.message || 'Validation failed. Please check your input.');
        }
      } else {
        setError(err.response?.data?.message || 'Failed to create resident. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-4">Add New Resident Profile</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Basic Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                placeholder="Enter last name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                placeholder="Enter middle name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suffix
              </label>
              <select
                name="suffix"
                value={formData.suffix}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Birth Place *
              </label>
              <input
                type="text"
                name="birthPlace"
                value={formData.birthPlace}
                onChange={handleInputChange}
                placeholder="Enter birth place"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Auto-calculated from birth date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                readOnly
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Civil Status *
              </label>
              <select
                name="civilStatus"
                value={formData.civilStatus}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Civil Status</option>
                <option value="SINGLE">Single</option>
                <option value="MARRIED">Married</option>
                <option value="DIVORCED">Divorced</option>
                <option value="WIDOWED">Widowed</option>
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
                placeholder="Filipino"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                placeholder="Enter religion"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Address Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                House Number
              </label>
              <input
                type="text"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleInputChange}
                placeholder="e.g. 123, Blk 4 Lot 5"
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
                placeholder="e.g. Rizal Street"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Purok</option>
                <option value="Purok 1">Purok 1</option>
                <option value="Purok 2">Purok 2</option>
                <option value="Purok 3">Purok 3</option>
                <option value="Purok 4">Purok 4</option>
                <option value="Purok 5">Purok 5</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complete Address *
            </label>
            <textarea
              name="completeAddress"
              value={formData.completeAddress}
              onChange={handleInputChange}
              rows={3}
              placeholder="Enter complete address"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telephone Number
              </label>
              <input
                type="tel"
                name="telephoneNumber"
                value={formData.telephoneNumber}
                onChange={handleInputChange}
                placeholder="(02) XXXX-XXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Household Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Household Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
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

            {formData.isHouseholdHead === 'no' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship to Household Head
                </label>
                <select
                  name="relationshipToHead"
                  value={formData.relationshipToHead}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Relationship</option>
                  <option value="SPOUSE">Spouse</option>
                  <option value="CHILD">Child</option>
                  <option value="PARENT">Parent</option>
                  <option value="SIBLING">Sibling</option>
                  <option value="GRANDCHILD">Grandchild</option>
                  <option value="GRANDPARENT">Grandparent</option>
                  <option value="OTHER_RELATIVE">Other Relative</option>
                  <option value="NON_RELATIVE">Non-Relative</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Employment Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Employment Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Status
              </label>
              <select
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Employment Status</option>
                <option value="EMPLOYED">Employed</option>
                <option value="UNEMPLOYED">Unemployed</option>
                <option value="SELF_EMPLOYED">Self-Employed</option>
                <option value="RETIRED">Retired</option>
                <option value="STUDENT">Student</option>
                <option value="OFW">OFW</option>
              </select>
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
                placeholder="Enter occupation"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                placeholder="Enter employer name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Educational Attainment
              </label>
              <select
                name="educationalAttainment"
                value={formData.educationalAttainment}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Educational Attainment</option>
                <option value="NO_FORMAL_EDUCATION">No Formal Education</option>
                <option value="ELEMENTARY_UNDERGRADUATE">Elementary Undergraduate</option>
                <option value="ELEMENTARY_GRADUATE">Elementary Graduate</option>
                <option value="HIGH_SCHOOL_UNDERGRADUATE">High School Undergraduate</option>
                <option value="HIGH_SCHOOL_GRADUATE">High School Graduate</option>
                <option value="VOCATIONAL">Vocational</option>
                <option value="COLLEGE_UNDERGRADUATE">College Undergraduate</option>
                <option value="COLLEGE_GRADUATE">College Graduate</option>
                <option value="POST_GRADUATE">Post Graduate</option>
              </select>
            </div>
          </div>        </div>

        {/* Family Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Family Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mother's Name
              </label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleInputChange}
                placeholder="Mother's full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                placeholder="Father's full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Emergency Contact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact Name
              </label>
              <input
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleInputChange}
                placeholder="Full name of emergency contact"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship
              </label>
              <input
                type="text"
                name="emergencyContactRelationship"
                value={formData.emergencyContactRelationship}
                onChange={handleInputChange}
                placeholder="e.g. Spouse, Parent, Sibling"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>        {/* Government IDs */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Government IDs & Documents</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary ID Type
              </label>
              <select
                name="primaryIdType"
                value={formData.primaryIdType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                placeholder="XXXX-XXXX-XXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Voter Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Voter Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voter Status *
              </label>
              <select
                name="voterStatus"
                value={formData.voterStatus}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="NOT_REGISTERED">Not Registered</option>
                <option value="REGISTERED">Registered</option>
                <option value="DECEASED">Deceased</option>
                <option value="TRANSFERRED">Transferred</option>
              </select>
            </div>

            {formData.voterStatus === 'REGISTERED' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precinct Number
                </label>
                <input
                  type="text"
                  name="precinctNumber"
                  value={formData.precinctNumber}
                  onChange={handleInputChange}
                  placeholder="Enter precinct number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Health Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Health Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Conditions
              </label>
              <textarea
                name="medicalConditions"
                value={formData.medicalConditions}
                onChange={handleInputChange}
                rows={3}
                placeholder="List any medical conditions"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                rows={3}
                placeholder="List any allergies"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Special Classifications */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Special Classifications</h2>
          <p className="text-sm text-gray-600 mb-4">Check all that apply:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
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
              
              <div>
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

                {formData.specialClassifications.personWithDisability && (
                  <div className="ml-6 mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Disability Type
                    </label>
                    <input
                      type="text"
                      name="disabilityType"
                      value={formData.specialClassifications.disabilityType}
                      onChange={handleSpecialFieldChange}
                      placeholder="Specify disability type"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
              
              <div>
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

                {formData.specialClassifications.indigenousPeople && (
                  <div className="ml-6 mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Indigenous Group
                    </label>
                    <input
                      type="text"
                      name="indigenousGroup"
                      value={formData.specialClassifications.indigenousGroup}
                      onChange={handleSpecialFieldChange}
                      placeholder="Specify indigenous group"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
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

                {formData.specialClassifications.fourPsBeneficiary && (
                  <div className="ml-6 mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      4Ps Household ID
                    </label>
                    <input
                      type="text"
                      name="fourPsHouseholdId"
                      value={formData.specialClassifications.fourPsHouseholdId}
                      onChange={handleSpecialFieldChange}
                      placeholder="Enter 4Ps Household ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>
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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register Resident'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewResident;
