import React, { useState, useEffect } from 'react';
import { FiUpload, FiX, FiCheck } from 'react-icons/fi';
import Breadcrumb from '../global/Breadcrumb'; // Import your existing breadcrumb component
import { barangayOfficialsService } from '../../services';
import type { BarangayOfficialFormData } from '../../services/barangayOfficials.types';

interface EditBarangayOfficialProps {
  onClose: () => void;
  onSave: (officialData: any) => void;
  official?: any;
}

const EditBarangayOfficial: React.FC<EditBarangayOfficialProps> = ({ onClose, onSave, official }) => {  // Loading and error states for API calls
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Animation trigger on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Toast state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  // Toast utility function
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<BarangayOfficialFormData>({
    prefix: official?.prefix || 'Mr.',
    firstName: official?.firstName || 'Juan',
    middleName: official?.middleName || 'Perez',
    lastName: official?.lastName || 'Dela Cruz',
    gender: official?.gender || 'Male',
    birthDate: official?.birthDate || '1985-06-16',
    contactNumber: official?.contactNumber || '+63 912 345 6789',
    emailAddress: official?.emailAddress || 'sanmiguel.pasig@gmail.com',
    completeAddress: official?.completeAddress || '',
    civilStatus: official?.civilStatus || 'Married',
    educationalBackground: official?.educationalBackground || 'Bachelor in Public Administration',
    position: official?.position || 'KAGAWAD',
    committeeAssignment: official?.committeeAssignment || 'Health',
    termStart: official?.termStart || '2022-05-05',
    termEnd: official?.termEnd || '2025-05-10',
    isActive: official?.isActive !== undefined ? official.isActive : true
  });

  // Load draft data (commented out to avoid localStorage issues)
  const loadDraftData = () => {
    try {
      // const savedDraft = localStorage.getItem(`officialDraft_${official?.id || 'new'}`);
      // if (savedDraft) {
      //   const draftData = JSON.parse(savedDraft);
      //   setFormData(draftData);
      // }
    } catch (error) {
      console.error('Failed to load draft data:', error);
    }
  };

  // Save draft (commented out to avoid localStorage issues)
  const handleSaveDraft = () => {
    setIsSavingDraft(true);
    try {
      // localStorage.setItem(`officialDraft_${official?.id || 'new'}`, JSON.stringify(formData));
      setError(null);
      showToast('Draft saved successfully!', 'success');
    } catch (error) {
      showToast('Failed to save draft. Please try again.', 'error');
      console.error('Failed to save draft:', error);
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Clear draft (commented out to avoid localStorage issues)
  const clearDraft = () => {
    try {
      // localStorage.removeItem(`officialDraft_${official?.id || 'new'}`);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  };
  // Load draft data on component mount
  useEffect(() => {
    loadDraftData();
    
    // Initialize form data from official prop if provided
    if (official) {
      setFormData({
        prefix: official.prefix || 'Mr.',
        firstName: official.firstName || '',
        middleName: official.middleName || '',
        lastName: official.lastName || '',
        gender: official.gender || 'Male',
        birthDate: official.birthDate || '',
        contactNumber: official.contactNumber || '',
        emailAddress: official.emailAddress || '',
        completeAddress: official.completeAddress || '',
        civilStatus: official.civilStatus || 'Single',
        educationalBackground: official.educationalBackground || '',
        position: official.position || 'KAGAWAD',
        committeeAssignment: official.committeeAssignment || '',
        termStart: official.termStart || '',
        termEnd: official.termEnd || '',
        isActive: official.isActive !== undefined ? official.isActive : true
      });
    }
  }, [official]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let submitData: any;
      
      if (selectedFile) {
        // Use FormData only when there's a file to upload
        const formDataForUpload = new FormData();
        
        // Append all form fields
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formDataForUpload.append(key, value.toString());
          }
        });
        
        // Append file
        formDataForUpload.append('profile_photo', selectedFile);
        submitData = formDataForUpload;
      } else {
        // Use regular JSON data when there's no file
        submitData = { ...formData };
      }

      if (official?.id) {
        // Update existing official
        const updatedOfficial = await barangayOfficialsService.updateBarangayOfficial(official.id, submitData);
        
        // Call the parent onSave with the updated data
        onSave(updatedOfficial);
      } else {
        // Create new official
        const newOfficial = await barangayOfficialsService.createBarangayOfficial(submitData);
        
        // Call the parent onSave with the new data
        onSave(newOfficial);
      }
      
      // Clear the draft since official was successfully saved
      clearDraft();
      
      // Show success toast
      showToast(`Official ${official?.id ? 'updated' : 'created'} successfully!`, 'success');
      
      // Close after a brief delay to show the toast
      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (err: any) {
      console.error('Error saving official:', err);

      // Handle validation errors
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat();
        setError(`Validation failed: ${errorMessages.join(", ")}`);
      } else {
        setError(err.message || "Failed to save official. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={`p-6 bg-gray-50 min-h-screen flex flex-col gap-4 transition-all duration-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Breadcrumb */}
      <Breadcrumb isLoaded={isLoaded} />
      
      {/* Header */}
      <div className={`mb-2 transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '100ms' }}>
        <h1 className="text-2xl font-bold text-darktext pl-0">
          {official?.id ? 'Edit Barangay Official' : 'Add New Barangay Official'}
        </h1>
        {localStorage.getItem(`officialDraft_${official?.id || 'new'}`) && (
          <p className="text-sm text-gray-600 mt-1">
            📝 Draft data loaded from previous session
          </p>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className={`bg-red-50 border border-red-200 rounded-lg p-4 mb-4 transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '150ms' }}>
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}      {/* Loading State - removed since not used */}

      {/* Loading State */}
      {/* {isLoading && (
        <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '200ms' }}>
          <p className="text-blue-800 text-sm">Loading reference data...</p>
        </div>
      )} */}

      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '250ms' }}>
        {/* Basic Information */}
        <section className="mb-8">
          <h2 className={`text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4 transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '300ms' }}>Basic Information</h2>
          <div className="border-b border-gray-200 mb-6"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Profile Photo */}
            <div className={`lg:col-span-1 transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '350ms' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-smblue-400 transition-all duration-200">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-16 h-16 mx-auto rounded-full object-cover mb-3"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        setSelectedFile(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-3">
                    <FiUpload className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <input
                  type="file"
                  id="profilePhoto"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="profilePhoto"
                  className="text-smblue-400 hover:text-smblue-300 text-sm font-medium transition-colors cursor-pointer"
                >
                  {previewUrl ? 'Change Photo' : 'Upload Profile Photo'}
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Prefix */}
              <div className={`transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '400ms' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prefix
                </label>
                <select
                  name="prefix"
                  value={formData.prefix}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 transition-all"
                  title="Select prefix"
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Hon.">Hon.</option>
                </select>
              </div>

              {/* First Name */}
              <div className={`transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '450ms' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 transition-all"
                  required
                />
              </div>

              {/* Middle Name */}
              <div className={`transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '500ms' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Middle Name *
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 transition-all"
                  required
                />
              </div>

              {/* Last Name */}
              <div className={`transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '550ms' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 transition-all"
                  required
                />
              </div>

              {/* Gender */}
              <div className={`transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '600ms' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 transition-all"
                  title="Select gender"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Birthdate */}
              <div className={`transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '650ms' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birthdate
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 transition-all"
                />
              </div>

              {/* Contact Number */}
              <div className={`transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '700ms' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 transition-all"
                  required
                />
              </div>

              {/* Email Address */}
              <div className={`transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '750ms' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 transition-all"
                  required
                />
              </div>

              {/* Complete Address */}
              <div className={`transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '800ms' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complete Address
                </label>
                <input
                  type="text"
                  name="completeAddress"
                  value={formData.completeAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 transition-all"
                />
              </div>

              {/* Civil Status */}
              <div className={`transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '850ms' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Civil Status
                </label>
                <select
                  name="civilStatus"
                  value={formData.civilStatus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 transition-all"
                  title="Select civil status"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              {/* Educational Background */}
              <div className={`transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '900ms' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Educational Background
                </label>
                <input
                  type="text"
                  name="educationalBackground"
                  value={formData.educationalBackground}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Term Information */}
        <section className="mb-8">
          <h2 className={`text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4 transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '950ms' }}>Term Information</h2>
          <div className="border-b border-gray-200 mb-6"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Committee Assignment */}
            <div className={`transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '1000ms' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Committee Assignment
              </label>
              <select
                name="committeeAssignment"
                value={formData.committeeAssignment}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 transition-all"
                title="Select committee assignment"
              >
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Public Safety">Public Safety</option>
                <option value="Environment">Environment</option>
                <option value="Peace and Order">Peace and Order</option>
                <option value="Sports and Recreation">Sports and Recreation</option>
                <option value="Women and Family">Women and Family</option>
                <option value="Senior Citizens">Senior Citizens</option>
                <option value="Married">Married</option>
              </select>
            </div>

            {/* Term Start */}
            <div className={`transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '1050ms' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Term Start
              </label>
              <input
                type="date"
                name="termStart"
                value={formData.termStart}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 transition-all"
              />
            </div>

            {/* Term End */}
            <div className={`transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '1100ms' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Term End
              </label>
              <input
                type="date"
                name="termEnd"
                value={formData.termEnd}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 transition-all"
              />
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className={`flex justify-between items-center pt-6 border-t border-gray-200 transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '1150ms' }}>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSavingDraft || isSubmitting}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 hover:shadow-sm"
          >
            {isSavingDraft && (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>{isSavingDraft ? "Saving Draft..." : "Save Draft"}</span>
          </button>

          <div className="flex space-x-4">
            <button
              type="submit"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              // HARDCODED PREVIOUS (SEAN BA TO O DWYGHT?)
              // disabled={isSubmitting || isLoading}
              disabled={isSubmitting}
              // ADRIAN PREVIOUS
              // className="px-6 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              className="px-6 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 hover:shadow-sm"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <span>{isSubmitting ? (official?.id ? 'Updating...' : 'Creating...') : (official?.id ? 'Save Changes' : 'Create Official')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg border ${
            toast.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {toast.type === 'success' ? (
              <FiCheck className="w-5 h-5 text-green-600" />
            ) : (
              <FiX className="w-5 h-5 text-red-600" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => setToast({ show: false, message: '', type: 'success' })}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Close notification"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default EditBarangayOfficial;