// ============================================================================
// pages/residents/EditResident.tsx - Edit resident page
// ============================================================================

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResidentForm } from './_components/ResidentForm';

const EditResident: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const residentId = id ? parseInt(id, 10) : undefined;

  const handleClose = () => {
    navigate('/residents');
  };

  const handleSuccess = () => {
    setTimeout(() => {
      navigate('/residents');
    }, 1500);
  };

  if (!residentId || isNaN(residentId)) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">Invalid Resident ID</h1>
        <button
          onClick={handleClose}
          className="mt-4 px-6 py-2 bg-smblue-400 text-white rounded-lg"
        >
          Back to Residents
        </button>
      </div>
    );
  }

  return (
    <ResidentForm
      mode="edit"
      residentId={residentId}
      onClose={handleClose}
      onSuccess={handleSuccess}
    />
  );
};

export default EditResident;