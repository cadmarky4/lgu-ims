import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { documentsService } from '../../services/documents/documents.service';
import type { DocumentRequest } from '../../services/documents/documents.types';

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

interface CertificateFooterProps {
  certifyingOfficial?: string; 
  dateIssued?: string;
  orNumber?: string;
  amountPaid?: number;
}

const CertificateFooter: React.FC<CertificateFooterProps> = ({ 
  certifyingOfficial, 
  dateIssued, 
  orNumber, 
  amountPaid 
}) => (
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

const CertificateOfResidencyPrint: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<DocumentRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (documentId) {
      fetchDocument();
    }
  }, [documentId]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      
      // For development, use placeholder data
      const placeholderDocument: DocumentRequest = {
        id: parseInt(documentId || '1'),
        document_type: 'CERTIFICATE_OF_RESIDENCY',
        resident_id: 1,
        resident_name: 'Ana Reyes',
        purpose: 'School Enrollment',
        status: 'APPROVED',
        request_date: '2024-01-10T16:45:00Z',
        processing_fee: 30,
        certifying_official: 'Carmen Rodriguez - Barangay Secretary',
        notes: 'Years of Residence: 15, Residency Status: Permanent Resident',
        resident: {
          first_name: 'Ana',
          last_name: 'Reyes',
          complete_address: 'Purok 4, Brgy. Sikatuna Village, Samal, Bataan',
          mobile_number: '+63 945 678 9012'
        }
      };
      
      setDocument(placeholderDocument);
    } catch (err) {
      console.error('Failed to fetch document:', err);
      setError('Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    navigate('/process-document');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Document not found'}</p>
          <button
            onClick={handleClose}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Documents
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          * {
            visibility: visible !important;
            color: black !important;
            background: white !important;
            box-shadow: none !important;
            border: none !important;
            text-shadow: none !important;
          }
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .certificate-content {
            page-break-inside: avoid;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 1in !important;
            margin: 0 !important;
          }
        }
      `}</style>
      <div className="min-h-screen bg-white">
        {/* Print Controls - Hidden when printing */}
                <div className="print:hidden fixed top-4 right-4 z-10 space-x-2">
          <button
            onClick={handlePrint}
            className="bg-smblue-400 text-white px-6 py-3 rounded-lg hover:bg-smblue-500 shadow-lg font-medium cursor-pointer no-underline"
          >
            🖨️ Print Certificate
          </button>
          <button
            onClick={handleClose}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 shadow-lg cursor-pointer no-underline"
          >
            Close
          </button>
        </div>

        {/* Certificate Content */}
        <div className="max-w-4xl mx-auto p-8 certificate-content">
          <div className="bg-white p-8">
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
              of legal age, Filipino citizen, 
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
            dateIssued={document.processed_date}
            orNumber={'OR-' + document.id.toString().padStart(6, '0')}
            amountPaid={document.processing_fee}
          />
        </div>
      </div>
      </div>
    </>
  );
};

export default CertificateOfResidencyPrint; 