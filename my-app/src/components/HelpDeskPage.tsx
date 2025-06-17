import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit,
  Calendar,
  FileText,
  Phone,
  Mail,
  MessageSquare,
  ChevronDown,
  Download,
  BarChart3,
} from "lucide-react";

// Type definitions
interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  submittedBy: string;
  submittedDate: string;
  assignedTo: string;
  department: Department;
  contactInfo: string;
  phone?: string;
}

interface NewTicketForm {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  department: Department;
  contactInfo: string;
  phone: string;
}

interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
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

// Union types for better type safety
type TicketCategory = "Technical" | "Training" | "System" | "Feature Request";
type TicketPriority = "High" | "Medium" | "Low";
type TicketStatus = "Open" | "In Progress" | "Resolved" | "Under Review";
type Department =
  | "Process Document"
  | "Resident Management"
  | "Projects & Programs"
  | "Administration";
type TabKey = "all" | "open" | "inprogress" | "resolved";
type SortOption = "date" | "priority" | "title" | "status";

// Color mapping types
type PriorityColorMap = Record<TicketPriority, string>;
type StatusColorMap = Record<TicketStatus, string>;

const HelpDeskPage: React.FC = () => {
  // State with proper typing
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [showNewTicketForm, setShowNewTicketForm] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [filterStatus, setFilterStatus] = useState<TicketStatus | "all">("all");

  // Mock data with proper typing
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "TKT-001",
      title: "Barangay Certificate System Not Working",
      description:
        "Residents cannot generate barangay certificates online. System shows error message.",
      category: "Technical",
      priority: "High",
      status: "Open",
      submittedBy: "Maria Santos",
      submittedDate: "2025-06-14",
      assignedTo: "IT Support Team",
      department: "Process Document",
      contactInfo: "maria.santos@email.com",
      phone: "+63 912 345 6789",
    },
    {
      id: "TKT-002",
      title: "Request for Additional Staff Training",
      description:
        "Need training on new resident management system features for barangay staff.",
      category: "Training",
      priority: "Medium",
      status: "In Progress",
      submittedBy: "Juan Dela Cruz",
      submittedDate: "2025-06-13",
      assignedTo: "Training Department",
      department: "Resident Management",
      contactInfo: "juan.delacruz@sanmiguel.gov.ph",
      phone: "+63 917 123 4567",
    },
    {
      id: "TKT-003",
      title: "Budget Report Generation Issue",
      description:
        "Unable to generate quarterly budget reports for projects and programs.",
      category: "System",
      priority: "High",
      status: "Resolved",
      submittedBy: "Ana Rodriguez",
      submittedDate: "2025-06-12",
      assignedTo: "System Administrator",
      department: "Projects & Programs",
      contactInfo: "ana.rodriguez@sanmiguel.gov.ph",
      phone: "+63 905 987 6543",
    },
    {
      id: "TKT-004",
      title: "New Feature Request: Mobile App",
      description:
        "Request for mobile application to allow residents to access services on their phones.",
      category: "Feature Request",
      priority: "Low",
      status: "Under Review",
      submittedBy: "Barangay Captain Office",
      submittedDate: "2025-06-11",
      assignedTo: "Development Team",
      department: "Administration",
      contactInfo: "captain@sanmiguel.gov.ph",
      phone: "+63 920 111 2222",
    },
  ]);

  const [newTicket, setNewTicket] = useState<NewTicketForm>({
    title: "",
    description: "",
    category: "Technical",
    priority: "Medium",
    department: "Process Document",
    contactInfo: "",
    phone: "",
  });

  // Statistics calculation with proper typing
  const stats: TicketStats = {
    total: tickets.length,
    open: tickets.filter((t: Ticket) => t.status === "Open").length,
    inProgress: tickets.filter((t: Ticket) => t.status === "In Progress")
      .length,
    resolved: tickets.filter((t: Ticket) => t.status === "Resolved").length,
  };

  // Color mapping objects with proper typing
  const priorityColors: PriorityColorMap = {
    High: "bg-red-100 text-red-800 border-red-200",
    Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Low: "bg-green-100 text-green-800 border-green-200",
  };

  const statusColors: StatusColorMap = {
    Open: "bg-blue-100 text-blue-800 border-blue-200",
    "In Progress": "bg-orange-100 text-orange-800 border-orange-200",
    Resolved: "bg-green-100 text-green-800 border-green-200",
    "Under Review": "bg-purple-100 text-purple-800 border-purple-200",
  };

  // Properly typed arrays for form options
  const categoryOptions: TicketCategory[] = [
    "Technical",
    "Training",
    "System",
    "Feature Request",
  ];
  const priorityOptions: TicketPriority[] = ["Low", "Medium", "High"];
  const departmentOptions: Department[] = [
    "Process Document",
    "Resident Management",
    "Projects & Programs",
    "Administration",
  ];
  const statusFilterOptions: (TicketStatus | "all")[] = [
    "all",
    "Open",
    "In Progress",
    "Resolved",
    "Under Review",
  ];

  // Filter and search tickets with proper typing
  const filteredTickets: Ticket[] = tickets.filter((ticket: Ticket) => {
    const matchesSearch: boolean =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab: boolean =
      activeTab === "all" ||
      (activeTab === "open" && ticket.status === "Open") ||
      (activeTab === "inprogress" && ticket.status === "In Progress") ||
      (activeTab === "resolved" && ticket.status === "Resolved");

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

  // Event handlers with proper typing
  const handleNewTicketSubmit = (): void => {
    if (
      !newTicket.title.trim() ||
      !newTicket.description.trim() ||
      !newTicket.contactInfo.trim()
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const ticket: Ticket = {
      ...newTicket,
      id: `TKT-${String(tickets.length + 1).padStart(3, "0")}`,
      status: "Open",
      submittedBy: "Current User",
      submittedDate: new Date().toISOString().split("T")[0],
      assignedTo: "Unassigned",
    };

    setTickets((prevTickets: Ticket[]) => [...prevTickets, ticket]);
    setNewTicket({
      title: "",
      description: "",
      category: "Technical",
      priority: "Medium",
      department: "Process Document",
      contactInfo: "",
      phone: "",
    });
    setShowNewTicketForm(false);
  };

  const handleInputChange = (
    field: keyof NewTicketForm,
    value: string
  ): void => {
    setNewTicket((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTicketDetails = (ticketId: string): void => {
    setSelectedTicket(selectedTicket === ticketId ? null : ticketId);
  };

  // Tab configuration with proper typing
  const tabs: TabItem[] = [
    { key: "all", label: "All Tickets", count: stats.total },
    { key: "open", label: "Open", count: stats.open },
    { key: "inprogress", label: "In Progress", count: stats.inProgress },
    { key: "resolved", label: "Resolved", count: stats.resolved },
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
      title: "Open Tickets",
      value: stats.open,
      icon: AlertCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
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
            <h1 className="text-3xl font-bold text-gray-900">Help Desk</h1>
            <p className="text-gray-600 mt-1">
              Manage support tickets and system requests
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowNewTicketForm(!showNewTicketForm)}
              className="cursor-pointer bg-smblue-400 hover:bg-smblue-300 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Ticket
            </button>
            <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
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

      {/* New Ticket Form */}
      {showNewTicketForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Create New Ticket
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newTicket.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("title", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400 focus:border-transparent"
                  placeholder="Enter ticket title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={newTicket.department}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleInputChange(
                      "department",
                      e.target.value as Department
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400 focus:border-transparent"
                >
                  {departmentOptions.map((dept: Department) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={newTicket.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleInputChange("description", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400 focus:border-transparent h-24"
                placeholder="Describe the issue or request in detail"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newTicket.category}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleInputChange(
                      "category",
                      e.target.value as TicketCategory
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400 focus:border-transparent"
                >
                  {categoryOptions.map((category: TicketCategory) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={newTicket.priority}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleInputChange(
                      "priority",
                      e.target.value as TicketPriority
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400 focus:border-transparent"
                >
                  {priorityOptions.map((priority: TicketPriority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  value={newTicket.contactInfo}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("contactInfo", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400 focus:border-transparent"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={newTicket.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("phone", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-400 focus:border-transparent"
                  placeholder="+63 XXX XXX XXXX"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowNewTicketForm(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNewTicketSubmit}
                className="bg-smblue-400 hover:bg-smblue-300 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tickets by title, description, or submitter..."
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
            Ticket Portfolio ({filteredTickets.length} tickets)
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
                            #{ticket.id}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          {ticket.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                              ticket.priority
                            )}`}
                          >
                            {ticket.priority} Priority
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                              ticket.status
                            )}`}
                          >
                            {ticket.status}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                            {ticket.category}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {ticket.submittedBy}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {ticket.submittedDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {ticket.department}
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
                          Contact Information
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{ticket.contactInfo}</span>
                          </div>
                          {ticket.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>{ticket.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">
                          Assignment Details
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">Assigned to:</span>
                            <span className="ml-2 font-medium">
                              {ticket.assignedTo}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Department:</span>
                            <span className="ml-2 font-medium">
                              {ticket.department}
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

