import dotenv from 'dotenv';
import path from 'path';

// Load env vars at the very beginning
dotenv.config({ path: path.join(__dirname, '../.env') });
// Fallback for different build structures
dotenv.config({ path: path.join(__dirname, '../../.env') });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import apiRoutes from './routes/api';

const app = express();
const PORT = process.env.PORT || 5000;

// Trust Cloud Run's proxy for rate-limiting
app.set('trust proxy', 1);

// Security & Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://*"],
      connectSrc: ["'self'", "https://*"],
    },
  },
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

app.use('/api/', limiter);

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));

app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    portal: 'ECI Voter Portal - भारत निर्वाचन',
    version: '1.2.0',
    security: 'Hardened'
  });
});

// API Routes
app.use('/api', apiRoutes);

// Export for testing
export default app;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 ECI Voter Portal Backend running on port ${PORT}`);
    console.log(`🔗 API Documentation: http://localhost:${PORT}/health`);
  });
}
