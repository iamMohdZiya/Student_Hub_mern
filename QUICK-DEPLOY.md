# StudentHub - Quick Deployment Reference

🚀 Your project is now **deployment-ready**! Choose your preferred deployment method:

## 🏃‍♂️ Quick Start (Choose One)

### 1. Docker Deployment (Recommended)
```bash
# Copy environment template
cp .env.example .env
# Edit .env with your values

# Start everything
docker-compose up -d

# Check logs
docker-compose logs -f app
```
**Access:** http://localhost:3000

### 2. Local Production
```bash
# Windows
scripts\deployment\setup-dev.bat

# Linux/macOS
chmod +x scripts/deployment/setup-dev.sh
./scripts/deployment/setup-dev.sh
```

### 3. Cloud Platforms

#### Heroku (Easy)
```bash
heroku create your-app-name
git push heroku main
# Set environment variables in Heroku dashboard
```

#### Render (Simple)
1. Connect your GitHub repo to [Render](https://render.com)
2. Use the included `render.yaml` configuration
3. Set environment variables in dashboard

#### Vercel (Serverless)
```bash
npm i -g vercel
vercel --prod
```

#### DigitalOcean/AWS/GCP (VPS)
```bash
# Use the deployment script
chmod +x scripts/deployment/deploy-production.sh
sudo ./scripts/deployment/deploy-production.sh
```

## 📋 Required Environment Variables

Create `.env` file or set in your platform:

```env
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb://localhost:27017/studenthub
JWT_SECRET=your-64-character-secret-key
CLOUDINARY_CLOUD_NAME=optional-for-images
CLOUDINARY_API_KEY=optional-for-images
CLOUDINARY_API_SECRET=optional-for-images
```

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🗄️ Database Options

### MongoDB Atlas (Cloud - Recommended)
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create cluster → Get connection string
3. Update `MONGO_URI` in environment

### Local MongoDB
```bash
# Install MongoDB locally
# Ubuntu/Debian: sudo apt install mongodb-org
# macOS: brew install mongodb-community
# Windows: Download from MongoDB website
```

## 🔧 What's Included

Your project now has:

✅ **Multi-platform deployment configs:**
- `Dockerfile` - Container deployment
- `docker-compose.yml` - Full stack with database
- `Procfile` - Heroku deployment
- `vercel.json` - Vercel serverless deployment
- `render.yaml` - Render deployment

✅ **Production optimizations:**
- PM2 process management (`ecosystem.config.js`)
- Nginx reverse proxy configuration
- Health check endpoint (`/health`)
- Environment-based CORS settings
- Static file serving for React frontend

✅ **Development tools:**
- Development setup scripts
- Hot reload for both frontend and backend
- Cross-platform compatibility

✅ **Security features:**
- Environment variable management
- Proper CORS configuration
- Rate limiting setup (Nginx)
- File upload restrictions

## 🚀 Deployment Commands

### Docker
```bash
docker build -t studenthub .
docker run -p 3000:3000 studenthub
```

### Production Build
```bash
# Build frontend
cd frontend && npm run build

# Move to backend
mv dist ../backend/public

# Start with PM2
cd ../backend
npm run prod
```

### Development Mode
```bash
# Start both servers
npm run dev

# Or individually
npm run dev:backend
npm run dev:frontend
```

## 🏥 Health Check

Once deployed, verify at: `https://your-domain.com/health`

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T12:00:00.000Z",
  "uptime": 123.45,
  "memory": {...},
  "version": "1.0.0"
}
```

## 🔍 Troubleshooting

### Common Issues:

**Port already in use:**
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

**Database connection error:**
- Verify MongoDB is running
- Check connection string format
- Ensure IP whitelist (Atlas)

**Frontend not loading:**
- Ensure build exists in `backend/public/`
- Check NODE_ENV=production
- Verify static file serving

**File uploads failing:**
- Check uploads directory permissions
- Verify file size limits
- Ensure proper CORS configuration

## 📞 Support

If you encounter issues:
1. Check the logs: `pm2 logs` or `docker-compose logs -f`
2. Verify environment variables are set correctly
3. Test health endpoint
4. Review the full [DEPLOYMENT.md](./DEPLOYMENT.md) guide

---

**🎉 Your StudentHub application is ready for production!** Choose your deployment method and launch! 🚀
