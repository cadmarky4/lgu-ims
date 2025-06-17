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
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ResidentManagement from "./components/ResidentManagement";
import HouseholdManagement from "./components/HouseholdManagement";
import ProcessDocument from "./components/ProcessDocument";
import BarangayClearanceForm from "./components/BarangayClearanceForm";
import BusinessPermitForm from "./components/BusinessPermitForm";
import CertificateOfIndigencyForm from "./components/CertificateOfIndigencyForm";
import CertificateOfResidencyForm from "./components/CertificateOfResidencyForm";
import DocumentQueue from "./components/DocumentQueue";
import BarangayOfficialsPage from "./components/BarangayOfficialsPage";
import SettingsPage from "./components/SettingsPage";
import ProjectsAndPrograms from "./components/ProjectsAndPrograms";
import UserManagement from "./components/UserManagement";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ReportsPage from "./components/ReportsPage";
import "./index.css";
import HelpDeskPage from "./components/HelpDeskPage";

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
            <Route path="/household" element={<HouseholdManagement />} />
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
              element={<BarangayClearanceForm onNavigate={handleMenuItemClick} />}
            />
            <Route
              path="/business-permit"
              element={<BusinessPermitForm onNavigate={handleMenuItemClick} />}
            />
            <Route
              path="/certificate-indigency"
              element={<CertificateOfIndigencyForm onNavigate={handleMenuItemClick} />}
            />
            <Route
              path="/certificate-residency"
              element={<CertificateOfResidencyForm onNavigate={handleMenuItemClick} />}
            />
            <Route path="/officials" element={<BarangayOfficialsPage />} />
            <Route path="/projects" element={<ProjectsAndPrograms />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/reports" element={<ReportsPage />} />

            {/* Help desk routes */}
            <Route path="/helpdesk" element={<HelpDeskPage />} />
            <Route
              path="/appointments"
              element={
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Appointments
                  </h2>
                  <p className="text-gray-600">
                    Appointments management. Content will be implemented here.
                  </p>
                </div>
              }
            />
            <Route
              path="/blotter"
              element={
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Blotter
                  </h2>
                  <p className="text-gray-600">
                    Blotter records. Content will be implemented here.
                  </p>
                </div>
              }
            />
            <Route
              path="/complaints"
              element={
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Complaints
                  </h2>
                  <p className="text-gray-600">
                    Complaints management. Content will be implemented here.
                  </p>
                </div>
              }
            />
            <Route
              path="/suggestions"
              element={
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Suggestions
                  </h2>
                  <p className="text-gray-600">
                    Suggestions box. Content will be implemented here.
                  </p>
                </div>
              }
            />

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

