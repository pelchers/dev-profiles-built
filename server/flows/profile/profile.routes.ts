import express, { Request, Response, Router } from 'express';
import { getUserProfile, getProfileByUsername, updateUserProfile } from './profile.controller';
import { authenticateJWT } from '../../common/middleware/auth.middleware';

const router: Router = express.Router();

// Get the current user's profile (authenticated route)
router.get('/profile', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const profile = await getUserProfile(userId);
    res.status(200).json(profile);
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    res.status(404).json({ error: error.message || 'Profile not found' });
  }
});

// Get a user's profile by username (public route)
router.get('/username/:username', async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    
    const profile = await getProfileByUsername(username);
    res.status(200).json(profile);
  } catch (error: any) {
    console.error('Error fetching profile by username:', error);
    res.status(404).json({ error: error.message || 'Profile not found' });
  }
});

// Update the current user's profile (authenticated route)
router.put('/profile', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const updateData = req.body;
    const updatedProfile = await updateUserProfile(userId, updateData);
    
    res.status(200).json(updatedProfile);
  } catch (error: any) {
    console.error('Error updating profile:', error);
    res.status(400).json({ error: error.message || 'Failed to update profile' });
  }
});

export default router; 