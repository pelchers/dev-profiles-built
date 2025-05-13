import { User, UserUpdateInput } from '../types/user';

/**
 * API utility functions for working with user profiles
 */

// Use the local API or proxy path
const API_BASE_URL = '/api';

/**
 * Get token from localStorage
 */
const getAuthToken = () => localStorage.getItem('token');

/**
 * Fetch the current user's profile (requires authentication)
 * 
 * @returns The user profile data
 */
export const profileApi = {
  // Get current user's profile
  getCurrentProfile: async (): Promise<User> => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const response = await fetch(`${API_BASE_URL}/profile/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch profile');
    }
    
    return response.json();
  },

  // Get profile by username
  getProfileByUsername: async (username: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/profile/${username}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return response.json();
  },

  // Update current user's profile
  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const response = await fetch(`${API_BASE_URL}/profile/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    return response.json();
  },

  // Sync GitHub data
  syncGitHub: async (): Promise<User> => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const response = await fetch(`${API_BASE_URL}/github/sync`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to sync GitHub data');
    }
    
    return response.json();
  },
};

// Backward compatibility for existing code
export const fetchProfile = async (token: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/profile/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch profile: ${response.status}`);
  }

  return response.json();
};

export const fetchProfileByUsername = async (username: string): Promise<User> => {
  return profileApi.getProfileByUsername(username);
};

export const updateProfile = async (token: string, profileData: UserUpdateInput): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/profile/me`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profileData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to update profile: ${response.status}`);
  }

  return response.json();
};

/**
 * Fetch GitHub profile data for a given username (public endpoint)
 * 
 * @param username GitHub username
 * @returns GitHub profile data
 */
export const fetchGitHubProfile = async (username: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/github/profile/${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `GitHub profile not found: ${response.status}`);
  }

  return response.json();
};

/**
 * Sync the current user's profile with GitHub data (requires authentication)
 * 
 * @param token JWT authentication token
 * @param username GitHub username to sync
 * @returns The updated user profile with GitHub data
 */
export const syncGitHubProfile = async (token: string, username: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/github/sync`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to sync GitHub profile: ${response.status}`);
  }

  return response.json();
};

/**
 * Sync the current user's profile with GitHub data using URL (requires authentication)
 * The backend will extract the username from the URL
 * 
 * @param token JWT authentication token
 * @param githubUrl GitHub profile URL
 * @returns The updated user profile with GitHub data
 */
export const syncGitHubProfileByUrl = async (token: string, githubUrl: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/github/sync`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ githubUrl })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to sync GitHub profile: ${response.status}`);
  }

  return response.json();
}; 