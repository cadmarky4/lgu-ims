// ============================================================================
// components/residents/form/ProfilePhotoUpload.tsx - Profile photo component
// ============================================================================

import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FiUpload } from 'react-icons/fi';

interface ProfilePhotoUploadProps {
  preview: string | null;
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
}

export const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  preview,
  onFileSelect,
  isUploading = false
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition ${
        isUploading ? 'opacity-50 pointer-events-none' : ''
      }`}
      onClick={handleClick}
    >
      {preview ? (
        <img
          src={preview}
          alt="Profile Preview"
          className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border"
        />
      ) : (
        <FiUpload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      )}
      
      {isUploading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
          <span className="ml-2 text-gray-600">Uploading...</span>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-2">
            {t('residents.form.profilePhoto.upload')}
          </p>
          <p className="text-sm text-gray-500">
            {t('residents.form.profilePhoto.clickToBrowse')}
          </p>
        </>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};