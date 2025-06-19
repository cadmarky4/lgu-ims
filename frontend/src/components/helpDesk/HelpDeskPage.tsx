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
  const [modalTicket, setModalTicket] = useState<Ticket | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editedTicket, setEditedTicket] = useState<Ticket | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Animation trigger on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Mock data with proper typing
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "TKT-001",
      title: "Business Permit Appointment Request",
      description:
        "Resident requested appointment for business permit renewal. Scheduled for next week.",
      type: "Appointment",
      priority: "Medium",
      status: "Pending",
      submittedBy: "Maria Santos",
      submittedDate: "2025-06-14",
      assignedTo: "Business Permits Office",
      department: "Business Permits and Licensing",
      referenceNumber: "APT-2025-0614-001",
      appointmentDate: "2025-06-21",
      appointmentTime: "10:00 AM",
      purpose: "Business permit renewal for retail store",
      contactEmail: "maria.santos@email.com",
      contactPhone: "+63 912 345 6789",
    },
    {
      id: "TKT-002",
      title: "Noise Disturbance Report",
      description:
        "Blotter report filed regarding noise complaint in Barangay Zone 3. Requires mediation.",
      type: "Blotter",
      priority: "High",
      status: "In Progress",
      submittedBy: "Juan Dela Cruz",
      submittedDate: "2025-06-13",
      assignedTo: "Barangay Peace and Order Committee",
      department: "Peace and Order",
      referenceNumber: "BLT-2025-0613-001",
      incidentType: "Noise Complaint",
      incidentDate: "2025-06-13",
      incidentLocation: "123 Main St, Barangay Zone 3",
      respondentName: "Pedro Gonzales",
      contactEmail: "juan.delacruz@email.com",
      contactPhone: "+63 917 123 4567",
    },
    {
      id: "TKT-003",
      title: "Street Light Malfunction",
      description:
        "Complaint about non-functioning street lights on Main Street. Affects public safety.",
      type: "Complaint",
      priority: "High",
      status: "Resolved",
      submittedBy: "Ana Rodriguez",
      submittedDate: "2025-06-12",
      assignedTo: "Engineering Department",
      department: "Infrastructure",
      referenceNumber: "CMP-2025-0612-001",
      complaintCategory: "Infrastructure",
      urgency: "High",
      contactEmail: "ana.rodriguez@email.com",
      contactPhone: "+63 905 987 6543",
    },
    {
      id: "TKT-004",
      title: "Community Garden Project Proposal",
      description:
        "Suggestion for establishing a community garden in the vacant lot near the health center.",
      type: "Suggestion",
      priority: "Low",
      status: "Pending",
      submittedBy: "Community Leaders",
      submittedDate: "2025-06-11",
      assignedTo: "Planning Committee",
      department: "Community Development",
      referenceNumber: "SUG-2025-0611-001",
      suggestionCategory: "Environmental Protection",
      expectedBenefits:
        "Promotes community engagement, provides fresh produce, beautifies the area",
      contactEmail: "community.leaders@email.com",
      contactPhone: "+63 920 111 2222",
    },
  ]);

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

  const handleStatusChange = (
    ticketId: string,
    newStatus: TicketStatus
  ): void => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
    setEditingStatus(null);
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

  const saveChanges = (): void => {
    if (editedTicket) {
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === editedTicket.id ? editedTicket : ticket
        )
      );
      closeModal();
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

  return (
    <div className="@container/main min-h-screen bg-gray-50 p-6">
      {/* Breadcrumb */}
      <Breadcrumb isLoaded={isLoaded} />

      {/* Header Section */}
      <div className={`mb-8 transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
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
        </div>

        <div className="divide-y divide-gray-200">
          {filteredTickets.length === 0 ? (
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