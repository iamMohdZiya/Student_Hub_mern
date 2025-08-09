# Multi-stage build for StudentHub
# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production

COPY frontend/ ./
RUN npm run build

# Stage 2: Setup backend with frontend build
FROM node:18-alpine AS production

# Install PM2 globally for process management
RUN npm install -g pm2

# Create app directory
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY backend/ ./

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/frontend/dist ./public

# Create uploads directories
RUN mkdir -p uploads/profiles uploads/posts

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S studenthub -u 1001

# Change ownership of the app directory
RUN chown -R studenthub:nodejs /app
USER studenthub

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "http.get('http://localhost:3000/', (res) => { if (res.statusCode === 200) process.exit(0); process.exit(1); })" \
  || exit 1

# Start the application with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
