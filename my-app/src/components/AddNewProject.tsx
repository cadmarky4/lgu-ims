import React, { useState } from 'react';
import { FiUpload, FiX, FiPlus, FiAlertCircle } from 'react-icons/fi';
import { apiService } from '../services/api';

interface AddNewProjectProps {
  onClose: () => void;
  onSave?: (projectData: any) => void;
}

interface FieldError {
  [key: string]: string;
}

const AddNewProject: React.FC<AddNewProjectProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    // Basic Information
    projectName: '',
    title: '',
    description: '',
    objectives: '',
    expected_outcomes: '',
    
    // Project Classification
    category: '',
    type: 'REGULAR',
    priority: 'NORMAL',
    
    // Timeline
    start_date: '',
    end_date: '',
    actual_start_date: '',
    actual_end_date: '',
    
    // Budget Information
    total_budget: '',
    allocated_budget: '',
    utilized_budget: '0',
    remaining_budget: '',
    funding_source: 'BARANGAY_FUNDS',
    funding_agency: '',
    
    // Location and Beneficiaries
    location: '',
    target_puroks: [] as string[],
    target_beneficiaries: '',
    actual_beneficiaries: '',
    beneficiary_criteria: '',
    
    // Project Management
    project_manager_id: '',
    approving_official_id: '',
    approved_date: '',
    
    // Status and Progress
    status: 'PLANNING',
    progress_percentage: '0',
    
    // Documentation
    attachments: [] as string[],
    remarks: '',
    completion_report: '',
    lessons_learned: [] as string[],
    
    // Monitoring and Evaluation
    last_monitoring_date: '',
    monitoring_remarks: '',
    quality_rating: '',
    evaluation_notes: '',
    
    // Legacy fields for compatibility
    projectDescription: '',
    startDate: '',
    endDate: '',
    priorityLevel: 'NORMAL',
    totalBudget: '',
    fundingSource: 'BARANGAY_FUNDS',
    budgetBreakdown: {
      materialSupplies: '000',
      laborServices: '000',
      equipment: '000'
    },
    projectManager: '',
    expectedBeneficiaries: '',
    teamDepartment: 'All Departments',
    keyStakeholders: '',
    projectLocation: '',
    successMetrics: '',
    potentialRisks: ''
  });

  const [milestones, setMilestones] = useState([
    { description: '', date: '' }
  ]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const teamMembers = Array.from({ length: 8 }, (_, i) => ({
    id: `member-${i + 1}`,
    name: 'Juan D. Cruz',
    position: 'Barangay Captain',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  }));
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const handleMultiSelectChange = (field: string, value: string) => {
    setFormData(prev => {
      const currentValue = prev[field as keyof typeof prev] as string[];
      return {
        ...prev,
        [field]: currentValue.includes(value) 
          ? currentValue.filter((item: string) => item !== value)
          : [...currentValue, value]
      };
    });
  };

  const handleArrayInputChange = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const handleBudgetChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      budgetBreakdown: {
        ...prev.budgetBreakdown,
        [field]: value
      }
    }));
  };

  const addMilestone = () => {
    setMilestones([...milestones, { description: '', date: '' }]);
  };

  const updateMilestone = (index: number, field: string, value: string) => {
    const updated = milestones.map((milestone, i) => 
      i === index ? { ...milestone, [field]: value } : milestone
    );
    setMilestones(updated);
  };

  const toggleTeamMember = (memberId: string) => {
    setSelectedTeamMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const selectAllVisible = () => {
    const allIds = teamMembers.map(member => member.id);
    setSelectedTeamMembers(allIds);
  };

  const clearAll = () => {
    setSelectedTeamMembers([]);
  };

  const calculateTotal = () => {
    const material = parseInt(formData.budgetBreakdown.materialSupplies) || 0;
    const labor = parseInt(formData.budgetBreakdown.laborServices) || 0;
    const equipment = parseInt(formData.budgetBreakdown.equipment) || 0;
    return material + labor + equipment;
  };  const validateProject = () => {
    const errors: FieldError = {};
    
    // Basic Information
    if (!formData.projectName.trim() && !formData.title.trim()) {
      errors.projectName = 'Project name is required';
    }
    
    if (!formData.category) {
      errors.category = 'Project category is required';
    }
    
    if (!formData.projectDescription.trim() && !formData.description.trim()) {
      errors.projectDescription = 'Project description is required';
    }
    
    // Timeline validation
    if (!formData.startDate && !formData.start_date) {
      errors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate && !formData.end_date) {
      errors.endDate = 'End date is required';
    }
    
    // Check if end date is after start date
    const startDate = formData.start_date || formData.startDate;
    const endDate = formData.end_date || formData.endDate;
    
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      errors.endDate = 'End date must be after start date';
    }
    
    // Budget validation
    const totalBudget = parseFloat(formData.total_budget || formData.totalBudget);
    const allocatedBudget = parseFloat(formData.allocated_budget);
    
    if (!totalBudget || totalBudget <= 0) {
      errors.totalBudget = 'Please provide a valid total budget';
    }
    
    if (allocatedBudget && totalBudget && allocatedBudget > totalBudget) {
      errors.allocated_budget = 'Allocated budget cannot exceed total budget';
    }
    
    // Location validation
    if (!formData.location && !formData.projectLocation) {
      errors.location = 'Project location is required';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) {
      return;
    }
    
    if (!validateProject()) {
      return;
    }
    
    setIsSubmitting(true);
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      // Transform form data to match backend API structure with comprehensive field mapping
      const projectData = {
        // Basic Information
        title: formData.title || formData.projectName,
        description: formData.description || formData.projectDescription,
        objectives: formData.objectives || null,
        expected_outcomes: formData.expected_outcomes || null,
        
        // Project Classification
        category: formData.category,
        type: formData.type || 'REGULAR',
        priority: formData.priority || formData.priorityLevel?.toUpperCase() || 'NORMAL',
        
        // Timeline
        start_date: formData.start_date || formData.startDate,
        end_date: formData.end_date || formData.endDate,
        actual_start_date: formData.actual_start_date || null,
        actual_end_date: formData.actual_end_date || null,
        
        // Budget Information
        total_budget: parseFloat(formData.total_budget || formData.totalBudget) || 0,
        allocated_budget: parseFloat(formData.allocated_budget) || parseFloat(formData.total_budget || formData.totalBudget) || 0,
        utilized_budget: parseFloat(formData.utilized_budget) || 0,
        funding_source: formData.funding_source || 'BARANGAY_FUNDS',
        funding_agency: formData.funding_agency || null,
        
        // Location and Beneficiaries
        location: formData.location || formData.projectLocation,
        target_puroks: formData.target_puroks.length > 0 ? formData.target_puroks : null,
        target_beneficiaries: parseInt(formData.target_beneficiaries || formData.expectedBeneficiaries) || null,
        actual_beneficiaries: parseInt(formData.actual_beneficiaries) || null,
        beneficiary_criteria: formData.beneficiary_criteria || null,
        
        // Project Management
        project_manager_id: formData.project_manager_id || null,
        approving_official_id: formData.approving_official_id || null,
        approved_date: formData.approved_date || null,
        
        // Status and Progress
        status: formData.status || 'PLANNING',
        progress_percentage: parseInt(formData.progress_percentage) || 0,
        
        // Documentation
        attachments: formData.attachments.length > 0 ? formData.attachments : null,
        remarks: formData.remarks || null,
        completion_report: formData.completion_report || null,
        lessons_learned: formData.lessons_learned.length > 0 ? formData.lessons_learned : null,
        
        // Monitoring and Evaluation
        last_monitoring_date: formData.last_monitoring_date || null,
        monitoring_remarks: formData.monitoring_remarks || null,
        quality_rating: parseInt(formData.quality_rating) || null,
        evaluation_notes: formData.evaluation_notes || null,
        
        // Legacy/compatibility fields
        name: formData.title || formData.projectName,
        budget_breakdown: {
          materials: parseFloat(formData.budgetBreakdown.materialSupplies) || 0,
          labor: parseFloat(formData.budgetBreakdown.laborServices) || 0,
          equipment: parseFloat(formData.budgetBreakdown.equipment) || 0
        },
        milestones: milestones.filter(m => m.description && m.date).map(m => ({
          description: m.description,
          target_date: m.date
        })),
        team_members: selectedTeamMembers,
        success_metrics: formData.successMetrics,
        potential_risks: formData.potentialRisks,
        key_stakeholders: formData.keyStakeholders
      };

      const response = await apiService.createProject(projectData);
      
      // Call the optional onSave callback if provided
      if (onSave) {
        onSave(response || projectData);
      }
      
      onClose();
    } catch (err: any) {
      console.error('Error creating project:', err);
      
      if (err.errors && Object.keys(err.errors).length) {
        // Handle validation errors from Laravel backend
        setFieldErrors(err.errors);
        const firstError = Object.values(err.errors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else {
        setError(err.message || 'Failed to create project. Please try again.');
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-4">Add New Project</h1>
      </div>      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}        {/* Basic Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6 pb-2 border-b border-gray-200">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                placeholder="Enter project name here..."
                className={`w-full px-3 py-2 border ${fieldErrors.projectName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {fieldErrors.projectName && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="w-3 h-3 mr-1" /> {fieldErrors.projectName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${fieldErrors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                title="Select category"
                required
              >
                <option value="">Select Category</option>
                <option value="INFRASTRUCTURE">Infrastructure</option>
                <option value="HEALTH">Health</option>
                <option value="EDUCATION">Education</option>
                <option value="SOCIAL_SERVICES">Social Services</option>
                <option value="ENVIRONMENT">Environment</option>
                <option value="LIVELIHOOD">Livelihood</option>
                <option value="DISASTER_PREPAREDNESS">Disaster Preparedness</option>
                <option value="YOUTH_DEVELOPMENT">Youth Development</option>
                <option value="SENIOR_CITIZEN_PROGRAM">Senior Citizen Program</option>
                <option value="WOMEN_EMPOWERMENT">Women Empowerment</option>
                <option value="OTHER">Other</option>
              </select>
              {fieldErrors.category && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="w-3 h-3 mr-1" /> {fieldErrors.category}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description *
              </label>
              <textarea
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleInputChange}
                placeholder="Provide a detailed description of the project"
                rows={4}
                className={`w-full px-3 py-2 border ${fieldErrors.projectDescription ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {fieldErrors.projectDescription && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="w-3 h-3 mr-1" /> {fieldErrors.projectDescription}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objectives
              </label>
              <textarea
                name="objectives"
                value={formData.objectives}
                onChange={handleInputChange}
                placeholder="List the main objectives of this project"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Outcomes
              </label>
              <textarea
                name="expected_outcomes"
                value={formData.expected_outcomes}
                onChange={handleInputChange}
                placeholder="Describe the expected outcomes and impact of this project"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"              />
            </div>
          </div>
        </div>

        {/* Project Classification */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6 pb-2 border-b border-gray-200">Project Classification</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="REGULAR">Regular</option>
                <option value="SPECIAL">Special</option>
                <option value="EMERGENCY">Emergency</option>
                <option value="FUNDED">Externally Funded</option>
                <option value="DONATION">Donation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="LOW">Low</option>
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="PLANNING">Planning</option>
                <option value="APPROVED">Approved</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
        </div>        {/* Timeline and Priority */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6 pb-2 border-b border-gray-200">Timeline</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${fieldErrors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {fieldErrors.startDate && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="w-3 h-3 mr-1" /> {fieldErrors.startDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${fieldErrors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {fieldErrors.endDate && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="w-3 h-3 mr-1" /> {fieldErrors.endDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actual Start Date
              </label>
              <input
                type="date"
                name="actual_start_date"
                value={formData.actual_start_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actual End Date
              </label>
              <input
                type="date"
                name="actual_end_date"
                value={formData.actual_end_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Define Project Milestones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Define Project Milestones *
            </label>
            <p className="text-sm text-gray-500 mb-4">Add key milestones and target dates for your projects</p>
            
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Milestone description"
                    value={milestone.description}
                    onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="date"
                    placeholder="dd/mm/yyyy"
                    value={milestone.date}
                    onChange={(e) => updateMilestone(index, 'date', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}
              
              <button
                type="button"
                onClick={addMilestone}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add New Item</span>
              </button>
            </div>
          </div>
        </div>        {/* Budget Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6 pb-2 border-b border-gray-200">Budget Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Budget *
              </label>
              <input
                type="number"
                name="total_budget"
                value={formData.total_budget}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 border ${fieldErrors.totalBudget ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {fieldErrors.totalBudget && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="w-3 h-3 mr-1" /> {fieldErrors.totalBudget}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allocated Budget *
              </label>
              <input
                type="number"
                name="allocated_budget"
                value={formData.allocated_budget}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 border ${fieldErrors.allocated_budget ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {fieldErrors.allocated_budget && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="w-3 h-3 mr-1" /> {fieldErrors.allocated_budget}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Utilized Budget
              </label>
              <input
                type="number"
                name="utilized_budget"
                value={formData.utilized_budget}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Funding Source *
              </label>
              <select
                name="funding_source"
                value={formData.funding_source}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="BARANGAY_FUNDS">Barangay Funds</option>
                <option value="MUNICIPAL_FUNDS">Municipal Funds</option>
                <option value="PROVINCIAL_FUNDS">Provincial Funds</option>
                <option value="NATIONAL_GOVERNMENT">National Government</option>
                <option value="NGO">NGO</option>
                <option value="PRIVATE_SECTOR">Private Sector</option>
                <option value="DONATIONS">Donations</option>
                <option value="MIXED_FUNDING">Mixed Funding</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Funding Agency
              </label>
              <input
                type="text"
                name="funding_agency"
                value={formData.funding_agency}
                onChange={handleInputChange}
                placeholder="Name of the funding agency or organization"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"              />
            </div>
          </div>

          {/* Budget Breakdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Budget Breakdown
            </label>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Material & Supplies</span>
                <div className="flex items-center space-x-2">
                  <span>₱</span>
                  <input
                    type="text"
                    value={formData.budgetBreakdown.materialSupplies}
                    onChange={(e) => handleBudgetChange('materialSupplies', e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleBudgetChange('materialSupplies', '000')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Labor & Services</span>
                <div className="flex items-center space-x-2">
                  <span>₱</span>
                  <input
                    type="text"
                    value={formData.budgetBreakdown.laborServices}
                    onChange={(e) => handleBudgetChange('laborServices', e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleBudgetChange('laborServices', '000')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Equipment</span>
                <div className="flex items-center space-x-2">
                  <span>₱</span>
                  <input
                    type="text"
                    value={formData.budgetBreakdown.equipment}
                    onChange={(e) => handleBudgetChange('equipment', e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleBudgetChange('equipment', '000')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add New Item</span>
              </button>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total Estimated</span>
                  <span className="font-semibold text-lg">₱ {calculateTotal()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location and Beneficiaries */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6 pb-2 border-b border-gray-200">Location and Beneficiaries</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Specify location within the barangay"
                className={`w-full px-3 py-2 border ${fieldErrors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {fieldErrors.location && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="w-3 h-3 mr-1" /> {fieldErrors.location}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Puroks
              </label>
              <input
                type="text"
                name="target_puroks_input"
                value={formData.target_puroks.join(', ')}
                onChange={(e) => handleArrayInputChange('target_puroks', e.target.value)}
                placeholder="Enter purok names separated by commas (e.g., Purok 1, Purok 2)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Beneficiaries
              </label>
              <input
                type="number"
                name="target_beneficiaries"
                value={formData.target_beneficiaries}
                onChange={handleInputChange}
                placeholder="Number of residents who will benefit"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actual Beneficiaries
              </label>
              <input
                type="number"
                name="actual_beneficiaries"
                value={formData.actual_beneficiaries}
                onChange={handleInputChange}
                placeholder="Actual number of beneficiaries"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beneficiary Criteria
              </label>
              <textarea
                name="beneficiary_criteria"
                value={formData.beneficiary_criteria}
                onChange={handleInputChange}
                placeholder="Describe the criteria for selecting beneficiaries"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Project Management */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6 pb-2 border-b border-gray-200">Project Management</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Manager
              </label>
              <select
                name="project_manager_id"
                value={formData.project_manager_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Project Manager</option>
                <option value="1">Juan D. Cruz</option>
                <option value="2">Maria Santos</option>
                <option value="3">Jose Reyes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Approving Official
              </label>
              <select
                name="approving_official_id"
                value={formData.approving_official_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Approving Official</option>
                <option value="1">Barangay Captain</option>
                <option value="2">Municipal Mayor</option>
                <option value="3">Department Head</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Approved Date
              </label>
              <input
                type="date"
                name="approved_date"
                value={formData.approved_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress Percentage
              </label>
              <input
                type="number"
                name="progress_percentage"
                value={formData.progress_percentage}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Project Team & Stakeholders */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6 pb-2 border-b border-gray-200">Project Team & Stakeholders</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Manager *
              </label>
              <select
                name="projectManager"
                value={formData.projectManager}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title="Select project manager"
                required
              >
                <option value="">Select Project Manager</option>
                <option value="Juan D. Cruz">Juan D. Cruz</option>
                <option value="Maria Santos">Maria Santos</option>
                <option value="Jose Reyes">Jose Reyes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Beneficiaries
              </label>
              <input
                type="text"
                name="expectedBeneficiaries"
                value={formData.expectedBeneficiaries}
                onChange={handleInputChange}
                placeholder="Number of residents who will benefit"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Team Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Team Members
            </label>
            
            <div className="flex items-center justify-between mb-4">
              <select
                name="teamDepartment"
                value={formData.teamDepartment}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title="Select department"
              >
                <option value="All Departments">All Departments</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
              
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={selectAllVisible}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Select All Visible
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => toggleTeamMember(member.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedTeamMembers.includes(member.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-sm text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.position}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Stakeholders */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Stakeholders
            </label>
            <p className="text-sm text-gray-500 mb-4">List key stakeholders, partners, or beneficiaries involved in this project</p>
            <textarea
              name="keyStakeholders"
              value={formData.keyStakeholders}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6 pb-2 border-b border-gray-200">Additional Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Documents
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                    Choose Files
                  </button> 
                  <span> to browse or drag and drop</span>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Location
              </label>
              <input
                type="text"
                name="projectLocation"
                value={formData.projectLocation}
                onChange={handleInputChange}
                placeholder="Specify location within the barangay"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Success Metrics
              </label>
              <textarea
                name="successMetrics"
                value={formData.successMetrics}
                onChange={handleInputChange}
                placeholder="How will you measure the success of this project? (e.g. completion rate, beneficiary satisfaction, measurable outcomes)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Potential Risks & Challenges */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6 pb-2 border-b border-gray-200">Potential Risks & Challenges</h2>
          
          <textarea
            name="potentialRisks"
            value={formData.potentialRisks}
            onChange={handleInputChange}
            placeholder="Identify potential risks, challenges, or obstacles and mitigation strategies"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />        </div>

        {/* Documentation and Monitoring */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6 pb-2 border-b border-gray-200">Documentation and Monitoring</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Monitoring Date
              </label>
              <input
                type="date"
                name="last_monitoring_date"
                value={formData.last_monitoring_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quality Rating (1-5)
              </label>
              <select
                name="quality_rating"
                value={formData.quality_rating}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Rating</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                placeholder="Additional notes or comments about the project"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monitoring Remarks
              </label>
              <textarea
                name="monitoring_remarks"
                value={formData.monitoring_remarks}
                onChange={handleInputChange}
                placeholder="Comments and observations from monitoring activities"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evaluation Notes
              </label>
              <textarea
                name="evaluation_notes"
                value={formData.evaluation_notes}
                onChange={handleInputChange}
                placeholder="Detailed evaluation findings and recommendations"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Completion Report
              </label>
              <textarea
                name="completion_report"
                value={formData.completion_report}
                onChange={handleInputChange}
                placeholder="Final completion report (to be filled upon project completion)"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || isSubmitting}
          >
            {loading || isSubmitting ? 'Creating Project...' : 'Submit Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewProject; 