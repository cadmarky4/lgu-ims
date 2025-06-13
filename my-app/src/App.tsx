import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ResidentManagement from './components/ResidentManagement';
import HouseholdManagement from './components/HouseholdManagement';
import ProcessDocument from './components/ProcessDocument';
import DocumentsManagement from './components/DocumentsManagement';
import BarangayOfficialsPage from './components/BarangayOfficialsPage';
import SettingsPage from './components/SettingsPage';
import ProjectsAndPrograms from './components/ProjectsAndPrograms';
import UserManagement from './components/UserManagement';
import ComplaintsManagement from './components/ComplaintsManagement';
import SuggestionsManagement from './components/SuggestionsManagement';
import BlotterCasesManagement from './components/BlotterCasesManagement';
import AppointmentsManagement from './components/AppointmentsManagement';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { apiService } from './services/api';
import './index.css';

function App() {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');  const [isLoading, setIsLoading] = useState(true);  // This user state is used for authentication tracking
  const [_currentUser, setCurrentUser] = useState<any>(null); // Using underscore prefix to indicate intentional non-use

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const user = localStorage.getItem('user');        
        if (token && user) {          // Verify token is still valid
          const userData = await apiService.getCurrentUser();
          setCurrentUser(userData); // Store user data for possible future use
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleMenuItemClick = (item: string) => {
    setActiveMenuItem(item);
  };
  const handleLogin = async (credentials: { email: string; password: string; rememberMe: boolean }) => {
    try {
      setIsLoading(true);
      const { user } = await apiService.login(credentials);
      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error('Login failed:', error);
      alert(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (userData: any) => {
    try {
      setIsLoading(true);
      const { user } = await apiService.register(userData);
      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error('Signup failed:', error);
      alert(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setActiveMenuItem('dashboard');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
        />        <main className="flex-1">
          {activeMenuItem === 'dashboard' && <Dashboard />}
          {activeMenuItem === 'residents' && <ResidentManagement />}
          {activeMenuItem === 'household' && <HouseholdManagement />}
          {activeMenuItem === 'documents' && <DocumentsManagement />}
          {(activeMenuItem === 'process-document' || activeMenuItem === 'barangay-clearance' || activeMenuItem === 'business-permit' || activeMenuItem === 'certificate-indigency' || activeMenuItem === 'certificate-residency') && <ProcessDocument onNavigate={handleMenuItemClick} />}
          {activeMenuItem === 'officials' && <BarangayOfficialsPage />}
          {activeMenuItem === 'projects' && <ProjectsAndPrograms />}
          {activeMenuItem === 'users' && <UserManagement />}
          {activeMenuItem === 'complaints' && <ComplaintsManagement />}
          {activeMenuItem === 'suggestions' && <SuggestionsManagement />}
          {activeMenuItem === 'blotter-cases' && <BlotterCasesManagement />}
          {activeMenuItem === 'appointments' && <AppointmentsManagement />}
          {activeMenuItem === 'settings' && <SettingsPage />}
          {!['dashboard', 'residents', 'household', 'documents', 'process-document', 'barangay-clearance', 'business-permit', 'certificate-indigency', 'certificate-residency', 'officials', 'projects', 'users', 'complaints', 'suggestions', 'blotter-cases', 'appointments', 'settings'].includes(activeMenuItem) && (
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
