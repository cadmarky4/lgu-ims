import { useNotifications } from "@/components/_global/NotificationSystem";
import { BarangayOfficialFormDataSchema, transformBarangayOfficialToFormData, type BarangayOfficialFormData } from "@/services/officials/barangayOfficials.types";
import { useBarangayOfficial, useCreateBarangayOfficial, useUpdateBarangayOfficial } from "@/services/officials/useBarangayOfficials";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useIsAlreadyRegisteredAsOfficial } from "./useIsAlreadyOfficial";
import { useEffect, useState } from "react";
import { useResidents } from "@/services/residents/useResidents";
import { useTranslation } from "react-i18next";
import { residentsService } from "@/services/residents/residents.service";

interface useBarangayOfficialsFormProps {
    mode: 'create' | 'edit',
    barangayOfficialId?: string,
    onSuccess?: () => void;
}

export function useBarangayOfficialsForm({ mode, barangayOfficialId, onSuccess }: useBarangayOfficialsFormProps) {    
    const { t } = useTranslation(); 
    const { showNotification } = useNotifications();
    const [ isAlreadyRegisteredAsOfficialWarning, setIsAlreadyRegisteredAsOfficialWarning ] = useState<string | null>(null);
    
    const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);

    const form = useForm<BarangayOfficialFormData>({
        resolver: zodResolver(BarangayOfficialFormDataSchema),
        defaultValues: transformBarangayOfficialToFormData(null),
        mode: 'onBlur',
    })

    const {  watch, setValue, reset } = form;
    const residentId  = watch('resident_id');
    const searchResident = watch('resident_search');

    // Queries and mutations
    const { data: official, isLoading: isLoadingOfficial } = useBarangayOfficial(
        barangayOfficialId || '',
        mode === 'edit' && !!barangayOfficialId
    );

    const { data: residents, isLoading: isLoadingResidents, error: residentsError } = useResidents({ search: searchResident });

    const createBarangayOfficial = useCreateBarangayOfficial();
    const updateBarangayOfficial = useUpdateBarangayOfficial();
    
    const { isAlreadyRegisteredAsOfficial, isChecking } = useIsAlreadyRegisteredAsOfficial();

    // set default values of dropdowns to empty strings
    // useEffect(() => {
    //     setValue("committee_assignment", "");
    // },[])

    // Check if barangay official already registered when key fields change
    useEffect(() => {
        if (residentId) {
            const timeoutId = setTimeout(() => {
                (async () => {
                    const result = await isAlreadyRegisteredAsOfficial(residentId);
                    if (result > 0) {
                        setIsAlreadyRegisteredAsOfficialWarning('Official already registered');
                    } else if (result === -1) {
                        setIsAlreadyRegisteredAsOfficialWarning('Error checking');
                    } else {
                        // backend search
                        const res = await residentsService.getResident(
                            residentId ? Number(residentId) : -1
                          );
                        // frontend search
                        // const res = residents?.data.find(resident => 
                        //     resident.id === (residentId ? Number(residentId) : -1)
                        // );
                        setValue('first_name', res.first_name);
                        setValue('middle_name', res.middle_name);
                        setValue('last_name', res.last_name);
                        setValue('gender', res.gender);
                        setValue('birth_date', res.birth_date);
                        setValue('mobile_number', res.mobile_number);
                        setValue('email_address', res.email_address);
                        setValue('complete_address', res.complete_address);
                        setValue('civil_status', res.civil_status);
                        setValue('educational_attainment', res.educational_attainment);
                        setValue('profile_photo_url', res.profile_photo_url);
                    }
                })();
            }, 1000);
    
            return () => clearTimeout(timeoutId);
        } else {
            setIsAlreadyRegisteredAsOfficialWarning(null);
        }
    }, [residentId, isAlreadyRegisteredAsOfficial]);
    

    // Load official data for edit mode
    useEffect(() => {
        if (mode === 'edit' && official) {
            const formData = transformBarangayOfficialToFormData(official);
            reset(formData);

            if (official.profile_photo_url) {
                setProfilePhotoPreview(official.profile_photo_url);
            }
        }
    }, [mode, official, reset])

    // Load draft on mount for create mode
    useEffect(() => {
        if (mode === 'create') {
        try {
            const savedDraft = localStorage.getItem('barangayOfficialDraft');
            if (savedDraft) {
            const draftData = JSON.parse(savedDraft);
            reset(draftData);
            }
        } catch (error) {
            console.error('Failed to load draft:', error);
        }
        }
    }, [mode, reset]);

    // Load draft on mount for create mode
    useEffect(() => {
        if (mode === 'create') {
            try {
                const savedDraft = localStorage.getItem('barangayOfficialDraft');
                if (savedDraft) {
                const draftData = JSON.parse(savedDraft);
                reset(draftData);
                }
            } catch (error) {
                console.error('Failed to load draft:', error);
            }
        }
    }, [mode, reset]);

    // Form submission
    const handleSubmit = async (data: BarangayOfficialFormData) => {
        try {
            if (mode === 'create') {
                await createBarangayOfficial.mutateAsync(data);
                showNotification({
                    type: 'success',
                    title: t('barangayOfficials.form.messages.createSuccess'),
                    message: t('barangayOfficials.form.messages.createSuccess'),
                    duration: 3000,
                    persistent: false,
                });
            } else if (mode === 'edit' && barangayOfficialId) {
                showNotification({
                    type: 'success',
                    title: t('barangayOfficials.form.messages.updateSuccess'),
                    message: t('barangayOfficials.form.messages.updateSuccess'),
                    duration: 3000,
                    persistent: false,
                });
            }
            onSuccess?.();
        } catch (error) {
            const errorMessage = (error as Error)?.message || 
              (mode === 'create' 
                ? t('barangayOfficials.form.messages.createError')
                : t('barangayOfficials.form.messages.updateError')
              );
            showNotification({
              type: 'error',
              title: t('barangayOfficials.form.messages.error'),
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
          localStorage.setItem('barangayOfficialDraft', JSON.stringify(draftData));
          showNotification({
            type: 'info',
            title: t('barangayOfficials.form.messages.draftSaved'),
            message: t('barangayOfficials.form.messages.draftSaved'),
            duration: 3000,
            persistent: false,
          });
        } catch (error) {
          console.error('Failed to save draft:', error);
          showNotification({
            type: 'error',
            title: t('barangayOfficials.form.messages.draftError'),
            message: t('barangayOfficials.form.messages.draftError'),
            duration: 3000,
            persistent: false,
          });
        }
      };
    
      const clearDraft = () => {
        try {
          localStorage.removeItem('barangayOfficialDraft');
        } catch (error) {
          console.error('Failed to clear draft:', error);
        }
    };

    return {
        form,
        official,
        isLoadingOfficial,
        residents,
        isLoadingResidents,
        residentsError,
        profilePhotoPreview,
        isAlreadyRegisteredAsOfficialWarning,
        isSubmitting: createBarangayOfficial.isPending || updateBarangayOfficial.isPending,
        isCheckingAlreadyRegisteredAsOfficial: isChecking,
        handleSubmit: form.handleSubmit(handleSubmit),
        saveDraft,
        clearDraft,
    };
};