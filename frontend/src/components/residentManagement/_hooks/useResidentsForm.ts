// ============================================================================
// hooks/use-resident-form.ts - Custom hook for resident form logic
// ============================================================================

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@/components/_global/NotificationSystem';
import { 
    ResidentFormDataSchema,
    transformResidentToFormData,
    type ResidentFormData 
} from '@/services/residents/residents-form.types'; 

import { 
    useResident ,
    useCreateResident, 
    useUpdateResident,
} from '@/services/residents/useResidents';

import { useFileUpload } from '@/services/__shared/__hooks/useFileUpload';

import { useCheckDuplicates } from './useDuplicateCheck';

interface UseResidentFormProps {
  mode: 'create' | 'edit';
  residentId?: number;
  onSuccess?: () => void;
}

export function useResidentForm({ mode, residentId, onSuccess }: UseResidentFormProps) {
  const { t } = useTranslation();

  const { showNotification } = useNotifications();

  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  
  // React Hook Form setup
   const form = useForm<ResidentFormData>({
    resolver: zodResolver(ResidentFormDataSchema),
    defaultValues: transformResidentToFormData(null),
    mode: 'onBlur',
  });

  const { watch, setValue, reset } = form;
  const watchedValues = watch(['first_name', 'last_name', 'birth_date']);
  
  // Queries and mutations
  const { data: resident, isLoading: isLoadingResident } = useResident(
    residentId || 0, 
    mode === 'edit' && !!residentId
  );
  
  const createResident = useCreateResident();
  const updateResident = useUpdateResident();
  const uploadFile = useFileUpload();
  
  // Duplicate checking
  const { checkDuplicates, isChecking } = useCheckDuplicates({
    onDuplicatesFound: (duplicates) => {
      if (duplicates.length > 0) {
        setDuplicateWarning(
          t('residents.form.messages.duplicateWarning', { count: duplicates.length })
        );
      } else {
        setDuplicateWarning(null);
      }
    },
  });

  // Auto-calculate age when birth date changes
  useEffect(() => {
    const birthDate = watchedValues[2]; // birthDate
    if (birthDate) {
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      setValue('age', age.toString());
    }
  }, [watchedValues, setValue]);

  // Check for duplicates when key fields change
  useEffect(() => {
    const [firstName, lastName, birthDate] = watchedValues;
    if (firstName && lastName && birthDate) {
      const timeoutId = setTimeout(() => {
        checkDuplicates({ firstName, lastName, birthDate });
      }, 1000);
      return () => clearTimeout(timeoutId);
    } else {
      setDuplicateWarning(null);
    }
  }, [watchedValues, checkDuplicates]);

  // Load resident data for edit mode
  useEffect(() => {
    if (mode === 'edit' && resident) {
      const formData = transformResidentToFormData(resident);
      reset(formData);
      
      if (resident.profile_photo_url) {
        setProfilePhotoPreview(resident.profile_photo_url);
      }
    }
  }, [mode, resident, reset]);

  // Load draft on mount for create mode
  useEffect(() => {
    if (mode === 'create') {
      try {
        const savedDraft = localStorage.getItem('residentDraft');
        if (savedDraft) {
          const draftData = JSON.parse(savedDraft);
          reset(draftData);
        }
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [mode, reset]);

  // File upload handler
  const handleFileUpload = async (file: File) => {
    try {
      const result = await uploadFile.mutateAsync({ 
        file, 
        folder: 'residents',
        isPublic: true 
      });
      setValue('profile_photo_url', result.url);
      setProfilePhotoPreview(result.url);
      return result.url;
    } catch (error) {
      showNotification({
        type: 'error',
        title: t('residents.form.messages.uploadError'),
        message: t('residents.form.profilePhoto.uploadError'),
        duration: 3000,
        persistent: false,
      });
      throw error;
    }
  };

  // Form submission
  const handleSubmit = async (data: ResidentFormData) => {
    try {
      if (mode === 'create') {
        await createResident.mutateAsync(data);
        showNotification({
          type: 'success',
          title: t('residents.form.messages.createSuccess'),
          message: t('residents.form.messages.createSuccess'),
          duration: 3000,
          persistent: false,
        });
      } else if (mode === 'edit' && residentId) {
        await updateResident.mutateAsync({ id: residentId, data: data });
        showNotification({
          type: 'success',
          title: t('residents.form.messages.updateSuccess'),
          message: t('residents.form.messages.updateSuccess'),
          duration: 3000,
          persistent: false,
        });
      }
      onSuccess?.();
    } catch (error) {
      const errorMessage = (error as Error)?.message || 
        (mode === 'create' 
          ? t('residents.form.messages.createError')
          : t('residents.form.messages.updateError')
        );
      showNotification({
        type: 'error',
        title: t('residents.form.messages.error'),
        message: errorMessage,
        duration: 3000,
        persistent: false,
      });
      console.error('Form submission error:', error);
    }
  };

  // Draft management
  const saveDraft = () => {
    try {
      const draftData = form.getValues();
      localStorage.setItem('residentDraft', JSON.stringify(draftData));
      showNotification({
        type: 'info',
        title: t('residents.form.messages.draftSaved'),
        message: t('residents.form.messages.draftSaved'),
        duration: 3000,
        persistent: false,
      });
    } catch (error) {
      console.error('Failed to save draft:', error);
      showNotification({
        type: 'error',
        title: t('residents.form.messages.draftError'),
        message: t('residents.form.messages.draftError'),
        duration: 3000,
        persistent: false,
      });
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem('residentDraft');
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  };

  return {
    form,
    resident,
    isLoadingResident,
    profilePhotoPreview,
    duplicateWarning,
    isSubmitting: createResident.isPending || updateResident.isPending,
    isUploadingFile: uploadFile.isPending,
    isCheckingDuplicates: isChecking,
    handleSubmit: form.handleSubmit(handleSubmit),
    handleFileUpload,
    saveDraft,
    clearDraft,
  };
}