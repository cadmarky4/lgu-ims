import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { HouseholdFormDataSchema, transformHouseholdToFormData, type HouseholdFormData } from '@/services/households/households.types';
import { useCreateHousehold, useUpdateHousehold } from '@/services/households/useHouseholds';
import { useNotifications } from '@/components/_global/NotificationSystem';

interface UseHouseholdFormProps {
  initialData?: any; // For edit mode
  mode?: 'create' | 'edit';
}

export const useHouseholdForm = ({ initialData, mode = 'create' }: UseHouseholdFormProps = {}) => {
  const [formError, setFormError] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const { showNotification } = useNotifications();

  // Initialize form with React Hook Form + Zod validation
  const form = useForm<HouseholdFormData>({
    resolver: zodResolver(HouseholdFormDataSchema),
    defaultValues: initialData ? transformHouseholdToFormData(initialData) : transformHouseholdToFormData(null),
    mode: 'onChange',
  });

  // TanStack Query mutations
  const createHouseholdMutation = useCreateHousehold();
  const updateHouseholdMutation = useUpdateHousehold();

  // Get draft key based on mode
  const getDraftKey = () => {
    if (mode === 'edit' && initialData?.id) {
      return `householdDraft_${initialData.id}`;
    }
    return 'householdDraft';
  };

  // Load draft data on mount
  useEffect(() => {
    loadDraftData();
  }, [mode, initialData?.id]);

  const loadDraftData = () => {
    try {
      const draftKey = getDraftKey();
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        form.reset(draftData);
        showNotification({
          type: 'info',
          title: 'Draft Loaded',
          message: 'Previous draft data has been loaded'
        });
      }
    } catch (error) {
      console.error('Failed to load draft data:', error);
    }
  };

  const saveDraft = (data: HouseholdFormData) => {
    setIsSavingDraft(true);
    try {
      const draftKey = getDraftKey();
      localStorage.setItem(draftKey, JSON.stringify(data));
      showNotification({
        type: 'success',
        title: 'Draft Saved',
        message: 'Your changes have been saved as draft'
      });
      setTimeout(() => setIsSavingDraft(false), 500);
    } catch (error) {
      console.error('Failed to save draft:', error);
      showNotification({
        type: 'error',
        title: 'Draft Save Failed',
        message: 'Could not save draft to local storage'
      });
      setIsSavingDraft(false);
    }
  };

  const clearDraft = () => {
    try {
      const draftKey = getDraftKey();
      localStorage.removeItem(draftKey);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  };

  const onSubmit = async (data: HouseholdFormData, onSuccess?: () => void) => {
    setFormError(null);
    
    try {
      // Validate that head resident is selected
      if (!data.head_resident_id) {
        setFormError('Please select a household head before saving.');
        return;
      }

      // Transform memberRelationships to simple members array for API
      const submitData = {
        ...data,
        members: data.memberRelationships?.map(mr => mr.residentId) || null
      };

      if (mode === 'create') {
        await createHouseholdMutation.mutateAsync(submitData);
        showNotification({
          type: 'success',
          title: 'Household Created',
          message: 'New household has been created successfully'
        });
      } else {
        // For edit mode, need household ID
        if (!initialData?.id) {
          throw new Error('Household ID is required for update');
        }
        await updateHouseholdMutation.mutateAsync({ 
          id: initialData.id, 
          data: submitData 
        });
        showNotification({
          type: 'success',
          title: 'Household Updated',
          message: `Household ${initialData.household_number} has been updated successfully`
        });
      }

      clearDraft(); // Clear draft after successful submission

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      const errorMessage = error.message || `Failed to ${mode} household. Please try again.`;
      setFormError(errorMessage);
      showNotification({
        type: 'error',
        title: `${mode === 'create' ? 'Create' : 'Update'} Failed`,
        message: errorMessage
      });
    }
  };

  return {
    form,
    formError,
    setFormError,
    isSubmitting: createHouseholdMutation.isPending || updateHouseholdMutation.isPending,
    onSubmit,
    saveDraft,
    isSavingDraft,
    clearDraft,
    // Expose mutation states for additional handling if needed
    createMutation: createHouseholdMutation,
    updateMutation: updateHouseholdMutation,
  };
};