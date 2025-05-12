const { AuthService } = require('./auth.service.cjs');

class AuthController {
  // Register new user
  static async register(req, res) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        error: error.message || 'Failed to register user'
      });
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: 'Email and password are required'
        });
      }

      const result = await AuthService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      // Don't reveal if user exists
      res.status(401).json({
        error: 'Invalid credentials'
      });
    }
  }

  // Refresh token
  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          error: 'Refresh token is required'
        });
      }

      const result = await AuthService.refreshToken(refreshToken);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({
        error: error.message || 'Invalid refresh token'
      });
    }
  }

  // Logout user
  static async logout(req, res) {
    try {
      // Clear refresh token from database
      await AuthService.logout(req.user?.userId);
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({
        error: error.message || 'Failed to logout'
      });
    }
  }
}

module.exports = { AuthController }; 