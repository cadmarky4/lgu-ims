import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../_global/Breadcrumb';
import HouseholdFormSections from './_components/HouseholdFormSections';
import { useHouseholdForm } from './_hooks/useHouseholdForm';


const AddNewHousehold: React.FC = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  // Animation trigger on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Use our custom household form hook
  const {
    form,
    isSubmitting,
    onSubmit,
    saveDraft,
    isSavingDraft,
    formError,
  } = useHouseholdForm();

  const handleClose = () => {
    const isDirty = form.formState.isDirty;
    
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/household');
      }
    } else {
      navigate('/household');
    }
  };

  const handleSaveDraft = () => {
    saveDraft(form.getValues());
  };

  const handleFormSubmit = (data: any) => {
    onSubmit(data, () => navigate('/household'));
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      {/* Automatic Breadcrumbs */}
      <Breadcrumb isLoaded={isLoaded} />

      {/* Header */}
      <div className={`mb-2 transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <h1 className="text-2xl font-bold text-darktext pl-0">Add New Household Profile</h1>
        {localStorage.getItem('householdDraft') && (
          <p className="text-sm text-gray-600 mt-1">
            📝 Draft data loaded from previous session
          </p>
        )}
      </div>

      {/* Error Display */}
      {formError && (
        <div className={`bg-red-50 border border-red-200 rounded-lg p-4 mb-4 transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ transitionDelay: '200ms' }}>
          <p className="text-red-800 text-sm">{formError}</p>
        </div>
      )}

      <form 
        onSubmit={form.handleSubmit(handleFormSubmit)} 
        className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} 
        style={{ transitionDelay: '300ms' }}
      >
        {/* Form Sections */}
        <HouseholdFormSections form={form} />

        {/* Form Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSavingDraft || isSubmitting}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSavingDraft && (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>{isSavingDraft ? "Saving Draft..." : "Save Draft"}</span>
          </button>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>{isSubmitting ? 'Saving...' : 'Save Household'}</span>
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default AddNewHousehold;