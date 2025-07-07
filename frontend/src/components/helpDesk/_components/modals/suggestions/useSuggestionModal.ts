// ============================================================================
// hooks/suggestions/useSuggestionModal.ts - Modal state management hook
// ============================================================================

import { useEffect } from 'react';
import { useSuggestion, useUpdateSuggestion } from '@/services/helpDesk/suggestions/useSuggestions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNotifications } from '@/components/_global/NotificationSystem';
import { EditSuggestionSchema, type EditSuggestion } from '@/services/helpDesk/suggestions/suggestions.types';
import { useTranslation } from 'react-i18next';

interface UseSuggestionModalProps {
  suggestionId: string | null;
  onClose: () => void;
  mode: "view" | "edit",
  setMode: (mode: "view" | "edit") => void;
}

export const useSuggestionModal = ({ suggestionId, onClose, mode, setMode }: UseSuggestionModalProps) => {
  const { t } = useTranslation();
  const { showNotification } = useNotifications();
  
  // Fetch suggestion data
  const { 
    data: suggestion, 
    isLoading, 
    error,
    refetch 
  } = useSuggestion(suggestionId || '', !!suggestionId);

  // Update suggestion mutation
  const updateSuggestionMutation = useUpdateSuggestion();

  // Form setup
  const form = useForm<EditSuggestion>({
    resolver: zodResolver(EditSuggestionSchema),
    defaultValues: {
      ticket: {},
      suggestion: {}
    }
  });

  const { handleSubmit, reset, formState: { errors, isDirty } } = form;

  // Reset form when suggestion data changes
  useEffect(() => {
    if (suggestion) {
      reset({
        ticket: {
          subject: suggestion.ticket.subject,
          description: suggestion.ticket.description,
          priority: suggestion.ticket.priority,
          requester_name: suggestion.ticket.requester_name,
          contact_number: suggestion.ticket.contact_number,
          email_address: suggestion.ticket.email_address,
          complete_address: suggestion.ticket.complete_address,
          status: suggestion.ticket.status,
        },
        suggestion: {
          s_category: suggestion.suggestion.s_category,
          expected_benefits: suggestion.suggestion.expected_benefits,
          implementation_ideas: suggestion.suggestion.implementation_ideas,
          resources_needed: suggestion.suggestion.resources_needed
        }
      });
    }
  }, [suggestion, reset]);

  const handleModeToggle = () => {
    setMode(mode === 'view' ? 'edit' : 'view');
  };

  const handleClose = () => {
    setMode('view');
    reset();
    onClose();
  };

  const handleSubmitForm = async (data: EditSuggestion) => {
    console.log("HEREEE");
    if (!suggestionId) return;

    try {
      await updateSuggestionMutation.mutateAsync({
        id: suggestionId,
        data
      });
      
      showNotification({
        type: 'success',
        title: t('helpDesk.suggestionsForm.messages.updateSuccess'),
        duration: 3000,
        persistent: false,
      });
      
      setMode('view');
      refetch();
    } catch (error) {
      const errorMessage = (error as Error)?.message || t('helpDesk.suggestionsForm.messages.updateError');
      showNotification({
        type: 'error',
        title: t('helpDesk.suggestionsForm.messages.error'),
        message: errorMessage,
        duration: 3000,
        persistent: false,
      });
      console.error('Update error:', error);
    }
  };

  const handleCancel = () => {
    reset();
    setMode('view');
  };

  return {
    suggestion,
    isLoading,
    error,
    mode,
    form,
    errors,
    isDirty,
    isSubmitting: updateSuggestionMutation.isPending,
    handleModeToggle,
    handleClose,
    handleSubmit: handleSubmit(handleSubmitForm),
    handleCancel,
  };
};