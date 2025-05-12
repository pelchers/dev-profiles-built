import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import profileRoutes from './flows/profile/profile.routes';
import githubRoutes from './flows/github/github.routes';
import { PrismaClient } from '@prisma/client';

// Initialize environment variables
dotenv.config();

// Create Express server
const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : true,
  credentials: true,
}));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// Routes
app.use('/api/users', profileRoutes);
app.use('/api/github', githubRoutes);

// Catch-all for 404s
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

export default app; 