import { profileApi } from '../profile';
import { User, UserType, DevFocus } from '../../types/user';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('profileApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('mock-token');
  });

  const mockUser: User = {
    id: '123',
    userType: UserType.DEVELOPER,
    username: 'testuser',
    email: 'test@example.com',
    displayName: 'Test User',
    devFocus: [DevFocus.FRONTEND],
    languages: ['TypeScript', 'JavaScript'],
    frameworks: ['React', 'Next.js'],
    tools: ['Git', 'Docker'],
    specialties: ['UI/UX'],
    yearsExp: 5,
    openToRoles: ['Full-time'],
    tags: ['web', 'frontend'],
    interests: ['open source'],
  };

  describe('getCurrentProfile', () => {
    it('should fetch current user profile', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUser),
      });

      const result = await profileApi.getCurrentProfile();

      expect(mockFetch).toHaveBeenCalledWith('/api/profile/me', {
        headers: {
          'Authorization': 'Bearer mock-token',
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw error on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(profileApi.getCurrentProfile()).rejects.toThrow('Failed to fetch profile');
    });
  });

  describe('getProfileByUsername', () => {
    it('should fetch profile by username', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUser),
      });

      const result = await profileApi.getProfileByUsername('testuser');

      expect(mockFetch).toHaveBeenCalledWith('/api/profile/testuser');
      expect(result).toEqual(mockUser);
    });

    it('should throw error on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(profileApi.getProfileByUsername('testuser')).rejects.toThrow('Failed to fetch profile');
    });
  });

  describe('updateProfile', () => {
    const updateData = {
      displayName: 'Updated Name',
      bio: 'Updated bio',
    };

    it('should update user profile', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockUser, ...updateData }),
      });

      const result = await profileApi.updateProfile(updateData);

      expect(mockFetch).toHaveBeenCalledWith('/api/profile/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token',
        },
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual({ ...mockUser, ...updateData });
    });

    it('should throw error on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(profileApi.updateProfile(updateData)).rejects.toThrow('Failed to update profile');
    });
  });

  describe('syncGitHub', () => {
    it('should sync GitHub data', async () => {
      const mockGitHubData = {
        ...mockUser,
        githubUsername: 'testuser',
        githubId: 12345,
        githubAvatarUrl: 'https://github.com/avatar.png',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGitHubData),
      });

      const result = await profileApi.syncGitHub();

      expect(mockFetch).toHaveBeenCalledWith('/api/profile/github/sync', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer mock-token',
        },
      });
      expect(result).toEqual(mockGitHubData);
    });

    it('should throw error on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(profileApi.syncGitHub()).rejects.toThrow('Failed to sync GitHub data');
    });
  });
}); 