import React, { useState, useEffect } from 'react';
import { FiSearch, FiUser, FiCheck, FiArrowLeft } from 'react-icons/fi';
import { apiService } from '../../services';
import { documentsService }from '../../services/documents.service';
import Breadcrumb from '../global/Breadcrumb';

interface BarangayClearanceFormProps {
  onNavigate: (page: string) => void;
}

interface Resident {
  id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  birth_date: string;
  age?: number;
  civil_status: string;
  nationality: string;
  complete_address: string;
  mobile_number?: string;
  email_address?: string;
}

const BarangayClearanceForm: React.FC<BarangayClearanceFormProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [formData, setFormData] = useState({
    purpose: '',
    validIdPresented: '',
    yearsOfResidency: '',
    certifyingOfficial: '',
    additionalInfo: '',
    urgentRequest: false
  });

  const validIds = [
    'National ID (PhilSys)',
    'Driver\'s License',
    'Passport',
    'Voter\'s ID',
    'PhilHealth ID',
    'SSS ID',
    'TIN ID',
    'Senior Citizen ID',
    'PWD ID',
    'UMID',
    'Postal ID'
  ];

  const commonPurposes = [
    'Employment Application',
    'Business Permit Application',
    'School Enrollment',
    'Scholarship Application',
    'Passport Application',
    'Bank Account Opening',
    'Loan Application',
    'Travel Requirements',
    'Government Transaction',
    'Legal Purposes'
  ];

  const barangayOfficials = [
    'Hon. Juan Dela Cruz - Punong Barangay',
    'Hon. Maria Santos - Kagawad',
    'Hon. Roberto Garcia - Kagawad',
    'Carmen Rodriguez - Barangay Secretary'
  ];

  // Animation trigger on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchResidents();
    } else {
      setResidents([]);
    }
  }, [searchTerm]);
  const searchResidents = async () => {
    try {
      setLoading(true);
      
      // Use real API to search residents
      const response = await apiService.getResidents({ 
        search: searchTerm, 
        per_page: 10 
      });
      
      setResidents(response.data || []);
    } catch (err) {
      console.error('Failed to search residents:', err);
      
      // Fallback to placeholder data for development/testing
      const placeholderResidents = [
        {
          id: 1,
          first_name: 'Juan',
          last_name: 'Dela Cruz',
          middle_name: 'Santos',
          birth_date: '1985-03-15',
          age: 39,
          civil_status: 'MARRIED',
          nationality: 'Filipino',
          complete_address: 'Purok 1, Barangay San Miguel, Quezon City',
          mobile_number: '+63 912 345 6789'
        },
        {
          id: 2,
          first_name: 'Maria',
          last_name: 'Gonzalez',
          middle_name: 'Reyes',
          birth_date: '1990-07-22',
          age: 34,
          civil_status: 'SINGLE',
          nationality: 'Filipino',
          complete_address: 'Purok 2, Barangay San Miguel, Quezon City',
          mobile_number: '+63 923 456 7890'
        },
        {
          id: 3,
          first_name: 'Roberto',
          last_name: 'Garcia',
          middle_name: 'Cruz',
          birth_date: '1978-11-08',
          age: 45,
          civil_status: 'MARRIED',
          nationality: 'Filipino',
          complete_address: 'Purok 3, Barangay San Miguel, Quezon City',
          mobile_number: '+63 934 567 8901'
        },
        {
          id: 4,
          first_name: 'Ana',
          last_name: 'Torres',
          middle_name: 'Lopez',
          birth_date: '1995-01-12',
          age: 29,
          civil_status: 'SINGLE',
          nationality: 'Filipino',
          complete_address: 'Purok 4, Barangay San Miguel, Quezon City',
          mobile_number: '+63 945 678 9012'
        },
        {
          id: 5,
          first_name: 'Carlos',
          last_name: 'Mendoza',
          middle_name: 'Silva',
          birth_date: '1982-09-30',
          age: 41,
          civil_status: 'WIDOWED',
          nationality: 'Filipino',
          complete_address: 'Purok 1, Barangay San Miguel, Quezon City',
          mobile_number: '+63 956 789 0123'
        }
      ];

      // Filter residents based on search term
      const filteredResidents = placeholderResidents.filter(resident => {
        const fullName = `${resident.first_name} ${resident.middle_name} ${resident.last_name}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase()) ||
               resident.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               resident.last_name.toLowerCase().includes(searchTerm.toLowerCase());
      });

      setResidents(filteredResidents);
    } finally {
      setLoading(false);
    }
  };

  const handleResidentSelect = (resident: Resident) => {
    setSelectedResident(resident);
    setSearchTerm(`${resident.first_name} ${resident.middle_name || ''} ${resident.last_name}`.trim());
    setResidents([]);
    setStep(2);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSubmit = async () => {
    if (!selectedResident) return;

    try {
      setSubmitting(true);
      setError(null);

      const documentData = {
        document_type: 'BARANGAY_CLEARANCE' as const,
        title: `Barangay Clearance for ${selectedResident.first_name} ${selectedResident.middle_name ? selectedResident.middle_name + ' ' : ''}${selectedResident.last_name}`,
        resident_id: selectedResident.id,
        applicant_name: `${selectedResident.first_name} ${selectedResident.middle_name ? selectedResident.middle_name + ' ' : ''}${selectedResident.last_name}`,
        applicant_address: selectedResident.complete_address,
        applicant_contact: selectedResident.mobile_number,
        purpose: formData.purpose,
        processing_fee: formData.urgentRequest ? 100 : 50,
        priority: formData.urgentRequest ? 'HIGH' as const : 'NORMAL' as const,
        requirements_submitted: [formData.validIdPresented],
        remarks: `Valid ID: ${formData.validIdPresented}, Years of Residency: ${formData.yearsOfResidency}, Additional Info: ${formData.additionalInfo}, Certifying Official: ${formData.certifyingOfficial}`
      };

      const document = await documentsService.createDocument(documentData);
      
      console.log('Document submitted successfully:', document);
      
      setStep(3);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : 'Unknown error') || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
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
        
        {loading && (
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
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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

      {/* Clearance Details Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">
          Barangay Clearance Details
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
              Valid ID Presented *
            </label>
            <select
              value={formData.validIdPresented}
              onChange={(e) => handleInputChange('validIdPresented', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              required
            >
              <option value="">Select valid ID</option>
              {validIds.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Residency *
            </label>
            <input
              type="number"
              value={formData.yearsOfResidency}
              onChange={(e) => handleInputChange('yearsOfResidency', e.target.value)}
              placeholder="Enter number of years"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certifying Official *
            </label>
            <select
              value={formData.certifyingOfficial}
              onChange={(e) => handleInputChange('certifyingOfficial', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              required
            >
              <option value="">Select official</option>
              {barangayOfficials.map((official) => (
                <option key={official} value={official}>{official}</option>
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
              placeholder="Any additional information or special circumstances..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
            />
          </div>
        </div>

        {/* Urgent Request Option */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.urgentRequest}
              onChange={(e) => handleInputChange('urgentRequest', e.target.checked)}
              className="h-4 w-4 text-smblue-400 focus:ring-smblue-200 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Urgent Processing Request (+₱50 fee)
            </span>
          </label>
          <p className="mt-1 text-xs text-gray-600">
            Urgent requests are processed within 24 hours instead of the standard 48-72 hours.
          </p>
        </div>

        {/* Processing Fee */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Processing Fee:</span>
            <span className="text-lg font-bold text-smblue-400">
              ₱{formData.urgentRequest ? '100' : '50'}
            </span>
          </div>
          {formData.urgentRequest && (
            <p className="text-xs text-gray-600 mt-1">
              Includes ₱50 standard fee + ₱50 urgent processing fee
            </p>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={() => setStep(1)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !formData.purpose || !formData.validIdPresented || !formData.yearsOfResidency || !formData.certifyingOfficial}
            className="px-6 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {submitting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>{submitting ? 'Submitting...' : 'Submit Request'}</span>
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
        Your Barangay Clearance request has been submitted and is now in the processing queue.
      </p>
      
      {selectedResident && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Request Details</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Resident:</strong> {selectedResident.first_name} {selectedResident.last_name}</p>
            <p><strong>Document:</strong> Barangay Clearance</p>
            <p><strong>Purpose:</strong> {formData.purpose}</p>
            <p><strong>Processing Fee:</strong> ₱{formData.urgentRequest ? '100' : '50'}</p>
            <p><strong>Expected Processing Time:</strong> {formData.urgentRequest ? '24 hours' : '48-72 hours'}</p>
          </div>
        </div>
      )}
      
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => onNavigate('process-document')}
          className="px-6 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300 transition-colors"
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
              validIdPresented: '',
              yearsOfResidency: '',
              certifyingOfficial: '',
              additionalInfo: '',
              urgentRequest: false
            });
          }}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
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
          <h1 className="text-2xl font-bold text-darktext">Barangay Clearance Request</h1>
        </div>
        <p className="text-gray-600">Certificate of Good Moral Character and Community Standing</p>
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
              step === 2 ? 'Enter Details' :
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

export default BarangayClearanceForm;