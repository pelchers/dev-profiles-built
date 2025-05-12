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

module.exports = router; 