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
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? (process.env.CORS_ORIGIN || '').split(',').filter(Boolean)
  : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

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

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app build
  const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(frontendPath));

  // Catch all handler: send back React's index.html file
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Welcome to the StudentHub backend server! Frontend is running on port 5173.');
  });
}



app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT || 3000}`);
});

