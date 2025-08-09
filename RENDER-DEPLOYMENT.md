# StudentHub Render Deployment Guide

🚀 **Complete guide to deploy StudentHub on Render**

## 📋 Prerequisites

Before starting, ensure you have:
- [x] Git repository (GitHub/GitLab/Bitbucket)
- [x] MongoDB Atlas account (free tier available)
- [x] Cloudinary account (optional, for image storage)
- [x] Render account (free tier available)

## 🗄️ Step 1: Setup MongoDB Atlas

Since Render doesn't provide MongoDB, you'll use MongoDB Atlas (free):

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign up for free account
3. Create a new project: "StudentHub"

### 1.2 Create Database Cluster
1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select region closest to **Oregon** (where your Render app will be)
4. Name your cluster: `studenthub-cluster`
5. Click "Create Cluster"

### 1.3 Setup Database Access
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `studenthub_user`
5. Generate secure password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 1.4 Setup Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow access from anywhere" (0.0.0.0/0)
   - This allows Render to connect from any IP
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Driver: **Node.js**, Version: **4.1 or later**
4. Copy the connection string - it looks like:
   ```
   mongodb+srv://studenthub_user:<password>@studenthub-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name at the end: `/studenthub`

Final connection string example:
```
mongodb+srv://studenthub_user:yourpassword@studenthub-cluster.xxxxx.mongodb.net/studenthub?retryWrites=true&w=majority
```

## 🚀 Step 2: Deploy to Render

### 2.1 Connect Your Repository
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your Git provider (GitHub recommended)
4. Select your `studenthub` repository
5. Click "Connect"

### 2.2 Configure Your Service
Render will detect your `render.yaml` file automatically, but verify these settings:

**Basic Settings:**
- **Name**: `studenthub-app` (or your preferred name)
- **Region**: Oregon (USA West)
- **Branch**: `main` (or your default branch)
- **Runtime**: Node.js
- **Build Command**: Uses render.yaml configuration
- **Start Command**: Uses render.yaml configuration

**Plan:**
- Choose **Free** tier for testing
- Upgrade to **Starter** ($7/month) for production with custom domain

### 2.3 Set Environment Variables

In the Render dashboard, go to "Environment" tab and add these variables:

**Required Variables:**
```bash
# Database
MONGO_URI = mongodb+srv://studenthub_user:yourpassword@studenthub-cluster.xxxxx.mongodb.net/studenthub?retryWrites=true&w=majority

# Security (Render will auto-generate JWT_SECRET)
JWT_SECRET = [Render will generate this automatically]

# Application
NODE_ENV = production
PORT = [Leave empty - Render sets this automatically]

# CORS (Important!)
CORS_ORIGIN = https://your-app-name.onrender.com
```

**Optional Variables (for Cloudinary):**
```bash
CLOUDINARY_CLOUD_NAME = your-cloudinary-name
CLOUDINARY_API_KEY = your-api-key
CLOUDINARY_API_SECRET = your-api-secret
```

### 2.4 Deploy
1. Click "Create Web Service"
2. Render will start building your application
3. Monitor the build logs for any errors
4. Build time: ~5-10 minutes for first deployment

## 📦 Step 3: Setup Cloudinary (Optional but Recommended)

For production-grade image handling:

### 3.1 Create Cloudinary Account
1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for free account
3. Go to Dashboard

### 3.2 Get API Credentials
1. Copy your credentials:
   - **Cloud Name**
   - **API Key** 
   - **API Secret**

### 3.3 Add to Render Environment Variables
Add the Cloudinary variables in Render dashboard → Environment tab.

## 🔍 Step 4: Verify Deployment

### 4.1 Check Application Health
1. Your app URL: `https://your-app-name.onrender.com`
2. Health check: `https://your-app-name.onrender.com/health`
3. Expected health response:
   ```json
   {
     "status": "healthy",
     "timestamp": "2025-01-01T12:00:00.000Z",
     "uptime": 123.45,
     "memory": {...},
     "version": "1.0.0"
   }
   ```

### 4.2 Test Key Features
- [x] User registration
- [x] User login
- [x] Profile creation
- [x] Post creation
- [x] Image uploads
- [x] Admin dashboard

### 4.3 Check Logs
If something isn't working:
1. Go to Render dashboard
2. Click on your service
3. Go to "Logs" tab
4. Check for error messages

## ⚡ Step 5: Performance & Production Setup

### 5.1 Custom Domain (Paid Plan Required)
1. Upgrade to Starter plan ($7/month)
2. Go to Settings → Custom Domain
3. Add your domain
4. Update CORS_ORIGIN environment variable

### 5.2 SSL Certificate
- Render provides free SSL certificates automatically
- Your app will be available on HTTPS

### 5.3 Environment Updates
After deployment, update CORS_ORIGIN:
```bash
CORS_ORIGIN = https://your-actual-domain.com,https://your-app-name.onrender.com
```

## 🛠️ Step 6: Create Admin User

After successful deployment:

1. **Option A: Via Application**
   - Go to your app: `https://your-app-name.onrender.com`
   - Register a new account
   - Contact you to manually promote to admin in MongoDB Atlas

2. **Option B: Direct Database Insert**
   - Go to MongoDB Atlas → Browse Collections
   - Select `studenthub` database → `users` collection
   - Find your user document
   - Edit the document:
   ```json
   {
     ...
     "role": "admin",
     "status": "approved"
   }
   ```

## 🚨 Common Issues & Solutions

### Build Failures
**Issue**: Build fails during npm install
**Solution**: Check package.json files are valid JSON

**Issue**: Frontend build fails
**Solution**: Check all frontend dependencies are installed

### Runtime Errors
**Issue**: Database connection error
**Solution**: 
- Verify MongoDB connection string
- Check MongoDB Atlas network access (0.0.0.0/0)
- Ensure database user has correct permissions

**Issue**: CORS errors
**Solution**: Update CORS_ORIGIN environment variable with your Render app URL

**Issue**: File uploads fail
**Solution**: 
- Check Cloudinary credentials
- Verify file size limits
- Ensure upload directories are created

### Performance Issues
**Issue**: App sleeps on free tier
**Solution**: 
- Free tier sleeps after 15 minutes of inactivity
- Upgrade to Starter plan ($7/month) for always-on service
- Use a service like UptimeRobot to ping your app

## 💰 Render Pricing

### Free Tier
- ✅ 750 hours/month (limited)
- ✅ SSL certificates
- ❌ Custom domains
- ❌ Always-on service (sleeps after 15 min)

### Starter ($7/month)
- ✅ Always-on service
- ✅ Custom domains
- ✅ SSL certificates
- ✅ More build minutes

### Professional ($25/month)
- ✅ Everything in Starter
- ✅ More resources
- ✅ Zero-downtime deploys

## 🔄 Updates & Redeployment

### Automatic Deployment
- Every push to your main branch triggers automatic deployment
- Monitor builds in Render dashboard

### Manual Deployment
1. Go to Render dashboard
2. Click "Manual Deploy" → "Deploy latest commit"

### Environment Variable Changes
- Changes to environment variables trigger automatic redeployment
- No code changes needed

## 📊 Monitoring

### Built-in Monitoring
- Render provides basic metrics in dashboard
- Monitor response times, memory usage, CPU usage

### Application Logs
- Access real-time logs in Render dashboard
- Set up log retention based on your plan

### Health Checks
- Render automatically monitors `/health` endpoint
- Automatic restart on health check failures

## 🎉 Success Checklist

After deployment, verify:

- [x] App loads at your Render URL
- [x] Health check returns 200 status
- [x] Database connection works
- [x] User registration works
- [x] User login works
- [x] File uploads work (if using Cloudinary)
- [x] Admin functions accessible
- [x] No console errors in browser
- [x] Mobile responsiveness works

---

## 🆘 Need Help?

If you encounter issues:

1. **Check Render logs** first
2. **Verify environment variables** are set correctly
3. **Test MongoDB connection** in Atlas dashboard
4. **Review this guide** for missed steps
5. **Check GitHub Issues** for similar problems

Your StudentHub application should now be live and accessible to users worldwide! 🌍

**Your app URL**: `https://your-app-name.onrender.com`

---

*Happy deploying! 🚀*
