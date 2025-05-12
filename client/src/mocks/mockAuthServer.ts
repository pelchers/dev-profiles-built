import { User, UserType, DevFocus, Role } from '../types/user';

/**
 * Mock Authentication API Server
 * This file provides mock implementations of our auth endpoints
 * for development and testing purposes.
 */

// Example successful signup response
export const mockSignupResponse = {
  user: {
    id: '1',
    email: 'newuser@example.com',
    userType: UserType.DEVELOPER,
    displayName: 'New Developer',
    emailVerified: false,
    role: Role.USER,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  message: 'Signup successful. Please check your email for verification.',
};

// Example email verification response
export const mockEmailVerificationResponse = {
  success: true,
  message: 'Email verified successfully',
  user: {
    ...mockSignupResponse.user,
    emailVerified: true,
  },
};

// Example login response
export const mockLoginResponse = {
  user: {
    ...mockSignupResponse.user,
    emailVerified: true,
  },
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  message: 'Login successful',
};

// Example error responses
export const mockAuthErrors = {
  invalidCredentials: {
    status: 401,
    message: 'Invalid email or password',
  },
  emailTaken: {
    status: 400,
    message: 'Email already registered',
  },
  invalidToken: {
    status: 401,
    message: 'Invalid or expired token',
  },
  unverifiedEmail: {
    status: 403,
    message: 'Please verify your email before logging in',
  },
  passwordTooWeak: {
    status: 400,
    message: 'Password does not meet security requirements',
    errors: [
      { field: 'password', message: 'Must be at least 8 characters' },
      { field: 'password', message: 'Must include uppercase and lowercase letters' },
      { field: 'password', message: 'Must include at least one number' },
      { field: 'password', message: 'Must include at least one special character' },
    ],
  },
};

// Example API endpoints
export const authApiEndpoints = {
  signup: '/api/auth/signup',
  login: '/api/auth/login',
  verifyEmail: '/api/auth/verify-email',
  resendVerification: '/api/auth/resend-verification',
  resetPassword: '/api/auth/reset-password',
  refreshToken: '/api/auth/refresh-token',
};

/**
 * MOCK API EXAMPLES
 * These examples show the complete flow of authentication requests/responses
 */

export const authApiExamples = {
  // Signup Examples
  signupRequest: {
    url: authApiEndpoints.signup,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      email: 'newuser@example.com',
      password: 'SecurePass123!',
      userType: UserType.DEVELOPER,
      displayName: 'New Developer',
    },
  },
  signupResponse: mockSignupResponse,

  // Login Examples
  loginRequest: {
    url: authApiEndpoints.login,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      email: 'user@example.com',
      password: 'SecurePass123!',
    },
  },
  loginResponse: mockLoginResponse,

  // Email Verification Examples
  verifyEmailRequest: {
    url: `${authApiEndpoints.verifyEmail}?token=verification-token-123`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
  verifyEmailResponse: mockEmailVerificationResponse,

  // Resend Verification Examples
  resendVerificationRequest: {
    url: authApiEndpoints.resendVerification,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      email: 'user@example.com',
    },
  },
  resendVerificationResponse: {
    success: true,
    message: 'Verification email sent successfully',
  },

  // Password Reset Examples
  resetPasswordRequest: {
    url: authApiEndpoints.resetPassword,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      email: 'user@example.com',
    },
  },
  resetPasswordResponse: {
    success: true,
    message: 'Password reset instructions sent to your email',
  },

  // Token Refresh Examples
  refreshTokenRequest: {
    url: authApiEndpoints.refreshToken,
    method: 'POST',
    headers: {
      'Authorization': 'Bearer refresh-token-123',
      'Content-Type': 'application/json',
    },
  },
  refreshTokenResponse: {
    token: 'new-access-token-123',
    refreshToken: 'new-refresh-token-123',
  },
};

/**
 * Mock validation functions
 * These simulate backend validation logic
 */

export const mockValidation = {
  isEmailValid: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isPasswordValid: (password: string): boolean => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  },

  getPasswordErrors: (password: string): string[] => {
    const errors = [];
    if (password.length < 8) errors.push('Must be at least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('Must include uppercase letters');
    if (!/[a-z]/.test(password)) errors.push('Must include lowercase letters');
    if (!/[0-9]/.test(password)) errors.push('Must include at least one number');
    if (!/[!@#$%^&*]/.test(password)) errors.push('Must include at least one special character');
    return errors;
  },
};

/**
 * Mock JWT functions
 * These simulate JWT handling
 */

export const mockJwtUtils = {
  generateToken: (userId: string): string => {
    return `mock-jwt-token-${userId}`;
  },

  verifyToken: (token: string): boolean => {
    return token.startsWith('mock-jwt-token-');
  },

  decodeToken: (token: string): { userId: string; exp: number } => {
    return {
      userId: token.split('-')[3],
      exp: Date.now() + 3600000, // 1 hour from now
    };
  },
};

/**
 * Mock session handling
 * These simulate session management
 */

export const mockSessionManager = {
  sessions: new Map<string, { userId: string; lastAccess: number }>(),

  createSession: (userId: string): string => {
    const sessionId = `session-${userId}-${Date.now()}`;
    mockSessionManager.sessions.set(sessionId, {
      userId,
      lastAccess: Date.now(),
    });
    return sessionId;
  },

  validateSession: (sessionId: string): boolean => {
    const session = mockSessionManager.sessions.get(sessionId);
    if (!session) return false;
    
    const expired = Date.now() - session.lastAccess > 3600000; // 1 hour
    if (expired) {
      mockSessionManager.sessions.delete(sessionId);
      return false;
    }

    session.lastAccess = Date.now();
    return true;
  },

  removeSession: (sessionId: string): void => {
    mockSessionManager.sessions.delete(sessionId);
  },
}; 