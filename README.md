# StudentHub - Full Stack Student Network Platform

A modern full-stack web application for students to connect, share achievements, and build their academic network.

## Features

### For Students
- **User Authentication**: Secure signup, login, and logout
- **Profile Management**: Create and edit personal profiles with bio and profile pictures
- **Post Creation**: Share achievements, projects, and updates with text and images
- **Social Feed**: View posts from all approved students
- **User Discovery**: Explore and connect with other students
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### For Administrators
- **User Approval System**: Review and approve/reject new user registrations
- **User Management**: View all users, manage roles, and delete accounts
- **Content Moderation**: Delete inappropriate posts
- **Dashboard**: View platform statistics and user activity

## Tech Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads (profile pictures and post images)
- **Bcrypt** for password hashing
- **Cloudinary** for image storage (optional)
- **CORS** enabled for frontend communication

### Frontend
- **React 19** with modern hooks
- **React Router DOM** for navigation
- **Tailwind CSS** for responsive styling
- **Vite** for fast development and building
- **Context API** for state management

## Project Structure

```
jsmajor/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controller/
│   │   ├── adminController.js    # Admin functionality
│   │   ├── postController.js     # Post management
│   │   ├── profileController.js  # Profile management
│   │   └── userLogin.js          # Authentication
│   ├── middleware/
│   │   ├── auth.js               # Authentication middleware
│   │   ├── isAdmin.js            # Admin authorization
│   │   └── multerConfig.js       # File upload configuration
│   ├── model/
│   │   ├── user.js               # User schema
│   │   ├── post.js               # Post schema
│   │   └── education.js          # Education schema (future feature)
│   ├── routes/
│   │   ├── admin.js              # Admin routes
│   │   ├── post.js               # Post routes
│   │   └── user.js               # User routes
│   ├── uploads/
│   │   ├── profiles/             # Profile pictures storage
│   │   └── posts/                # Post images storage
│   ├── .env                      # Environment variables
│   ├── app.js                    # Express app configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PostCard.jsx
│   │   │   └── PostForm.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx   # Authentication context
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Explore.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── ViewProfile.jsx
│   │   ├── services/
│   │   │   └── api.js            # API service layer
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Global styles
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment variables:**
   Create a `.env` file in the backend directory with:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/studenthub
   JWT_SECRET=your-super-secret-jwt-key-here
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name (optional)
   CLOUDINARY_API_KEY=your-api-key (optional)
   CLOUDINARY_API_SECRET=your-api-secret (optional)
   ```

4. **Create upload directories:**
   ```bash
   mkdir -p uploads/profiles uploads/posts
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

### Database Setup

1. **Start MongoDB:**
   - For local MongoDB: `mongod`
   - For MongoDB Atlas: Update the `MONGO_URI` in your `.env` file

2. **Create an Admin User:**
   ```bash
   cd backend
   npm run create-admin
   ```
   This will create an admin user with credentials you specify.

## Usage

### For Students

1. **Sign Up:** Create a new account with your name, email, and password
2. **Wait for Approval:** Your account will be pending until an admin approves it
3. **Login:** Once approved, log in with your credentials
4. **Create Profile:** Add a bio and profile picture
5. **Create Posts:** Share your achievements, projects, and updates
6. **Explore:** Discover other students and their posts
7. **View Profiles:** Click on other students to view their full profiles

### For Administrators

1. **Login:** Use your admin credentials to access the admin dashboard
2. **Review Users:** Go to Admin Dashboard to see pending user registrations
3. **Approve/Reject:** Approve legitimate students or reject suspicious accounts
4. **Manage Users:** View all users, change roles, or delete accounts if necessary
5. **Monitor Content:** Delete inappropriate posts if needed

## API Endpoints

### Authentication
- `POST /user/signup` - Register new user
- `POST /user/signin` - Login user
- `GET /user/logout` - Logout user

### Profile Management
- `GET /user/profile` - Get current user profile
- `GET /user/profile/:userId` - Get specific user profile
- `PUT /user/profile` - Update profile (with image upload)

### Posts
- `GET /posts` - Get all posts
- `POST /posts` - Create new post (with image upload)
- `GET /posts/:postId` - Get specific post
- `GET /posts/user/:userId` - Get posts by user
- `PUT /posts/:postId` - Update post
- `DELETE /posts/:postId` - Delete post

### Admin
- `GET /admin/stats` - Get platform statistics
- `GET /admin/users` - Get all users
- `GET /admin/users/pending` - Get pending users
- `PUT /admin/users/:userId/approve` - Approve user
- `PUT /admin/users/:userId/reject` - Reject user
- `DELETE /admin/users/:userId` - Delete user

## Security Features

- **JWT Authentication:** Secure token-based authentication
- **Password Hashing:** Bcrypt for secure password storage
- **User Approval System:** Admin must approve new registrations
- **Route Protection:** Protected routes for authenticated users
- **Admin Authorization:** Separate admin routes and permissions
- **File Upload Security:** Validated file uploads with size limits
- **CORS Configuration:** Proper cross-origin resource sharing setup

## Future Enhancements

- Education profile sections with academic achievements
- Real-time messaging between students
- Event creation and management
- Study group formation
- Project collaboration features
- Mobile app development
- Email notifications
- Advanced search and filtering
- User reputation system

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Contact the development team

---


