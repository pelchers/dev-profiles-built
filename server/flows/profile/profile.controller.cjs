const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get user profile by ID
async function getUserProfile(userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const profile = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      bio: true,
      userType: true,
      profileImage: true,
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
      tags: true,
      interests: true,
      experience: true,
      education: true,
      techStacks: true,
      accolades: true,
      roles: true,
      // Company specific fields
      companyName: true,
      companySize: true,
      industry: true,
      hiring: true,
      openRoles: true,
      foundingYear: true,
      teamLinks: true,
      orgDescription: true,
      // GitHub fields
      githubUsername: true,
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
      githubStats: true,
    }
  });

  if (!profile) {
    throw new Error('Profile not found');
  }

  return profile;
}

// Get profile by username
async function getProfileByUsername(username) {
  if (!username) {
    throw new Error('Username is required');
  }

  const profile = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      bio: true,
      userType: true,
      profileImage: true,
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
      tags: true,
      interests: true,
      experience: true,
      education: true,
      techStacks: true,
      accolades: true,
      roles: true,
      // Company specific fields
      companyName: true,
      companySize: true,
      industry: true,
      hiring: true,
      openRoles: true,
      foundingYear: true,
      teamLinks: true,
      orgDescription: true,
      // GitHub fields
      githubUsername: true,
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
      githubStats: true,
    }
  });

  return profile;
}

// Update user profile
async function updateUserProfile(userId, profileData) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  // Convert string arrays to proper format if needed
  const processedData = {
    ...profileData,
    // Convert JSON string fields if they're strings
    experience: typeof profileData.experience === 'string' 
      ? JSON.parse(profileData.experience) 
      : profileData.experience,
    education: typeof profileData.education === 'string'
      ? JSON.parse(profileData.education)
      : profileData.education,
    techStacks: typeof profileData.techStacks === 'string'
      ? JSON.parse(profileData.techStacks)
      : profileData.techStacks,
    accolades: typeof profileData.accolades === 'string'
      ? JSON.parse(profileData.accolades)
      : profileData.accolades,
    openRoles: typeof profileData.openRoles === 'string'
      ? JSON.parse(profileData.openRoles)
      : profileData.openRoles,
    teamLinks: typeof profileData.teamLinks === 'string'
      ? JSON.parse(profileData.teamLinks)
      : profileData.teamLinks,
  };

  // Update the profile
  const updatedProfile = await prisma.user.update({
    where: { id: userId },
    data: processedData,
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      bio: true,
      userType: true,
      profileImage: true,
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
      tags: true,
      interests: true,
      experience: true,
      education: true,
      techStacks: true,
      accolades: true,
      roles: true,
      // Company specific fields
      companyName: true,
      companySize: true,
      industry: true,
      hiring: true,
      openRoles: true,
      foundingYear: true,
      teamLinks: true,
      orgDescription: true,
      // GitHub fields
      githubUsername: true,
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
      githubStats: true,
    }
  });

  return updatedProfile;
}

module.exports = {
  getUserProfile,
  getProfileByUsername,
  updateUserProfile
}; 