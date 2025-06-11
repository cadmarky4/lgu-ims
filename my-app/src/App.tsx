import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ResidentManagement from './components/ResidentManagement';
import HouseholdManagement from './components/HouseholdManagement';
import ProcessDocument from './components/ProcessDocument';
import BarangayOfficialsPage from './components/BarangayOfficialsPage';
import SettingsPage from './components/SettingsPage';
import ProjectsAndPrograms from './components/ProjectsAndPrograms';
import UserManagement from './components/UserManagement';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import './index.css';

function App() {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  const handleMenuItemClick = (item: string) => {
    setActiveMenuItem(item);
  };

  const handleLogin = (credentials: { email: string; password: string; rememberMe: boolean }) => {
    console.log('Login attempt:', credentials);
    // Here you would typically validate credentials with backend
    setIsAuthenticated(true);
  };

  const handleSignup = (userData: any) => {
    console.log('Signup data:', userData);
    // Here you would typically send to backend
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveMenuItem('dashboard');
  };

  // Show authentication pages if not logged in
  if (!isAuthenticated) {
    if (authView === 'login') {
      return (
        <LoginPage 
          onLogin={handleLogin}
          onNavigateToSignup={() => setAuthView('signup')}
        />
      );
    } else {
      return (
        <SignupPage 
          onSignup={handleSignup}
          onNavigateToLogin={() => setAuthView('login')}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={handleLogout} />
      <div className="flex">
        <Sidebar 
          activeItem={activeMenuItem} 
          onItemClick={handleMenuItemClick} 
        />
        <main className="flex-1">
          {activeMenuItem === 'dashboard' && <Dashboard />}
          {activeMenuItem === 'residents' && <ResidentManagement />}
          {activeMenuItem === 'household' && <HouseholdManagement />}
          {(activeMenuItem === 'process-document' || activeMenuItem === 'barangay-clearance' || activeMenuItem === 'business-permit' || activeMenuItem === 'certificate-indigency' || activeMenuItem === 'certificate-residency') && <ProcessDocument onNavigate={handleMenuItemClick} />}
          {activeMenuItem === 'officials' && <BarangayOfficialsPage />}
          {activeMenuItem === 'projects' && <ProjectsAndPrograms />}
          {activeMenuItem === 'users' && <UserManagement />}
          {activeMenuItem === 'settings' && <SettingsPage />}
          {activeMenuItem !== 'dashboard' && activeMenuItem !== 'residents' && activeMenuItem !== 'household' && activeMenuItem !== 'process-document' && activeMenuItem !== 'barangay-clearance' && activeMenuItem !== 'business-permit' && activeMenuItem !== 'certificate-indigency' && activeMenuItem !== 'certificate-residency' && activeMenuItem !== 'officials' && activeMenuItem !== 'projects' && activeMenuItem !== 'users' && activeMenuItem !== 'settings' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {activeMenuItem.charAt(0).toUpperCase() + activeMenuItem.slice(1)} Page
              </h2>
              <p className="text-gray-600">
                This is the {activeMenuItem} section. Content will be implemented here.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
