# Multi-stage build for StudentHub
# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci  # install devDependencies for build

COPY frontend/ ./
RUN npm run build

# Stage 2: Setup backend with frontend build
FROM node:18-alpine AS production

ENV NODE_ENV=production   
RUN npm install -g pm2

WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ ./
# Copy frontend build to the correct location where backend expects it
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

RUN mkdir -p uploads/profiles uploads/posts

RUN addgroup -g 1001 -S nodejs
RUN adduser -S studenthub -u 1001
RUN chown -R studenthub:nodejs /app
USER studenthub

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "http.get('http://localhost:3000/', (res) => { if (res.statusCode === 200) process.exit(0); process.exit(1); })" \
  || exit 1

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
