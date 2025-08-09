# StudentHub Premium - Education API Documentation

## Overview

This document outlines the new premium education features and API endpoints added to StudentHub, creating a LinkedIn-clone experience for students.

## New Features Added

### 1. Premium LinkedIn-Style UI
- **Premium Color Scheme**: LinkedIn blue (#0a66c2) and gold accents (#f5c842)
- **Professional Navbar**: Icon-based navigation with status indicators
- **Card-based Layout**: Premium cards with golden accent borders
- **LinkedIn-style Buttons**: Gradient buttons with hover effects
- **Premium Badges**: Gold gradient badges for premium features

### 2. Education Profile System
- **Comprehensive Education Tracking**: Current education, 12th grade, 10th grade
- **Academic Details**: Degree, department, college, batch year, GPA
- **Date Management**: Start dates, end dates, completion years
- **Description Support**: Academic achievements and additional information

### 3. Enhanced Home Page
- **Three-column Layout**: Profile sidebar, main feed, trending sidebar
- **Profile Statistics**: View counts, post impressions
- **Quick Actions**: Status updates, education management
- **Trending Topics**: Educational hashtags and metrics
- **People Suggestions**: Network recommendations

## API Endpoints

### Education Management

#### 1. Create Education Profile
```http
POST /education
Content-Type: application/json
Authorization: Required (Cookie-based)

{
  "degree": "Bachelor of Technology",
  "department": "Computer Science Engineering", 
  "currentCollege": "IIT Delhi",
  "batchYear": "2024",
  "startDate": "2020-08-01",
  "endDate": "2024-06-30",
  "dob": "2001-05-15",
  "graduationPercentage": 85.5,
  "description": "Focused on AI and Machine Learning...",
  "percentage_10th": {
    "percentage": 88.2,
    "college": "ABC High School",
    "startDate": "2017-06-01"
  },
  "percentage_12th": {
    "percentage": 92.4,
    "college": "XYZ Senior Secondary School", 
    "startDate": "2019-06-01"
  }
}
```

**Response:**
```json
{
  "message": "Education profile created successfully",
  "education": {
    "_id": "education_id",
    "userId": "user_id",
    "degree": "Bachelor of Technology",
    "department": "Computer Science Engineering",
    "currentCollege": "IIT Delhi",
    "batchYear": "2024",
    "startDate": "2020-08-01T00:00:00.000Z",
    "endDate": "2024-06-30T00:00:00.000Z",
    "dob": "2001-05-15T00:00:00.000Z",
    "graduationPercentage": 85.5,
    "description": "Focused on AI and Machine Learning...",
    "percentage_10th": {
      "percentage": 88.2,
      "college": "ABC High School",
      "startDate": "2017-06-01T00:00:00.000Z"
    },
    "percentage_12th": {
      "percentage": 92.4,
      "college": "XYZ Senior Secondary School",
      "startDate": "2019-06-01T00:00:00.000Z"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 2. Update Education Profile
```http
PUT /education
Content-Type: application/json
Authorization: Required (Cookie-based)

{
  "graduationPercentage": 87.2,
  "description": "Updated description with new achievements..."
}
```

#### 3. Get Current User's Education Profile
```http
GET /education/me
Authorization: Required (Cookie-based)
```

**Response:**
```json
{
  "education": {
    "_id": "education_id",
    "userId": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "profileImage": "profile_image.jpg",
      "bio": "Computer Science Student"
    },
    "degree": "Bachelor of Technology",
    "department": "Computer Science Engineering",
    "currentCollege": "IIT Delhi",
    "batchYear": "2024",
    "startDate": "2020-08-01T00:00:00.000Z",
    "endDate": "2024-06-30T00:00:00.000Z",
    "dob": "2001-05-15T00:00:00.000Z",
    "graduationPercentage": 87.2,
    "description": "Updated description with new achievements...",
    "percentage_10th": {
      "percentage": 88.2,
      "college": "ABC High School",
      "startDate": "2017-06-01T00:00:00.000Z"
    },
    "percentage_12th": {
      "percentage": 92.4,
      "college": "XYZ Senior Secondary School",
      "startDate": "2019-06-01T00:00:00.000Z"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

#### 4. Get Specific User's Education Profile
```http
GET /education/:userId
Authorization: Not required (Public)
```

#### 5. Browse All Education Profiles
```http
GET /education/browse?department=Computer Science&batchYear=2024&degree=Bachelor&page=1&limit=10
Authorization: Not required (Public)
```

**Query Parameters:**
- `department`: Filter by department (case-insensitive)
- `batchYear`: Filter by batch year (exact match)
- `degree`: Filter by degree type (case-insensitive)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**
```json
{
  "educations": [
    {
      "_id": "education_id",
      "userId": {
        "_id": "user_id",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "profileImage": "jane_profile.jpg",
        "bio": "CS Student",
        "status": "approved"
      },
      "degree": "Bachelor of Technology",
      "department": "Computer Science Engineering",
      "currentCollege": "IIT Delhi",
      "batchYear": "2024",
      "graduationPercentage": 89.5,
      "description": "Specializing in Machine Learning...",
      "createdAt": "2024-01-10T09:20:00.000Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "total": 45
}
```

#### 6. Delete Education Profile
```http
DELETE /education
Authorization: Required (Cookie-based)
```

**Response:**
```json
{
  "message": "Education profile deleted successfully"
}
```

### Admin Endpoints

#### 7. Get Education Statistics (Admin Only)
```http
GET /education/admin/stats
Authorization: Required (Admin Cookie-based)
```

**Response:**
```json
{
  "totalProfiles": 150,
  "departmentStats": [
    { "_id": "Computer Science Engineering", "count": 45 },
    { "_id": "Mechanical Engineering", "count": 32 },
    { "_id": "Electrical Engineering", "count": 28 }
  ],
  "batchStats": [
    { "_id": "2024", "count": 67 },
    { "_id": "2023", "count": 52 },
    { "_id": "2025", "count": 31 }
  ],
  "degreeStats": [
    { "_id": "Bachelor of Technology", "count": 89 },
    { "_id": "Master of Science", "count": 34 },
    { "_id": "Bachelor of Science", "count": 27 }
  ]
}
```

## Frontend Components

### 1. Education Page (/education)
- **Full CRUD Interface**: Create, read, update education profiles
- **Form Validation**: Required fields and data type validation  
- **Responsive Design**: Mobile-friendly form layout
- **Premium Styling**: LinkedIn-inspired design language

### 2. Enhanced Navbar
- **Professional Icons**: Education, Home, Network navigation
- **Status Indicators**: Online status, notifications
- **Premium Dropdown**: Enhanced profile menu with quick actions
- **Search Integration**: Global search functionality

### 3. Premium Home Page
- **Sidebar Layout**: Profile stats, quick actions, trending topics
- **Feed Interface**: LinkedIn-style post feed
- **Welcome Banner**: Premium onboarding for new users
- **Network Suggestions**: People you may know recommendations

## Data Models

### Education Schema
```javascript
{
  userId: { type: ObjectId, ref: 'User', required: true },
  degree: { type: String, required: true },
  dob: { type: Date, required: true },
  department: { type: String, required: true },
  batchYear: { type: String, required: true },
  endDate: { type: Date, required: true },
  currentCollege: { type: String, required: true },
  description: { type: String, required: false },
  percentage_10th: {
    percentage: { type: Number, required: false },
    college: { type: String, required: false },
    startDate: { type: Date, required: false }
  },
  percentage_12th: {
    percentage: { type: Number, required: false },
    college: { type: String, required: false },
    startDate: { type: Date, required: false }
  },
  startDate: { type: Date, required: false },
  graduationPercentage: { type: Number, required: false },
  timestamps: true
}
```

## Authentication & Authorization

### Authentication Requirements
- **Protected Routes**: All CUD operations require authentication
- **Admin Routes**: Statistics endpoint requires admin privileges
- **Public Routes**: Browse and view operations are public

### Security Features
- **JWT Cookie Authentication**: Secure token-based auth
- **User Status Validation**: Only approved users can access features
- **Input Sanitization**: Validated and sanitized user inputs
- **Rate Limiting**: Protection against API abuse

## Frontend API Integration

### JavaScript API Client
```javascript
// Education API methods added to apiService
async createEducationProfile(educationData)
async updateEducationProfile(educationData) 
async getMyEducationProfile()
async getEducationProfile(userId)
async getAllEducationProfiles(filters)
async deleteEducationProfile()
async getEducationStats() // Admin only
```

### Usage Examples
```javascript
// Create education profile
const educationData = {
  degree: "Bachelor of Technology",
  department: "Computer Science Engineering",
  currentCollege: "IIT Delhi",
  batchYear: "2024",
  // ... other fields
};

try {
  const response = await apiService.createEducationProfile(educationData);
  console.log('Profile created:', response.data);
} catch (error) {
  console.error('Error:', error.message);
}

// Browse education profiles with filters
const filters = {
  department: "Computer Science",
  batchYear: "2024",
  page: 1,
  limit: 10
};

const profiles = await apiService.getAllEducationProfiles(filters);
```

## Error Handling

### Common Error Responses
```json
// Validation Error
{
  "message": "Validation failed",
  "errors": ["Degree is required", "End date is required"]
}

// Duplicate Profile Error
{
  "message": "Education profile already exists. Use update instead."
}

// Not Found Error
{
  "message": "Education profile not found"
}

// Authorization Error
{
  "message": "Access denied. Admin privileges required."
}
```

## Premium UI Features

### CSS Custom Properties
```css
:root {
  --linkedin-blue: #0a66c2;
  --linkedin-dark-blue: #004182;
  --linkedin-light-blue: #70b5f9;
  --premium-gold: #f5c842;
  --premium-gold-dark: #d4a017;
  --premium-gold-light: #ffd700;
}
```

### Premium Component Classes
- `.linkedin-card`: Standard LinkedIn-style cards
- `.premium-card`: Premium cards with gold accent
- `.btn-linkedin`: LinkedIn blue gradient buttons
- `.btn-premium`: Gold gradient premium buttons
- `.premium-badge`: Gold premium member badges
- `.profile-img`: Professional profile images with hover effects

## Installation & Setup

### Backend Setup
1. Install new dependencies (already included)
2. Start the server: `npm run dev` in backend directory
3. Education routes are automatically available at `/education`

### Frontend Setup  
1. Start development server: `npm run dev` in frontend directory
2. Access new Education page at `/education` (requires login)
3. Enhanced Home page automatically loads new premium design

## Testing the New Features

### Manual Testing Checklist
- [ ] Create education profile via `/education` page
- [ ] Update existing education profile
- [ ] View education profiles of other users
- [ ] Browse education profiles with filters
- [ ] Test responsive design on mobile devices
- [ ] Verify premium styling across all pages
- [ ] Test admin statistics endpoint
- [ ] Validate form inputs and error handling

### API Testing with cURL
```bash
# Create education profile
curl -X POST http://localhost:3000/education \
  -H "Content-Type: application/json" \
  -d '{"degree":"B.Tech","department":"CSE","currentCollege":"IIT Delhi","batchYear":"2024","dob":"2001-01-01","endDate":"2024-06-01"}' \
  --cookie-jar cookies.txt

# Get education profile  
curl -X GET http://localhost:3000/education/me \
  --cookie cookies.txt

# Browse profiles
curl -X GET "http://localhost:3000/education/browse?department=Computer&page=1&limit=5"
```

## Conclusion

The new education system transforms StudentHub into a premium LinkedIn-style platform for students, providing:

- **Professional UI/UX**: LinkedIn-inspired design with premium colors
- **Comprehensive Education Tracking**: Full academic profile management
- **Advanced Filtering**: Search and discover students by education criteria
- **Admin Analytics**: Statistical insights into platform usage
- **Responsive Design**: Mobile-first approach for all devices

The system is designed to scale and can be extended with additional features like skill endorsements, course recommendations, and academic achievements.
