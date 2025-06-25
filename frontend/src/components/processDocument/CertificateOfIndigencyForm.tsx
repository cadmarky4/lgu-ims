import React, { useState, useEffect } from 'react';
import { FiSearch, FiUser, FiCheck, FiArrowLeft, FiInfo } from 'react-icons/fi';
import { useResidents } from '../../services/residents/useResidents';
import { useDocumentForm } from './_hooks/useDocumentForm';
import { type DocumentFormData } from '../../services/documents/documents.types';
import { type Resident } from '../../services/residents/residents.types';
import Breadcrumb from '../_global/Breadcrumb';

interface CertificateOfIndigencyFormProps {
  onNavigate: (page: string) => void;
}

const CertificateOfIndigencyForm: React.FC<CertificateOfIndigencyFormProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [formData, setFormData] = useState({
    purpose: '',
    monthlyIncome: '',
    householdMembers: '',
    sourceOfIncome: '',
    additionalInfo: '',
    declarationAgreed: false
  });

  // Use our new document form hook
  const documentForm = useDocumentForm({
    documentType: 'CERTIFICATE_OF_INDIGENCY',
    onSuccess: (document) => {
      console.log('Certificate of Indigency created successfully:', document);
      setStep(3);
    },
    onError: (error) => {
      console.error('Failed to create certificate of indigency:', error);
    }
  });

  // Use residents query for search
  const { 
    data: residentsData, 
    isLoading: searchLoading 
  } = useResidents({ 
    search: searchTerm, 
    per_page: 10 
  });

  const residents = residentsData?.data || [];

  const commonPurposes = [
    'Medical Assistance',
    'Educational Scholarship',
    'DSWD AICS Program',
    'PCSO Medical Assistance',
    'Burial Assistance',
    'Calamity Relief',
    'Food Assistance',
    'Housing Program',
    'Legal Aid Services',
    'Government Benefits'
  ];

  const incomeSources = [
    'No Regular Income',
    'Daily Labor/Casual Work',
    'Unemployment',
    'Senior Citizen Pension',
    'PWD Benefits',
    'Informal Vending',
    'Dependent on Family',
    'Other (Specify in Additional Info)'
  ];

  // Animation trigger on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleResidentSelect = (resident: Resident) => {
    setSelectedResident(resident);
    setSearchTerm(`${resident.first_name} ${resident.middle_name || ''} ${resident.last_name}`.trim());
    setStep(2);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!selectedResident || !formData.declarationAgreed) return;

    const documentData: DocumentFormData = {
      document_type: 'CERTIFICATE_OF_INDIGENCY',
      resident_id: selectedResident.id,
      applicant_name: `${selectedResident.first_name} ${selectedResident.middle_name ? selectedResident.middle_name + ' ' : ''}${selectedResident.last_name}`,
      applicant_address: selectedResident.complete_address,
      applicant_contact: selectedResident.mobile_number,
      purpose: formData.purpose,
      processing_fee: 0, // Always FREE by law
      priority: 'NORMAL',
      requirements_submitted: ['Declaration of Indigency'],
      remarks: `Monthly Income: ₱${formData.monthlyIncome}, Household Members: ${formData.householdMembers}, Source: ${formData.sourceOfIncome}, Additional Info: ${formData.additionalInfo}`,
      // Additional fields for our schema
      applicant_email: selectedResident.email_address || '',
      needed_date: '',
    };

    await documentForm.handleSubmit(documentData);
  };

  const renderStep1 = () => (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-700 ease-out ${
      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`} style={{ transitionDelay: '200ms' }}>
      <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">
        Select Resident
      </h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search for resident *
        </label>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter resident's name..."
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
          />
        </div>
        
        {searchLoading && (
          <div className="mt-2 text-sm text-gray-500">Searching...</div>
        )}
        
        {residents.length > 0 && (
          <div className="mt-2 border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
            {residents.map((resident) => (
              <div
                key={resident.id}
                onClick={() => handleResidentSelect(resident)}
                className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-smblue-100 rounded-full flex items-center justify-center">
                    <FiUser className="h-5 w-5 text-smblue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {resident.first_name} {resident.middle_name} {resident.last_name}
                    </div>
                    <div className="text-sm text-gray-500">{resident.complete_address}</div>
                    <div className="text-xs text-gray-400">
                      Age: {resident.age} • {resident.civil_status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={() => onNavigate('addNewResident')}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer no-underline"
        >
          <FiUser className="w-4 h-4 mr-2" />
          Add New Resident
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className={`space-y-6 transition-all duration-700 ease-out ${
      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`} style={{ transitionDelay: '200ms' }}>
      {/* FREE Certificate Notice */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex">
          <FiInfo className="flex-shrink-0 h-5 w-5 text-orange-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-orange-800">
              Certificate of Indigency is FREE
            </h3>
            <div className="mt-2 text-sm text-orange-700">
              <p>
                In accordance with DILG Memorandum Circular 2019-72 and R.A. 11261 (First Time Jobseekers Assistance Act), 
                this certificate is issued <strong>FREE OF CHARGE</strong>. Any person demanding payment may be held liable under applicable laws.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Resident Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">
          Resident Information
        </h2>
        
        {selectedResident && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="text-sm text-gray-900">
                {selectedResident.first_name} {selectedResident.middle_name} {selectedResident.last_name}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <div className="text-sm text-gray-900">{selectedResident.age}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Civil Status</label>
              <div className="text-sm text-gray-900">{selectedResident.civil_status}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
              <div className="text-sm text-gray-900">{selectedResident.nationality}</div>
            </div>
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <div className="text-sm text-gray-900">{selectedResident.complete_address}</div>
            </div>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => setStep(1)}
            className="inline-flex items-center text-sm text-smblue-400 hover:text-smblue-300"
          >
            <FiArrowLeft className="w-4 h-4 mr-1" />
            Change Resident
          </button>
        </div>
      </div>

      {/* Indigency Information Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">
          Indigency Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose of Request *
            </label>
            <select
              value={formData.purpose}
              onChange={(e) => handleInputChange('purpose', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              required
            >
              <option value="">Select purpose</option>
              {commonPurposes.map((purpose) => (
                <option key={purpose} value={purpose}>{purpose}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Household Income *
            </label>
            <input
              type="number"
              value={formData.monthlyIncome}
              onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
              placeholder="Enter monthly income in pesos"
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Enter 0 if no income</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Household Members *
            </label>
            <input
              type="number"
              value={formData.householdMembers}
              onChange={(e) => handleInputChange('householdMembers', e.target.value)}
              placeholder="Total family members"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Source of Income *
            </label>
            <select
              value={formData.sourceOfIncome}
              onChange={(e) => handleInputChange('sourceOfIncome', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              required
            >
              <option value="">Select income source</option>
              {incomeSources.map((source) => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Information
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              placeholder="Provide additional details about family situation, special circumstances, or other relevant information..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
            />
          </div>
        </div>

        {/* Declaration */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={formData.declarationAgreed}
              onChange={(e) => handleInputChange('declarationAgreed', e.target.checked)}
              className="h-4 w-4 text-orange-500 focus:ring-orange-200 border-gray-300 rounded mt-1"
              required
            />
            <span className="ml-3 text-sm text-gray-700">
              <strong>Declaration:</strong> I hereby declare that the information provided above is true and correct. 
              I understand that providing false information may result in legal consequences. I also acknowledge that 
              my family belongs to the indigent sector and requires assistance from government programs and institutions.
            </span>
          </label>
        </div>

        {/* Processing Fee */}
        <div className="mt-6 p-4 bg-orange-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Processing Fee:</span>
            <span className="text-lg font-bold text-orange-600">FREE</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            As mandated by law, Certificate of Indigency is issued free of charge
          </p>
        </div>

        {/* Display error if exists */}
        {documentForm.error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{documentForm.error}</p>
            <button 
              onClick={documentForm.clearError}
              className="mt-2 text-red-600 underline text-sm"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={() => setStep(1)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer no-underline"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={documentForm.isSubmitting || !formData.purpose || !formData.monthlyIncome || !formData.householdMembers || !formData.sourceOfIncome || !formData.declarationAgreed}
            className="px-6 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 cursor-pointer no-underline"
          >
            {documentForm.isSubmitting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>{documentForm.isSubmitting ? 'Submitting...' : 'Submit Request'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center transition-all duration-700 ease-out ${
      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`} style={{ transitionDelay: '200ms' }}>
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiCheck className="w-8 h-8 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted Successfully!</h2>
      <p className="text-gray-600 mb-6">
        Your Certificate of Indigency request has been submitted and is now in the processing queue.
      </p>
      
      {selectedResident && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Request Details</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Resident:</strong> {selectedResident.first_name} {selectedResident.last_name}</p>
            <p><strong>Document:</strong> Certificate of Indigency</p>
            <p><strong>Purpose:</strong> {formData.purpose}</p>
            <p><strong>Processing Fee:</strong> FREE</p>
            <p><strong>Expected Processing Time:</strong> 24-48 hours</p>
          </div>
        </div>
      )}
      
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-orange-800">
          <strong>Important:</strong> This certificate is issued free of charge. Please present a valid ID 
          when claiming your certificate. Processing may require verification of the information provided.
        </p>
      </div>
      
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => onNavigate('process-document')}
          className="px-6 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300 transition-colors cursor-pointer no-underline"
        >
          View All Requests
        </button>
        <button
          onClick={() => {
            setStep(1);
            setSelectedResident(null);
            setSearchTerm('');
            setFormData({
              purpose: '',
              monthlyIncome: '',
              householdMembers: '',
              sourceOfIncome: '',
              additionalInfo: '',
              declarationAgreed: false
            });
          }}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer no-underline"
        >
          New Request
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb isLoaded={isLoaded} />

      {/* Header */}
      <div className={`mb-6 transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <div className="flex items-center space-x-2 mb-2">
          <button
            onClick={() => onNavigate('process-document')}
            className="text-smblue-400 hover:text-smblue-300"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-darktext">Certificate of Indigency Request</h1>
        </div>
        <p className="text-gray-600">For Low-Income Residents Requiring Government Assistance</p>
      </div>

      {/* Progress Indicator */}
      <div className={`mb-8 transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ transitionDelay: '100ms' }}>
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber 
                  ? 'bg-smblue-400 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-16 h-1 ml-2 ${
                  step > stepNumber ? 'bg-smblue-400' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-2">
          <div className="text-sm text-gray-600">
            Step {step} of 3: {
              step === 1 ? 'Select Resident' :
              step === 2 ? 'Enter Information' :
              'Confirmation'
            }
          </div>
        </div>
      </div>

      {/* Form Steps */}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
};

export default CertificateOfIndigencyForm;