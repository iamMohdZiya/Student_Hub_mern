# MERN Stack Backend - Complete User Management System

## 🚀 Features

### ✅ **Fixed and Implemented:**
- **Complete User Authentication System** with JWT
- **Admin Panel** with full user management
- **User Approval System** (pending → approved/rejected)
- **Education Management System**
- **Profile Management** with image upload
- **Role-based Access Control** (USER/ADMIN)
- **Comprehensive API** with proper error handling
- **Database Integration** with MongoDB
- **File Upload Support** for profile images
- **CORS Support** for frontend integration



### 📋 **Admin Panel Features:**
- **Dashboard Statistics** (total users, pending, approved, rejected)
- **User Management** (view all users with pagination and search)
- **User Approval/Rejection** with reason tracking
- **Bulk Operations** (approve/reject multiple users)
- **Role Management** (promote to admin/demote to user)
- **User Deletion** with data cleanup
- **Detailed User Profiles** with education data

## 🛠 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB running on localhost:27017
- npm or yarn package manager

### Installation

1. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration:**
   Create `.env` file (already exists):
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/majorjsLU
   JWT_SECRET=superBahubali
   ```

3. **Create Admin User:**
   ```bash
   npm run create-admin
   ```

4. **Start Server:**
   ```bash
   npm start
   ```

5. **Server Ready:**
   - Server: http://localhost:3000
   - MongoDB: Connected to `majorjsLU` database

## 🔐 Admin Login Credentials

**Default Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`
- Role: `ADMIN`
- Status: `approved`

> ⚠️ **Important:** Change the admin password after first login!

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # Database configuration
├── controller/
│   ├── adminController.js    # Admin panel logic
│   ├── profileController.js  # Profile management
│   ├── postController.js     # Post management
│   └── userLogin.js          # User authentication
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── isAdmin.js           # Admin role verification
│   └── multerConfig.js      # File upload configuration
├── model/
│   ├── user.js              # User schema with approval system
│   ├── education.js         # Education schema (fixed)
│   └── post.js              # Post schema
├── routes/
│   ├── admin.js             # Admin panel routes
│   ├── user.js              # User routes (cleaned up)
│   └── post.js              # Post routes
├── scripts/
│   └── createAdmin.js       # Admin user creation script
├── service/
│   └── authentication.js    # JWT token service
├── uploads/
│   ├── profiles/            # Profile image storage
│   └── posts/               # Post image storage
├── .env                     # Environment variables
├── app.js                   # Main application (with CORS)
├── package.json             # Dependencies and scripts
├── API_DOCUMENTATION.md     # Complete API documentation
└── README.md                # This file
```

## 🔄 User Registration Flow

1. **User Signs Up** → Status: `pending`
2. **Admin Reviews** → Can approve or reject with reason
3. **If Approved** → User can login and access system
4. **If Rejected** → User cannot login, receives rejection message

## 🎯 Key API Endpoints

### User Routes (`/user`)
- `POST /user/signup` - Register new user
- `POST /user/signin` - Login user
- `GET /user/logout` - Logout user
- `GET /user/profile` - Get profile
- `PUT /user/profile` - Update profile
- `POST /user/education` - Add education
- `GET /user/education` - Get education
- `PUT /user/education` - Update education
- `DELETE /user/education/:id` - Delete education

### Admin Routes (`/admin`)
- `GET /admin/stats` - Dashboard statistics
- `GET /admin/users` - Get all users (paginated)
- `GET /admin/users/pending` - Get pending users
- `PUT /admin/users/:id/approve` - Approve user
- `PUT /admin/users/:id/reject` - Reject user
- `DELETE /admin/users/:id` - Delete user
- `PUT /admin/users/:id/role` - Update user role
- `PUT /admin/users/bulk/approve` - Bulk approve
- `PUT /admin/users/bulk/reject` - Bulk reject

## 🧪 Testing the API

### Test User Registration:
```bash
curl -X POST http://localhost:3000/user/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@test.com","password":"password123"}'
```

### Test Admin Login:
```bash
curl -X POST http://localhost:3000/user/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Get User Stats (Admin):
```bash
curl -X GET http://localhost:3000/admin/stats \
  -H "Cookie: token=your_jwt_token"
```

## 🔒 Security Features

- **JWT Authentication** with HTTP-only cookies
- **Password Hashing** with crypto module
- **Role-based Access Control**
- **Input Validation** on all endpoints
- **CORS Protection** configured
- **Admin-only Routes** properly protected

## 📊 Database Schema

### User Model:
- Basic info (name, email, password)
- Profile (bio, profile image)
- Status system (pending/approved/rejected)
- Role system (USER/ADMIN)
- Timestamps

### Education Model:
- Personal details (DOB, degree, department)
- Academic records (10th, 12th, graduation percentages)
- College information
- Timeline (start date, end date, batch year)

## 🎨 Frontend Integration Ready

- **CORS configured** for popular development ports
- **RESTful API** with consistent responses
- **Comprehensive error handling**
- **File upload support** for images
- **Pagination support** for large datasets

## 📈 Next Steps

1. **Frontend Development:** Build React/Vue/Angular frontend
2. **Email Integration:** Add email notifications for approval/rejection
3. **Advanced Features:** Add more user management features
4. **Testing:** Add unit and integration tests
5. **Deployment:** Deploy to cloud platforms

## 🐛 Common Issues & Solutions

1. **MongoDB Connection:** Ensure MongoDB is running
2. **Port Conflicts:** Change PORT in .env if needed
3. **Admin Access:** Use the created admin credentials
4. **File Uploads:** Ensure uploads directories exist
5. **CORS Issues:** Add your frontend URL to CORS configuration

---

**🎉 Your complete MERN backend is ready!** 

The system now provides a solid foundation for any user management application with admin capabilities, education tracking, and secure authentication.
