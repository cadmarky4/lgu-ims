import React, { useState, useEffect } from 'react';
import { FiSearch, FiUser, FiCheck, FiArrowLeft, FiHome, FiCalendar } from 'react-icons/fi';
import { apiService } from '../../services';

interface CertificateOfResidencyFormProps {
  onNavigate: (page: string) => void;
}

interface Resident {
  id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  birth_date: string;
  age: number;
  civil_status: string;
  nationality: string;
  complete_address: string;
  mobile_number?: string;
}

const CertificateOfResidencyForm: React.FC<CertificateOfResidencyFormProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    purpose: '',
    yearsOfResidence: '',
    previousAddress: '',
    residencyStatus: '',
    certifyingOfficial: '',
    additionalInfo: '',
    urgentRequest: false
  });

  const purposeOptions = [
    'Employment',
    'School Enrollment',
    'Bank Account Opening',
    'Loan Application',
    'Government Transaction',
    'Legal Proceedings',
    'Passport Application',
    'Visa Application',
    'Other (Specify in Additional Info)'
  ];

  const residencyStatusOptions = [
    'Permanent Resident',
    'Temporary Resident',
    'Boarder/Renter',
    'Family Member',
    'Caretaker'
  ];

  const barangayOfficials = [
    'Hon. Juan Dela Cruz - Punong Barangay',
    'Hon. Maria Santos - Kagawad',
    'Hon. Roberto Garcia - Kagawad',
    'Carmen Rodriguez - Barangay Secretary'
  ];

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
      
      // Use placeholder data for development/testing
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

      // In production, use this:
      // const response = await apiService.getResidents({ 
      //   search: searchTerm, 
      //   per_page: 10 
      // });
      // setResidents(response.data);
    } catch (err) {
      console.error('Failed to search residents:', err);
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
        id: Math.floor(Math.random() * 1000) + 100, // Random ID for placeholder
        resident_id: selectedResident.id,
        document_type: 'CERTIFICATE_RESIDENCY',
        purpose: formData.purpose,
        processing_fee: formData.urgentRequest ? 55 : 30,
        notes: `Years of Residence: ${formData.yearsOfResidence}, Previous Address: ${formData.previousAddress}, Residency Status: ${formData.residencyStatus}, Additional Info: ${formData.additionalInfo}`,
        certifying_official: formData.certifyingOfficial,
        priority: formData.urgentRequest ? 'HIGH' : 'NORMAL',
        status: 'PENDING',
        created_at: new Date().toISOString(),
        resident: selectedResident
      };

      // Simulate API delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Document submitted (placeholder):', documentData);
      
      // In production, use this:
      // await apiService.createDocument(documentData);
      
      setStep(3);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : 'Unknown error') || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
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
    <div className="space-y-6">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Address</label>
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

      {/* Certificate Details Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">
          Certificate of Residency Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose *
            </label>
            <select
              value={formData.purpose}
              onChange={(e) => handleInputChange('purpose', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              required
            >
              <option value="">Select purpose</option>
              {purposeOptions.map((purpose) => (
                <option key={purpose} value={purpose}>{purpose}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Residence *
            </label>
            <input
              type="number"
              value={formData.yearsOfResidence}
              onChange={(e) => handleInputChange('yearsOfResidence', e.target.value)}
              placeholder="Number of years residing in the barangay"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Residency Status *
            </label>
            <select
              value={formData.residencyStatus}
              onChange={(e) => handleInputChange('residencyStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-200"
              required
            >
              <option value="">Select residency status</option>
              {residencyStatusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certifying Official *
            </label>
            <select
              value={formData.certifyingOfficial}
              onChange={(e) => handleInputChange('certifyingOfficial', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-200"
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
              Previous Address (if applicable)
            </label>
            <input
              type="text"
              value={formData.previousAddress}
              onChange={(e) => handleInputChange('previousAddress', e.target.value)}
              placeholder="Previous address if recently moved to the barangay"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-200"
            />
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-200"
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
              className="h-4 w-4 text-green-500 focus:ring-green-200 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Urgent Processing Request (+₱25 fee)
            </span>
          </label>
          <p className="mt-1 text-xs text-gray-600">
            Urgent requests are processed within 1-2 business days instead of the standard 3-5 business days.
          </p>
        </div>

        {/* Processing Fee */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Processing Fee:</span>
            <span className="text-lg font-bold text-green-500">
              ₱{formData.urgentRequest ? '55' : '30'}
            </span>
          </div>
          {formData.urgentRequest && (
            <p className="text-xs text-gray-600 mt-1">
              Includes ₱30 standard fee + ₱25 urgent processing fee
            </p>
          )}
        </div>

        {/* Certificate Validity Notice */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex">
            <FiCalendar className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Certificate Validity
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>This Certificate of Residency is valid for <strong>6 months</strong> from the date of issuance.</p>
                <p className="mt-1">Required for various transactions including employment, school enrollment, and government applications.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements Notice */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex">
            <FiHome className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Required Documents
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Valid ID of the applicant</li>
                  <li>Proof of residence (utility bills, lease contract, etc.)</li>
                  <li>Barangay ID or voter's registration (if available)</li>
                </ul>
              </div>
            </div>
          </div>
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
            disabled={submitting || !formData.purpose || !formData.yearsOfResidence || !formData.residencyStatus || !formData.certifyingOfficial}
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiCheck className="w-8 h-8 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Certificate of Residency Request Submitted!</h2>
      <p className="text-gray-600 mb-6">
        Your certificate of residency application has been submitted and is now in the processing queue.
      </p>
      
      {selectedResident && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Application Details</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Applicant:</strong> {selectedResident.first_name} {selectedResident.last_name}</p>
            <p><strong>Purpose:</strong> {formData.purpose}</p>
            <p><strong>Years of Residence:</strong> {formData.yearsOfResidence} years</p>
            <p><strong>Processing Fee:</strong> ₱{formData.urgentRequest ? '55' : '30'}</p>
            <p><strong>Expected Processing Time:</strong> {formData.urgentRequest ? '1-2 business days' : '3-5 business days'}</p>
            <p><strong>Certificate Validity:</strong> 6 months from issuance</p>
          </div>
        </div>
      )}
      
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <FiHome className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5" />
            <div className="ml-3 text-left">
              <h3 className="text-sm font-medium text-blue-800">
                Next Steps
              </h3>
              <div className="mt-1 text-sm text-blue-700">
              <ol className="list-decimal list-inside space-y-1">
                <li>Prepare required documents listed above</li>
                <li>Wait for approval notification</li>
                <li>Visit barangay office for document verification</li>
                <li>Pay processing fee and claim your certificate</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      
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
              yearsOfResidence: '',
              previousAddress: '',
              residencyStatus: '',
              certifyingOfficial: '',
              additionalInfo: '',
              urgentRequest: false
            });
          }}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          New Application
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <button
            onClick={() => onNavigate('process-document')}
            className="text-smblue-400 hover:text-smblue-300"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-darktext">Certificate of Residency</h1>
        </div>
        <p className="text-gray-600">Barangay Certificate of Residency Application</p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
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
              step === 2 ? 'Certificate Details' :
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

export default CertificateOfResidencyForm;

