import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Header from "./components/global/Header";
import Sidebar from "./components/global/Sidebar";
import Dashboard from "./components/dashboard/Dashboard";
import ResidentManagement from "./components/residentManagement/ResidentManagement";
import AddNewResident from "./components/residentManagement/AddNewResident";
import EditResident from "./components/residentManagement/EditResident";
import ViewResident from "./components/residentManagement/ViewResident";
import HouseholdManagement from "./components/householdManagement/HouseholdManagement";
import AddNewHousehold from "./components/householdManagement/AddNewHousehold";
import EditHousehold from "./components/householdManagement/EditHousehold";
import ViewHousehold from "./components/householdManagement/ViewHousehold";
import ProcessDocument from "./components/processDocument/ProcessDocument";
import BarangayClearanceForm from "./components/processDocument/BarangayClearanceForm";
import BusinessPermitForm from "./components/processDocument/BusinessPermitForm";
import CertificateOfIndigencyForm from "./components/processDocument/CertificateOfIndigencyForm";
import CertificateOfResidencyForm from "./components/processDocument/CertificateOfResidencyForm";
import DocumentQueue from "./components/processDocument/DocumentQueue";
import BarangayOfficialsPage from "./components/barangayOfficials/BarangayOfficialsPage";
import SettingsPage from "./components/settings/SettingsPage";
import ProjectsAndPrograms from "./components/projectsAndPrograms/ProjectsAndPrograms";
import AddNewProject from "./components/projectsAndPrograms/AddNewProject";
import EditProject from "./components/projectsAndPrograms/EditProject";
import UserManagement from "./components/userManagement/UserManagement";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import ReportsPage from "./components/reports/ReportsPage";
import "./index.css";
import HelpDeskPage from "./components/helpDesk/HelpDeskPage";
import Appointments from "./components/helpDesk/Appointments";
import Blotter from "./components/helpDesk/Blotter";
import Complaints from "./components/helpDesk/Complaints";
import Suggestions from "./components/helpDesk/Suggestions";

// Main App Layout Component
const AppLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 767px)").matches
  );
  const { logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  // Get current active menu item from URL
  const getActiveMenuItem = () => {
    const path = location.pathname.substring(1) || "dashboard";
    // Handle nested project routes
    if (path.startsWith("projects")) {
      return "projects";
    }
    // Handle nested routes for residents and household
    if (path.startsWith("residents")) {
      return "residents";
    }
    if (path.startsWith("household")) {
      return "household";
    }
    return path;
  };

  const handleMenuItemClick = (item: string) => {
    navigate(`/${item}`);
    if (isMobile) setIsOpen(false);
  };
  const handleLogout = () => {
    logout();
    // No need to navigate here since logout() handles the redirect
  };

  const handleSidebarToggle = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleMediaChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
      setIsOpen(!event.matches);
    };

    setIsMobile(mediaQuery.matches);
    setIsOpen(!mediaQuery.matches);

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  return (
    <>
      <Header
        isSidebarExpanded={isOpen}
        onToggleSidebar={handleSidebarToggle}
        onLogout={handleLogout}
        isMobile={isMobile}
      />
      <div className="bg-gray-50 flex h-screen overflow-hidden">
        <Sidebar
          activeItem={getActiveMenuItem()}
          onItemClick={handleMenuItemClick}
          isExpanded={isOpen}
          isMobile={isMobile}
        />        <main className="flex-1 mt-[81px] h-[calc(100vh-81px)] overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/residents" element={<ResidentManagement />} />
            <Route path="/residents/add" element={<AddNewResident />} />
            <Route path="/residents/edit/:id" element={<EditResident />} />
            <Route path="/residents/view/:id" element={<ViewResident />} />
            <Route path="/household" element={<HouseholdManagement />} />
            <Route path="/household/add" element={<AddNewHousehold />} />
            <Route path="/household/edit/:id" element={<EditHousehold />} />
            <Route path="/household/view/:id" element={<ViewHousehold />} />
            <Route
              path="/process-document"
              element={<ProcessDocument onNavigate={handleMenuItemClick} />}
            />
            <Route
              path="/document-queue"
              element={<DocumentQueue onNavigate={handleMenuItemClick} />}
            />
            <Route
              path="/barangay-clearance"
              element={
                <BarangayClearanceForm onNavigate={handleMenuItemClick} />
              }
            />
            <Route
              path="/business-permit"
              element={<BusinessPermitForm onNavigate={handleMenuItemClick} />}
            />
            <Route
              path="/certificate-indigency"
              element={
                <CertificateOfIndigencyForm onNavigate={handleMenuItemClick} />
              }
            />
            <Route
              path="/certificate-residency"
              element={
                <CertificateOfResidencyForm onNavigate={handleMenuItemClick} />
              }
            />
            <Route path="/officials" element={<BarangayOfficialsPage />} />

            {/* Projects and Programs Routes */}
            <Route path="/projects" element={<ProjectsAndPrograms />} />
            <Route path="/projects/add" element={<AddNewProject />} />
            <Route path="/projects/edit/:projectId" element={<EditProject />} />

            <Route path="/users" element={<UserManagement />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/reports" element={<ReportsPage />} />

            {/* Help desk routes */}
            <Route path="/help-desk" element={<HelpDeskPage />} />
            <Route path="/schedule-appointment" element={<Appointments />} />
            <Route path="/file-blotter" element={<Blotter />} />
            <Route path="/file-complaint" element={<Complaints />} />
            <Route path="/share-suggestions" element={<Suggestions />} />

            {/* Catch all route for undefined paths */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
};

// Main App Component with Authentication
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes - only accessible when NOT authenticated */}
          <Route
            path="/login"
            element={
              <ProtectedRoute requireAuth={false}>
                <LoginPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <ProtectedRoute requireAuth={false}>
                <SignupPage />
              </ProtectedRoute>
            }
          />

          {/* Protected routes - only accessible when authenticated */}
          <Route
            path="/*"
            element={
              <ProtectedRoute requireAuth={true}>
                <AppLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

