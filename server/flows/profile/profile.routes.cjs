const express = require('express');
const { authenticateJWT } = require('../../common/middleware/auth.middleware.cjs');
const {
  getUserProfile,
  getProfileByUsername,
  updateUserProfile
} = require('./profile.controller.cjs');

const router = express.Router();

// Get current user's profile
router.get('/me', authenticateJWT, async (req, res) => {
  try {
    const profile = await getUserProfile(req.user?.userId);
    res.json(profile);
  } catch (error) {
    res.status(400).json({
      error: error.message || 'Failed to get profile'
    });
  }
});

// Get profile by username
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const profile = await getProfileByUsername(username);
    
    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found'
      });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(400).json({
      error: error.message || 'Failed to get profile'
    });
  }
});

// Update user profile
router.put('/me', authenticateJWT, async (req, res) => {
  try {
    const updatedProfile = await updateUserProfile(req.user?.userId, req.body);
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({
      error: error.message || 'Failed to update profile'
    });
  }
});

// Sync GitHub profile data
router.post('/github/sync', authenticateJWT, async (req, res) => {
  try {
    // Get the current user's profile first
    const profile = await getUserProfile(req.user?.userId);
    
    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found'
      });
    }
    
    // Check if GitHub username exists
    if (!profile.githubUsername && !req.body.username) {
      return res.status(400).json({
        error: 'GitHub username is required for sync'
      });
    }
    
    // Use GitHub username from profile or from request body
    const githubUsername = profile.githubUsername || req.body.username;
    
    // For now, we'll just update the profile with the GitHub username
    // In a real implementation, you would fetch data from GitHub API
    const updatedProfile = await updateUserProfile(req.user?.userId, {
      githubUsername,
      githubSync: new Date().toISOString(),
    });
    
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({
      error: error.message || 'Failed to sync GitHub profile'
    });
  }
});

module.exports = router; 