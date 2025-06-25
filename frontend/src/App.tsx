import { createBrowserRouter, RouterProvider, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./components/_global/NotificationSystem";
import ProtectedRoute from "./components/_auth/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import Dashboard from "./components/dashboard/Dashboard";
import ResidentManagement from "./components/residentManagement/ResidentManagement";
import AddNewResident from "./components/residentManagement/AddNewResident";
import EditResident from "./components/residentManagement/EditResident";
import ViewResident from "./components/residentManagement/ViewResident";
// import HouseholdManagement from "./components/householdManagement/HouseholdManagement";
// import AddNewHousehold from "./components/householdManagement/AddNewHousehold";
// import EditHousehold from "./components/householdManagement/EditHousehold";
// import ViewHousehold from "./components/householdManagement/ViewHousehold";
// import ProcessDocument from "./components/processDocument/ProcessDocument";
// import BarangayClearanceForm from "./components/processDocument/BarangayClearanceForm";
// import BusinessPermitForm from "./components/processDocument/BusinessPermitForm";
// import CertificateOfIndigencyForm from "./components/processDocument/CertificateOfIndigencyForm";
// import CertificateOfResidencyForm from "./components/processDocument/CertificateOfResidencyForm";
// import DocumentQueue from "./components/processDocument/DocumentQueue";
// import BarangayClearancePrint from "./components/processDocument/BarangayClearancePrint";
// import CertificateOfResidencyPrint from "./components/processDocument/CertificateOfResidencyPrint";
// import CertificateOfIndigencyPrint from "./components/processDocument/CertificateOfIndigencyPrint";
// import BusinessPermitPrint from "./components/processDocument/BusinessPermitPrint";
// import BarangayOfficialsPage from "./components/barangayOfficials/BarangayOfficialsPage";
// import SettingsPage from "./components/_settings/SettingsPage";
// import ProjectsAndPrograms from "./components/projectsAndPrograms/ProjectsAndPrograms";
// import AddNewProject from "./components/projectsAndPrograms/AddNewProject";
// import EditProject from "./components/projectsAndPrograms/EditProject";
// import UserManagement from "./components/userManagement/UserManagement";
// import EditUserPage from "./components/userManagement/EditUserPage";
// import ViewUserPage from "./components/userManagement/ViewUserPage";
import LoginPage from "./components/_auth/LoginPage";
import SignupPage from "./components/_auth/SignupPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import './i18';

// Wrapper components to handle navigation prop
// const ProcessDocumentWrapper = () => {
//   const navigate = useNavigate();
//   return <ProcessDocument onNavigate={(item) => navigate(`/${item}`)} />;
// };

// const DocumentQueueWrapper = () => {
//   const navigate = useNavigate();
//   return <DocumentQueue onNavigate={(item) => navigate(`/${item}`)} />;
// };

// const BarangayClearanceFormWrapper = () => {
//   const navigate = useNavigate();
//   return <BarangayClearanceForm onNavigate={(item) => navigate(`/${item}`)} />;
// };

// const BusinessPermitFormWrapper = () => {
//   const navigate = useNavigate();
//   return <BusinessPermitForm onNavigate={(item) => navigate(`/${item}`)} />;
// };

// const CertificateOfIndigencyFormWrapper = () => {
//   const navigate = useNavigate();
//   return <CertificateOfIndigencyForm onNavigate={(item) => navigate(`/${item}`)} />;
// };

// const CertificateOfResidencyFormWrapper = () => {
//   const navigate = useNavigate();
//   return <CertificateOfResidencyForm onNavigate={(item) => navigate(`/${item}`)} />;
// };

// Define routes using data format
const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <ProtectedRoute requireAuth={false}>
        <LoginPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute requireAuth={true}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        // element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        // element: <Dashboard />,
      },
      {
        path: "residents",
        children: [
          {
            index: true,
            element: <ResidentManagement />,
          },
          {
            path: "add",
            element: <AddNewResident />,
          },
          {
            path: "edit/:id",
            element: <EditResident />,
          },
          {
            path: "view/:id",
            element: <ViewResident />,
          },
        ],
      },
      {
        path: "household",
        // children: [
        //   {
        //     index: true,
        //     element: <HouseholdManagement />,
        //   },
        //   {
        //     path: "add",
        //     element: <AddNewHousehold />,
        //   },
        //   {
        //     path: "edit/:id",
        //     element: <EditHousehold />,
        //   },
        //   {
        //     path: "view/:id",
        //     element: <ViewHousehold />,
        //   },
        // ],
      },
      {
        path: "process-document",
        // children: [
        //   {
        //     index: true,
        //     element: <ProcessDocumentWrapper />,
        //   },
        //   {
        //     path: "document-queue",
        //     element: <DocumentQueueWrapper />,
        //   },
        //   {
        //     path: "barangay-clearance",
        //     element: <BarangayClearanceFormWrapper />,
        //   },
        //   {
        //     path: "business-permit",
        //     element: <BusinessPermitFormWrapper />,
        //   },
        //   {
        //     path: "certificate-indigency",
        //     element: <CertificateOfIndigencyFormWrapper />,
        //   },
        //   {
        //     path: "certificate-residency",
        //     element: <CertificateOfResidencyFormWrapper />,
        //   },

        // ],
      },
      {
        path: "officials",
        // element: <BarangayOfficialsPage />,
      },
      {
        path: "projects",
        // children: [
        //   {
        //     index: true,
        //     element: <ProjectsAndPrograms />,
        //   },
        //   {
        //     path: "edit/:projectId",
        //     element: <EditProject />,
        //   },
        //   {
        //     path: "add",
        //     element: <AddNewProject />,
        //   },
        // ],
      },      {
        path: "users",
        // children: [
        //   {
        //     index: true,
        //     element: <UserManagement />,
        //   },
        //   {
        //     path: "edit/:id",
        //     element: <EditUserPage />,
        //   },
        //   {
        //     path: "view/:id",
        //     element: <ViewUserPage />,
        //   },
        // ],
      },
      {
        path: "settings",
        // element: <SettingsPage />,
      },
      {
        path: "reports",
        // element: <ReportsPage />,
      },
      {
        path: "help-desk",
        // children: [
        //   {
        //     index: true,
        //     element: <HelpDeskPage />,
        //   },
        //   {
        //     path: "schedule-appointment",
        //     element: <Appointments />,
        //   },
        //   {
        //     path: "file-blotter",
        //     element: <Blotter />,
        //   },
        //   {
        //     path: "file-complaint",
        //     element: <Complaints />,
        //   },
        //   {
        //     path: "share-suggestions",
        //     element: <Suggestions />,
        //   },
        // ],
      },
      {
        path: "*",
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
  // Standalone Print Routes (outside AppLayout to avoid headers/navigation)
  // {
  //   path: "/print/barangay-clearance/:documentId",
  //   element: (
  //     <ProtectedRoute requireAuth={true}>
  //       <BarangayClearancePrint />
  //     </ProtectedRoute>
  //   ),
  // },
  // {
  //   path: "/print/certificate-residency/:documentId",
  //   element: (
  //     <ProtectedRoute requireAuth={true}>
  //       <CertificateOfResidencyPrint />
  //     </ProtectedRoute>
  //   ),
  // },
  // {
  //   path: "/print/certificate-indigency/:documentId",
  //   element: (
  //     <ProtectedRoute requireAuth={true}>
  //       <CertificateOfIndigencyPrint />
  //     </ProtectedRoute>
  //   ),
  // },
  // {
  //   path: "/print/business-permit/:documentId",
  //   element: (
  //     <ProtectedRoute requireAuth={true}>
  //       <BusinessPermitPrint />
  //     </ProtectedRoute>
  //   ),
  // },
]);

// Main App Component
function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <RouterProvider router={router} />
        </NotificationProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;

// import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
//   useLocation,
//   useNavigate,
// } from "react-router-dom";
// import { AuthProvider, useAuth } from "./contexts/AuthContext";
// import ProtectedRoute from "./components/auth/ProtectedRoute";
// import Header from "./components/global/Header";
// import Sidebar from "./components/global/Sidebar";
// import Dashboard from "./components/dashboard/Dashboard";
// import ResidentManagement from "./components/residentManagement/ResidentManagement";
// import AddNewResident from "./components/residentManagement/AddNewResident";
// import EditResident from "./components/residentManagement/EditResident";
// import ViewResident from "./components/residentManagement/ViewResident";
// import HouseholdManagement from "./components/householdManagement/HouseholdManagement";
// import AddNewHousehold from "./components/householdManagement/AddNewHousehold";
// import EditHousehold from "./components/householdManagement/EditHousehold";
// import ViewHousehold from "./components/householdManagement/ViewHousehold";
// import ProcessDocument from "./components/processDocument/ProcessDocument";
// import BarangayClearanceForm from "./components/processDocument/BarangayClearanceForm";
// import BusinessPermitForm from "./components/processDocument/BusinessPermitForm";
// import CertificateOfIndigencyForm from "./components/processDocument/CertificateOfIndigencyForm";
// import CertificateOfResidencyForm from "./components/processDocument/CertificateOfResidencyForm";
// import DocumentQueue from "./components/processDocument/DocumentQueue";
// import BarangayOfficialsPage from "./components/barangayOfficials/BarangayOfficialsPage";
// import SettingsPage from "./components/settings/SettingsPage";
// import ProjectsAndPrograms from "./components/projectsAndPrograms/ProjectsAndPrograms";
// import AddNewProject from "./components/projectsAndPrograms/AddNewProject";
// import EditProject from "./components/projectsAndPrograms/EditProject";
// import UserManagement from "./components/userManagement/UserManagement";
// import LoginPage from "./components/auth/LoginPage";
// import SignupPage from "./components/auth/SignupPage";
// import ReportsPage from "./components/reports/ReportsPage";
// import "./index.css";
// import HelpDeskPage from "./components/helpDesk/HelpDeskPage";
// import Appointments from "./components/helpDesk/Appointments";
// import Blotter from "./components/helpDesk/Blotter";
// import Complaints from "./components/helpDesk/Complaints";
// import Suggestions from "./components/helpDesk/Suggestions";

// // Main App Layout Component
// const AppLayout: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(
//     window.matchMedia("(max-width: 767px)").matches
//   );
//   const { logout } = useAuth();

//   const location = useLocation();
//   const navigate = useNavigate();

//   // Get current active menu item from URL
//   const getActiveMenuItem = () => {
//     const path = location.pathname.substring(1) || "dashboard";

//     // Handle nested project routes
//     if (path.startsWith("projects")) {
//       return "projects";
//     }
//     // Handle nested routes for residents and household
//     if (path.startsWith("residents")) {
//       return "residents";
//     }
//     if (path.startsWith("household")) {
//       return "household";
//     }
//     return path;
//   };

//   const handleMenuItemClick = (item: string) => {
//     navigate(`/${item}`);
//     if (isMobile) setIsOpen(false);
//   };
//   const handleLogout = () => {
//     logout();
//     // No need to navigate here since logout() handles the redirect
//   };

//   const handleSidebarToggle = () => {
//     setIsOpen((prev) => !prev);
//   };

//   useEffect(() => {
//     const mediaQuery = window.matchMedia("(max-width: 767px)");

//     const handleMediaChange = (event: MediaQueryListEvent) => {
//       setIsMobile(event.matches);
//       setIsOpen(!event.matches);
//     };

//     setIsMobile(mediaQuery.matches);
//     setIsOpen(!mediaQuery.matches);

//     mediaQuery.addEventListener("change", handleMediaChange);
//     return () => mediaQuery.removeEventListener("change", handleMediaChange);
//   }, []);

//   return (
//     <>
//       <Header
//         isSidebarExpanded={isOpen}
//         onToggleSidebar={handleSidebarToggle}
//         onLogout={handleLogout}
//         isMobile={isMobile}
//       />
//       <div className="bg-gray-50 flex h-screen overflow-hidden">
//         <Sidebar
//           activeItem={getActiveMenuItem()}
//           onItemClick={handleMenuItemClick}
//           isExpanded={isOpen}
//           isMobile={isMobile}
//         />        <main className="flex-1 mt-[81px] h-[calc(100vh-81px)] overflow-y-auto">
//           <Routes>
//             <Route path="/" element={<Navigate to="/dashboard" replace />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/residents" element={<ResidentManagement />} />
//             <Route path="/residents/add" element={<AddNewResident />} />
//             <Route path="/residents/edit/:id" element={<EditResident />} />
//             <Route path="/residents/view/:id" element={<ViewResident />} />
//             <Route path="/household" element={<HouseholdManagement />} />
//             <Route path="/household/add" element={<AddNewHousehold />} />
//             <Route path="/household/edit/:id" element={<EditHousehold />} />
//             <Route path="/household/view/:id" element={<ViewHousehold />} />
//             <Route
//               path="/process-document"
//               element={<ProcessDocument onNavigate={handleMenuItemClick} />}
//             />
//             <Route
//               path="/process-document/document-queue"
//               element={<DocumentQueue onNavigate={handleMenuItemClick} />}
//             />
//             <Route
//               path="/process-document/barangay-clearance"
//               element={
//                 <BarangayClearanceForm onNavigate={handleMenuItemClick} />
//               }
//             />
//             <Route
//               path="/process-document/business-permit"
//               element={<BusinessPermitForm onNavigate={handleMenuItemClick} />}
//             />
//             <Route
//               path="/process-document/certificate-indigency"
//               element={
//                 <CertificateOfIndigencyForm onNavigate={handleMenuItemClick} />
//               }
//             />
//             <Route
//               path="/process-document/certificate-residency"
//               element={
//                 <CertificateOfResidencyForm onNavigate={handleMenuItemClick} />
//               }
//             />
//             <Route path="/officials" element={<BarangayOfficialsPage />} />

//             {/* Projects and Programs Routes */}
//             <Route path="/projects" element={<ProjectsAndPrograms />}/>
//             <Route path="/projects/edit/:projectId" element={<EditProject />} />
//             <Route path="/projects/add" element={<AddNewProject />} />

//             <Route path="/users" element={<UserManagement />} />
//             <Route path="/settings" element={<SettingsPage />} />
//             <Route path="/reports" element={<ReportsPage />} />

//             {/* Help desk routes */}
//             <Route path="/help-desk" element={<HelpDeskPage />} />
//             <Route path="/help-desk/schedule-appointment" element={<Appointments />} />
//             <Route path="/help-desk/file-blotter" element={<Blotter />} />
//             <Route path="/help-desk/file-complaint" element={<Complaints />} />
//             <Route path="/help-desk/share-suggestions" element={<Suggestions />} />

//             {/* Catch all route for undefined paths */}
//             <Route path="*" element={<Navigate to="/dashboard" replace />} />
//           </Routes>
//         </main>
//       </div>
//     </>
//   );
// };

// // Main App Component with Authentication
// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* Public routes - only accessible when NOT authenticated */}
//           <Route
//             path="/login"
//             element={
//               <ProtectedRoute requireAuth={false}>
//                 <LoginPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/signup"
//             element={
//               <ProtectedRoute requireAuth={false}>
//                 <SignupPage />
//               </ProtectedRoute>
//             }
//           />

//           {/* Protected routes - only accessible when authenticated */}
//           <Route
//             path="/*"
//             element={
//               <ProtectedRoute requireAuth={true}>
//                 <AppLayout />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

