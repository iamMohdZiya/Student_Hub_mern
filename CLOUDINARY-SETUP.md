# ☁️ Cloudinary Setup Guide

**Complete step-by-step guide to set up Cloudinary for StudentHub image handling**

## 🎯 What is Cloudinary?

Cloudinary is a cloud-based image and video management service. The **free tier** includes:
- ✅ 25 GB storage
- ✅ 25 GB monthly bandwidth
- ✅ Image transformations (resize, crop, optimize)
- ✅ Automatic format optimization (WebP, AVIF)
- ✅ CDN delivery worldwide
- ✅ 1000 transformations/month

Perfect for StudentHub's profile pictures and post images!

## 📋 Step 1: Create Cloudinary Account

### 1.1 Sign Up
1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Click **"Sign up for free"**
3. Choose sign-up method:
   - **Email + Password** (recommended)
   - **Google Account**
   - **GitHub Account**

### 1.2 Account Setup
**Fill out the form:**
- **First Name**: Your first name
- **Last Name**: Your last name
- **Email**: Your email address
- **Company/Organization**: "Personal Project" or your name
- **Role**: "Developer" or "Student"

### 1.3 Email Verification
1. Check your email for verification link
2. Click the verification link
3. You'll be logged into your Cloudinary dashboard

### 1.4 Welcome Tour (Optional)
- Cloudinary might show a welcome tour
- You can skip this or go through it quickly

## 🔧 Step 2: Get Your API Credentials

### 2.1 Access Dashboard
After signing up, you'll be in your Cloudinary Console (dashboard).

### 2.2 Find Your Credentials
On the dashboard homepage, you'll see a **"Product Environment Credentials"** section with:

**Account Details:**
- **Cloud Name**: `your-cloud-name` 
- **API Key**: `123456789012345`
- **API Secret**: `abcdefghijklmnopqrstuvwxyz123456` (hidden by default)

### 2.3 Reveal and Copy Credentials

**Cloud Name:**
- This is visible by default
- Copy and save it: `your-cloud-name`

**API Key:**
- This is visible by default
- Copy and save it: `123456789012345`

**API Secret:**
- Click the **"👁️ Show"** icon next to API Secret
- Copy and save it: `abcdefghijklmnopqrstuvwxyz123456`

### 2.4 Save Your Credentials
**Important**: Save these three values - you'll need them for Render:

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345  
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

## ⚙️ Step 3: Configure Upload Settings (Optional)

### 3.1 Access Settings
1. Click the **"Settings"** gear icon (⚙️) in the top right
2. Go to **"Upload"** tab

### 3.2 Configure Upload Presets (Recommended)
Upload presets define how images are processed when uploaded.

**Create Upload Preset for Profile Pictures:**
1. Scroll to **"Upload presets"** section
2. Click **"Add upload preset"**
3. Configure:
   - **Preset name**: `studenthub_profiles`
   - **Signing mode**: `Unsigned` (allows uploads without backend signature)
   - **Folder**: `studenthub/profiles`
   - **Access mode**: `Public`
   - **Resource type**: `Image`
   - **Format**: `Auto` (Cloudinary chooses best format)
   - **Quality**: `Auto`
   - **Transformation**: 
     - Width: `400`
     - Height: `400`
     - Crop: `fill` (crops to exact dimensions)
     - Gravity: `face` (focuses on faces when cropping)

4. Click **"Save"**

**Create Upload Preset for Post Images:**
1. Click **"Add upload preset"** again
2. Configure:
   - **Preset name**: `studenthub_posts`
   - **Signing mode**: `Unsigned`
   - **Folder**: `studenthub/posts`
   - **Access mode**: `Public`
   - **Resource type**: `Image`
   - **Format**: `Auto`
   - **Quality**: `Auto`
   - **Transformation**: 
     - Width: `800`
     - Height: `600`
     - Crop: `limit` (don't exceed dimensions, maintain aspect ratio)

3. Click **"Save"**

## 🔒 Step 4: Security Settings (Optional but Recommended)

### 4.1 Access Security Settings
1. In Settings, go to **"Security"** tab

### 4.2 Configure Allowed Origins
To restrict uploads to your domain only:

1. Scroll to **"Restricted media types"** section
2. **Allowed origins**: Add your domains:
   ```
   https://your-app-name.onrender.com
   http://localhost:5173
   http://localhost:3000
   ```

### 4.3 Resource Limits
Set limits to prevent abuse:

1. **Max file size**: `5 MB` (default is usually 10MB)
2. **Max image dimensions**: `2048x2048` (prevents huge uploads)

## 🧪 Step 5: Test Your Setup (Optional)

### 5.1 Test Upload Widget
1. In your dashboard, click **"Media Library"** in left sidebar
2. Click **"Upload"** button
3. Try uploading a test image
4. Should appear in your media library

### 5.2 Test API Integration
If you want to test locally before deploying:

1. Update your `backend/.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
   ```

2. Start your app and try uploading a profile picture or post image

## 🎉 Step 6: Success Checklist

Verify you have:
- [x] Cloudinary account created
- [x] Cloud Name copied and saved
- [x] API Key copied and saved  
- [x] API Secret copied and saved
- [x] Upload presets created (optional)
- [x] Security settings configured (optional)

## 🔄 Step 7: Integration with StudentHub

### 7.1 How It Works in Your App
Your StudentHub app already has Cloudinary integration built-in:

**Profile Pictures:**
- User uploads image through your app
- App sends image to Cloudinary
- Cloudinary processes and optimizes image
- Returns URL to optimized image
- App saves URL in MongoDB

**Post Images:**
- Same process for post images
- Images are automatically optimized for web

### 7.2 Benefits You Get
- **Fast Loading**: Images served via CDN worldwide
- **Automatic Optimization**: WebP format for modern browsers
- **Responsive Images**: Different sizes for different devices
- **Backup**: Images stored safely in cloud
- **Transformations**: Automatic cropping, resizing

## 📊 Step 8: Monitor Your Usage

### 8.1 Check Usage Dashboard
1. In Cloudinary dashboard, go to **"Dashboard"** (home)
2. View usage stats:
   - **Storage**: How much space you're using
   - **Bandwidth**: Monthly data transfer
   - **Transformations**: Image processing operations

### 8.2 Set Up Alerts (Optional)
1. Go to **Settings** → **"Notifications"**
2. Set up email alerts when you reach:
   - 80% of storage limit
   - 80% of bandwidth limit

## 💡 Cloudinary Tips

### Free Tier Limits
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 1000/month
- **Admin API calls**: 500/hour

### When to Upgrade
Consider upgrading when you:
- Approach storage/bandwidth limits
- Need more transformations
- Want video support
- Need advanced features

### Best Practices
- ✅ Use upload presets for consistent image processing
- ✅ Set file size limits to prevent huge uploads
- ✅ Use folders to organize images (`studenthub/profiles`, `studenthub/posts`)
- ✅ Enable auto-format for best performance
- ✅ Set quality to "auto" for optimal file sizes

## 🔧 Advanced Features (Optional)

### 8.1 Image Transformations
You can transform images on-the-fly by changing URLs:

**Original**: 
```
https://res.cloudinary.com/your-cloud/image/upload/profile.jpg
```

**Resized to 200x200**:
```
https://res.cloudinary.com/your-cloud/image/upload/w_200,h_200,c_fill/profile.jpg
```

**Optimized for web**:
```
https://res.cloudinary.com/your-cloud/image/upload/f_auto,q_auto/profile.jpg
```

### 8.2 Responsive Images
Cloudinary can serve different sizes based on device:

```html
<img src="https://res.cloudinary.com/your-cloud/image/upload/w_auto,c_scale/profile.jpg" 
     sizes="(max-width: 768px) 100vw, 50vw">
```

## 🆘 Troubleshooting

### Common Issues

**"Invalid API credentials" errors:**
- Double-check your Cloud Name, API Key, and API Secret
- Ensure no extra spaces in the values
- Verify you're using the correct environment variables

**"Upload failed" errors:**
- Check file size limits (default 10MB)
- Verify file format is supported (JPG, PNG, GIF, WebP)
- Check your internet connection

**"Transformation limit exceeded" errors:**
- You've used your 1000 monthly transformations
- Consider upgrading or optimizing your transformation usage

**Images not loading:**
- Verify the Cloudinary URL is correct
- Check if images are set to "Public" access mode
- Ensure your app has internet connectivity

### Getting Help
- **Cloudinary Documentation**: [cloudinary.com/documentation](https://cloudinary.com/documentation)
- **Support Center**: Available in Cloudinary dashboard
- **Community**: [community.cloudinary.com](https://community.cloudinary.com)

## 🔐 Security Notes

### API Secret Security
- **Never expose API Secret in frontend code**
- **Only use API Secret on your backend/server**
- **For frontend uploads, use unsigned upload presets**

### Upload Security  
- **Use upload presets to control what can be uploaded**
- **Set file size and dimension limits**
- **Restrict allowed origins to your domain**
- **Monitor your usage regularly**

---

## 🎊 You're All Set!

Your Cloudinary setup is complete! Here's what you accomplished:

✅ **Account created** with 25GB free storage
✅ **API credentials** ready for Render deployment  
✅ **Upload presets** configured for optimization
✅ **Security settings** configured (optional)

## 📝 For Render Deployment

Add these to your Render environment variables:
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

**Your StudentHub app will now:**
- ⚡ Upload images to Cloudinary automatically
- 🎯 Optimize images for web performance  
- 🌍 Serve images via global CDN
- 🔒 Handle image storage securely
- 📱 Support responsive image delivery

---

## 🚀 Next Step: Render Deployment

With both MongoDB Atlas and Cloudinary set up, you're ready to deploy to Render!

**You now have:**
- 🗄️ **Database**: MongoDB Atlas connection string
- ☁️ **Images**: Cloudinary API credentials  
- 🚀 **App**: Ready for deployment

Go to `RENDER-CHECKLIST.md` to complete your deployment! 🎉
