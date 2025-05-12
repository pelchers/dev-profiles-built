const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

// Sync GitHub profile data
async function syncGitHubProfile(userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { githubUsername: true }
  });

  if (!user?.githubUsername) {
    throw new Error('GitHub username not found');
  }

  try {
    // Fetch GitHub profile data
    const response = await axios.get(`https://api.github.com/users/${user.githubUsername}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`
        })
      }
    });

    const githubData = response.data;

    // Update user profile with GitHub data
    const updatedProfile = await prisma.user.update({
      where: { id: userId },
      data: {
        githubId: githubData.id.toString(),
        githubAvatarUrl: githubData.avatar_url,
        githubHtmlUrl: githubData.html_url,
        githubBio: githubData.bio,
        githubCompany: githubData.company,
        githubBlog: githubData.blog,
        githubLocation: githubData.location,
        githubTwitter: githubData.twitter_username,
        githubFollowers: githubData.followers,
        githubFollowing: githubData.following,
        githubPublicRepos: githubData.public_repos,
        githubPublicGists: githubData.public_gists,
        githubCreatedAt: new Date(githubData.created_at),
        githubUpdatedAt: new Date(githubData.updated_at)
      }
    });

    return updatedProfile;
  } catch (error) {
    throw new Error(`Failed to sync GitHub profile: ${error.message}`);
  }
}

// Get GitHub profile data
async function getGitHubProfile(username) {
  if (!username) {
    throw new Error('Username is required');
  }

  const profile = await prisma.user.findUnique({
    where: { githubUsername: username },
    select: {
      id: true,
      githubUsername: true,
      githubId: true,
      githubAvatarUrl: true,
      githubHtmlUrl: true,
      githubBio: true,
      githubCompany: true,
      githubBlog: true,
      githubLocation: true,
      githubTwitter: true,
      githubFollowers: true,
      githubFollowing: true,
      githubPublicRepos: true,
      githubPublicGists: true,
      githubCreatedAt: true,
      githubUpdatedAt: true,
      githubStats: true
    }
  });

  return profile;
}

// Update GitHub profile data
async function updateGitHubProfile(userId, profileData) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const updatedProfile = await prisma.user.update({
    where: { id: userId },
    data: {
      githubUsername: profileData.githubUsername,
      githubStats: typeof profileData.githubStats === 'string'
        ? JSON.parse(profileData.githubStats)
        : profileData.githubStats
    },
    select: {
      id: true,
      githubUsername: true,
      githubId: true,
      githubAvatarUrl: true,
      githubHtmlUrl: true,
      githubBio: true,
      githubCompany: true,
      githubBlog: true,
      githubLocation: true,
      githubTwitter: true,
      githubFollowers: true,
      githubFollowing: true,
      githubPublicRepos: true,
      githubPublicGists: true,
      githubCreatedAt: true,
      githubUpdatedAt: true,
      githubStats: true
    }
  });

  return updatedProfile;
}

// Extract GitHub username from URL
function extractGitHubUsername(url) {
  if (!url) {
    throw new Error('URL is required');
  }

  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== 'github.com') {
      throw new Error('Not a valid GitHub URL');
    }

    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    if (pathParts.length === 0) {
      throw new Error('No username found in URL');
    }

    return pathParts[0];
  } catch (error) {
    throw new Error(`Invalid GitHub URL: ${error.message}`);
  }
}

module.exports = {
  syncGitHubProfile,
  getGitHubProfile,
  updateGitHubProfile,
  extractGitHubUsername
}; 