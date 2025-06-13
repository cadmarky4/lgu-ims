import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface ProcessDocumentProps {
  onNavigate: (page: string) => void;
}

interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: string;
  dateOfBirth: string;
  age: number;
  civilStatus: string;
  placeOfBirth: string;
  nationality: string;
  address: string;
}

const ProcessDocument: React.FC<ProcessDocumentProps> = ({ onNavigate }) => {
  const [selectedDocumentType, setSelectedDocumentType] = useState('Barangay Clearance');
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRecord, setExpandedRecord] = useState(false);  const [residents, setResidents] = useState<Resident[]>([]);  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [certificateDetails, setCertificateDetails] = useState({
    purposeOfRequest: '',
    validIdPresented: '',
    yearsOfResidency: '',
    certifyingOfficial: ''
  });

  // Fetch residents data
  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getResidents({
        per_page: 100 // Get more residents for document processing
      });
      // Transform API data to match local interface
      const transformedResidents = response.data.map((resident: any) => ({
        id: resident.id.toString(),
        firstName: resident.first_name || resident.firstName,
        lastName: resident.last_name || resident.lastName,
        middleName: resident.middle_name || resident.middleName,
        gender: resident.gender,
        dateOfBirth: resident.date_of_birth || resident.dateOfBirth || 'MM/DD/YYYY',
        age: resident.age || 0,
        civilStatus: resident.civil_status || resident.civilStatus || 'Single',
        placeOfBirth: resident.place_of_birth || resident.placeOfBirth || 'Pasig, Philippines',
        nationality: resident.nationality || 'Filipino',
        address: resident.street_address || resident.address || 'Not specified'
      }));
      setResidents(transformedResidents);
      setError(null);
    } catch (err) {
      console.error('Error fetching residents:', err);
      setError('Failed to load residents');
      // Fallback to static data for demo
      setResidents([
        {
          id: '1',
          firstName: 'Ella',
          lastName: 'Garcia',
          middleName: 'V.',
          gender: 'Female',
          dateOfBirth: 'MM/DD/YYYY',
          age: 22,
          civilStatus: 'Single',
          placeOfBirth: 'Pasig, Philippines',
          nationality: 'Filipino',
          address: '123 San Miguel St., Pasig City'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const validateForm = () => {
    if (!selectedResident) {
      setError('Please select a resident first');
      return false;
    }
    
    if (!certificateDetails.purposeOfRequest.trim()) {
      setError('Please specify the purpose for this document');
      return false;
    }
    
    if (!certificateDetails.validIdPresented.trim()) {
      setError('Please specify what valid ID was presented');
      return false;
    }
    
    if (!certificateDetails.yearsOfResidency.trim()) {
      setError('Please specify years of residency');
      return false;
    }
    
    if (!certificateDetails.certifyingOfficial.trim()) {
      setError('Please select a certifying official');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleProcessDocument = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      if (!selectedResident) {
        throw new Error("No resident selected");
      }
      
      const documentData = {
        resident_id: selectedResident.id,
        document_type: selectedDocumentType,
        purpose: certificateDetails.purposeOfRequest,
        valid_id: certificateDetails.validIdPresented,
        years_of_residency: certificateDetails.yearsOfResidency,
        certifying_official: certificateDetails.certifyingOfficial,
        request_date: new Date().toISOString().split('T')[0]
      };

      await apiService.createDocument(documentData);
      
      // Success message
      setError(null);
      alert('Document processed successfully!');
      
      // Reset form
      setSelectedResident(null);
      setCertificateDetails({
        purposeOfRequest: '',
        validIdPresented: '',
        yearsOfResidency: '',
        certifyingOfficial: ''
      });
      
      // Navigate back to document management
      onNavigate('documents');
    } catch (err) {
      console.error('Error processing document:', err);
      setError('Failed to process document. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const documentTypes = [
    { id: 'barangay-clearance', name: 'Barangay Clearance', description: 'Process Document for' },
    { id: 'business-permit', name: 'Business Permit', description: 'Process Document for' },
    { id: 'certificate-indigency', name: 'Certificate of Indigency', description: 'Process Document for' },
    { id: 'certificate-residency', name: 'Certificate of Residency', description: 'Process Document for' }
  ];

  const filteredResidents = residents.filter(resident =>
    `${resident.firstName} ${resident.middleName} ${resident.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleResidentSelect = (resident: Resident) => {
    setSelectedResident(resident);
    setSearchTerm(`${resident.firstName} ${resident.middleName || ''} ${resident.lastName}`.trim());
  };

  const handleCertificateDetailsChange = (field: string, value: string) => {
    setCertificateDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      {/* Loading Status */}
      {loading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-600 text-sm">Loading resident data...</p>
        </div>
      )}
      {/* Select Document Type */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200 border-l-4 border-blue-600 pl-4">
          Select Document Type
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {documentTypes.map((docType) => (
            <div
              key={docType.id}
              onClick={() => setSelectedDocumentType(docType.name)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedDocumentType === docType.name
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-sm text-gray-500 mb-1">{docType.description}</div>
              <div className="font-medium text-gray-900">{docType.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Select Resident */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200 border-l-4 border-blue-600 pl-4">
          Select Resident
        </h2>
        
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search residents..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => onNavigate('addNewResident')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            + Add New Resident
          </button>
        </div>

        {/* Resident Search Results */}
        {searchTerm && !selectedResident && (
          <div className="bg-white border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
            {filteredResidents.map((resident) => (
              <div
                key={resident.id}
                onClick={() => handleResidentSelect(resident)}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">
                  {resident.firstName} {resident.middleName} {resident.lastName}
                </div>
                <div className="text-sm text-gray-500">{resident.address}</div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Resident Display */}
        {selectedResident && (
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="font-medium text-gray-900">
              {selectedResident.firstName} {selectedResident.middleName} {selectedResident.lastName}
            </div>
          </div>
        )}
      </div>

      {/* Resident Information */}
      {selectedResident && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200 border-l-4 border-blue-600 pl-4">
            Resident Information
          </h2>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-sm">
              <div>
                <div className="text-gray-500 font-medium mb-1">Last Name:</div>
                <div className="text-gray-900">{selectedResident.lastName}</div>
              </div>
              <div>
                <div className="text-gray-500 font-medium mb-1">First Name:</div>
                <div className="text-gray-900">{selectedResident.firstName}</div>
              </div>
              <div>
                <div className="text-gray-500 font-medium mb-1">Gender:</div>
                <div className="text-gray-900">{selectedResident.gender}</div>
              </div>
              <div>
                <div className="text-gray-500 font-medium mb-1">Date of Birth:</div>
                <div className="text-gray-900">{selectedResident.dateOfBirth}</div>
              </div>
              <div>
                <div className="text-gray-500 font-medium mb-1">Age:</div>
                <div className="text-gray-900">{selectedResident.age}</div>
              </div>
              <div>
                <div className="text-gray-500 font-medium mb-1">Civil Status:</div>
                <div className="text-gray-900">{selectedResident.civilStatus}</div>
              </div>
              <div>
                <div className="text-gray-500 font-medium mb-1">Place of Birth:</div>
                <div className="text-gray-900">{selectedResident.placeOfBirth}</div>
              </div>
              <div>
                <div className="text-gray-500 font-medium mb-1">Nationality:</div>
                <div className="text-gray-900">{selectedResident.nationality}</div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-base font-medium text-gray-900 mb-4">Address Information</h4>
              
              <button
                onClick={() => setExpandedRecord(!expandedRecord)}
                className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
              >
                <svg 
                  className={`w-4 h-4 mr-1 transition-transform ${expandedRecord ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Click here to expand record
              </button>

              {expandedRecord && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm">
                    <div className="text-gray-500 font-medium mb-1">Full Address:</div>
                    <div className="text-gray-900">{selectedResident.address}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Certificate Details */}
      {selectedResident && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200 border-l-4 border-blue-600 pl-4">
            Certificate Details
          </h2>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose of Request
                </label>
                <input
                  type="text"
                  value={certificateDetails.purposeOfRequest}
                  onChange={(e) => handleCertificateDetailsChange('purposeOfRequest', e.target.value)}
                  placeholder="Ex. For Scholar, Job Application..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid ID Presented
                </label>
                <select
                  value={certificateDetails.validIdPresented}
                  onChange={(e) => handleCertificateDetailsChange('validIdPresented', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a Valid ID</option>
                  <option value="Driver's License">Driver's License</option>
                  <option value="Passport">Passport</option>
                  <option value="National ID">National ID</option>
                  <option value="Voter's ID">Voter's ID</option>
                  <option value="SSS ID">SSS ID</option>
                  <option value="TIN ID">TIN ID</option>
                  <option value="Senior Citizen ID">Senior Citizen ID</option>
                  <option value="PWD ID">PWD ID</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Residency
                </label>
                <input
                  type="number"
                  value={certificateDetails.yearsOfResidency}
                  onChange={(e) => handleCertificateDetailsChange('yearsOfResidency', e.target.value)}
                  placeholder="22"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certifying Official
                </label>
                <select
                  value={certificateDetails.certifyingOfficial}
                  onChange={(e) => handleCertificateDetailsChange('certifyingOfficial', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Barangay Official</option>
                  <option value="Juan Perez Dela Cruz">Juan Perez Dela Cruz - Barangay Captain</option>
                  <option value="Maria Santos">Maria Santos - Kagawad</option>
                  <option value="Roberto Gonzales">Roberto Gonzales - Kagawad</option>
                  <option value="Carmen Rodriguez">Carmen Rodriguez - Secretary</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      {selectedResident && (
        <div className="flex justify-end">
          <button
            onClick={handleProcessDocument}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {submitting ? 'Processing...' : 'Process Document →'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProcessDocument;