const mongoose = require('mongoose');

const db = async () => {
    // Use MONGODB_URI or fallback to MONGO_URI for backward compatibility
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoUri) {
        console.error('MongoDB URI is not defined. Please set MONGODB_URI or MONGO_URI environment variable.');
        process.exit(1);
    }
    
    console.log('Connecting to MongoDB with URI:', mongoUri.replace(/\/\/.*@/, '//****@')); // Hide credentials in logs
    
    mongoose
         .connect(mongoUri)
         .then(() => console.log('MongoDB connected successfully'))
         .catch(err => {
             console.error('MongoDB connection error:', err.message);
             process.exit(1);
         });
};

module.exports = db;
