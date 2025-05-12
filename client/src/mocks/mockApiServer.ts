import { User, UserType, DevFocus, Role } from '../types/user';

/**
 * This file demonstrates how to interact with our API endpoints.
 * It provides examples of the request/response format that would be used
 * when integrating the ProfilePage with our real backend.
 */

// Example user response from fetchProfile() API call
export const mockUserResponse: User = {
  id: '1',
  username: 'janedev',
  email: 'jane@example.com', 
  userType: UserType.COMPANY,
  displayName: 'Jane Dev',
  bio: 'Fullstack developer passionate about React and Node.js',
  githubUrl: 'https://github.com/octocat',
  githubUsername: 'octocat',
  githubId: 583231,
  githubAvatarUrl: 'https://github.com/images/error/octocat_happy.gif',
  githubHtmlUrl: 'https://github.com/octocat',
  githubBio: 'There once was...',
  githubCompany: 'GitHub',
  githubBlog: 'https://github.com/blog',
  githubTwitter: 'monatheoctocat',
  githubFollowers: 20,
  githubFollowing: 0,
  githubPublicRepos: 2,
  githubPublicGists: 1,
  githubCreatedAt: '2008-01-14T04:33:35Z',
  githubUpdatedAt: '2024-05-20T12:00:00Z',
  githubStats: { stars: 42, forks: 10, issues: 5 },
  location: 'San Francisco',
  website: 'https://janedev.com',
  title: 'Lead Engineer',
  devFocus: [DevFocus.FULLSTACK, DevFocus.API],
  languages: ['TypeScript', 'Python'],
  frameworks: ['React', 'Next.js'],
  tools: ['Docker', 'Figma'],
  specialties: ['UI/UX', 'Testing'],
  yearsExp: 7,
  openToRoles: ['Mentor', 'Freelance'],
  tags: ['Open Source', 'Remote'],
  interests: ['AI', 'Startups'],
  companyName: 'Acme Corp',
  companySize: '51-200',
  industry: 'Software',
  hiring: true,
  openRoles: [
    {
      title: 'Frontend Engineer',
      description: 'React/TypeScript',
      requirements: ['3+ years experience'],
      benefits: ['Remote work', 'Health insurance'],
      type: 'Full-time',
      url: 'https://acme.com/jobs/frontend',
      location: 'Remote',
      salary: '$120k - $140k',
    },
    {
      title: 'Backend Engineer',
      description: 'Node/Prisma',
      requirements: ['5+ years experience'],
      benefits: ['Stock options', 'Flexible hours'],
      type: 'Contract',
      url: 'https://acme.com/jobs/backend',
      location: 'San Francisco, CA',
      salary: '$100/hr',
    }
  ],
  foundingYear: 2010,
  teamLinks: [
    { name: 'LinkedIn', url: 'https://linkedin.com/company/acme' },
    { name: 'Website', url: 'https://acme.com/team' }
  ],
  orgDescription: 'We build awesome developer tools for modern teams.',
  emailVerified: true,
  role: Role.USER,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2024-05-20T12:00:00Z',
};

// Example of an update profile request body 
export const mockUpdateProfileRequest = {
  displayName: 'Jane Smith',
  bio: 'Updated bio with more details about my experience',
  location: 'New York',
  yearsExp: 8,
  languages: ['TypeScript', 'Python', 'Go'],
  // Notice we're not sending sensitive fields like password or email
};

// Example response from GitHub API (only relevant fields shown)
export const mockGitHubResponse = {
  login: 'octocat',
  id: 583231,
  avatar_url: 'https://github.com/images/error/octocat_happy.gif',
  html_url: 'https://github.com/octocat',
  name: 'The Octocat',
  company: 'GitHub',
  blog: 'https://github.com/blog',
  location: 'San Francisco',
  email: null,
  bio: 'There once was...',
  twitter_username: 'monatheoctocat',
  public_repos: 2,
  public_gists: 1,
  followers: 20,
  following: 0,
  created_at: '2008-01-14T04:33:35Z',
  updated_at: '2024-05-20T12:00:00Z'
};

// Example API endpoints used by ProfilePage
export const apiEndpoints = {
  // Get the current user's profile
  profile: '/api/users/profile',
  
  // Update the current user's profile
  updateProfile: '/api/users/profile',
  
  // Get a user's profile by username
  profileByUsername: (username: string) => `/api/users/username/${username}`,
  
  // Get GitHub profile data
  githubProfile: (username: string) => `/api/github/${username}`,
  
  // Sync GitHub profile data
  syncGithub: (username: string) => `/api/github/sync/${username}`,
};

/*****************************************************************************
 * ADDITIONAL MOCK API EXAMPLES
 *****************************************************************************/

/**
 * PROFILE API EXAMPLES
 * 
 * These examples show the complete flow of fetching, updating, and working with profiles
 */

// Example of a GET request to /api/users/profile (with auth header)
export const profileApiExamples = {
  // Fetch current user profile
  fetchProfileRequest: {
    url: '/api/users/profile',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      'Content-Type': 'application/json'
    }
  },
  fetchProfileResponse: mockUserResponse, // Same as above
  
  // Fetch profile by username (public, no auth required)
  fetchProfileByUsernameRequest: {
    url: '/api/users/username/janedev',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  },
  fetchProfileByUsernameResponse: {
    // Similar to mockUserResponse but without sensitive fields
    id: '1',
    username: 'janedev',
    userType: UserType.COMPANY,
    displayName: 'Jane Dev',
    // No email or other private data
    // ... rest of public fields
  },
  
  // Update profile example
  updateProfileRequest: {
    url: '/api/users/profile',
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      'Content-Type': 'application/json'
    },
    body: {
      displayName: 'Jane Smith',
      bio: 'Updated bio with more details',
      languages: ['TypeScript', 'Python', 'Go'],
      openToRoles: ['Mentor', 'Full-time', 'Freelance'],
      // Add a new team link (for company profiles)
      teamLinks: [
        { name: 'LinkedIn', url: 'https://linkedin.com/company/acme' },
        { name: 'Website', url: 'https://acme.com/team' },
        { name: 'Twitter', url: 'https://twitter.com/acme' }
      ]
    }
  },
  
  // Update profile response - returns the updated user data
  updateProfileResponse: {
    ...mockUserResponse,
    displayName: 'Jane Smith',
    bio: 'Updated bio with more details',
    languages: ['TypeScript', 'Python', 'Go'],
    openToRoles: ['Mentor', 'Full-time', 'Freelance'],
    teamLinks: [
      { name: 'LinkedIn', url: 'https://linkedin.com/company/acme' },
      { name: 'Website', url: 'https://acme.com/team' },
      { name: 'Twitter', url: 'https://twitter.com/acme' }
    ],
    updatedAt: '2024-05-25T15:30:00Z', // Notice the updated timestamp
  }
};

/**
 * GITHUB API EXAMPLES
 * 
 * These examples show the complete flow of fetching and syncing GitHub profile data
 */

export const githubApiExamples = {
  // Fetch GitHub profile data (public endpoint)
  fetchGitHubRequest: {
    url: '/api/github/octocat',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  },
  fetchGitHubResponse: mockGitHubResponse, // GitHub API response
  
  // Sync GitHub profile (authenticated, updates user profile with GitHub data)
  syncGitHubRequest: {
    url: '/api/github/sync',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      'Content-Type': 'application/json'
    },
    body: {
      githubUsername: 'octocat'
      // Alternatively, you can provide githubUrl and the backend will extract the username
      // githubUrl: 'https://github.com/octocat'
    }
  },
  
  // Sync response contains the updated user with GitHub data
  syncGitHubResponse: {
    ...mockUserResponse,
    githubUsername: 'octocat',
    githubId: 583231,
    githubAvatarUrl: 'https://github.com/images/error/octocat_happy.gif',
    githubHtmlUrl: 'https://github.com/octocat',
    githubBio: 'There once was...',
    // All other GitHub fields are updated
    updatedAt: '2024-05-25T15:35:00Z', // Notice updated timestamp
  },
  
  // Sync by username (alternative endpoint)
  syncGitHubByUsernameRequest: {
    url: '/api/github/sync/octocat', // Username in URL
    method: 'POST',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      'Content-Type': 'application/json'
    }
    // No body needed, username is in URL
  },
  
  // Batch sync GitHub profiles (admin only)
  batchSyncGitHubRequest: {
    url: '/api/github/batch-sync',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Admin token
      'Content-Type': 'application/json'
    },
    body: {
      batchSize: 50 // Optional, defaults to 100
    }
  },
  
  batchSyncGitHubResponse: {
    total: 50,
    successful: 48,
    failed: 2,
    errors: [
      'Failed to sync user1: GitHub API rate limit exceeded',
      'Failed to sync user2: GitHub profile not found'
    ]
  }
};

/**
 * EXAMPLES OF HOW AUTHENTICATION INTEGRATES WITH PROFILE
 * 
 * These show how the authentication flow would work with the profile system
 */

export const authApiExamples = {
  // Login response includes user profile data
  loginResponse: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    user: {
      id: '1',
      username: 'janedev',
      email: 'jane@example.com',
      userType: UserType.COMPANY,
      // Basic profile info
      displayName: 'Jane Dev',
      profileImage: null,
      // Other essential fields
    },
    expiresAt: '2024-06-25T15:35:00Z'
  },
  
  // Registration with GitHub (creates profile and syncs)
  registerWithGitHubResponse: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    user: {
      id: '2', // New user
      username: 'newdev',
      email: 'newdev@example.com',
      userType: UserType.DEVELOPER,
      // Already populated with GitHub data
      githubUsername: 'newdev',
      githubAvatarUrl: 'https://avatars.githubusercontent.com/u/12345',
      // Other GitHub fields
    },
    expiresAt: '2024-06-25T15:35:00Z'
  }
};

/**
 * USAGE EXAMPLES
 * 
 * Here are some code snippets showing how to use these APIs from React components
 */

export const apiUsageExamples = {
  fetchProfile: `
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/users/profile', {
          headers: {
            'Authorization': \`Bearer \${token}\`,
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch profile');
        
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load your profile');
      } finally {
        setLoading(false);
      }
    };
  `,
  
  updateProfile: `
    const updateProfile = async (profileData) => {
      setUpdating(true);
      try {
        const response = await fetch('/api/users/profile', {
          method: 'PUT',
          headers: {
            'Authorization': \`Bearer \${token}\`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(profileData)
        });
        
        if (!response.ok) throw new Error('Failed to update profile');
        
        const updatedUser = await response.json();
        setUser(updatedUser);
        setSuccess('Profile updated successfully');
      } catch (error) {
        console.error('Error updating profile:', error);
        setError('Failed to update your profile');
      } finally {
        setUpdating(false);
      }
    };
  `,
  
  syncGitHub: `
    const syncGitHubProfile = async (username) => {
      setSyncing(true);
      try {
        const response = await fetch(\`/api/github/sync/\${username}\`, {
          method: 'POST',
          headers: {
            'Authorization': \`Bearer \${token}\`,
          }
        });
        
        if (!response.ok) throw new Error('Failed to sync GitHub profile');
        
        const updatedUser = await response.json();
        setUser(updatedUser);
        setSuccess('GitHub profile synced successfully');
      } catch (error) {
        console.error('Error syncing GitHub profile:', error);
        setError('Failed to sync your GitHub profile');
      } finally {
        setSyncing(false);
      }
    };
  `
};

/**
 * AUTOMATIC GITHUB SYNC BEHAVIOR
 * 
 * This describes how the automatic GitHub sync works when updating profiles
 */

export const automaticGitHubSyncExample = {
  description: `
    When a user updates their profile and changes their githubUrl:
    
    1. The client sends the updated profile data to /api/users/profile
    2. The server detects the githubUrl has changed
    3. The server extracts the username from the URL
    4. The server updates the user's profile with the new githubUrl and githubUsername
    5. The server initiates a background sync with GitHub's API
    6. The server returns the updated user profile immediately (without waiting for GitHub sync)
    7. When the GitHub sync completes, the user's profile is updated with GitHub data
    
    On next profile load, the user will see their synced GitHub data
  `,
  
  manualVsAutomatic: `
    The GitHub sync happens in two ways:
    
    1. Automatically when a user updates their githubUrl field
    2. Manually when a user clicks the "Sync GitHub Data" button
    
    The first method happens in the background and doesn't block the user's update.
    The second method is for when users want to refresh their GitHub data immediately.
  `
};

/**
 * API REQUEST/RESPONSE FLOW DIAGRAMS
 *
 * These diagrams show the file flow for each API operation from frontend to backend and back
 */

export const apiFlowDiagrams = {
  // Profile fetch flow
  fetchProfileFlow: `
    Frontend                          Backend
    --------                          -------
    
    ProfilePage.tsx
          ↓
    AuthContext.tsx 
          ↓
    api/profile.ts ---------------→ server/flows/profile/profile.routes.ts
      (fetch)                              ↓
          ↑                      server/flows/profile/profile.controller.ts
          |                              ↓
    types/user.ts ←--------------- server/common/types/user.ts
          ↑                              ↓
    ProfilePage.tsx                 database (Prisma)
    (renders data)
  `,

  // Profile update flow
  updateProfileFlow: `
    Frontend                          Backend
    --------                          -------
    
    ProfilePage.tsx
    (user edits form)
          ↓
    AuthContext.tsx 
          ↓
    api/profile.ts ---------------→ server/flows/profile/profile.routes.ts
    (PUT request)                          ↓
          ↑                      server/flows/profile/profile.controller.ts
          |                              ↓
    types/user.ts ←--------------- server/common/types/user.ts
          ↑                              ↓
    ProfilePage.tsx                 database (Prisma)
    (displays updated data)
  `,

  // GitHub sync flow
  githubSyncFlow: `
    Frontend                          Backend                     External
    --------                          -------                     --------
    
    ProfilePage.tsx
    (click sync button)
          ↓
    AuthContext.tsx 
          ↓
    api/profile.ts ---------------→ server/flows/github/github.routes.ts
   (POST to /github/sync)                  ↓
          ↑                      server/flows/github/github.controller.ts
          |                              ↓                          ↓
    types/user.ts ←--------------- server/common/types/user.ts   GitHub API
          ↑                              ↓                          ↑
    ProfilePage.tsx                 database (Prisma) -------------|
    (displays GitHub data)
  `,

  // Automatic GitHub sync flow (when updating profile with new GitHub URL)
  autoGitHubSyncFlow: `
    Frontend                          Backend                     External
    --------                          -------                     --------
    
    ProfilePage.tsx
    (user updates githubUrl)
          ↓
    AuthContext.tsx 
          ↓
    api/profile.ts ---------------→ server/flows/profile/profile.routes.ts
    (PUT request)                          ↓
          ↑                      server/flows/profile/profile.controller.ts
          |                              ↓
    types/user.ts ←--------------- server/common/types/user.ts
          ↑                              ↓
    ProfilePage.tsx             server/flows/github/github.controller.ts
    (displays updated URL)                 ↓                          ↓
                                   database (Prisma) ------------- GitHub API
                                                                     ↑
                                                                     |
                                   Background Process ---------------|
                                   (async GitHub sync)
  `
}; 