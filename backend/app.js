const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const db = require('./config/db');
const cookieParser = require('cookie-parser');
const { checkForAthenticationCookie } = require('./middleware/auth');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const adminRoutes = require('./routes/admin');
const educationRoutes = require('./routes/education');
require('dotenv').config();

db();

// CORS configuration
const isProduction = process.env.NODE_ENV === 'development';
const isDocker = process.env.DOCKER === 'true';
const isRender = process.env.RENDER === 'true' || process.env.RENDER_SERVICE_NAME;

// Set up allowed origins based on environment
let allowedOrigins;
if (isProduction || isDocker || isRender) {
  // In production, Docker, or Render, allow same origin and specified origins
  allowedOrigins = ['self'];
  if (process.env.CORS_ORIGIN) {
    allowedOrigins.push(...process.env.CORS_ORIGIN.split(',').filter(Boolean));
  }
  if (isRender && process.env.RENDER_SERVICE_NAME) {
    allowedOrigins.push(`https://${process.env.RENDER_SERVICE_NAME}.onrender.com`);
  }
} else {
  // In development, allow all localhost variants
  allowedOrigins = [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ];
}

console.log('Environment:', { isProduction, isDocker, isRender });
console.log('CORS allowed origins:', allowedOrigins);

// CORS configuration function
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // In production/Docker/Render, allow same origin requests
    if (isProduction || isDocker || isRender) {
      // Allow same-origin requests (when frontend is served from same server)
      if (origin === `http://localhost:${process.env.PORT || 3000}` || 
          origin === `https://localhost:${process.env.PORT || 3000}`) {
        return callback(null, true);
      }
    }
    
    // Check if origin is in allowed origins
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('self')) {
      callback(null, true);
    } else {
      console.warn('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(checkForAthenticationCookie('token'));

// Serve static files from uploads directory
app.use('/uploads/profiles', express.static(path.join(__dirname, 'uploads/profiles')));
app.use('/uploads/posts', express.static(path.join(__dirname, 'uploads/posts')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0'
  });
});

// Routes
app.use('/user', userRoutes);
app.use('/posts', postRoutes);
app.use('/admin', adminRoutes);
app.use('/education', educationRoutes);

// Debug endpoint to check environment
app.get('/debug', (req, res) => {
  const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
  const indexPath = path.join(frontendPath, 'index.html');
  const fs = require('fs');
  
  res.json({
    nodeEnv: process.env.NODE_ENV,
    currentDir: __dirname,
    frontendPath: frontendPath,
    indexExists: fs.existsSync(indexPath),
    frontendDirExists: fs.existsSync(frontendPath),
    frontendContents: fs.existsSync(frontendPath) ? fs.readdirSync(frontendPath) : 'Directory not found',
    port: process.env.PORT,
    corsOrigin: process.env.CORS_ORIGIN
  });
});

// Serve React frontend in production or on Render
// Check for production OR if we're on Render platform
const isRenderPlatform = process.env.RENDER === 'true' || process.env.RENDER_SERVICE_NAME;

console.log('Environment check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('RENDER:', process.env.RENDER);
console.log('RENDER_SERVICE_NAME:', process.env.RENDER_SERVICE_NAME);
console.log('isProduction:', isProduction);
console.log('isRenderPlatform:', isRenderPlatform);


if (isProduction) {
  const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
  
  console.log('Production mode - serving frontend from:', frontendPath);
  console.log('Frontend directory exists:', require('fs').existsSync(frontendPath));
  
  // Serve static files
  app.use(express.static(frontendPath));

  // Catch-all handler for React routes - using regex pattern to avoid path-to-regexp issues
  app.get(/.*/, (req, res, next) => {
    const indexPath = path.join(frontendPath, 'index.html');

    // Skip API/static routes
    const skipPrefixes = [
      '/user', '/posts', '/admin', '/education',
      '/health', '/debug', '/uploads'
    ];
    if (skipPrefixes.some(prefix => req.path.startsWith(prefix))) {
      return next();
    }

    // Serve React index.html if it exists
    if (require('fs').existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(500).send(`
        <h1>Frontend Build Not Found</h1>
        <p>The frontend build directory was not found at: ${frontendPath}</p>
        <p>Make sure the frontend build completed successfully during deployment.</p>
        <p>Backend is running correctly - check /health endpoint</p>
        <p>Check debug info at /debug endpoint</p>
        <hr>
        <p><strong>Quick Debug:</strong></p>
        <p>NODE_ENV: ${process.env.NODE_ENV}</p>
        <p>Current directory: ${__dirname}</p>
        <p>Looking for frontend at: ${frontendPath}</p>
      `);
    }
  });
} else {
  app.get('/', (req, res) => {
    res.send(`
      <h1>Welcome to the StudentHub backend server!</h1>
      <p>Frontend is running on port 5173.</p>
      <p><strong>Current Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
      <p><a href="/health">Health Check</a> | <a href="/debug">Debug Info</a></p>
    `);
  });
}





app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT || 3000}`);
});

