import { User, UserUpdateInput } from '../types/user';

/**
 * API utility functions for working with user profiles
 */

// Use the local API or proxy path
const API_BASE_URL = '';  // Empty means use the same origin or proxy defined in vite.config.ts

/**
 * Fetch the current user's profile (requires authentication)
 * 
 * @param token JWT authentication token
 * @returns The user profile data
 */
export const fetchProfile = async (token: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
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

/**
 * Fetch a user's profile by username (public endpoint, no auth required)
 * 
 * @param username The username to fetch
 * @returns The public user profile data
 */
export const fetchProfileByUsername = async (username: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/api/users/username/${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Profile not found: ${response.status}`);
  }

  return response.json();
};

/**
 * Update the current user's profile (requires authentication)
 * 
 * @param token JWT authentication token
 * @param profileData The profile data to update
 * @returns The updated user profile data
 */
export const updateProfile = async (token: string, profileData: UserUpdateInput): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
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
  const response = await fetch(`${API_BASE_URL}/api/github/${username}`, {
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
  const response = await fetch(`${API_BASE_URL}/api/github/sync/${username}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
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
  const response = await fetch(`${API_BASE_URL}/api/github/sync`, {
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