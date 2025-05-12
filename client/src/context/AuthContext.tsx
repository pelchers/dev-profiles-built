import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserUpdateInput } from '../types/user';
import { fetchProfile, updateProfile, syncGitHubProfile } from '../api/profile';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUserProfile: (profileData: UserUpdateInput) => Promise<User>;
  syncGithubProfile: (username: string) => Promise<User>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  updateUserProfile: async () => { throw new Error('Not implemented'); },
  syncGithubProfile: async () => { throw new Error('Not implemented'); },
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

  // Login - store token and user data
  const login = (newToken: string, userData: User) => {
    console.log('Logging in with user data:', userData);
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    setError(null);
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

  // Provide the context value
  const contextValue: AuthContextType = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    updateUserProfile,
    syncGithubProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 