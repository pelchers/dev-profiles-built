import express, { Request, Response, Router } from 'express';
import { 
  fetchGitHubProfile, 
  syncUserGitHubProfile, 
  batchSyncGitHubProfiles,
  extractGitHubUsername
} from './github.controller';
import { authenticateJWT } from '../../common/middleware/auth.middleware';

const router: Router = express.Router();

// Get GitHub profile by username (public endpoint)
router.get('/:username', async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ error: 'GitHub username is required' });
    }

    const githubData = await fetchGitHubProfile(username);
    res.status(200).json(githubData);
  } catch (error: any) {
    console.error('GitHub profile fetch error:', error);
    res.status(404).json({ error: error.message || 'Failed to fetch GitHub profile' });
  }
});

// Sync GitHub profile data for the authenticated user
router.post('/sync', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const { githubUsername, githubUrl } = req.body;
    
    // Extract username from URL if provided but no direct username
    let username = githubUsername;
    if (!username && githubUrl) {
      username = extractGitHubUsername(githubUrl);
    }
    
    if (!username) {
      return res.status(400).json({ error: 'GitHub username or URL is required' });
    }

    const updatedUser = await syncUserGitHubProfile(userId, username);
    res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error('GitHub sync error:', error);
    res.status(400).json({ error: error.message || 'Failed to sync GitHub profile' });
  }
});

// Sync GitHub profile for a specific username (authenticated user only)
router.post('/sync/:username', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const { username } = req.params;
    
    if (!username) {
      return res.status(400).json({ error: 'GitHub username is required' });
    }

    const updatedUser = await syncUserGitHubProfile(userId, username);
    res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error('GitHub sync error:', error);
    res.status(400).json({ error: error.message || 'Failed to sync GitHub profile' });
  }
});

// Admin route to trigger batch sync of all GitHub profiles
// This would typically be called by a scheduled job
router.post('/batch-sync', authenticateJWT, async (req: Request, res: Response) => {
  try {
    // Check if user is admin
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { batchSize } = req.body;
    const results = await batchSyncGitHubProfiles(batchSize || 100);
    
    res.status(200).json(results);
  } catch (error: any) {
    console.error('Batch GitHub sync error:', error);
    res.status(500).json({ error: error.message || 'Failed to run batch GitHub sync' });
  }
});

export default router; 