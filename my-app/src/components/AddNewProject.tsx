import React, { useState } from 'react';
import { FiUpload, FiX, FiCalendar, FiPlus } from 'react-icons/fi';

interface AddNewProjectProps {
  onClose: () => void;
  onSave: (projectData: any) => void;
}

const AddNewProject: React.FC<AddNewProjectProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    category: '',
    projectDescription: '',
    startDate: '',
    endDate: '',
    priorityLevel: 'Medium',
    totalBudget: '',
    fundingSource: '',
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = {
      ...formData,
      milestones,
      selectedTeamMembers,
      totalEstimated: calculateTotal()
    };
    onSave(projectData);
    onClose();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 pl-0">Add New Project</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {/* Basic Information */}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title="Select category"
                required
              >
                <option value="">Select Category</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Community">Community</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Environment">Environment</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description *
              </label>
              <textarea
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleInputChange}
                placeholder="Provide a detailed description of the project: objectives, scope and expected outcomes"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Timeline and Priority */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6 pb-2 border-b border-gray-200">Timeline and Priority</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                placeholder="dd/mm/yyyy"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                placeholder="dd/mm/yyyy"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level *
              </label>
              <div className="flex space-x-2">
                {['High', 'Medium', 'Low'].map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priorityLevel: priority }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.priorityLevel === priority
                        ? priority === 'High' ? 'bg-red-100 text-red-800' : 
                          priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
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
        </div>

        {/* Budget Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6 pb-2 border-b border-gray-200">Budget Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Budget *
              </label>
              <input
                type="text"
                name="totalBudget"
                value={formData.totalBudget}
                onChange={handleInputChange}
                placeholder="₱ 000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Funding Source *
              </label>
              <select
                name="fundingSource"
                value={formData.fundingSource}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title="Select funding source"
                required
              >
                <option value="">Select Funding Source</option>
                <option value="Barangay Fund">Barangay Fund</option>
                <option value="Government Grant">Government Grant</option>
                <option value="Private Donation">Private Donation</option>
                <option value="Partnership">Partnership</option>
              </select>
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
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Submit Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewProject; 