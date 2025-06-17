import React, { useState, useEffect } from 'react';
import { FiSearch, FiUser, FiCheck, FiArrowLeft, FiBriefcase, FiMapPin } from 'react-icons/fi';
import { apiService } from '../services';

interface BusinessPermitFormProps {
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

const BusinessPermitForm: React.FC<BusinessPermitFormProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    businessAddress: '',
    businessDescription: '',
    capitalAmount: '',
    numberOfEmployees: '',
    operatingHours: '',
    certifyingOfficial: '',
    additionalInfo: '',
    urgentRequest: false
  });

  const businessTypes = [
    'Retail Store',
    'Sari-sari Store',
    'Restaurant/Eatery',
    'Beauty Salon/Barbershop',
    'Internet Cafe',
    'Repair Shop',
    'Tailoring/Dressmaking',
    'Bakery',
    'Pharmacy/Drugstore',
    'Hardware Store',
    'Grocery Store',
    'Service Provider',
    'Manufacturing',
    'Other (Specify in Additional Info)'
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
        document_type: 'BUSINESS_PERMIT',
        purpose: `Business Permit for ${formData.businessName}`,
        processing_fee: formData.urgentRequest ? 150 : 100,
        notes: `Business: ${formData.businessName}, Type: ${formData.businessType}, Address: ${formData.businessAddress}, Capital: ₱${formData.capitalAmount}, Employees: ${formData.numberOfEmployees}, Hours: ${formData.operatingHours}, Additional Info: ${formData.additionalInfo}`,
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
        Select Business Owner
      </h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search for business owner *
        </label>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter business owner's name..."
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
          Business Owner Information
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Residence Address</label>
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
            Change Business Owner
          </button>
        </div>
      </div>

      {/* Business Details Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">
          Business Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              placeholder="Enter business name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Type *
            </label>
            <select
              value={formData.businessType}
              onChange={(e) => handleInputChange('businessType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
              required
            >
              <option value="">Select business type</option>
              {businessTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Address *
            </label>
            <input
              type="text"
              value={formData.businessAddress}
              onChange={(e) => handleInputChange('businessAddress', e.target.value)}
              placeholder="Complete business address"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Description *
            </label>
            <textarea
              value={formData.businessDescription}
              onChange={(e) => handleInputChange('businessDescription', e.target.value)}
              placeholder="Describe the nature of your business, products/services offered..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capital Amount *
            </label>
            <input
              type="number"
              value={formData.capitalAmount}
              onChange={(e) => handleInputChange('capitalAmount', e.target.value)}
              placeholder="Business capital in pesos"
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Employees
            </label>
            <input
              type="number"
              value={formData.numberOfEmployees}
              onChange={(e) => handleInputChange('numberOfEmployees', e.target.value)}
              placeholder="Total number of employees"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operating Hours *
            </label>
            <input
              type="text"
              value={formData.operatingHours}
              onChange={(e) => handleInputChange('operatingHours', e.target.value)}
              placeholder="e.g. 8:00 AM - 6:00 PM, Monday to Saturday"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
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
              placeholder="Any additional information about the business, special requirements, etc..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-200"
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
              className="h-4 w-4 text-purple-500 focus:ring-purple-200 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Urgent Processing Request (+₱50 fee)
            </span>
          </label>
          <p className="mt-1 text-xs text-gray-600">
            Urgent requests are processed within 3-5 business days instead of the standard 7-10 business days.
          </p>
        </div>

        {/* Processing Fee */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Processing Fee:</span>
            <span className="text-lg font-bold text-smblue-400">
              ₱{formData.urgentRequest ? '150' : '100'}
            </span>
          </div>
          {formData.urgentRequest && (
            <p className="text-xs text-gray-600 mt-1">
              Includes ₱100 standard fee + ₱50 urgent processing fee
            </p>
          )}
        </div>

        {/* Requirements Notice */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex">
            <FiBriefcase className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Required Documents for Business Permit
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Valid ID of business owner</li>
                  <li>Proof of business address (lease contract or property title)</li>
                  <li>Business registration documents (if applicable)</li>
                  <li>Sanitary permit (for food establishments)</li>
                  <li>Fire safety inspection certificate</li>
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
            disabled={submitting || !formData.businessName || !formData.businessType || !formData.businessAddress || !formData.businessDescription || !formData.capitalAmount || !formData.operatingHours || !formData.certifyingOfficial}
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
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Permit Request Submitted!</h2>
      <p className="text-gray-600 mb-6">
        Your business permit application has been submitted and is now in the processing queue.
      </p>
      
      {selectedResident && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Application Details</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Business Owner:</strong> {selectedResident.first_name} {selectedResident.last_name}</p>
            <p><strong>Business Name:</strong> {formData.businessName}</p>
            <p><strong>Business Type:</strong> {formData.businessType}</p>
            <p><strong>Processing Fee:</strong> ₱{formData.urgentRequest ? '150' : '100'}</p>
            <p><strong>Expected Processing Time:</strong> {formData.urgentRequest ? '3-5 business days' : '7-10 business days'}</p>
          </div>
        </div>
      )}
      
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <FiMapPin className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5" />
          <div className="ml-3 text-left">
            <h3 className="text-sm font-medium text-blue-800">
              Next Steps
            </h3>
            <div className="mt-1 text-sm text-blue-700">
              <ol className="list-decimal list-inside space-y-1">
                <li>Prepare required documents listed above</li>
                <li>Wait for approval notification</li>
                <li>Visit barangay office for document verification</li>
                <li>Pay processing fee and claim your permit</li>
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
              businessName: '',
              businessType: '',
              businessAddress: '',
              businessDescription: '',
              capitalAmount: '',
              numberOfEmployees: '',
              operatingHours: '',
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
          <h1 className="text-2xl font-bold text-darktext">Business Permit Application</h1>
        </div>
        <p className="text-gray-600">Barangay Business Clearance and Operating Permit</p>
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
              step === 1 ? 'Select Business Owner' :
              step === 2 ? 'Business Information' :
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

export default BusinessPermitForm;

