import React from 'react';
import { User, Phone, Mail, MapPin, EyeOff } from 'lucide-react';
import { type ViewComplaint } from '@/services/helpDesk/complaints/complaints.types';
import { FormField } from '@/components/_global/components/FormField';

interface ComplaintComplainantInformationSectionProps {
  complaint: ViewComplaint;
  mode: 'view' | 'edit';
}

export const ComplaintComplainantInformationSection: React.FC<ComplaintComplainantInformationSectionProps> = ({
  complaint,
  mode,
}) => {
  // Check if submission is anonymous
  const isAnonymous = !complaint.ticket.requester_name || 
                     complaint.ticket.requester_name.trim() === '' ||
                     complaint.ticket.requester_name === 'Anonymous';

  if (isAnonymous) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <User className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Complainant Information</h3>
        </div>
        <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
          <EyeOff className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="font-medium">Anonymous Complaint</p>
          <p className="text-sm">This complaint was submitted anonymously</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b">
        <User className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold">Complainant Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {mode === 'view' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <p className="text-sm text-gray-900">{complaint.ticket.requester_name}</p>
            </div>
          ) : (
            <FormField
              name="ticket.requester_name"
              label="Full Name"
              placeholder="Enter full name"
            />
          )}
        </div>

        <div>
          {mode === 'view' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <p className="text-sm text-gray-900 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {complaint.ticket.contact_number || 'Not provided'}
              </p>
            </div>
          ) : (
            <FormField
              name="ticket.contact_number"
              label="Contact Number"
              placeholder="Enter contact number"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {mode === 'view' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <p className="text-sm text-gray-900 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {complaint.ticket.email_address || 'Not provided'}
              </p>
            </div>
          ) : (
            <FormField
              type="email"
              name="ticket.email_address"
              label="Email Address"
              placeholder="Enter email address"
            />
          )}
        </div>

        <div>
          {mode === 'view' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complete Address
              </label>
              <p className="text-sm text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {complaint.ticket.complete_address || 'Not provided'}
              </p>
            </div>
          ) : (
            <FormField
              name="ticket.complete_address"
              label="Complete Address"
              placeholder="Enter complete address"
            />
          )}
        </div>
      </div>
    </div>
  );
};