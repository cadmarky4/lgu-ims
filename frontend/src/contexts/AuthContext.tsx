import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { setAuthErrorHandler, clearAuthErrorHandler } from '../services/auth-error-handler';

// Types
interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  role: string;
  department: string;
  position?: string;
  employee_id?: string;
  phone?: string;
  is_active: boolean;
  is_verified: boolean;
  full_name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  role: string;
  department: string;
  position?: string;
  employee_id?: string;
  phone?: string;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Define logout function using useCallback so it can be used in useEffect
  const logout = useCallback((): void => {
    try {
      // Call logout endpoint if token exists (fire and forget)
      if (token) {
        fetch('http://127.0.0.1:8000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }).catch((error) => {
          console.error('Logout API error:', error);
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Immediately clear local state and storage
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');
    
    // Force a page reload to ensure clean state
    window.location.href = '/login';
  }, [user, token]);

  // Register the logout handler for API errors
  useEffect(() => {
    const handleAuthError = () => {
      console.log('Auth error handler called from API');
      logout();
    };

    setAuthErrorHandler(handleAuthError);

    // Cleanup on unmount
    return () => {
      clearAuthErrorHandler();
    };
  }, [logout]);

  // Check for existing token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check both localStorage and sessionStorage for token
        let savedToken = localStorage.getItem('auth_token');
        let savedUser = localStorage.getItem('auth_user');
        
        if (!savedToken) {
          savedToken = sessionStorage.getItem('auth_token');
          savedUser = sessionStorage.getItem('auth_user');
        }
          if (savedToken && savedUser) {
          try {
            // Parse saved user data for validation
            JSON.parse(savedUser);
            
            // Validate token with backend
            const response = await fetch('http://127.0.0.1:8000/api/auth/user', {
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${savedToken}`,
              },
            });

            if (response.ok) {
              const data = await response.json();
              if (data.success && data.data) {
                // Token is valid, set user and token
                setToken(savedToken);
                setUser(data.data); // Use fresh user data from server
              } else {
                throw new Error('Invalid token response');
              }
            } else {
              throw new Error('Token validation failed');
            }
          } catch (error) {
            console.error('Error validating saved token:', error);
            // Clear invalid stored data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('auth_user');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success && data.data) {
        const { user: userData, token: userToken } = data.data;
        
        setUser(userData);
        setToken(userToken);
        
        // Save to localStorage if remember me is checked
        if (credentials.rememberMe) {
          localStorage.setItem('auth_token', userToken);
          localStorage.setItem('auth_user', JSON.stringify(userData));
        } else {
          // Save to sessionStorage for session-only storage
          sessionStorage.setItem('auth_token', userToken);
          sessionStorage.setItem('auth_user', JSON.stringify(userData));
        }
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('http://127.0.0.1:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (response.status === 422 && data.errors) {
          const error = new Error('Validation errors') as any;
          error.errors = data.errors;
          throw error;
        }
        throw new Error(data.message || 'Registration failed');
      }

      if (data.success && data.data) {
        const { user: newUser, token: userToken } = data.data;
        
        setUser(newUser);
        setToken(userToken);
        
        // Save to localStorage by default for new registrations
        localStorage.setItem('auth_token', userToken);
        localStorage.setItem('auth_user', JSON.stringify(newUser));
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;    } finally {
      setIsLoading(false);
    }
  };
  const isAuthenticated = !!user && !!token;

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

