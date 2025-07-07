import React from 'react';
import { FileText } from 'lucide-react';
import { type ViewSuggestion } from '@/services/helpDesk/suggestions/suggestions.types';
import { FormField } from '@/components/_global/components/FormField';
import { priorities, statusOptions } from '@/services/helpDesk/helpDesk.type';

interface SuggestionTicketInformationSectionProps {
  suggestion: ViewSuggestion;
  mode: 'view' | 'edit';
}

export const SuggestionTicketInformationSection: React.FC<SuggestionTicketInformationSectionProps> = ({
  suggestion,
  mode,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b">
        <FileText className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold">Ticket Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {mode === 'view' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <p className="text-sm text-gray-900">{suggestion.ticket.subject}</p>
            </div>
          ) : (
            <FormField
              name="ticket.subject"
              label="Subject"
              placeholder="Enter subject"
              required
            />
          )}
        </div>

        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            {mode === 'view' ? (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(suggestion.ticket.priority)}`}>
                {suggestion.ticket.priority}
              </span>
            ) : (
              <FormField
                type="select"
                name="ticket.priority"
                label=""
                options={priorities.map(priority => ({
                  value: priority,
                  label: priority
                }))}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            {mode === 'view' ? (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(suggestion.ticket.status)}`}>
                {suggestion.ticket.status}
              </span>
            ) : (
              <FormField
                type="select"
                name="ticket.status"
                label=""
                options={statusOptions.map(status => ({
                  value: status,
                  label: status
                }))}
              />
            )}
          </div>
        </div>
      </div>

      <div>
        {mode === 'view' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Suggestion Description
            </label>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">
              {suggestion.ticket.description}
            </p>
          </div>
        ) : (
          <FormField
            type="textarea"
            name="ticket.description"
            label="Suggestion Description"
            placeholder="Enter suggestion description"
            required
            rows={3}
          />
        )}
      </div>
    </div>
  );
};