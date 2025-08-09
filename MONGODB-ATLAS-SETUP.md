# 🗄️ MongoDB Atlas Setup Guide

**Complete step-by-step guide to set up MongoDB Atlas for StudentHub**

## 🎯 What is MongoDB Atlas?

MongoDB Atlas is MongoDB's cloud database service. The **free tier (M0)** includes:
- ✅ 512 MB storage (enough for thousands of users)
- ✅ Shared RAM and vCPU
- ✅ No time limits
- ✅ Built-in security
- ✅ Automatic backups

## 📋 Step 1: Create MongoDB Atlas Account

### 1.1 Sign Up
1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Click **"Try Free"** or **"Sign Up"**
3. Choose sign-up method:
   - **Email + Password** (recommended)
   - **Google Account**
   - **GitHub Account**

### 1.2 Account Verification
1. Check your email for verification link
2. Click the verification link
3. Complete your profile information

### 1.3 Welcome Survey (Optional)
- You can skip this or fill it out
- Select "I'm learning MongoDB" if asked

## 🏗️ Step 2: Create Your First Cluster

### 2.1 Choose Deployment Type
1. You'll see "Deploy your database" page
2. Click **"Create"** under **M0 FREE**
   - **Don't** choose M2/M5 (these are paid)
   - Look for the **"FREE"** label

### 2.2 Configure Your Cluster
**Cloud Provider & Region:**
- **Provider**: AWS (recommended)
- **Region**: Choose closest to **Oregon, USA** (where Render servers are)
  - Good options: `us-west-2` (Oregon), `us-west-1` (California)
  - This reduces latency to your Render app

**Cluster Tier:**
- Should show **M0 Sandbox** (FREE)
- **Monthly Cost**: $0.00

**Additional Settings:**
- **Cluster Name**: `studenthub-cluster` (or any name you prefer)
- **MongoDB Version**: Use default (latest)
- Leave other settings as default

### 2.3 Create Cluster
1. Click **"Create"**
2. **Wait 3-5 minutes** for cluster creation
3. You'll see a progress screen - this is normal

## 🔐 Step 3: Database Access (Create User)

### 3.1 Create Database User
While cluster is creating, set up database access:

1. On the left sidebar, click **"Database Access"**
2. Click **"+ ADD NEW DATABASE USER"**

### 3.2 Configure Database User
**Authentication Method:**
- Choose **"Password"** (default)

**Password Authentication:**
- **Username**: `studenthub_user`
- **Password**: Click **"Autogenerate Secure Password"**
  - **IMPORTANT**: Copy and save this password somewhere safe!
  - Or create your own strong password (mix of letters, numbers, symbols)

**Database User Privileges:**
- Select **"Read and write to any database"**
- This gives your app permission to create/read/update/delete data

**Built-in Role:**
- Should show `readWriteAnyDatabase@admin`

### 3.3 Restrict Access (Optional)
- **Restrict Access to Specific Clusters**: Leave unchecked
- **Temporary User**: Leave unchecked (you want permanent access)

### 3.4 Add User
1. Click **"Add User"**
2. User will be created instantly

## 🌐 Step 4: Network Access (Allow Render)

### 4.1 Configure Network Access
1. On the left sidebar, click **"Network Access"**
2. Click **"+ ADD IP ADDRESS"**

### 4.2 Allow Access from Anywhere
**For Render deployment, you need to allow all IPs:**

1. Click **"ALLOW ACCESS FROM ANYWHERE"**
   - This sets IP Address to `0.0.0.0/0`
   - This is safe because you still need username/password to access

2. **Comment**: `Render deployment access`

3. Click **"Confirm"**

**⚠️ Important:** This is necessary because Render uses dynamic IPs that change frequently.

## 🔗 Step 5: Get Connection String

### 5.1 Connect to Your Cluster
1. Go back to **"Database"** (or **"Clusters"**) in left sidebar
2. Find your cluster and click **"Connect"**

### 5.2 Choose Connection Method
1. Click **"Connect your application"**
   - **Not** "MongoDB Shell" or "MongoDB Compass"

### 5.3 Configure Connection
**Driver and Version:**
- **Driver**: Node.js
- **Version**: 4.1 or later (default is fine)

### 5.4 Copy Connection String
You'll see a connection string like this:
```
mongodb+srv://studenthub_user:<password>@studenthub-cluster.xxxxxx.mongodb.net/?retryWrites=true&w=majority
```

**IMPORTANT Steps:**
1. **Copy the entire string**
2. **Replace `<password>`** with your actual password from Step 3.2
3. **Add database name** at the end before the `?`:

**Before:**
```
mongodb+srv://studenthub_user:yourpassword@studenthub-cluster.xxxxxx.mongodb.net/?retryWrites=true&w=majority
```

**After (add `/studenthub`):**
```
mongodb+srv://studenthub_user:yourpassword@studenthub-cluster.xxxxxx.mongodb.net/studenthub?retryWrites=true&w=majority
```

### 5.5 Save Your Connection String
**Save this complete connection string** - you'll need it for Render environment variables!

## ✅ Step 6: Test Your Setup (Optional)

### 6.1 Test Connection Locally
If you want to test the connection before deploying:

1. Update your `backend/.env` file:
   ```env
   MONGO_URI=mongodb+srv://studenthub_user:yourpassword@studenthub-cluster.xxxxxx.mongodb.net/studenthub?retryWrites=true&w=majority
   ```

2. Start your backend:
   ```bash
   cd backend
   npm run dev
   ```

3. Check logs - should see "Database connected successfully" or similar

## 🎉 Step 7: Success Checklist

Verify you have:
- [x] MongoDB Atlas account created
- [x] Free M0 cluster created and running
- [x] Database user created (`studenthub_user`)
- [x] Network access configured (0.0.0.0/0)
- [x] Connection string copied and saved
- [x] Database name added to connection string (`/studenthub`)

## 📊 Step 8: Monitor Your Database

### 8.1 View Your Data
After your app is deployed and users start registering:

1. Go to **"Database"** → **"Browse Collections"**
2. Select `studenthub` database
3. You'll see collections like:
   - `users` - User accounts
   - `posts` - User posts
   - `educations` - Education profiles

### 8.2 Monitor Usage
1. Go to **"Database"** → **"Metrics"**
2. Monitor:
   - Storage usage (512 MB limit)
   - Operations per second
   - Connections

## 💡 MongoDB Atlas Tips

### Free Tier Limits
- **Storage**: 512 MB
- **RAM**: Shared
- **Connections**: 500 concurrent
- **Clusters**: 1 per project

### When to Upgrade
Consider upgrading to M2 ($9/month) when you:
- Approach 512 MB storage
- Need dedicated RAM
- Want automated backups
- Need more concurrent connections

### Security Best Practices
- ✅ Use strong passwords
- ✅ Regularly rotate database passwords
- ✅ Monitor access logs
- ✅ Use specific IP addresses in production (when possible)

## 🔄 Managing Your Database

### Backup (Automatic on Free Tier)
- Atlas automatically backs up your data
- Free tier: 2-day backup retention

### Updates
- Atlas automatically updates MongoDB version
- No downtime for minor updates

### Scaling
- Easy upgrade to larger tiers
- No data migration needed

## 🆘 Troubleshooting

### Common Issues

**"Connection refused" errors:**
- Check network access settings
- Verify IP address is whitelisted (0.0.0.0/0)

**"Authentication failed" errors:**
- Verify username and password
- Check password special characters are URL-encoded

**"Database not found" errors:**
- Ensure `/studenthub` is added to connection string
- Database will be created automatically on first connection

**"Timeout" errors:**
- Check internet connection
- Verify cluster is in closest region to your app

### Getting Help
- **MongoDB Documentation**: [docs.mongodb.com](https://docs.mongodb.com)
- **Atlas Support**: Available in Atlas dashboard
- **Community Forums**: [community.mongodb.com](https://community.mongodb.com)

---

## 🎊 Next Step: Cloudinary Setup

After MongoDB Atlas is set up, continue with Cloudinary setup for image handling!

Your connection string should look like:
```
mongodb+srv://studenthub_user:yourpassword@studenthub-cluster.xxxxxx.mongodb.net/studenthub?retryWrites=true&w=majority
```

**Save this - you'll need it for Render deployment!** 🚀
