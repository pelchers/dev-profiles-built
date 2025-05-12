import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserUpdateInput } from '../types/user';
import { fetchProfile, updateProfile, syncGitHubProfile } from '../api/profile';

// API base URL configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'
  : 'http://localhost:3000/api';

interface RegisterInput {
  email: string;
  username: string;
  password: string;
  displayName: string;
  userType: string;
  githubUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  register: (data: RegisterInput) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (profileData: UserUpdateInput) => Promise<User>;
  syncGithubProfile: (username: string) => Promise<User>;
  updateUser: (user: User) => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  register: async () => { throw new Error('Not implemented'); },
  login: async () => { throw new Error('Not implemented'); },
  logout: () => {},
  updateUserProfile: async () => { throw new Error('Not implemented'); },
  syncGithubProfile: async () => { throw new Error('Not implemented'); },
  updateUser: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        
        if (storedToken) {
          setToken(storedToken);
          try {
            const userData = await fetchProfile(storedToken);
            console.log('Fetched user profile:', userData);
            setUser(userData);
          } catch (err) {
            // If fetching profile fails, token might be invalid
            localStorage.removeItem('token');
            setToken(null);
            console.error('Failed to fetch user profile:', err);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Authentication failed. Please log in again.');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Register - create new account
  const register = async (data: RegisterInput) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      // Store token and user data
      localStorage.setItem('token', result.token);
      setToken(result.token);
      setUser(result.user);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login - store token and user data
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store both access token and refresh token
      localStorage.setItem('token', data.accessToken);
      setToken(data.accessToken);
      setUser(data.user);
      setError(null);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout - clear token and user data
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Update user profile
  const updateUserProfile = async (profileData: UserUpdateInput): Promise<User> => {
    if (!token) {
      throw new Error('Not authenticated');
    }

    try {
      setLoading(true);
      const updatedUser = await updateProfile(token, profileData);
      console.log('Updated user profile:', updatedUser);
      setUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sync GitHub profile
  const syncGithubProfile = async (username: string): Promise<User> => {
    if (!token) {
      throw new Error('Not authenticated');
    }

    try {
      setLoading(true);
      const updatedUser = await syncGitHubProfile(token, username);
      console.log('Synced GitHub profile:', updatedUser);
      setUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      setError(err.message || 'Failed to sync GitHub profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Compute authentication status
  const isAuthenticated = !!token && !!user;

  // Update user
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Provide the context value
  const contextValue: AuthContextType = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    updateUserProfile,
    syncGithubProfile,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 