import React from 'react';
import { FiPrinter, FiDownload } from 'react-icons/fi';

interface CertificateData {
  id: number;
  document_type: string;
  resident: {
    first_name: string;
    last_name: string;
    middle_name?: string;
    complete_address: string;
    birth_date: string;
    age: number;
    civil_status: string;
    nationality: string;
  };
  purpose: string;
  certifying_official: string;
  issue_date: string;
  serial_number: string;
  barangay_info?: {
    name: string;
    municipality: string;
    province: string;
    captain_name: string;
    secretary_name: string;
  };
}

interface CertificateTemplatesProps {
  certificateData: CertificateData;
  onPrint: () => void;
  onDownload: () => void;
}

const CertificateTemplates: React.FC<CertificateTemplatesProps> = ({
  certificateData,
  onPrint,
  onDownload
}) => {
  const formatName = (firstName: string, lastName: string, middleName?: string) => {
    return `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderBarangayClearance = () => (
    <div className="bg-white p-8 shadow-lg rounded-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-4">
            <span className="text-white font-bold">LOGO</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              REPUBLIC OF THE PHILIPPINES
            </h1>
            <h2 className="text-lg font-semibold text-gray-800">
              PROVINCE OF {certificateData.barangay_info?.province?.toUpperCase() || 'METRO MANILA'}
            </h2>
            <h3 className="text-base font-medium text-gray-700">
              {certificateData.barangay_info?.municipality?.toUpperCase() || 'CITY/MUNICIPALITY'}
            </h3>
            <h4 className="text-base font-medium text-blue-600">
              BARANGAY {certificateData.barangay_info?.name?.toUpperCase() || 'BARANGAY NAME'}
            </h4>
          </div>
        </div>
        <div className="border-t-2 border-blue-600 w-32 mx-auto"></div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">BARANGAY CLEARANCE</h1>
        <p className="text-sm text-gray-600">Certificate of Good Moral Character</p>
      </div>

      {/* Serial Number */}
      <div className="mb-8">
        <p className="text-right text-sm font-medium text-gray-700">
          Serial No: <span className="font-bold">{certificateData.serial_number}</span>
        </p>
      </div>

      {/* Content */}
      <div className="mb-8 leading-relaxed">
        <p className="text-base text-gray-800 mb-4">
          <strong>TO WHOM IT MAY CONCERN:</strong>
        </p>
        
        <p className="text-base text-gray-800 mb-6 text-justify">
          This is to certify that <strong className="text-lg underline">
          {formatName(
            certificateData.resident.first_name,
            certificateData.resident.last_name,
            certificateData.resident.middle_name
          ).toUpperCase()}</strong>, 
          {certificateData.resident.age} years old, {certificateData.resident.civil_status.toLowerCase()}, 
          {certificateData.resident.nationality}, and a resident of{' '}
          <strong>{certificateData.resident.complete_address}</strong> is a person of good moral character 
          and has no derogatory record filed in this Barangay.
        </p>

        <p className="text-base text-gray-800 mb-6 text-justify">
          This certification is being issued upon the request of the above-mentioned person for{' '}
          <strong className="underline">{certificateData.purpose.toLowerCase()}</strong> and for whatever 
          legal purposes it may serve.
        </p>

        <p className="text-base text-gray-800 mb-8">
          Issued this <strong>{formatDate(certificateData.issue_date)}</strong> at Barangay{' '}
          {certificateData.barangay_info?.name || 'Name'},{' '}
          {certificateData.barangay_info?.municipality || 'Municipality'},{' '}
          {certificateData.barangay_info?.province || 'Province'}.
        </p>
      </div>

      {/* Signatures */}
      <div className="flex justify-between items-end">
        <div className="text-left">
          <p className="text-sm text-gray-600 mb-8">Prepared by:</p>
          <div className="border-b-2 border-gray-400 w-48 mb-2"></div>
          <p className="text-sm font-medium text-gray-800">
            {certificateData.barangay_info?.secretary_name || 'BARANGAY SECRETARY'}
          </p>
          <p className="text-xs text-gray-600">Barangay Secretary</p>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-8">Certified by:</p>
          <div className="border-b-2 border-gray-400 w-48 mb-2"></div>
          <p className="text-sm font-bold text-gray-800">
            {certificateData.certifying_official.toUpperCase()}
          </p>
          <p className="text-xs text-gray-600">Punong Barangay</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300">
        <p className="text-xs text-gray-500 text-center">
          This document is issued in accordance with the Local Government Code of 1991 (R.A. 7160)
        </p>
      </div>
    </div>
  );

  const renderCertificateOfResidency = () => (
    <div className="bg-white p-8 shadow-lg rounded-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mr-4">
            <span className="text-white font-bold">LOGO</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              REPUBLIC OF THE PHILIPPINES
            </h1>
            <h2 className="text-lg font-semibold text-gray-800">
              PROVINCE OF {certificateData.barangay_info?.province?.toUpperCase() || 'METRO MANILA'}
            </h2>
            <h3 className="text-base font-medium text-gray-700">
              {certificateData.barangay_info?.municipality?.toUpperCase() || 'CITY/MUNICIPALITY'}
            </h3>
            <h4 className="text-base font-medium text-green-600">
              BARANGAY {certificateData.barangay_info?.name?.toUpperCase() || 'BARANGAY NAME'}
            </h4>
          </div>
        </div>
        <div className="border-t-2 border-green-600 w-32 mx-auto"></div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CERTIFICATE OF RESIDENCY</h1>
      </div>

      {/* Serial Number */}
      <div className="mb-8">
        <p className="text-right text-sm font-medium text-gray-700">
          Serial No: <span className="font-bold">{certificateData.serial_number}</span>
        </p>
      </div>

      {/* Content */}
      <div className="mb-8 leading-relaxed">
        <p className="text-base text-gray-800 mb-4">
          <strong>TO WHOM IT MAY CONCERN:</strong>
        </p>
        
        <p className="text-base text-gray-800 mb-6 text-justify">
          This is to certify that <strong className="text-lg underline">
          {formatName(
            certificateData.resident.first_name,
            certificateData.resident.last_name,
            certificateData.resident.middle_name
          ).toUpperCase()}</strong>, 
          {certificateData.resident.age} years old, {certificateData.resident.civil_status.toLowerCase()}, 
          born on {formatDate(certificateData.resident.birth_date)}, is a bonafide resident of{' '}
          <strong>{certificateData.resident.complete_address}</strong>.
        </p>

        <p className="text-base text-gray-800 mb-6 text-justify">
          This certification is being issued upon the request of the above-mentioned person for{' '}
          <strong className="underline">{certificateData.purpose.toLowerCase()}</strong> and for whatever 
          legal purposes it may serve.
        </p>

        <p className="text-base text-gray-800 mb-8">
          Issued this <strong>{formatDate(certificateData.issue_date)}</strong> at Barangay{' '}
          {certificateData.barangay_info?.name || 'Name'},{' '}
          {certificateData.barangay_info?.municipality || 'Municipality'},{' '}
          {certificateData.barangay_info?.province || 'Province'}.
        </p>
      </div>

      {/* Signatures */}
      <div className="flex justify-between items-end">
        <div className="text-left">
          <p className="text-sm text-gray-600 mb-8">Prepared by:</p>
          <div className="border-b-2 border-gray-400 w-48 mb-2"></div>
          <p className="text-sm font-medium text-gray-800">
            {certificateData.barangay_info?.secretary_name || 'BARANGAY SECRETARY'}
          </p>
          <p className="text-xs text-gray-600">Barangay Secretary</p>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-8">Certified by:</p>
          <div className="border-b-2 border-gray-400 w-48 mb-2"></div>
          <p className="text-sm font-bold text-gray-800">
            {certificateData.certifying_official.toUpperCase()}
          </p>
          <p className="text-xs text-gray-600">Punong Barangay</p>
        </div>
      </div>

      {/* Validity */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700 text-center font-medium">
          Valid for six (6) months from date of issuance
        </p>
      </div>
    </div>
  );

  const renderCertificateOfIndigency = () => (
    <div className="bg-white p-8 shadow-lg rounded-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mr-4">
            <span className="text-white font-bold">LOGO</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              REPUBLIC OF THE PHILIPPINES
            </h1>
            <h2 className="text-lg font-semibold text-gray-800">
              PROVINCE OF {certificateData.barangay_info?.province?.toUpperCase() || 'METRO MANILA'}
            </h2>
            <h3 className="text-base font-medium text-gray-700">
              {certificateData.barangay_info?.municipality?.toUpperCase() || 'CITY/MUNICIPALITY'}
            </h3>
            <h4 className="text-base font-medium text-orange-600">
              BARANGAY {certificateData.barangay_info?.name?.toUpperCase() || 'BARANGAY NAME'}
            </h4>
          </div>
        </div>
        <div className="border-t-2 border-orange-600 w-32 mx-auto"></div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CERTIFICATE OF INDIGENCY</h1>
        <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg inline-block">
          <p className="text-sm font-medium">FREE OF CHARGE - DILG MC 2019-72</p>
        </div>
      </div>

      {/* Serial Number */}
      <div className="mb-8">
        <p className="text-right text-sm font-medium text-gray-700">
          Serial No: <span className="font-bold">{certificateData.serial_number}</span>
        </p>
      </div>

      {/* Content */}
      <div className="mb-8 leading-relaxed">
        <p className="text-base text-gray-800 mb-4">
          <strong>TO WHOM IT MAY CONCERN:</strong>
        </p>
        
        <p className="text-base text-gray-800 mb-6 text-justify">
          This is to certify that <strong className="text-lg underline">
          {formatName(
            certificateData.resident.first_name,
            certificateData.resident.last_name,
            certificateData.resident.middle_name
          ).toUpperCase()}</strong>, 
          {certificateData.resident.age} years old, {certificateData.resident.civil_status.toLowerCase()}, 
          and a resident of <strong>{certificateData.resident.complete_address}</strong> belongs to the 
          indigent sector of this barangay.
        </p>

        <p className="text-base text-gray-800 mb-6 text-justify">
          The above-mentioned person has no regular source of income and is therefore qualified to avail 
          of the benefits and services provided by the government and other institutions for indigent families.
        </p>

        <p className="text-base text-gray-800 mb-6 text-justify">
          This certification is being issued upon the request of the above-mentioned person for{' '}
          <strong className="underline">{certificateData.purpose.toLowerCase()}</strong> and for whatever 
          legal purposes it may serve.
        </p>

        <p className="text-base text-gray-800 mb-8">
          Issued this <strong>{formatDate(certificateData.issue_date)}</strong> at Barangay{' '}
          {certificateData.barangay_info?.name || 'Name'},{' '}
          {certificateData.barangay_info?.municipality || 'Municipality'},{' '}
          {certificateData.barangay_info?.province || 'Province'}.
        </p>
      </div>

      {/* Signatures */}
      <div className="flex justify-between items-end">
        <div className="text-left">
          <p className="text-sm text-gray-600 mb-8">Prepared by:</p>
          <div className="border-b-2 border-gray-400 w-48 mb-2"></div>
          <p className="text-sm font-medium text-gray-800">
            {certificateData.barangay_info?.secretary_name || 'BARANGAY SECRETARY'}
          </p>
          <p className="text-xs text-gray-600">Barangay Secretary</p>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-8">Certified by:</p>
          <div className="border-b-2 border-gray-400 w-48 mb-2"></div>
          <p className="text-sm font-bold text-gray-800">
            {certificateData.certifying_official.toUpperCase()}
          </p>
          <p className="text-xs text-gray-600">Punong Barangay</p>
        </div>
      </div>

      {/* Legal Notice */}
      <div className="mt-8 p-4 bg-orange-50 border-l-4 border-orange-400 rounded-lg">
        <p className="text-xs text-orange-800">
          <strong>LEGAL NOTICE:</strong> This certificate is issued FREE OF CHARGE in accordance with 
          DILG Memorandum Circular 2019-72 and R.A. 11261 (First Time Jobseekers Assistance Act). 
          Any person who demands payment for this certificate may be held liable under applicable laws.
        </p>
      </div>
    </div>
  );

  const renderBusinessClearance = () => (
    <div className="bg-white p-8 shadow-lg rounded-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mr-4">
            <span className="text-white font-bold">LOGO</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              REPUBLIC OF THE PHILIPPINES
            </h1>
            <h2 className="text-lg font-semibold text-gray-800">
              PROVINCE OF {certificateData.barangay_info?.province?.toUpperCase() || 'METRO MANILA'}
            </h2>
            <h3 className="text-base font-medium text-gray-700">
              {certificateData.barangay_info?.municipality?.toUpperCase() || 'CITY/MUNICIPALITY'}
            </h3>
            <h4 className="text-base font-medium text-purple-600">
              BARANGAY {certificateData.barangay_info?.name?.toUpperCase() || 'BARANGAY NAME'}
            </h4>
          </div>
        </div>
        <div className="border-t-2 border-purple-600 w-32 mx-auto"></div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">BARANGAY BUSINESS CLEARANCE</h1>
      </div>

      {/* Serial Number */}
      <div className="mb-8">
        <p className="text-right text-sm font-medium text-gray-700">
          Serial No: <span className="font-bold">{certificateData.serial_number}</span>
        </p>
      </div>

      {/* Content */}
      <div className="mb-8 leading-relaxed">
        <p className="text-base text-gray-800 mb-4">
          <strong>TO WHOM IT MAY CONCERN:</strong>
        </p>
        
        <p className="text-base text-gray-800 mb-6 text-justify">
          This is to certify that <strong className="text-lg underline">
          {formatName(
            certificateData.resident.first_name,
            certificateData.resident.last_name,
            certificateData.resident.middle_name
          ).toUpperCase()}</strong>, 
          {certificateData.resident.age} years old, {certificateData.resident.civil_status.toLowerCase()}, 
          and a resident of <strong>{certificateData.resident.complete_address}</strong> is hereby 
          granted clearance to operate a business within the territorial jurisdiction of this barangay.
        </p>

        <p className="text-base text-gray-800 mb-6 text-justify">
          The proposed business has been verified to be in accordance with the applicable zoning 
          ordinances and does not violate any existing barangay regulations.
        </p>

        <p className="text-base text-gray-800 mb-6 text-justify">
          This clearance is being issued for the purpose of{' '}
          <strong className="underline">{certificateData.purpose.toLowerCase()}</strong> and for whatever 
          legal purposes it may serve.
        </p>

        <p className="text-base text-gray-800 mb-8">
          Issued this <strong>{formatDate(certificateData.issue_date)}</strong> at Barangay{' '}
          {certificateData.barangay_info?.name || 'Name'},{' '}
          {certificateData.barangay_info?.municipality || 'Municipality'},{' '}
          {certificateData.barangay_info?.province || 'Province'}.
        </p>
      </div>

      {/* Signatures */}
      <div className="flex justify-between items-end">
        <div className="text-left">
          <p className="text-sm text-gray-600 mb-8">Prepared by:</p>
          <div className="border-b-2 border-gray-400 w-48 mb-2"></div>
          <p className="text-sm font-medium text-gray-800">
            {certificateData.barangay_info?.secretary_name || 'BARANGAY SECRETARY'}
          </p>
          <p className="text-xs text-gray-600">Barangay Secretary</p>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-8">Certified by:</p>
          <div className="border-b-2 border-gray-400 w-48 mb-2"></div>
          <p className="text-sm font-bold text-gray-800">
            {certificateData.certifying_official.toUpperCase()}
          </p>
          <p className="text-xs text-gray-600">Punong Barangay</p>
        </div>
      </div>

      {/* Validity */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <p className="text-sm text-purple-700 text-center font-medium">
          Valid for one (1) year from date of issuance or until business permit renewal
        </p>
      </div>
    </div>
  );

  const renderCertificate = () => {
    switch (certificateData.document_type) {
      case 'BARANGAY_CLEARANCE':
        return renderBarangayClearance();
      case 'CERTIFICATE_RESIDENCY':
        return renderCertificateOfResidency();
      case 'CERTIFICATE_INDIGENCY':
        return renderCertificateOfIndigency();
      case 'BUSINESS_CLEARANCE':
        return renderBusinessClearance();
      default:
        return renderBarangayClearance();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Action Buttons */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex justify-end space-x-3">
          <button
            onClick={onPrint}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPrinter className="w-4 h-4" />
            <span>Print</span>
          </button>
          <button
            onClick={onDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FiDownload className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Certificate */}
      {renderCertificate()}
    </div>
  );
};

export default CertificateTemplates; 