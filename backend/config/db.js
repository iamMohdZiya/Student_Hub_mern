const mongoose = require('mongoose');

const db = async () => {
    // Use MONGODB_URI or fallback to MONGO_URI for backward compatibility
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoUri) {
        console.warn('MongoDB URI is not defined. Skipping database connection.');
        console.warn('Set MONGODB_URI or MONGO_URI environment variable to enable database.');
        return;
    }
    
    console.log('Connecting to MongoDB with URI:', mongoUri.replace(/\/\/.*@/, '//****@')); // Hide credentials in logs
    
    try {
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        console.warn('Server will continue without database connection.');
        // Don't exit process - let server start without DB for now
    }
};

module.exports = db;
