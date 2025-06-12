import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ResidentManagement from "./components/ResidentManagement";
import HouseholdManagement from "./components/HouseholdManagement";
import ProcessDocument from "./components/ProcessDocument";
import BarangayOfficialsPage from "./components/BarangayOfficialsPage";
import SettingsPage from "./components/SettingsPage";
import ProjectsAndPrograms from "./components/ProjectsAndPrograms";
import ReportsPage from "./components/ReportsPage";
import "./index.css";

function App() {
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");

  const handleMenuItemClick = (item: string) => {
    setActiveMenuItem(item);
  };

  return (
    // <div className="min-h-screen bg-gray-50">
    <>
      <Header />
      <div className="bg-gray-50 flex mt-[81px] h-[calc(100vh-81px)] overflow-hidden">
        <Sidebar
          activeItem={activeMenuItem}
          onItemClick={handleMenuItemClick}
        />
        <main className="flex-1 overflow-y-auto">
          {activeMenuItem === "dashboard" && <Dashboard />}
          {activeMenuItem === "residents" && <ResidentManagement />}
          {activeMenuItem === "household" && <HouseholdManagement />}
          {(activeMenuItem === "process-document" ||
            activeMenuItem === "barangay-clearance" ||
            activeMenuItem === "business-permit" ||
            activeMenuItem === "certificate-indigency" ||
            activeMenuItem === "certificate-residency") && (
            <ProcessDocument onNavigate={handleMenuItemClick} />
          )}
          {activeMenuItem === "officials" && <BarangayOfficialsPage />}
          {activeMenuItem === "projects" && <ProjectsAndPrograms />}
          {activeMenuItem === "settings" && <SettingsPage />}
          {activeMenuItem === "reports" && <ReportsPage />}
          {activeMenuItem !== "dashboard" &&
            activeMenuItem !== "residents" &&
            activeMenuItem !== "household" &&
            activeMenuItem !== "process-document" &&
            activeMenuItem !== "barangay-clearance" &&
            activeMenuItem !== "business-permit" &&
            activeMenuItem !== "certificate-indigency" &&
            activeMenuItem !== "certificate-residency" &&
            activeMenuItem !== "officials" &&
            activeMenuItem !== "projects" &&
            activeMenuItem !== "settings" &&
            activeMenuItem !== "reports" && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {activeMenuItem.charAt(0).toUpperCase() +
                    activeMenuItem.slice(1)}{" "}
                  Page
                </h2>
                <p className="text-gray-600">
                  This is the {activeMenuItem} section. Content will be
                  implemented here.
                </p>
              </div>
            )}
        </main>
      </div>
    </>
  );
}

export default App;
