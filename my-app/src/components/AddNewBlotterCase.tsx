import React, { useState } from 'react';
import { FiCalendar, FiMapPin, FiUser, FiFileText } from 'react-icons/fi';
import { apiService } from '../services/api';

interface AddNewBlotterCaseProps {
  onClose: () => void;
  onSave?: (caseData: any) => void;
}

const AddNewBlotterCase: React.FC<AddNewBlotterCaseProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    incident_type: '',
    complainant_name: '',
    complainant_contact: '',
    respondent_name: '',
    respondent_contact: '',
    incident_date: '',
    incident_location: '',
    description: '',
    priority: 'medium',
    reported_by: '',
    assigned_officer: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.incident_type) {
      setError('Incident type is required');
      return;
    }
    
    if (!formData.complainant_name.trim()) {
      setError('Complainant name is required');
      return;
    }
    
    if (!formData.complainant_contact.trim()) {
      setError('Complainant contact number is required');
      return;
    }
    
    if (!formData.respondent_name.trim()) {
      setError('Respondent name is required');
      return;
    }
    
    if (!formData.incident_date) {
      setError('Incident date is required');
      return;
    }
    
    if (!formData.incident_location.trim()) {
      setError('Incident location is required');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Incident description is required');
      return;
    }
    
    if (!formData.reported_by.trim()) {
      setError('Reporter name is required');
      return;
    }
    
    // Validate phone format if provided
    if (formData.complainant_contact && !/^09\d{9}$/.test(formData.complainant_contact)) {
      setError('Complainant contact number should be in the format 09XXXXXXXXX');
      return;
    }
    
    if (formData.respondent_contact && !/^09\d{9}$/.test(formData.respondent_contact)) {
      setError('Respondent contact number should be in the format 09XXXXXXXXX');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Transform form data to match backend API structure
      const caseData = {
        incident_type: formData.incident_type,
        complainant_name: formData.complainant_name.trim(),
        complainant_contact: formData.complainant_contact.trim(),
        respondent_name: formData.respondent_name.trim(),
        respondent_contact: formData.respondent_contact.trim() || null,
        incident_date: formData.incident_date,
        incident_location: formData.incident_location.trim(),
        description: formData.description.trim(),
        status: 'pending', // Initial status for new cases
        priority: formData.priority,
        reported_by: formData.reported_by.trim(),
        assigned_officer: formData.assigned_officer.trim() || null
      };

      const response = await apiService.createBlotterCase(caseData);
      
      // Call the optional onSave callback if provided
      if (onSave) {
        onSave(response.data);
      }
      
      onClose();
    } catch (err) {
      console.error('Error creating blotter case:', err);
      setError('Failed to create blotter case. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-4">File New Blotter Case</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Incident Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Incident Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Incident Type *
              </label>
              <select
                name="incident_type"
                value={formData.incident_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Incident Type</option>
                <option value="physical_injury">Physical Injury</option>
                <option value="theft">Theft</option>
                <option value="property_damage">Property Damage</option>
                <option value="trespassing">Trespassing</option>
                <option value="noise_complaint">Noise Complaint</option>
                <option value="disturbance">Disturbance of Peace</option>
                <option value="harassment">Harassment</option>
                <option value="domestic_violence">Domestic Violence</option>
                <option value="land_dispute">Land Dispute</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Incident Date *
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="incident_date"
                  value={formData.incident_date}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Incident Location *
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="incident_location"
                  value={formData.incident_location}
                  onChange={handleInputChange}
                  placeholder="Enter location where incident occurred"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Incident Description *
            </label>
            <div className="relative">
              <FiFileText className="absolute left-3 top-3 text-gray-400" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                placeholder="Provide a detailed description of the incident"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Complainant Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Complainant Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complainant Name *
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="complainant_name"
                  value={formData.complainant_name}
                  onChange={handleInputChange}
                  placeholder="Enter complainant's full name"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number *
              </label>
              <input
                type="text"
                name="complainant_contact"
                value={formData.complainant_contact}
                onChange={handleInputChange}
                placeholder="e.g. 09123456789"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reported By *
              </label>
              <input
                type="text"
                name="reported_by"
                value={formData.reported_by}
                onChange={handleInputChange}
                placeholder="e.g. John Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Respondent Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Respondent Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Respondent Name *
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="respondent_name"
                  value={formData.respondent_name}
                  onChange={handleInputChange}
                  placeholder="Enter respondent's full name"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number (if known)
              </label>
              <input
                type="text"
                name="respondent_contact"
                value={formData.respondent_contact}
                onChange={handleInputChange}
                placeholder="e.g. 09123456789"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Officer (if applicable)
              </label>
              <input
                type="text"
                name="assigned_officer"
                value={formData.assigned_officer}
                onChange={handleInputChange}
                placeholder="e.g. PO Juan Cruz"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Filing...' : 'File Blotter Case'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewBlotterCase;
