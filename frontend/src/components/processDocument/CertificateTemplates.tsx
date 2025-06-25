import React from 'react';

// Types for document data
interface DocumentData {
  id: number;
  document_type: string;
  resident_name: string;
  purpose: string;
  status: string;
  request_date: string;
  resident: {
    first_name: string;
    last_name: string;
    middle_name?: string;
    complete_address?: string;
    birth_date?: string;
    civil_status?: string;
    nationality?: string;
  };
  certifying_official?: string;
  or_number?: string;
  amount_paid?: number;
  date_issued?: string;
}

interface CertificateTemplateProps {
  document: DocumentData;
  onClose: () => void;
}

// Common Certificate Header Component
const CertificateHeader: React.FC = () => (
  <div className="text-center mb-8">
    <div className="mb-4">
      <h1 className="text-lg font-bold text-gray-800">REPUBLIC OF THE PHILIPPINES</h1>
      <h2 className="text-base font-semibold text-gray-700">PROVINCE OF BATAAN</h2>
      <h3 className="text-base font-semibold text-gray-700">MUNICIPALITY OF SAMAL</h3>
      <h4 className="text-lg font-bold text-gray-800">Brgy. Sikatuna Village</h4>
    </div>
    <div className="border-t-2 border-b-2 border-black py-2 mb-6">
      <h2 className="text-xl font-bold text-gray-800">OFFICE OF THE PUNONG BARANGAY</h2>
    </div>
  </div>
);

// Common Certificate Footer Component
const CertificateFooter: React.FC<{ 
  certifyingOfficial?: string; 
  dateIssued?: string;
  orNumber?: string;
  amountPaid?: number;
}> = ({ certifyingOfficial, dateIssued, orNumber, amountPaid }) => (
  <div className="mt-12">
    <div className="flex justify-between items-start">
      <div className="w-1/2">
        <p className="text-sm mb-4">Date Issued: {dateIssued || new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
        {orNumber && (
          <p className="text-sm mb-2">O.R. Number: {orNumber}</p>
        )}
        {amountPaid && (
          <p className="text-sm">Amount Paid: ₱{amountPaid.toFixed(2)}</p>
        )}
      </div>
      <div className="w-1/2 text-center">
        <div className="mt-8">
          <div className="border-b-2 border-black inline-block w-64 mb-2"></div>
          <p className="text-sm font-semibold">{certifyingOfficial || 'PUNONG BARANGAY'}</p>
          <p className="text-xs text-gray-600">Punong Barangay</p>
        </div>
      </div>
    </div>
  </div>
);

// Barangay Clearance Template
export const BarangayClearanceTemplate: React.FC<CertificateTemplateProps> = ({ document, onClose }) => (
  <div className="fixed inset-0 bg-white z-50 overflow-auto">
    <div className="max-w-4xl mx-auto p-8 min-h-screen print:p-4">
      {/* Close button - hidden when printing */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 print:hidden"
      >
        Close
      </button>
      
      {/* Print button - hidden when printing */}
      <button
        onClick={() => window.print()}
        className="fixed top-4 right-20 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 print:hidden"
      >
        Print / Save PDF
      </button>

      <div className="bg-white border-2 border-black p-8 print:border-0 print:p-0">
        <CertificateHeader />
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 underline mb-6">BARANGAY CLEARANCE</h1>
        </div>

        <div className="mb-8">
          <p className="text-base leading-relaxed text-justify mb-4">
            <span className="font-semibold">TO WHOM IT MAY CONCERN:</span>
          </p>
          
          <p className="text-base leading-relaxed text-justify mb-6">
            This is to certify that <span className="font-semibold underline">{document.resident_name.toUpperCase()}</span>, 
            of legal age, {document.resident.civil_status || 'N/A'}, {document.resident.nationality || 'Filipino'} citizen, 
            and a resident of <span className="font-semibold">{document.resident.complete_address || 'Brgy. Sikatuna Village, Samal, Bataan'}</span>, 
            is personally known to me and is a person of good moral character and reputation in the community.
          </p>

          <p className="text-base leading-relaxed text-justify mb-6">
            This certification is issued upon the request of the above-named person for 
            <span className="font-semibold"> {document.purpose.toLowerCase()}</span> and for whatever legal purpose 
            it may serve him/her best.
          </p>

          <p className="text-base leading-relaxed text-justify">
            Given this <span className="font-semibold">{new Date().getDate()}</span> day of{' '}
            <span className="font-semibold">{new Date().toLocaleDateString('en-US', { month: 'long' })}</span>,{' '}
            <span className="font-semibold">{new Date().getFullYear()}</span> at Brgy. Sikatuna Village, Samal, Bataan, Philippines.
          </p>
        </div>

        <CertificateFooter 
          certifyingOfficial={document.certifying_official}
          dateIssued={document.date_issued}
          orNumber={document.or_number}
          amountPaid={document.amount_paid}
        />
      </div>
    </div>
  </div>
);

// Certificate of Residency Template
export const CertificateOfResidencyTemplate: React.FC<CertificateTemplateProps> = ({ document, onClose }) => (
  <div className="fixed inset-0 bg-white z-50 overflow-auto">
    <div className="max-w-4xl mx-auto p-8 min-h-screen print:p-4">
      {/* Close button - hidden when printing */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 print:hidden"
      >
        Close
      </button>
      
      {/* Print button - hidden when printing */}
      <button
        onClick={() => window.print()}
        className="fixed top-4 right-20 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 print:hidden"
      >
        Print / Save PDF
      </button>

      <div className="bg-white border-2 border-black p-8 print:border-0 print:p-0">
        <CertificateHeader />
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 underline mb-6">CERTIFICATE OF RESIDENCY</h1>
        </div>

        <div className="mb-8">
          <p className="text-base leading-relaxed text-justify mb-4">
            <span className="font-semibold">TO WHOM IT MAY CONCERN:</span>
          </p>
          
          <p className="text-base leading-relaxed text-justify mb-6">
            This is to certify that <span className="font-semibold underline">{document.resident_name.toUpperCase()}</span>, 
            of legal age, born on {document.resident.birth_date ? new Date(document.resident.birth_date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) : 'N/A'}, 
            {document.resident.civil_status || 'N/A'}, {document.resident.nationality || 'Filipino'} citizen, 
            is a <span className="font-semibold">BONAFIDE RESIDENT</span> of 
            <span className="font-semibold"> {document.resident.complete_address || 'Brgy. Sikatuna Village, Samal, Bataan'}</span>.
          </p>

          <p className="text-base leading-relaxed text-justify mb-6">
            This certification is issued upon the request of the above-named person for 
            <span className="font-semibold"> {document.purpose.toLowerCase()}</span> and for whatever legal purpose 
            it may serve him/her best.
          </p>

          <p className="text-base leading-relaxed text-justify">
            Given this <span className="font-semibold">{new Date().getDate()}</span> day of{' '}
            <span className="font-semibold">{new Date().toLocaleDateString('en-US', { month: 'long' })}</span>,{' '}
            <span className="font-semibold">{new Date().getFullYear()}</span> at Brgy. Sikatuna Village, Samal, Bataan, Philippines.
          </p>
        </div>

        <CertificateFooter 
          certifyingOfficial={document.certifying_official}
          dateIssued={document.date_issued}
          orNumber={document.or_number}
          amountPaid={document.amount_paid}
        />
      </div>
    </div>
  </div>
);

// Certificate of Indigency Template
export const CertificateOfIndigencyTemplate: React.FC<CertificateTemplateProps> = ({ document, onClose }) => (
  <div className="fixed inset-0 bg-white z-50 overflow-auto">
    <div className="max-w-4xl mx-auto p-8 min-h-screen print:p-4">
      {/* Close button - hidden when printing */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 print:hidden"
      >
        Close
      </button>
      
      {/* Print button - hidden when printing */}
      <button
        onClick={() => window.print()}
        className="fixed top-4 right-20 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 print:hidden"
      >
        Print / Save PDF
      </button>

      <div className="bg-white border-2 border-black p-8 print:border-0 print:p-0">
        <CertificateHeader />
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 underline mb-6">CERTIFICATE OF INDIGENCY</h1>
        </div>

        <div className="mb-8">
          <p className="text-base leading-relaxed text-justify mb-4">
            <span className="font-semibold">TO WHOM IT MAY CONCERN:</span>
          </p>
          
          <p className="text-base leading-relaxed text-justify mb-6">
            This is to certify that <span className="font-semibold underline">{document.resident_name.toUpperCase()}</span>, 
            of legal age, {document.resident.civil_status || 'N/A'}, {document.resident.nationality || 'Filipino'} citizen, 
            and a resident of <span className="font-semibold">{document.resident.complete_address || 'Brgy. Sikatuna Village, Samal, Bataan'}</span>, 
            belongs to an <span className="font-semibold">INDIGENT FAMILY</span> in this barangay.
          </p>

          <p className="text-base leading-relaxed text-justify mb-6">
            This certification is issued upon the request of the above-named person for 
            <span className="font-semibold"> {document.purpose.toLowerCase()}</span> and for whatever legal purpose 
            it may serve him/her best.
          </p>

          <p className="text-base leading-relaxed text-justify">
            Given this <span className="font-semibold">{new Date().getDate()}</span> day of{' '}
            <span className="font-semibold">{new Date().toLocaleDateString('en-US', { month: 'long' })}</span>,{' '}
            <span className="font-semibold">{new Date().getFullYear()}</span> at Brgy. Sikatuna Village, Samal, Bataan, Philippines.
          </p>
        </div>

        <CertificateFooter 
          certifyingOfficial={document.certifying_official}
          dateIssued={document.date_issued}
          orNumber={document.or_number}
          amountPaid={document.amount_paid}
        />
      </div>
    </div>
  </div>
);

// Business Permit Template
export const BusinessPermitTemplate: React.FC<CertificateTemplateProps> = ({ document, onClose }) => (
  <div className="fixed inset-0 bg-white z-50 overflow-auto">
    <div className="max-w-4xl mx-auto p-8 min-h-screen print:p-4">
      {/* Close button - hidden when printing */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 print:hidden"
      >
        Close
      </button>
      
      {/* Print button - hidden when printing */}
      <button
        onClick={() => window.print()}
        className="fixed top-4 right-20 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 print:hidden"
      >
        Print / Save PDF
      </button>

      <div className="bg-white border-2 border-black p-8 print:border-0 print:p-0">
        <CertificateHeader />
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 underline mb-6">BARANGAY BUSINESS PERMIT</h1>
        </div>

        <div className="mb-8">
          <p className="text-base leading-relaxed text-justify mb-4">
            <span className="font-semibold">TO WHOM IT MAY CONCERN:</span>
          </p>
          
          <p className="text-base leading-relaxed text-justify mb-6">
            This is to certify that <span className="font-semibold underline">{document.resident_name.toUpperCase()}</span>, 
            of legal age, {document.resident.civil_status || 'N/A'}, {document.resident.nationality || 'Filipino'} citizen, 
            and a resident of <span className="font-semibold">{document.resident.complete_address || 'Brgy. Sikatuna Village, Samal, Bataan'}</span>, 
            has been <span className="font-semibold">GRANTED PERMISSION</span> to operate a small business within the territorial 
            jurisdiction of this barangay.
          </p>

          <p className="text-base leading-relaxed text-justify mb-6">
            This permit is issued for <span className="font-semibold">{document.purpose.toLowerCase()}</span> and 
            is subject to the rules and regulations of the barangay and other government agencies.
          </p>

          <p className="text-base leading-relaxed text-justify mb-6">
            This permit is valid for <span className="font-semibold">ONE (1) YEAR</span> from the date of issuance 
            and is <span className="font-semibold">NON-TRANSFERABLE</span>.
          </p>

          <p className="text-base leading-relaxed text-justify">
            Given this <span className="font-semibold">{new Date().getDate()}</span> day of{' '}
            <span className="font-semibold">{new Date().toLocaleDateString('en-US', { month: 'long' })}</span>,{' '}
            <span className="font-semibold">{new Date().getFullYear()}</span> at Brgy. Sikatuna Village, Samal, Bataan, Philippines.
          </p>
        </div>

        <CertificateFooter 
          certifyingOfficial={document.certifying_official}
          dateIssued={document.date_issued}
          orNumber={document.or_number}
          amountPaid={document.amount_paid}
        />
      </div>
    </div>
  </div>
);

export type { DocumentData, CertificateTemplateProps }; 