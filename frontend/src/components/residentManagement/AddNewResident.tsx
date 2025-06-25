// ============================================================================
// pages/residents/AddResident.tsx - Add resident page
// ============================================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ResidentForm } from './_components/ResidentForm';

const AddResident: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/residents');
  };

  const handleSuccess = () => {
    setTimeout(() => {
      navigate('/residents');
    }, 1500);
  };

  return (
    <ResidentForm
      mode="create"
      onClose={handleClose}
      onSuccess={handleSuccess}
    />
  );
};

export default AddResident;