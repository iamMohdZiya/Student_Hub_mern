# MERN Stack Backend API Documentation

## Overview
This is a complete MERN stack backend with user authentication, admin panel, and education management system.

## Base URL
```
http://localhost:3000
```

## Authentication
The API uses JWT tokens stored in HTTP-only cookies for authentication.

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## User Routes (`/user`)

### 1. User Registration
**POST** `/user/signup`

Register a new user account. User will be in pending status awaiting admin approval.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Account created successfully! Your account is pending admin approval.",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "pending",
    "role": "USER"
  }
}
```

### 2. User Login
**POST** `/user/signin`

Login with email and password. Only approved users can login (except admins).

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "status": "approved",
    "profileImage": "default-profile.png",
    "bio": "me"
  }
}
```

### 3. User Logout
**GET** `/user/logout`

Logout current user by clearing authentication token.

---

## Profile Management

### 4. Get Profile
**GET** `/user/profile`
**GET** `/user/profile/:userId`

Get user profile information.

**Response:**
```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "status": "approved",
  "profileImage": "profile_image.jpg",
  "bio": "Software Developer",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 5. Update Profile
**PUT** `/user/profile`

Update user profile with optional image upload.

**Request Body:** (Form Data)
- `name` (string, optional)
- `bio` (string, optional)
- `profileImage` (file, optional)

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe Updated",
    "email": "john@example.com",
    "profileImage": "new_profile_image.jpg",
    "bio": "Updated bio",
    "role": "USER",
    "status": "approved"
  }
}
```

### 6. Get Profile Image
**GET** `/user/profile-image/:userId`

Get user's profile image file.

---

## Education Management

### 7. Add Education
**POST** `/user/education`

Add education record for the authenticated user.

**Request Body:**
```json
{
  "degree": "Bachelor of Computer Science",
  "dob": "1995-01-01",
  "department": "Computer Science",
  "batchYear": "2017",
  "endDate": "2021-06-30",
  "currentCollege": "University of Technology",
  "description": "Studied computer science fundamentals",
  "percentage_10th": {
    "percentage": 85,
    "college": "ABC High School",
    "startDate": "2010-04-01"
  },
  "percentage_12th": {
    "percentage": 88,
    "college": "XYZ Senior Secondary",
    "startDate": "2012-04-01"
  },
  "graduationPercentage": 82
}
```

### 8. Get Education
**GET** `/user/education`
**GET** `/user/education/:educationId`

Get education records for the authenticated user.

### 9. Update Education
**PUT** `/user/education`

Update education record.

### 10. Delete Education
**DELETE** `/user/education/:educationId`

Delete education record.

---

## Admin Routes (`/admin`)

All admin routes require authentication and admin role.

### 11. Get Dashboard Statistics
**GET** `/admin/stats`

Get user statistics for admin dashboard.

**Response:**
```json
{
  "totalUsers": 100,
  "pendingUsers": 15,
  "approvedUsers": 80,
  "rejectedUsers": 5,
  "adminUsers": 2,
  "recentSignups": 8
}
```

### 12. Get All Users
**GET** `/admin/users?page=1&limit=10&status=pending&search=john`

Get paginated list of users with optional filters.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `status` (string: 'pending', 'approved', 'rejected', or 'all')
- `search` (string: search in name and email)

**Response:**
```json
{
  "users": [
    {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "totalUsers": 50
}
```

### 13. Get Pending Users
**GET** `/admin/users/pending?page=1&limit=10`

Get paginated list of pending users.

### 14. Get User Details
**GET** `/admin/users/:userId`

Get detailed user information including education data.

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "education": [
    {
      "id": "education_id",
      "degree": "Bachelor of Computer Science",
      "department": "Computer Science",
      "currentCollege": "University of Technology"
    }
  ]
}
```

### 15. Approve User
**PUT** `/admin/users/:userId/approve`

Approve a pending user.

**Response:**
```json
{
  "message": "User approved successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "status": "approved"
  }
}
```

### 16. Reject User
**PUT** `/admin/users/:userId/reject`

Reject a pending user.

**Request Body:**
```json
{
  "reason": "Incomplete profile information"
}
```

**Response:**
```json
{
  "message": "User rejected successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "status": "rejected",
    "rejectionReason": "Incomplete profile information"
  }
}
```

### 17. Delete User
**DELETE** `/admin/users/:userId`

Delete a user and all associated data.

**Response:**
```json
{
  "message": "User and associated data deleted successfully"
}
```

### 18. Update User Role
**PUT** `/admin/users/:userId/role`

Update user role (promote to admin or demote to user).

**Request Body:**
```json
{
  "role": "ADMIN"
}
```

### 19. Bulk Approve Users
**PUT** `/admin/users/bulk/approve`

Approve multiple users at once.

**Request Body:**
```json
{
  "userIds": ["user_id_1", "user_id_2", "user_id_3"]
}
```

### 20. Bulk Reject Users
**PUT** `/admin/users/bulk/reject`

Reject multiple users at once.

**Request Body:**
```json
{
  "userIds": ["user_id_1", "user_id_2"],
  "reason": "Batch rejection reason"
}
```

---

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "message": "Error description"
}
```

Common error scenarios:
- **401 Unauthorized**: Invalid or missing authentication token
- **403 Forbidden**: Insufficient permissions (non-admin accessing admin routes)
- **404 Not Found**: Resource not found
- **409 Conflict**: User already exists (during signup)
- **500 Internal Server Error**: Server-side errors

---

## User Status Flow

1. **Registration**: User signs up → Status: `pending`
2. **Admin Review**: Admin approves or rejects
3. **Approved**: User can login and access system
4. **Rejected**: User cannot login, receives rejection reason

---

## Admin Features

- View dashboard with user statistics
- Manage all users (view, approve, reject, delete)
- Bulk operations for user management
- Search and filter users
- View detailed user profiles and education data
- Promote users to admin or demote to regular user

---

## Getting Started

1. Install dependencies: `npm install`
2. Create admin user: `npm run create-admin`
3. Start server: `npm start`
4. Default admin credentials:
   - Email: `admin@example.com`
   - Password: `admin123`

## Environment Variables

Create a `.env` file with:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/majorjsLU
JWT_SECRET=your_jwt_secret_key
```
