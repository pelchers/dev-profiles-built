import { PrismaClient } from '@prisma/client';
import { extractGitHubUsername } from '../github/github.controller';
import { syncUserGitHubProfile } from '../github/github.controller';
import { User, UserUpdateInput, UserResponse } from '../../common/types/user';

const prisma = new PrismaClient();

// Fetch a user's profile
export const getUserProfile = async (userId: string): Promise<UserResponse> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        userType: true,
        username: true,
        email: true,
        displayName: true,
        profileImage: true,
        bio: true,
        githubUrl: true,
        githubUsername: true,
        location: true,
        website: true,
        title: true,
        devFocus: true,
        languages: true,
        frameworks: true,
        tools: true,
        specialties: true,
        yearsExp: true,
        openToRoles: true,
        socialLinks: true,
        tags: true,
        preferences: true,
        interests: true,
        experience: true,
        education: true,
        techStacks: true,
        accolades: true,
        roles: true,
        githubStats: true,
        githubProfile: true,
        githubId: true,
        githubAvatarUrl: true,
        githubHtmlUrl: true,
        githubBio: true,
        githubCompany: true,
        githubBlog: true,
        githubTwitter: true,
        githubFollowers: true,
        githubFollowing: true,
        githubPublicRepos: true,
        githubPublicGists: true,
        githubCreatedAt: true,
        githubUpdatedAt: true,
        companyName: true,
        companySize: true,
        industry: true,
        hiring: true,
        openRoles: true,
        foundingYear: true,
        teamLinks: true,
        orgDescription: true,
        emailVerified: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Exclude sensitive fields: password, verificationToken, resetToken, resetTokenExpiry
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user as unknown as UserResponse;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Get profile by username (for public profiles)
export const getProfileByUsername = async (username: string): Promise<UserResponse> => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        userType: true,
        username: true,
        email: true,
        displayName: true,
        profileImage: true,
        bio: true,
        githubUrl: true,
        githubUsername: true,
        location: true,
        website: true,
        title: true,
        devFocus: true,
        languages: true,
        frameworks: true,
        tools: true,
        specialties: true,
        yearsExp: true,
        openToRoles: true,
        socialLinks: true,
        tags: true,
        interests: true,
        experience: true,
        education: true,
        techStacks: true,
        accolades: true,
        roles: true,
        githubStats: true,
        githubProfile: true,
        githubId: true,
        githubAvatarUrl: true,
        githubHtmlUrl: true,
        githubBio: true,
        githubCompany: true,
        githubBlog: true,
        githubTwitter: true,
        githubFollowers: true,
        githubFollowing: true,
        githubPublicRepos: true,
        githubPublicGists: true,
        githubCreatedAt: true,
        githubUpdatedAt: true,
        companyName: true,
        companySize: true,
        industry: true,
        hiring: true,
        openRoles: true,
        foundingYear: true,
        teamLinks: true,
        orgDescription: true,
        // Only public fields for other users
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user as unknown as UserResponse;
  } catch (error) {
    console.error('Error fetching profile by username:', error);
    throw error;
  }
};

// Update a user's profile
export const updateUserProfile = async (userId: string, profileData: UserUpdateInput): Promise<UserResponse> => {
  try {
    // Prevent updating sensitive fields
    const {
      id,
      email,
      password,
      emailVerified,
      verificationToken,
      resetToken,
      resetTokenExpiry,
      role,
      createdAt,
      updatedAt,
      ...safeUpdateData
    } = profileData as any;

    // Check if githubUrl was updated
    let shouldSyncGitHub = false;
    let githubUsername = safeUpdateData.githubUsername;

    // If githubUrl was updated but githubUsername wasn't explicitly set
    if (safeUpdateData.githubUrl && !safeUpdateData.githubUsername) {
      // Get current user data to check if githubUrl changed
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { githubUrl: true }
      });

      // If githubUrl has changed, extract the username and set flag to sync
      if (currentUser?.githubUrl !== safeUpdateData.githubUrl) {
        githubUsername = extractGitHubUsername(safeUpdateData.githubUrl);
        shouldSyncGitHub = true;
        
        // Add extracted username to update data
        if (githubUsername) {
          safeUpdateData.githubUsername = githubUsername;
        }
      }
    }

    // Update the user profile in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: safeUpdateData,
      select: {
        id: true,
        userType: true,
        username: true,
        email: true,
        displayName: true,
        profileImage: true,
        bio: true,
        githubUrl: true,
        githubUsername: true,
        location: true,
        website: true,
        title: true,
        devFocus: true,
        languages: true,
        frameworks: true,
        tools: true,
        specialties: true,
        yearsExp: true,
        openToRoles: true,
        socialLinks: true,
        tags: true,
        preferences: true,
        interests: true,
        experience: true,
        education: true,
        techStacks: true,
        accolades: true,
        roles: true,
        githubStats: true,
        githubProfile: true,
        githubId: true,
        githubAvatarUrl: true,
        githubHtmlUrl: true,
        githubBio: true,
        githubCompany: true,
        githubBlog: true,
        githubTwitter: true,
        githubFollowers: true,
        githubFollowing: true,
        githubPublicRepos: true,
        githubPublicGists: true,
        githubCreatedAt: true,
        githubUpdatedAt: true,
        companyName: true,
        companySize: true,
        industry: true,
        hiring: true,
        openRoles: true,
        foundingYear: true,
        teamLinks: true,
        orgDescription: true,
        emailVerified: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    // If GitHub URL was updated and username was extracted, sync GitHub data
    if (shouldSyncGitHub && githubUsername) {
      try {
        // Sync in background, don't await (to prevent blocking the response)
        syncUserGitHubProfile(userId, githubUsername).catch(error => {
          console.error('Background GitHub sync failed:', error);
        });
      } catch (error) {
        console.error('Failed to trigger GitHub sync:', error);
        // Don't throw error here, just log it - we still want to return the updated user
      }
    }

    return updatedUser as unknown as UserResponse;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}; 