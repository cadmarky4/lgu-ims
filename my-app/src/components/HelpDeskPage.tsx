import React, { useState } from "react";
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
  Calendar as CalendarCheck,
} from "lucide-react";

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
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [showTicketDropdown, setShowTicketDropdown] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<TicketStatus | "all">("all");
  const [editingStatus, setEditingStatus] = useState<string | null>(null);

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
      icon: CalendarCheck,
      href: "/appointments",
      color: "text-blue-600",
    },
    {
      type: "Blotter",
      label: "File Blotter Report",
      description: "Document incidents and disputes",
      icon: Shield,
      href: "/blotter",
      color: "text-red-600",
    },
    {
      type: "Complaint",
      label: "Log Complaint",
      description: "Record service complaints",
      icon: AlertCircle,
      href: "/complaints",
      color: "text-orange-600",
    },
    {
      type: "Suggestion",
      label: "Submit Suggestion",
      description: "Process improvement ideas",
      icon: Lightbulb,
      href: "/suggestions",
      color: "text-purple-600",
    },
  ];

  const statusOptions: TicketStatus[] = [
    "Pending",
    "In Progress",
    "Resolved",
    "Closed",
  ];
  const statusFilterOptions: (TicketStatus | "all")[] = [
    "all",
    ...statusOptions,
  ];

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

    const matchesFilter: boolean =
      filterStatus === "all" || ticket.status === filterStatus;

    return matchesSearch && matchesTab && matchesFilter;
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

  // Event handlers with proper typing
  const toggleTicketDetails = (ticketId: string): void => {
    setSelectedTicket(selectedTicket === ticketId ? null : ticketId);
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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Help Desk Management
            </h1>
            <p className="text-gray-600 mt-1">
              Process and track resident service requests
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <button
                onClick={() => setShowTicketDropdown(!showTicketDropdown)}
                className="cursor-pointer bg-smblue-400 hover:bg-smblue-300 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
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
                        <a
                          key={option.type}
                          href={option.href}
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
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
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
              value={filterStatus}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterStatus(e.target.value as TicketStatus | "all")
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400 focus:border-transparent"
            >
              {statusFilterOptions.map((status: TicketStatus | "all") => (
                <option key={status} value={status}>
                  {status === "all" ? "All Status" : status}
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
              onClick={() => setActiveTab(tab.key)}
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
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
                        <div className="flex items-center gap-2 mb-2">
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
                      onClick={() => toggleTicketDetails(ticket.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit Ticket"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedTicket === ticket.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">
                          Department Information
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">Department:</span>
                            <span className="ml-2 font-medium">
                              {ticket.department}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Ticket ID:</span>
                            <span className="ml-2 font-medium">
                              {ticket.id}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">
                          Processing Information
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">
                              Current Handler:
                            </span>
                            <span className="ml-2 font-medium">
                              {ticket.assignedTo}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Last Updated:</span>
                            <span className="ml-2 font-medium">
                              {ticket.submittedDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpDeskPage;
