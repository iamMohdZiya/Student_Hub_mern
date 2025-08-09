// MongoDB initialization script for Docker
// This script runs when MongoDB container starts for the first time

db = db.getSiblingDB('studenthub');

// Create collections with indexes for better performance
db.createCollection('users');
db.createCollection('posts');
db.createCollection('educations');

// Create indexes for better query performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ status: 1 });
db.users.createIndex({ role: 1 });
db.users.createIndex({ createdAt: -1 });

db.posts.createIndex({ user: 1 });
db.posts.createIndex({ createdAt: -1 });
db.posts.createIndex({ 'user.status': 1 });

db.educations.createIndex({ userId: 1 }, { unique: true });
db.educations.createIndex({ department: 1 });
db.educations.createIndex({ batchYear: 1 });
db.educations.createIndex({ degree: 1 });
db.educations.createIndex({ currentCollege: 1 });

print('Database initialized with collections and indexes');

// Create default admin user if not exists
const adminExists = db.users.findOne({ email: 'admin@studenthub.com' });

if (!adminExists) {
    // Note: Password will be hashed by the application
    db.users.insertOne({
        name: 'System Administrator',
        email: 'admin@studenthub.com',
        password: 'admin123', // This will be hashed by the application
        role: 'admin',
        status: 'approved',
        bio: 'System Administrator',
        profileImage: 'default.png',
        createdAt: new Date(),
        updatedAt: new Date()
    });
    print('Default admin user created');
} else {
    print('Admin user already exists');
}
