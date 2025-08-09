# StudentHub Deployment Guide

This guide covers multiple deployment options for the StudentHub application, from local production to cloud platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Production Deployment](#local-production-deployment)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Deployment Options](#cloud-deployment-options)
   - [Heroku](#heroku)
   - [Render](#render)
   - [Vercel](#vercel)
   - [DigitalOcean](#digitalocean)
5. [Environment Variables](#environment-variables)
6. [Database Setup](#database-setup)
7. [SSL/HTTPS Configuration](#sslhttps-configuration)
8. [Monitoring & Logging](#monitoring--logging)

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account or local MongoDB
- Cloudinary account (optional, for image storage)
- Git repository
- Domain name (for production)

## Local Production Deployment

### 1. Environment Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd jsmajor

# Copy environment template
cp .env.example backend/.env

# Generate a strong JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Configure Environment Variables

Edit `backend/.env`:

```env
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb://localhost:27017/studenthub
JWT_SECRET=<your-generated-secret>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
```

### 3. Install Dependencies & Build

```bash
# Install backend dependencies
cd backend
npm ci --production

# Install PM2 globally
npm install -g pm2

# Install frontend dependencies and build
cd ../frontend
npm ci
npm run build

# Move frontend build to backend
mv dist ../backend/public

# Start the application
cd ../backend
npm run prod
```

### 4. PM2 Management Commands

```bash
# View running processes
pm2 list

# View logs
pm2 logs studenthub-api

# Restart application
pm2 restart studenthub-api

# Stop application
pm2 stop studenthub-api

# Monitor resources
pm2 monit
```

## Docker Deployment

### 1. Using Docker Compose (Recommended)

```bash
# Create environment file for Docker
cp .env.example .env

# Edit .env with your production values
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Using Docker Only

```bash
# Build the image
docker build -t studenthub .

# Run the container
docker run -d \
  --name studenthub-app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e MONGO_URI=<your-mongodb-uri> \
  -e JWT_SECRET=<your-jwt-secret> \
  studenthub
```

## Cloud Deployment Options

### Heroku

1. **Prepare for Heroku:**

```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-studenthub-app

# Add MongoDB Atlas add-on
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=<your-jwt-secret>
heroku config:set CLOUDINARY_CLOUD_NAME=<your-name>
heroku config:set CLOUDINARY_API_KEY=<your-key>
heroku config:set CLOUDINARY_API_SECRET=<your-secret>
```

2. **Deploy:**

```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

3. **Create admin user:**

```bash
heroku run "cd backend && node scripts/createAdmin.js"
```

### Render

1. **Connect Repository:**
   - Go to [Render Dashboard](https://render.com)
   - Connect your GitHub repository
   - Use the `render.yaml` configuration

2. **Environment Variables:**
   Set in Render dashboard:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Strong random secret
   - `CLOUDINARY_*`: Your Cloudinary credentials

3. **Deploy:**
   - Render will automatically deploy from your repository
   - Monitor the build logs for any issues

### Vercel

1. **Install Vercel CLI:**

```bash
npm i -g vercel
```

2. **Deploy:**

```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add MONGO_URI
vercel env add JWT_SECRET
vercel env add NODE_ENV production
```

Note: Vercel is best suited for serverless deployment but may have limitations with file uploads.

### DigitalOcean

1. **Create Droplet:**
   - Ubuntu 22.04 LTS
   - At least 1GB RAM
   - SSH key authentication

2. **Server Setup:**

```bash
# Connect to server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt update
apt install -y mongodb-org

# Install Nginx
apt install -y nginx

# Install PM2
npm install -g pm2

# Setup PM2 startup
pm2 startup systemd
```

3. **Deploy Application:**

```bash
# Clone repository
git clone <your-repo-url> /var/www/studenthub
cd /var/www/studenthub

# Install dependencies and build
cd backend && npm ci --production
cd ../frontend && npm ci && npm run build
mv dist ../backend/public

# Setup environment
cp .env.example backend/.env
# Edit backend/.env with production values

# Start application
cd backend
pm2 start ecosystem.config.js --env production
pm2 save
```

4. **Configure Nginx:**

```bash
# Remove default config
rm /etc/nginx/sites-enabled/default

# Create new config
cp nginx/nginx.conf /etc/nginx/sites-available/studenthub
ln -s /etc/nginx/sites-available/studenthub /etc/nginx/sites-enabled/

# Test and restart Nginx
nginx -t
systemctl restart nginx
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `production` |
| `PORT` | Server port | `3000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/studenthub` |
| `JWT_SECRET` | JWT signing secret | `your-64-char-secret` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | - |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:3000` |
| `MAX_FILE_SIZE` | Max upload file size | `5242880` (5MB) |

## Database Setup

### MongoDB Atlas (Recommended for Cloud)

1. Create a cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a database user
3. Whitelist your application's IP addresses
4. Get the connection string
5. Update your `MONGO_URI` environment variable

### Local MongoDB

```bash
# Install MongoDB Community Edition
# Ubuntu/Debian
sudo apt install mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Create database and user
mongo
> use studenthub
> db.createUser({
    user: "studenthub_user",
    pwd: "secure_password",
    roles: [{ role: "dbOwner", db: "studenthub" }]
  })
```

## SSL/HTTPS Configuration

### Using Certbot (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Manual SSL Certificate

1. Place your certificate files in `nginx/ssl/`
2. Update `nginx/nginx.conf` to enable HTTPS server block
3. Restart Nginx

## Monitoring & Logging

### PM2 Monitoring

```bash
# Install PM2 monitoring
pm2 install pm2-logrotate

# View real-time monitoring
pm2 monit

# View application logs
pm2 logs --lines 100

# Performance metrics
pm2 show studenthub-api
```

### Log Rotation Setup

```bash
# Configure PM2 log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

### Health Monitoring

Add health check endpoints:

```javascript
// Add to backend/app.js
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

2. **Permission denied:**
   ```bash
   sudo chown -R $USER:$USER /var/www/studenthub
   ```

3. **Database connection issues:**
   - Check MongoDB is running
   - Verify connection string
   - Check firewall settings

4. **Frontend not loading:**
   - Ensure build files are in `backend/public/`
   - Check static file serving configuration

5. **File upload issues:**
   - Check uploads directory permissions
   - Verify file size limits
   - Ensure Cloudinary credentials are correct

### Performance Optimization

1. **Enable Nginx caching:**
   ```nginx
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

2. **PM2 cluster mode:**
   ```javascript
   // In ecosystem.config.js
   instances: 'max',
   exec_mode: 'cluster'
   ```

3. **Database indexes:**
   ```javascript
   // Already included in mongo-init.js
   db.users.createIndex({ email: 1 }, { unique: true });
   db.posts.createIndex({ createdAt: -1 });
   ```

## Security Checklist

- [ ] Strong JWT secret (64+ characters)
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] Database authentication enabled
- [ ] Regular security updates
- [ ] File upload restrictions
- [ ] Input validation and sanitization

## Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test database connectivity
4. Review Nginx configuration
5. Monitor system resources

---

This deployment guide should cover most scenarios. Choose the deployment method that best fits your needs and infrastructure requirements.
