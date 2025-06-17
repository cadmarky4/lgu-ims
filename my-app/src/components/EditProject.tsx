import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Calendar, Plus, MessageCircle, Eye, EyeOff } from 'lucide-react';
import { FiChevronRight } from 'react-icons/fi';

interface BudgetItem {
  id: string;
  name: string;
  amount: string;
}

interface Milestone {
  description: string;
  date: string;
}

interface ActivityLog {
  id: number;
  activity: string;
  user: string;
  time: string;
  type: 'status' | 'budget' | 'milestone' | 'team' | 'progress' | 'system' | 'note';
  details: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

const EditProject: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  
  const [formData, setFormData] = useState({
    projectName: '',
    category: '',
    projectDescription: '',
    currentStatus: 'Pending',
    progressPercentage: 0,
    startDate: '',
    endDate: '',
    priorityLevel: 'Medium',
    totalBudget: '',
    fundingSource: '',
    amountSpent: '',
    projectManager: '',
    expectedBeneficiaries: '',
    teamDepartment: 'All Departments',
    keyStakeholders: '',
    projectLocation: '',
    successMetrics: '',
    potentialRisks: ''
  });

  const [budgetBreakdown, setBudgetBreakdown] = useState<BudgetItem[]>([
    { id: '1', name: 'Material & Supplies', amount: '200000' },
    { id: '2', name: 'Labor & Services', amount: '400000' },
    { id: '3', name: 'Equipment', amount: '250000' }
  ]);

  const [milestones, setMilestones] = useState<Milestone[]>([
    { description: 'Site survey and assessment', date: '2025-06-10' }
  ]);

  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>(['member-1']);
  
  // Activity Log State
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([
    {
      id: 1,
      activity: 'Project status updated to Active',
      user: 'Juan Dela Cruz',
      time: '2 hours ago',
      type: 'status',
      details: 'Changed from Pending to Active'
    },
    {
      id: 2,
      activity: 'Budget breakdown updated',
      user: 'Maria Santos',
      time: '1 day ago',
      type: 'budget',
      details: 'Material & Supplies budget increased by ₱50,000'
    },
    {
      id: 3,
      activity: 'New milestone added',
      user: 'Jose Reyes',
      time: '3 days ago',
      type: 'milestone',
      details: 'Added "Site survey and assessment" milestone'
    },
    {
      id: 4,
      activity: 'Team member assigned',
      user: 'Admin',
      time: '5 days ago',
      type: 'team',
      details: 'Juan D. Cruz assigned as project manager'
    },
    {
      id: 5,
      activity: 'Project created',
      user: 'System',
      time: '1 week ago',
      type: 'system',
      details: 'Initial project setup completed'
    }
  ]);

  const [newNote, setNewNote] = useState('');
  const [originalFormData, setOriginalFormData] = useState({});
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showRecentOnly, setShowRecentOnly] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const teamMembers = Array.from({ length: 8 }, (_, i) => ({
    id: `member-${i + 1}`,
    name: 'Juan D. Cruz',
    position: 'Barangay Captain',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  }));

  // Mock data based on projectId (in real app, this would come from API)
  useEffect(() => {
    if (projectId) {
      // Simulate fetching project data by ID
      const mockProjectData = {
        1: {
          projectName: 'Street Lighting Enhancement Program',
          category: 'Infrastructure',
          projectDescription: 'Installation of LED street lights across major roads and pathways to improve safety and security for residents during night time.',
          currentStatus: 'Active',
          progressPercentage: 65,
          startDate: '2025-03-01',
          endDate: '2025-08-30',
          priorityLevel: 'High',
          totalBudget: '450000',
          fundingSource: 'Barangay Fund',
          amountSpent: '292500',
          projectManager: 'Juan Dela Cruz',
          expectedBeneficiaries: '8000',
          teamDepartment: 'All Departments',
          keyStakeholders: 'Local residents, nearby businesses, barangay council, LGU engineering department, electrical contractors',
          projectLocation: 'Major roads and pathways throughout the barangay',
          successMetrics: 'Reduced crime incidents during nighttime, improved pedestrian safety, resident satisfaction survey scores above 85%',
          potentialRisks: 'Weather delays, equipment supply chain issues, budget overruns due to unexpected site complications'
        },
        2: {
          projectName: 'Community Health Center Renovation',
          category: 'Health',
          projectDescription: 'Comprehensive renovation of the barangay health center including new medical equipment and facility upgrades.',
          currentStatus: 'Pending',
          progressPercentage: 0,
          startDate: '2025-07-01',
          endDate: '2025-12-15',
          priorityLevel: 'High',
          totalBudget: '850000',
          fundingSource: 'Government Grant',
          amountSpent: '0',
          projectManager: 'Maria Santos',
          expectedBeneficiaries: '12000',
          teamDepartment: 'Health',
          keyStakeholders: 'Health workers, patients, DOH, barangay council, medical suppliers',
          projectLocation: 'Barangay Health Center Building',
          successMetrics: 'Improved patient capacity, reduced waiting times, modern medical equipment operational',
          potentialRisks: 'Permit delays, construction disruptions to ongoing health services, equipment delivery delays'
        }
      };

      const projectData = mockProjectData[projectId as keyof typeof mockProjectData];
      if (projectData) {
        setFormData(projectData);
        setOriginalFormData(projectData);
        setProjectTitle(projectData.projectName);
      }
    }
  }, [projectId]);

  // File upload handlers
  const handleFiles = (files: FileList) => {
    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const id = Date.now().toString() + i;
      
      newFiles.push({
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        file
      });
    }
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Function to add activity log entry
  const addActivityLog = (activity: string, type: ActivityLog['type'], details: string) => {
    const newActivity: ActivityLog = {
      id: Date.now(),
      activity,
      user: 'Current User',
      time: 'Just now',
      type,
      details
    };
    setActivityLog(prev => [newActivity, ...prev]);
  };

  // Function to add manual note
  const addNote = () => {
    if (newNote.trim()) {
      addActivityLog('Manual note added', 'note', newNote.trim());
      setNewNote('');
    }
  };

  // Track form changes and log them
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const oldValue = (formData as any)[name];
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Log the change if it's different from original
    if (oldValue !== value && (originalFormData as any)[name] !== value) {
      let activityType: ActivityLog['type'] = 'system';
      let activityDescription = '';
      
      switch (name) {
        case 'currentStatus':
          activityType = 'status';
          activityDescription = `Project status changed to ${value}`;
          break;
        case 'progressPercentage':
          activityType = 'progress';
          activityDescription = `Progress updated to ${value}%`;
          break;
        case 'totalBudget':
        case 'amountSpent':
          activityType = 'budget';
          activityDescription = `${name === 'totalBudget' ? 'Total budget' : 'Amount spent'} updated`;
          break;
        case 'projectManager':
          activityType = 'team';
          activityDescription = `Project manager changed to ${value}`;
          break;
        default:
          activityDescription = `${name.replace(/([A-Z])/g, ' $1').toLowerCase()} updated`;
      }
      
      if (oldValue && oldValue !== value) {
        addActivityLog(activityDescription, activityType, `Changed from "${oldValue}" to "${value}"`);
      }
    }
  };

  const handleBudgetChange = (id: string, field: 'name' | 'amount', value: string) => {
    const oldItem = budgetBreakdown.find(item => item.id === id);
    setBudgetBreakdown(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
    
    if (oldItem && oldItem[field] !== value) {
      addActivityLog(
        `Budget item ${field} updated`,
        'budget',
        `${oldItem.name || 'Budget item'} ${field} changed from "${oldItem[field]}" to "${value}"`
      );
    }
  };

  const addBudgetItem = () => {
    const newId = Date.now().toString();
    setBudgetBreakdown(prev => [
      ...prev,
      { id: newId, name: '', amount: '000' }
    ]);
    addActivityLog('New budget item added', 'budget', 'Added new budget breakdown item');
  };

  const removeBudgetItem = (id: string) => {
    const itemToRemove = budgetBreakdown.find(item => item.id === id);
    setBudgetBreakdown(prev => prev.filter(item => item.id !== id));
    if (itemToRemove) {
      addActivityLog('Budget item removed', 'budget', `Removed "${itemToRemove.name}" from budget breakdown`);
    }
  };

  const addMilestone = () => {
    setMilestones([...milestones, { description: '', date: '' }]);
    addActivityLog('New milestone added', 'milestone', 'Added new project milestone');
  };

  const updateMilestone = (index: number, field: string, value: string) => {
    const oldMilestone = milestones[index];
    const updated = milestones.map((milestone, i) => 
      i === index ? { ...milestone, [field]: value } : milestone
    );
    setMilestones(updated);
    
    if (oldMilestone && oldMilestone[field as keyof Milestone] !== value) {
      addActivityLog(
        `Milestone ${field} updated`,
        'milestone',
        `Milestone ${field} changed from "${oldMilestone[field as keyof Milestone]}" to "${value}"`
      );
    }
  };

  const removeMilestone = (index: number) => {
    const milestoneToRemove = milestones[index];
    setMilestones(prev => prev.filter((_, i) => i !== index));
    addActivityLog('Milestone removed', 'milestone', `Removed milestone: "${milestoneToRemove.description}"`);
  };

  const toggleTeamMember = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    const isCurrentlySelected = selectedTeamMembers.includes(memberId);
    
    setSelectedTeamMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
    
    if (member) {
      addActivityLog(
        `Team member ${isCurrentlySelected ? 'removed' : 'added'}`,
        'team',
        `${member.name} ${isCurrentlySelected ? 'removed from' : 'added to'} project team`
      );
    }
  };

  const selectAllVisible = () => {
    const allIds = teamMembers.map(member => member.id);
    setSelectedTeamMembers(allIds);
  };

  const clearAll = () => {
    setSelectedTeamMembers([]);
  };

  const calculateTotal = () => {
    return budgetBreakdown.reduce((total, item) => {
      const amount = parseInt(item.amount) || 0;
      return total + amount;
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Navigate back to projects after successful submission
    navigate('/projects');
  };

  const handleCancel = () => {
    navigate('/projects');
  };

  const displayedActivities = showRecentOnly ? activityLog.slice(0, 3) : activityLog;

  return (
    <>
      <style>{`
        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .animate-slide-in-up { 
          opacity: 0;
          animation: slideInUp 0.4s ease-out forwards; 
        }
        .animate-fade-in { 
          opacity: 0;
          animation: fadeIn 0.3s ease-out forwards; 
        }
        .animate-slide-in-right { 
          opacity: 0;
          animation: slideInRight 0.3s ease-out forwards; 
        }
      `}</style>

      <div className="p-6 bg-gray-50 min-h-screen animate-fade-in">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4 animate-slide-in-up">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-smblue-400 hover:text-smblue-600 transition-colors duration-200 cursor-pointer"
          >
            Dashboard
          </button>
          <FiChevronRight className="w-4 h-4 text-gray-400" />
          <button 
            onClick={() => navigate('/projects')}
            className="text-smblue-400 hover:text-smblue-600 transition-colors duration-200 cursor-pointer"
          >
            Projects and Programs
          </button>
          <FiChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">Edit Project</span>
          {projectTitle && (
            <>
              <FiChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 truncate max-w-xs">{projectTitle}</span>
            </>
          )}
        </div>

        {/* Header */}
        <div className="mb-6 animate-slide-in-up">
          <h1 className="text-2xl font-bold text-gray-900 pl-0">Update Project Information</h1>
          {projectTitle && (
            <p className="text-gray-600 mt-1">Editing: {projectTitle}</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-slide-in-up" style={{animationDelay: '0.1s'}}>
          {/* Improved Activity Log Section */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-smblue-400" />
                <span>Project Activity</span>
                <span className="bg-smblue-100 text-smblue-800 text-xs px-2 py-1 rounded-full">
                  {activityLog.length} updates
                </span>
              </h2>
              <button
                type="button"
                onClick={() => setShowActivityLog(!showActivityLog)}
                className="flex items-center space-x-2 text-smblue-400 hover:text-smblue-400/90 text-sm font-medium transition-colors duration-200 cursor-pointer"
              >
                {showActivityLog ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showActivityLog ? 'Hide Details' : 'View Details'}</span>
              </button>
            </div>

            {/* Quick Add Note - Always Visible */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Note
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note about project changes or updates..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400 focus:border-smblue-400 transition-all duration-200"
                  onKeyPress={(e) => e.key === 'Enter' && addNote()}
                />
                <button
                  type="button"
                  onClick={addNote}
                  disabled={!newNote.trim()}
                  className="px-4 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-400/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Recent Activity Preview - Always Visible */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Recent Activity</h3>
                <button
                  type="button"
                  onClick={() => setShowRecentOnly(!showRecentOnly)}
                  className="text-xs text-smblue-400 hover:text-smblue-400/90 transition-colors duration-200 cursor-pointer"
                >
                  {showRecentOnly ? `Show All (${activityLog.length})` : 'Show Recent Only'}
                </button>
              </div>
              
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {displayedActivities.map((log) => (
                  <div key={log.id} className="flex items-center space-x-3 p-2 bg-white rounded border border-gray-100">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      log.type === 'status' ? 'bg-green-500' :
                      log.type === 'budget' ? 'bg-blue-500' :
                      log.type === 'milestone' ? 'bg-purple-500' :
                      log.type === 'team' ? 'bg-orange-500' :
                      log.type === 'progress' ? 'bg-indigo-500' :
                      log.type === 'note' ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">{log.activity}</p>
                      <p className="text-xs text-gray-500">{log.time} by {log.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Activity Log - Expandable */}
            {showActivityLog && (
              <div className="mt-4 pt-4 border-t border-gray-200 animate-slide-in-up">
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <div className="space-y-3">
                    {activityLog.map((log, index) => (
                      <div
                        key={log.id}
                        className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200"
                      >
                        <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                          log.type === 'status' ? 'bg-green-500' :
                          log.type === 'budget' ? 'bg-blue-500' :
                          log.type === 'milestone' ? 'bg-purple-500' :
                          log.type === 'team' ? 'bg-orange-500' :
                          log.type === 'progress' ? 'bg-indigo-500' :
                          log.type === 'note' ? 'bg-yellow-500' :
                          'bg-gray-400'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-gray-900">{log.activity}</p>
                            <span className="text-xs text-gray-500">{log.time}</span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{log.details}</p>
                          <p className="text-xs text-gray-500">by {log.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Content - Rest of the form sections would go here */}
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-6 pb-2 border-b border-gray-200">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="animate-slide-in-right" style={{animationDelay: '0.2s'}}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  placeholder="Enter project name here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400 focus:border-smblue-400 transition-all duration-200"
                  required
                />
              </div>

              <div className="animate-slide-in-right" style={{animationDelay: '0.3s'}}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400 focus:border-smblue-400 transition-all duration-200 cursor-pointer"
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

              <div className="md:col-span-2 animate-slide-in-right" style={{animationDelay: '0.4s'}}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed description of the project: objectives, scope and expected outcomes"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400 focus:border-smblue-400 transition-all duration-200"
                  required
                />
              </div>
            </div>
          </div>

          {/* Project Status and Progress */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-6 pb-2 border-b border-gray-200">Project Status and Progress</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="animate-slide-in-right" style={{animationDelay: '1.2s'}}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Status
                </label>
                <select
                  name="currentStatus"
                  value={formData.currentStatus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400 focus:border-smblue-400 transition-all duration-200 cursor-pointer"
                  title="Select status"
                >
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <div className="animate-slide-in-right" style={{animationDelay: '1.3s'}}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progress Percentage
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    name="progressPercentage"
                    value={formData.progressPercentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400 focus:border-smblue-400 transition-all duration-200"
                  />
                  <span>%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Current project completion (0-100)</p>
              </div>
            </div>

            {/* Visual Progress */}
            <div className="animate-slide-in-right" style={{animationDelay: '1.4s'}}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visual Progress
              </label>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div 
                  className="bg-smblue-400 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${formData.progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>0% Complete</span>
                <span>{formData.progressPercentage}% Complete</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 animate-slide-in-right" style={{animationDelay: '3.9s'}}>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-smblue-400 hover:bg-smblue-400/90 text-white rounded-lg transition-all duration-200 hover:shadow-md cursor-pointer"
            >
              Update Project
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProject;