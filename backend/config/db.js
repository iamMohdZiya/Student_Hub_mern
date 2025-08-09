const mongoose = require('mongoose');

const db = async () => {
    mongoose
         .connect(process.env.MONGO_URI)
         .then(() => console.log('MongoDB connected'))
         .catch(err => console.error('MongoDB connection error:', err));
};

module.exports = db;
