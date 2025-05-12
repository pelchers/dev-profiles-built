import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { User } from '../../common/types/user';

const prisma = new PrismaClient();
const GITHUB_API_URL = 'https://api.github.com';

// Fetch GitHub profile data
export const fetchGitHubProfile = async (username: string) => {
  try {
    const response = await axios.get(`${GITHUB_API_URL}/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // Add authorization if you have a GitHub token
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`
        })
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch GitHub profile:', error);
    throw new Error('GitHub profile not found or API limit reached');
  }
};

// Sync GitHub data for a specific user
export const syncUserGitHubProfile = async (userId: string, githubUsername: string) => {
  try {
    // Get the user first to ensure they exist
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Fetch GitHub profile data
    const githubData = await fetchGitHubProfile(githubUsername);

    // Update user with GitHub data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        githubUsername,
        githubId: githubData.id,
        githubAvatarUrl: githubData.avatar_url,
        githubHtmlUrl: githubData.html_url,
        githubBio: githubData.bio,
        githubCompany: githubData.company,
        githubBlog: githubData.blog,
        githubTwitter: githubData.twitter_username,
        githubFollowers: githubData.followers,
        githubFollowing: githubData.following,
        githubPublicRepos: githubData.public_repos,
        githubPublicGists: githubData.public_gists,
        githubCreatedAt: githubData.created_at ? new Date(githubData.created_at) : undefined,
        githubUpdatedAt: githubData.updated_at ? new Date(githubData.updated_at) : undefined,
        // Store the full GitHub profile as JSON
        githubProfile: githubData
      }
    });

    return updatedUser;
  } catch (error) {
    console.error('Failed to sync GitHub profile:', error);
    throw error;
  }
};

// Extract GitHub username from URL (helper function)
export const extractGitHubUsername = (url?: string): string | undefined => {
  if (!url) return undefined;
  
  try {
    const githubRegex = /github\.com\/([^\/]+)/;
    const match = url.match(githubRegex);
    return match ? match[1] : undefined;
  } catch (error) {
    console.error('Failed to extract GitHub username:', error);
    return undefined;
  }
};

// Batch sync for multiple users (used for scheduled sync)
export const batchSyncGitHubProfiles = async (batchSize = 100) => {
  try {
    // Get all users with a githubUsername set
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          githubUsername: null
        }
      },
      select: {
        id: true,
        githubUsername: true
      },
      take: batchSize
    });

    const results = {
      total: users.length,
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Process users in sequence (to respect rate limits)
    for (const user of users) {
      try {
        if (user.githubUsername) {
          await syncUserGitHubProfile(user.id, user.githubUsername);
          results.successful++;
        }
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Failed to sync ${user.githubUsername}: ${error.message}`);
      }
      
      // Small delay to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  } catch (error) {
    console.error('Batch GitHub sync failed:', error);
    throw error;
  }
}; 