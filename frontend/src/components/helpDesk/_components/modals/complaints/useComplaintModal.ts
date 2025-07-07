import { useEffect } from 'react';
import { useComplaint, useUpdateComplaint } from '@/services/helpDesk/complaints/useComplaints';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNotifications } from '@/components/_global/NotificationSystem';
import { EditComplaintSchema, type EditComplaint } from '@/services/helpDesk/complaints/complaints.types';
import { useTranslation } from 'react-i18next';

interface UseComplaintModalProps {
  complaintId: string | null;
  onClose: () => void;
  mode: "view" | "edit"
  setMode: (mode: "view" | "edit") => void;
}

export const useComplaintModal = ({ complaintId, onClose, mode, setMode }: UseComplaintModalProps) => {
  const { t } = useTranslation();
  const { showNotification } = useNotifications();
  
  // Fetch complaint data
  const { 
    data: complaint, 
    isLoading, 
    error,
    refetch 
  } = useComplaint(complaintId || '', !!complaintId);

  // Update complaint mutation
  const updateComplaintMutation = useUpdateComplaint();

  // Form setup
  const form = useForm<EditComplaint>({
    resolver: zodResolver(EditComplaintSchema),
    defaultValues: {
      ticket: {},
      complaint: {}
    }
  });

  const { handleSubmit, reset, formState: { errors, isDirty } } = form;

  // Reset form when complaint data changes
  useEffect(() => {
    if (complaint) {
      reset({
        ticket: {
          subject: complaint.ticket.subject,
          description: complaint.ticket.description,
          priority: complaint.ticket.priority,
          requester_name: complaint.ticket.requester_name,
          contact_number: complaint.ticket.contact_number,
          email_address: complaint.ticket.email_address,
          complete_address: complaint.ticket.complete_address,
          status: complaint.ticket.status,
        },
        complaint: {
          c_category: complaint.complaint.c_category,
          department: complaint.complaint.department,
          location: complaint.complaint.location
        }
      });
    }
  }, [complaint, reset]);

  const handleModeToggle = () => {
    setMode(mode === 'view' ? 'edit' : 'view');
  };

  const handleClose = () => {
    setMode('view');
    reset();
    onClose();
  };

  const handleSubmitForm = async (data: EditComplaint) => {
    if (!complaintId) return;

    try {
      await updateComplaintMutation.mutateAsync({
        id: complaintId,
        data
      });
      
      showNotification({
        type: 'success',
        title: t('helpDesk.complaintsForm.messages.updateSuccess'),
        duration: 3000,
        persistent: false,
      });
      
      setMode('view');
      refetch();
    } catch (error) {
      const errorMessage = (error as Error)?.message || t('helpDesk.complaintsForm.messages.updateError');
      showNotification({
        type: 'error',
        title: t('helpDesk.complaintsForm.messages.error'),
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
    complaint,
    isLoading,
    error,
    mode,
    form,
    errors,
    isDirty,
    isSubmitting: updateComplaintMutation.isPending,
    handleModeToggle,
    handleClose,
    handleSubmit: handleSubmit(handleSubmitForm),
    handleCancel,
  };
};