import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Minus,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit,
  Calendar,
  FileText,
  Download,
  ChevronRight,
  Shield,
  Lightbulb,
  Calendar as CalendarIcon,
  X,
  Save,
  Phone,
  Mail,
} from "lucide-react";
import Breadcrumb from "../global/Breadcrumb";

// Import API services
import { AppointmentsService } from "../../services/appointments.service";
import { ComplaintsService } from "../../services/complaints.service";
import { SuggestionsService } from "../../services/suggestions.service";
import { BlotterService } from "../../services/blotter.service";
import type { Appointment, AppointmentStatus } from "../../services/appointment.types";
import type { Complaint, ComplaintStatus } from "../../services/complaint.types";
import type { Suggestion, SuggestionStatus } from "../../services/suggestion.types";
import type { BlotterCase, BlotterStatus } from "../../services/blotter.types";

// Type definitions
interface Ticket {
  id: string;
  title: string;
  description: string;
  type: TicketType;
  priority: TicketPriority;
  status: TicketStatus;
  submittedBy: string;
  submittedDate: string;
  assignedTo: string;
  department: string;
  referenceNumber: string;
  // Type-specific fields
  appointmentDate?: string;
  appointmentTime?: string;
  purpose?: string;
  incidentType?: string;
  incidentDate?: string;
  incidentLocation?: string;
  respondentName?: string;
  complaintCategory?: string;
  urgency?: string;
  suggestionCategory?: string;
  expectedBenefits?: string;
  contactEmail?: string;
  contactPhone?: string;
}

interface TicketStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

interface TabItem {
  key: TabKey;
  label: string;
  count: number;
}

interface StatCard {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

interface TicketTypeOption {
  type: TicketType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
}

// Union types for better type safety
type TicketType = "Appointment" | "Blotter" | "Complaint" | "Suggestion";
type TicketPriority = "High" | "Medium" | "Low";
type TicketStatus = "Pending" | "In Progress" | "Resolved" | "Closed";
type TabKey = "all" | "pending" | "inprogress" | "resolved" | "closed";

// Color mapping types
type PriorityColorMap = Record<TicketPriority, string>;
type StatusColorMap = Record<TicketStatus, string>;
type TypeColorMap = Record<TicketType, string>;

const HelpDeskPage: React.FC = () => {
  // State with proper typing
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showTicketDropdown, setShowTicketDropdown] = useState<boolean>(false);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalTicket, setModalTicket] = useState<Ticket | null>(null);  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editedTicket, setEditedTicket] = useState<Ticket | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Animation trigger on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // API state management
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // API service instances
  const appointmentsService = new AppointmentsService();
  const complaintsService = new ComplaintsService();
  const suggestionsService = new SuggestionsService();
  const blotterService = new BlotterService();

  // Load all help desk data on component mount
  useEffect(() => {
    loadAllTickets();
  }, []);

  const loadAllTickets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch data from all help desk modules in parallel
      const [appointments, complaints, suggestions, blotterCases] = await Promise.all([
        appointmentsService.getAppointments().catch(() => []),
        complaintsService.getComplaints().catch(() => []),
        suggestionsService.getSuggestions().catch(() => []),
        blotterService.getBlotterCases().catch(() => []),
      ]);

      // Transform API data to unified Ticket format
      const transformedTickets: Ticket[] = [
        ...transformAppointments(appointments || []),
        ...transformComplaints(complaints || []),
        ...transformSuggestions(suggestions || []),
        ...transformBlotterCases(blotterCases || []),
      ];

      setTickets(transformedTickets);
    } catch (err) {
      console.error('Failed to load help desk data:', err);
      setError('Failed to load help desk data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Transform functions to convert API data to Ticket format
  const transformAppointments = (appointments: Appointment[]): Ticket[] => {
    return appointments.map(apt => ({
      id: `APT-${apt.id}`,
      title: `Appointment: ${apt.purpose}`,
      description: apt.additional_notes || 'No additional notes provided',
      type: "Appointment" as TicketType,
      priority: mapAppointmentPriority(apt.priority),
      status: mapAppointmentStatus(apt.status),
      submittedBy: apt.full_name,
      submittedDate: apt.created_at.split('T')[0],
      assignedTo: apt.assigned_official_name || apt.department,
      department: apt.department,
      referenceNumber: apt.appointment_number,
      appointmentDate: apt.preferred_date,
      appointmentTime: apt.preferred_time,
      purpose: apt.purpose,
      contactEmail: apt.email,
      contactPhone: apt.phone,
    }));
  };

  const transformComplaints = (complaints: Complaint[]): Ticket[] => {
    return complaints.map(cmp => ({
      id: `CMP-${cmp.id}`,
      title: `Complaint: ${cmp.subject}`,
      description: cmp.description,
      type: "Complaint" as TicketType,
      priority: mapComplaintPriority(cmp.urgency),
      status: mapComplaintStatus(cmp.status),
      submittedBy: cmp.full_name || 'Anonymous',
      submittedDate: cmp.created_at.split('T')[0],
      assignedTo: cmp.assigned_official?.name || cmp.department || 'Unassigned',
      department: cmp.department || 'General',
      referenceNumber: cmp.complaint_number,
      complaintCategory: cmp.complaint_category,
      urgency: cmp.urgency,
      contactEmail: cmp.email,
      contactPhone: cmp.phone,
    }));
  };

  const transformSuggestions = (suggestions: Suggestion[]): Ticket[] => {
    return suggestions.map(sug => ({
      id: `SUG-${sug.id}`,
      title: `Suggestion: ${sug.title}`,
      description: sug.description,
      type: "Suggestion" as TicketType,
      priority: mapSuggestionPriority(sug.priority),
      status: mapSuggestionStatus(sug.status),
      submittedBy: sug.name,
      submittedDate: sug.created_at.split('T')[0],
      assignedTo: sug.reviewer?.name || 'Planning Committee',
      department: 'Community Development',
      referenceNumber: sug.suggestion_number,
      suggestionCategory: sug.category,
      expectedBenefits: sug.benefits,
      contactEmail: sug.email,
      contactPhone: sug.phone,
    }));
  };

  const transformBlotterCases = (blotterCases: BlotterCase[]): Ticket[] => {
    return blotterCases.map(blotter => ({
      id: `BLT-${blotter.id}`,
      title: `Blotter: ${blotter.incident_type}`,
      description: blotter.incident_description,
      type: "Blotter" as TicketType,
      priority: mapBlotterPriority(blotter.priority),
      status: mapBlotterStatus(blotter.status),
      submittedBy: blotter.complainant_name,
      submittedDate: blotter.created_at.split('T')[0],
      assignedTo: blotter.investigator_details?.name || 'Peace and Order Committee',
      department: 'Peace and Order',
      referenceNumber: blotter.case_number,
      incidentType: blotter.incident_type,
      incidentDate: blotter.incident_date,
      incidentLocation: blotter.incident_location,
      respondentName: blotter.respondent_name,
      contactEmail: blotter.complainant_email,
      contactPhone: blotter.complainant_contact,
    }));
  };

  // Helper functions to map API enums to UI types
  const mapAppointmentPriority = (priority: string): TicketPriority => {
    switch (priority) {
      case 'URGENT': case 'HIGH': return 'High';
      case 'NORMAL': case 'MEDIUM': return 'Medium';
      case 'LOW': return 'Low';
      default: return 'Medium';
    }
  };

  const mapAppointmentStatus = (status: string): TicketStatus => {
    switch (status) {
      case 'CONFIRMED': return 'In Progress';
      case 'COMPLETED': return 'Resolved';
      case 'CANCELLED': return 'Closed';
      case 'PENDING': default: return 'Pending';
    }
  };

  const mapComplaintPriority = (urgency: string): TicketPriority => {
    switch (urgency?.toUpperCase()) {
      case 'HIGH': case 'URGENT': return 'High';
      case 'MEDIUM': case 'NORMAL': return 'Medium';
      case 'LOW': return 'Low';
      default: return 'Medium';
    }
  };

  const mapComplaintStatus = (status: string): TicketStatus => {
    switch (status) {
      case 'INVESTIGATING': case 'ASSIGNED': return 'In Progress';
      case 'RESOLVED': return 'Resolved';
      case 'CLOSED': return 'Closed';
      case 'PENDING': default: return 'Pending';
    }
  };

  const mapSuggestionPriority = (priority: string): TicketPriority => {
    switch (priority?.toUpperCase()) {
      case 'HIGH': return 'High';
      case 'MEDIUM': return 'Medium';
      case 'LOW': return 'Low';
      default: return 'Low';
    }
  };

  const mapSuggestionStatus = (status: string): TicketStatus => {
    switch (status) {
      case 'UNDER_REVIEW': case 'APPROVED': return 'In Progress';
      case 'IMPLEMENTED': return 'Resolved';
      case 'REJECTED': return 'Closed';
      case 'SUBMITTED': default: return 'Pending';
    }
  };

  const mapBlotterPriority = (priority: string): TicketPriority => {
    switch (priority) {
      case 'URGENT': case 'HIGH': return 'High';
      case 'NORMAL': return 'Medium';
      case 'LOW': return 'Low';
      default: return 'Medium';
    }
  };

  const mapBlotterStatus = (status: string): TicketStatus => {
    switch (status) {
      case 'UNDER_INVESTIGATION': case 'MEDIATION': return 'In Progress';
      case 'SETTLED': return 'Resolved';
      case 'CLOSED': case 'DISMISSED': return 'Closed';
      case 'FILED': default: return 'Pending';
    }
  };

  // Statistics calculation with proper typing
  const stats: TicketStats = {
    total: tickets.length,
    pending: tickets.filter((t: Ticket) => t.status === "Pending").length,
    inProgress: tickets.filter((t: Ticket) => t.status === "In Progress")
      .length,
    resolved: tickets.filter((t: Ticket) => t.status === "Resolved").length,
    closed: tickets.filter((t: Ticket) => t.status === "Closed").length,
  };

  // Color mapping objects with proper typing
  const priorityColors: PriorityColorMap = {
    High: "bg-red-100 text-red-800 border-red-200",
    Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Low: "bg-green-100 text-green-800 border-green-200",
  };

  const statusColors: StatusColorMap = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
    Resolved: "bg-green-100 text-green-800 border-green-200",
    Closed: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const typeColors: TypeColorMap = {
    Appointment: "bg-blue-100 text-blue-800 border-blue-200",
    Blotter: "bg-red-100 text-red-800 border-red-200",
    Complaint: "bg-orange-100 text-orange-800 border-orange-200",
    Suggestion: "bg-purple-100 text-purple-800 border-purple-200",
  };

  // Ticket type options configuration
  const ticketTypeOptions: TicketTypeOption[] = [
    {
      type: "Appointment",
      label: "Process Appointment",
      description: "Schedule resident appointments",
      icon: CalendarIcon,
      href: "/schedule-appointment",
      color: "text-blue-600",
    },
    {
      type: "Blotter",
      label: "File Blotter Report",
      description: "Document incidents and disputes",
      icon: Shield,
      href: "/file-blotter",
      color: "text-red-600",
    },
    {
      type: "Complaint",
      label: "Log Complaint",
      description: "Record service complaints",
      icon: AlertCircle,
      href: "/file-complaint",
      color: "text-orange-600",
    },
    {
      type: "Suggestion",
      label: "Submit Suggestion",
      description: "Process improvement ideas",
      icon: Lightbulb,
      href: "/share-suggestions",
      color: "text-purple-600",
    },
  ];

  const statusOptions: TicketStatus[] = [
    "Pending",
    "In Progress",
    "Resolved",
    "Closed",
  ];
  const priorityOptions: TicketPriority[] = ["High", "Medium", "Low"];

  // Filter and search tickets with proper typing
  const filteredTickets: Ticket[] = tickets.filter((ticket: Ticket) => {
    const matchesSearch: boolean =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab: boolean =
      activeTab === "all" ||
      (activeTab === "pending" && ticket.status === "Pending") ||
      (activeTab === "inprogress" && ticket.status === "In Progress") ||
      (activeTab === "resolved" && ticket.status === "Resolved") ||
      (activeTab === "closed" && ticket.status === "Closed");

    return matchesSearch && matchesTab;
  });

  // Helper functions with proper typing
  const getPriorityColor = (priority: TicketPriority): string => {
    return (
      priorityColors[priority] || "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getStatusColor = (status: TicketStatus): string => {
    return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getTypeColor = (type: TicketType): string => {
    return typeColors[type] || "bg-gray-100 text-gray-800 border-gray-200";
  };
  const handleStatusChange = async (
    ticketId: string,
    newStatus: TicketStatus
  ): Promise<void> => {
    try {      // Extract type and ID from ticket ID format (e.g., "APT-123" -> type: "Appointment", id: 123)
      const [typePrefix, id] = ticketId.split('-');
      const numericId = parseInt(id);
      
      // Update via appropriate API service with proper type casting
      switch (typePrefix) {
        case 'APT':
          await appointmentsService.updateAppointment(numericId, { status: mapUIStatusToAPI(newStatus, typePrefix) as AppointmentStatus });
          break;
        case 'CMP':
          await complaintsService.updateComplaint(numericId, { status: mapUIStatusToAPI(newStatus, typePrefix) as ComplaintStatus });
          break;
        case 'SUG':
          await suggestionsService.updateSuggestion(numericId, { status: mapUIStatusToAPI(newStatus, typePrefix) as SuggestionStatus });
          break;
        case 'BLT':
          await blotterService.updateBlotterCase(numericId, { status: mapUIStatusToAPI(newStatus, typePrefix) as BlotterStatus });
          break;
        default:
          throw new Error(`Unknown ticket type: ${typePrefix}`);
      }

      // Update local state
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
        )
      );
      setEditingStatus(null);
    } catch (error) {
      console.error('Failed to update ticket status:', error);
      setError('Failed to update ticket status. Please try again.');
    }
  };

  const openModal = (ticket: Ticket, editMode: boolean = false): void => {
    setModalTicket(ticket);
    setEditedTicket({ ...ticket });
    setIsEditMode(editMode);
    setShowModal(true);
  };

  const closeModal = (): void => {
    setShowModal(false);
    setModalTicket(null);
    setEditedTicket(null);
    setIsEditMode(false);
  };

  const handleEditChange = (field: keyof Ticket, value: any): void => {
    if (editedTicket) {
      setEditedTicket({ ...editedTicket, [field]: value });
    }
  };
  const saveChanges = async (): Promise<void> => {
    if (!editedTicket) return;

    try {
      // Extract type and ID from ticket ID format
      const [typePrefix, id] = editedTicket.id.split('-');
      const numericId = parseInt(id);

      // Prepare update data based on ticket type
      const updateData: any = {
        status: mapUIStatusToAPI(editedTicket.status, typePrefix),
        priority: mapUIPriorityToAPI(editedTicket.priority, typePrefix),
      };

      // Add common fields that can be updated
      if (editedTicket.description !== modalTicket?.description) {
        updateData.description = editedTicket.description;
      }

      // Add type-specific fields that can be updated
      switch (typePrefix) {
        case 'APT':
          if (editedTicket.purpose !== modalTicket?.purpose) {
            updateData.purpose = editedTicket.purpose;
          }
          if (editedTicket.appointmentDate !== modalTicket?.appointmentDate) {
            updateData.preferred_date = editedTicket.appointmentDate;
          }
          if (editedTicket.appointmentTime !== modalTicket?.appointmentTime) {
            updateData.preferred_time = editedTicket.appointmentTime;
          }
          await appointmentsService.updateAppointment(numericId, updateData);
          break;
        case 'CMP':
          if (editedTicket.complaintCategory !== modalTicket?.complaintCategory) {
            updateData.complaint_category = editedTicket.complaintCategory;
          }
          if (editedTicket.urgency !== modalTicket?.urgency) {
            updateData.urgency = editedTicket.urgency;
          }
          await complaintsService.updateComplaint(numericId, updateData);
          break;
        case 'SUG':
          if (editedTicket.suggestionCategory !== modalTicket?.suggestionCategory) {
            updateData.category = editedTicket.suggestionCategory;
          }
          if (editedTicket.expectedBenefits !== modalTicket?.expectedBenefits) {
            updateData.benefits = editedTicket.expectedBenefits;
          }
          await suggestionsService.updateSuggestion(numericId, updateData);
          break;
        case 'BLT':
          if (editedTicket.respondentName !== modalTicket?.respondentName) {
            updateData.respondent_name = editedTicket.respondentName;
          }
          await blotterService.updateBlotterCase(numericId, updateData);
          break;
        default:
          throw new Error(`Unknown ticket type: ${typePrefix}`);
      }

      // Update local state
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === editedTicket.id ? editedTicket : ticket
        )
      );
      
      closeModal();
    } catch (error) {
      console.error('Failed to save ticket changes:', error);
      setError('Failed to save changes. Please try again.');
    }
  };

  // Modal content based on ticket type
  const renderModalContent = () => {
    if (!modalTicket || !editedTicket) return null;

    const commonFields = (
      <>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            {isEditMode ? (
              <select
                value={editedTicket.status}
                onChange={(e) =>
                  handleEditChange("status", e.target.value as TicketStatus)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            ) : (
              <span
                className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                  modalTicket.status
                )}`}
              >
                {modalTicket.status}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            {isEditMode ? (
              <select
                value={editedTicket.priority}
                onChange={(e) =>
                  handleEditChange("priority", e.target.value as TicketPriority)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400"
              >
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            ) : (
              <span
                className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(
                  modalTicket.priority
                )}`}
              >
                {modalTicket.priority}
              </span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assigned To
          </label>
          {isEditMode ? (
            <input
              type="text"
              value={editedTicket.assignedTo}
              onChange={(e) => handleEditChange("assignedTo", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400"
            />
          ) : (
            <p className="text-gray-900">{modalTicket.assignedTo}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          {isEditMode ? (
            <textarea
              value={editedTicket.description}
              onChange={(e) => handleEditChange("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400"
            />
          ) : (
            <p className="text-gray-900">{modalTicket.description}</p>
          )}
        </div>
      </>
    );

    switch (modalTicket.type) {
      case "Appointment":
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Date
                </label>
                {isEditMode ? (
                  <input
                    type="date"
                    value={editedTicket.appointmentDate || ""}
                    onChange={(e) =>
                      handleEditChange("appointmentDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400"
                  />
                ) : (
                  <p className="text-gray-900">
                    {modalTicket.appointmentDate || "Not set"}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Time
                </label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={editedTicket.appointmentTime || ""}
                    onChange={(e) =>
                      handleEditChange("appointmentTime", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400"
                  />
                ) : (
                  <p className="text-gray-900">
                    {modalTicket.appointmentTime || "Not set"}
                  </p>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose
              </label>
              {isEditMode ? (
                <textarea
                  value={editedTicket.purpose || ""}
                  onChange={(e) => handleEditChange("purpose", e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400"
                />
              ) : (
                <p className="text-gray-900">
                  {modalTicket.purpose || "Not specified"}
                </p>
              )}
            </div>
          </>
        );

      case "Blotter":
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Incident Type
                </label>
                <p className="text-gray-900">
                  {modalTicket.incidentType || "Not specified"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Incident Date
                </label>
                <p className="text-gray-900">
                  {modalTicket.incidentDate || "Not specified"}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Incident Location
              </label>
              <p className="text-gray-900">
                {modalTicket.incidentLocation || "Not specified"}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Respondent Name
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  value={editedTicket.respondentName || ""}
                  onChange={(e) =>
                    handleEditChange("respondentName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400"
                />
              ) : (
                <p className="text-gray-900">
                  {modalTicket.respondentName || "Not specified"}
                </p>
              )}
            </div>
          </>
        );

      case "Complaint":
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <p className="text-gray-900">
                  {modalTicket.complaintCategory || "Not specified"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urgency
                </label>
                <p className="text-gray-900">
                  {modalTicket.urgency || "Not specified"}
                </p>
              </div>
            </div>
          </>
        );

      case "Suggestion":
        return (
          <>
            {commonFields}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <p className="text-gray-900">
                {modalTicket.suggestionCategory || "Not specified"}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Benefits
              </label>
              {isEditMode ? (
                <textarea
                  value={editedTicket.expectedBenefits || ""}
                  onChange={(e) =>
                    handleEditChange("expectedBenefits", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400"
                />
              ) : (
                <p className="text-gray-900">
                  {modalTicket.expectedBenefits || "Not specified"}
                </p>
              )}
            </div>
          </>
        );

      default:
        return commonFields;
    }
  };

  // Tab configuration with proper typing
  const tabs: TabItem[] = [
    { key: "all", label: "All Tickets", count: stats.total },
    { key: "pending", label: "Pending", count: stats.pending },
    { key: "inprogress", label: "In Progress", count: stats.inProgress },
    { key: "resolved", label: "Resolved", count: stats.resolved },
    { key: "closed", label: "Closed", count: stats.closed },
  ];

  // Statistics cards configuration with proper typing
  const statCards: StatCard[] = [
    {
      title: "Total Tickets",
      value: stats.total,
      icon: FileText,
      color: "text-smblue-400",
      bgColor: "bg-smblue-100",
    },
    {
      title: "Pending Review",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: AlertCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Resolved",
      value: stats.resolved,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];
  // Helper function to map UI status back to API status
  const mapUIStatusToAPI = (uiStatus: TicketStatus, typePrefix: string): AppointmentStatus | ComplaintStatus | SuggestionStatus | BlotterStatus => {
    switch (typePrefix) {
      case 'APT': // Appointments
        switch (uiStatus) {
          case 'Pending': return 'PENDING' as AppointmentStatus;
          case 'In Progress': return 'CONFIRMED' as AppointmentStatus;
          case 'Resolved': return 'COMPLETED' as AppointmentStatus;
          case 'Closed': return 'CANCELLED' as AppointmentStatus;
          default: return 'PENDING' as AppointmentStatus;
        }
      case 'CMP': // Complaints
        switch (uiStatus) {
          case 'Pending': return 'PENDING' as ComplaintStatus;
          case 'In Progress': return 'INVESTIGATING' as ComplaintStatus;
          case 'Resolved': return 'RESOLVED' as ComplaintStatus;
          case 'Closed': return 'CLOSED' as ComplaintStatus;
          default: return 'PENDING' as ComplaintStatus;
        }
      case 'SUG': // Suggestions
        switch (uiStatus) {
          case 'Pending': return 'SUBMITTED' as SuggestionStatus;
          case 'In Progress': return 'UNDER_REVIEW' as SuggestionStatus;
          case 'Resolved': return 'IMPLEMENTED' as SuggestionStatus;
          case 'Closed': return 'REJECTED' as SuggestionStatus;
          default: return 'SUBMITTED' as SuggestionStatus;
        }
      case 'BLT': // Blotter Cases
        switch (uiStatus) {
          case 'Pending': return 'FILED' as BlotterStatus;
          case 'In Progress': return 'UNDER_INVESTIGATION' as BlotterStatus;
          case 'Resolved': return 'SETTLED' as BlotterStatus;
          case 'Closed': return 'CLOSED' as BlotterStatus;
          default: return 'FILED' as BlotterStatus;
        }
      default:
        return 'PENDING' as any;
    }
  };

  // Helper function to map UI priority back to API priority
  const mapUIPriorityToAPI = (uiPriority: TicketPriority, typePrefix: string): string => {
    switch (typePrefix) {
      case 'APT': // Appointments
        switch (uiPriority) {
          case 'High': return 'HIGH';
          case 'Medium': return 'NORMAL';
          case 'Low': return 'LOW';
          default: return 'NORMAL';
        }
      case 'CMP': // Complaints
        switch (uiPriority) {
          case 'High': return 'HIGH';
          case 'Medium': return 'MEDIUM';
          case 'Low': return 'LOW';
          default: return 'MEDIUM';
        }
      case 'SUG': // Suggestions
        switch (uiPriority) {
          case 'High': return 'HIGH';
          case 'Medium': return 'MEDIUM';
          case 'Low': return 'LOW';
          default: return 'LOW';
        }
      case 'BLT': // Blotter Cases
        switch (uiPriority) {
          case 'High': return 'URGENT';
          case 'Medium': return 'NORMAL';
          case 'Low': return 'LOW';
          default: return 'NORMAL';
        }
      default:
        return uiPriority.toUpperCase();
    }
  };

  return (
    <div className="@container/main min-h-screen bg-gray-50 p-6">
      {/* Breadcrumb */}
      <Breadcrumb isLoaded={isLoaded} />

      {/* Header Section */}
      <div className={`mb-8 transition-all duration-700 ease-out`}>
        <div className="flex flex-col @3xl/main:flex-row @3xl/main:items-center @3xl/main:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Help Desk Management
            </h1>
            <p className="text-gray-600 mt-1">
              Process and track resident service requests
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 @3xl/main:flex-initial relative">
              <button
                onClick={() => setShowTicketDropdown(!showTicketDropdown)}
                className="w-full cursor-pointer bg-smblue-400 hover:bg-smblue-300 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                {showTicketDropdown ? (
                  <Minus className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Create New Ticket
              </button>

              {showTicketDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-2">
                    {ticketTypeOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <Link
                          key={option.type}
                          to={option.href}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          onClick={() => setShowTicketDropdown(false)}
                        >
                          <div
                            className={`p-2 bg-gray-100 rounded-lg ${option.color}`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {option.label}
                            </p>
                            <p className="text-sm text-gray-500">
                              {option.description}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 mt-3" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button className="cursor-pointer flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ transitionDelay: '100ms' }}>
        {statCards.map((card: StatCard, index: number) => {
          const IconComponent = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {card.title}
                  </p>
                  <p className={`text-3xl font-bold mt-1 ${card.color}`}>
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 ${card.bgColor} rounded-lg`}>
                  <IconComponent className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8 transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ transitionDelay: '200ms' }}>
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by title, submitter, or reference number..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as TabKey)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400 focus:border-transparent"
            >
              {tabs.map((status: TabItem) => (
                <option key={status.key} value={status.key}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 border-b border-gray-200">
          {tabs.map((tab: TabItem) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                console.log(filteredTickets);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-smblue-400 text-smblue-400 bg-smblue-50"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ transitionDelay: '300ms' }}>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Active Tickets ({filteredTickets.length})
          </h3>
        </div>        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-smblue-400 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading help desk tickets...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadAllTickets}
                className="px-4 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No tickets found matching your criteria.
              </p>
            </div>
          ) : (
            filteredTickets.map((ticket: Ticket) => (
              <div
                key={ticket.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {ticket.title}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {ticket.referenceNumber}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          {ticket.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(
                              ticket.type
                            )}`}
                          >
                            {ticket.type}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                              ticket.priority
                            )}`}
                          >
                            {ticket.priority} Priority
                          </span>
                          {editingStatus === ticket.id ? (
                            <select
                              value={ticket.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  ticket.id,
                                  e.target.value as TicketStatus
                                )
                              }
                              onBlur={() => setEditingStatus(null)}
                              className="px-2 py-1 text-xs font-medium rounded-full border focus:ring-2 focus:ring-smblue-400"
                              autoFocus
                            >
                              {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full border cursor-pointer ${getStatusColor(
                                ticket.status
                              )}`}
                              onClick={() => setEditingStatus(ticket.id)}
                              title="Click to change status"
                            >
                              {ticket.status}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Submitted by:</span>
                            {ticket.submittedBy}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {ticket.submittedDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Assigned to:</span>
                            {ticket.assignedTo}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal(ticket, false)}
                      className="cursor-pointer p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openModal(ticket, true)}
                      className="cursor-pointer p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit Ticket"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && modalTicket && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {modalTicket.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {modalTicket.referenceNumber}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full border ${getTypeColor(
                      modalTicket.type
                    )}`}
                  >
                    {modalTicket.type}
                  </span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">
                    Submitted by {modalTicket.submittedBy}
                  </span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">
                    {modalTicket.submittedDate}
                  </span>
                </div>
              </div>

              {renderModalContent()}

              {/* Contact Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">
                  Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {modalTicket.contactEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {modalTicket.contactEmail}
                      </span>
                    </div>
                  )}
                  {modalTicket.contactPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {modalTicket.contactPhone}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
                {isEditMode ? (
                  <>
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveChanges}
                      className="px-4 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => setIsEditMode(true)}
                      className="px-4 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300 transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Ticket
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpDeskPage;