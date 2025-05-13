const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const contactRoutes = require('./flows/contact/contactRoutes.cjs');
const authRoutes = require('./flows/auth/auth.routes.cjs');
const profileRoutes = require('./flows/profile/profile.routes.cjs');
const githubRoutes = require('./flows/github/github.routes.cjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Additional security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Rate limiting for all routes
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// API Routes - must come before static file serving
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/github', githubRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static files in production
if (process.env.NODE_ENV !== 'development') {
  // Ensure the static directory exists and has the right path
  const staticPath = path.resolve(__dirname, '../dist');
  console.log('Serving static files from:', staticPath);
  
  // Serve static files
  app.use(express.static(staticPath));
  
  // Handle SPA routing - this must come after API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.resolve(__dirname, '../dist/index.html'));
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// At the top of your main server file
if (process.env.NODE_ENV === 'production') {
  console.log('DATABASE_URL available:', !!process.env.DATABASE_URL);
  console.log('JWT_SECRET available:', !!process.env.JWT_SECRET);
  // Add other critical variables
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 