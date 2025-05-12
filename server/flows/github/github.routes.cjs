const express = require('express');
const { authenticateJWT } = require('../../common/middleware/auth.middleware.cjs');
const {
  syncGitHubProfile,
  getGitHubProfile,
  updateGitHubProfile,
  extractGitHubUsername
} = require('./github.controller.cjs');

const router = express.Router();

// Sync GitHub profile data
router.post('/sync', authenticateJWT, async (req, res) => {
  try {
    const result = await syncGitHubProfile(req.user?.userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: error.message || 'Failed to sync GitHub profile'
    });
  }
});

// Get GitHub profile data
router.get('/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const profile = await getGitHubProfile(username);
    res.json(profile);
  } catch (error) {
    res.status(400).json({
      error: error.message || 'Failed to get GitHub profile'
    });
  }
});

// Update GitHub profile data
router.put('/profile', authenticateJWT, async (req, res) => {
  try {
    const result = await updateGitHubProfile(req.user?.userId, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: error.message || 'Failed to update GitHub profile'
    });
  }
});

// Extract GitHub username from URL
router.post('/extract-username', async (req, res) => {
  try {
    const { url } = req.body;
    const username = extractGitHubUsername(url);
    res.json({ username });
  } catch (error) {
    res.status(400).json({
      error: error.message || 'Failed to extract GitHub username'
    });
  }
});

module.exports = router; 