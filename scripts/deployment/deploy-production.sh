#!/bin/bash

# StudentHub Production Deployment Script
# This script handles the complete production deployment process

set -e

echo "🚀 Starting StudentHub Production Deployment"

# Configuration
PROJECT_NAME="studenthub"
DEPLOY_PATH="/var/www/$PROJECT_NAME"
BACKUP_PATH="/var/backups/$PROJECT_NAME"
NODE_VERSION="18"
DOMAIN="${DOMAIN:-localhost}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

# Check for required tools
check_requirements() {
    print_status "Checking requirements..."
    
    command -v node >/dev/null 2>&1 || { print_error "Node.js is required but not installed. Aborting."; exit 1; }
    command -v npm >/dev/null 2>&1 || { print_error "npm is required but not installed. Aborting."; exit 1; }
    command -v pm2 >/dev/null 2>&1 || { print_error "PM2 is required but not installed. Run: npm install -g pm2"; exit 1; }
    
    print_status "All requirements satisfied ✅"
}

# Create backup of current deployment
create_backup() {
    if [ -d "$DEPLOY_PATH" ]; then
        print_status "Creating backup..."
        sudo mkdir -p "$BACKUP_PATH"
        BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
        sudo cp -r "$DEPLOY_PATH" "$BACKUP_PATH/$BACKUP_NAME"
        print_status "Backup created: $BACKUP_PATH/$BACKUP_NAME"
    fi
}

# Deploy application
deploy_app() {
    print_status "Deploying application..."
    
    # Create deployment directory
    sudo mkdir -p "$DEPLOY_PATH"
    
    # Copy project files
    print_status "Copying project files..."
    sudo cp -r . "$DEPLOY_PATH/"
    sudo chown -R $USER:$USER "$DEPLOY_PATH"
    
    cd "$DEPLOY_PATH"
    
    # Install backend dependencies
    print_status "Installing backend dependencies..."
    cd backend
    npm ci --production
    
    # Install frontend dependencies and build
    print_status "Building frontend..."
    cd ../frontend
    npm ci
    npm run build
    
    # Move frontend build to backend public directory
    print_status "Setting up frontend files..."
    rm -rf ../backend/public
    mv dist ../backend/public
    
    cd ../backend
}

# Setup environment
setup_environment() {
    print_status "Setting up environment..."
    
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from template..."
        cp ../.env.example .env
        print_warning "Please edit backend/.env with your production values before continuing"
        read -p "Press enter when ready to continue..."
    fi
    
    # Create logs directory
    mkdir -p logs
    
    # Create uploads directories
    mkdir -p uploads/profiles uploads/posts
    
    # Set proper permissions
    chmod -R 755 uploads/
}

# Setup PM2
setup_pm2() {
    print_status "Setting up PM2..."
    
    # Stop existing processes
    pm2 delete $PROJECT_NAME 2>/dev/null || true
    
    # Start the application
    NODE_ENV=production pm2 start ecosystem.config.js --env production
    
    # Save PM2 configuration
    pm2 save
    
    # Setup PM2 startup script
    pm2 startup systemd -u $USER --hp /home/$USER
    
    print_status "PM2 setup complete ✅"
}

# Setup Nginx (if available)
setup_nginx() {
    if command -v nginx >/dev/null 2>&1; then
        print_status "Setting up Nginx..."
        
        # Copy nginx configuration
        if [ -f "../nginx/nginx.conf" ]; then
            sudo cp ../nginx/nginx.conf /etc/nginx/sites-available/$PROJECT_NAME
            sudo ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/
            
            # Remove default site
            sudo rm -f /etc/nginx/sites-enabled/default
            
            # Test nginx configuration
            if sudo nginx -t; then
                sudo systemctl restart nginx
                print_status "Nginx setup complete ✅"
            else
                print_error "Nginx configuration test failed"
                return 1
            fi
        else
            print_warning "Nginx configuration not found, skipping nginx setup"
        fi
    else
        print_warning "Nginx not installed, skipping nginx setup"
    fi
}

# Setup SSL with Let's Encrypt
setup_ssl() {
    if command -v certbot >/dev/null 2>&1 && [ "$DOMAIN" != "localhost" ]; then
        print_status "Setting up SSL certificate..."
        
        read -p "Setup SSL certificate for $DOMAIN? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            sudo certbot --nginx -d "$DOMAIN"
            print_status "SSL setup complete ✅"
        fi
    else
        print_warning "Certbot not available or domain is localhost, skipping SSL setup"
    fi
}

# Run health check
health_check() {
    print_status "Running health check..."
    
    sleep 5  # Wait for application to start
    
    if curl -f -s "http://localhost:3000/health" > /dev/null; then
        print_status "Health check passed ✅"
        curl -s "http://localhost:3000/health" | jq . || curl -s "http://localhost:3000/health"
    else
        print_error "Health check failed ❌"
        print_status "PM2 status:"
        pm2 status
        print_status "PM2 logs:"
        pm2 logs --lines 20
        exit 1
    fi
}

# Main deployment process
main() {
    print_status "Starting deployment to: $DEPLOY_PATH"
    print_status "Domain: $DOMAIN"
    
    check_requirements
    create_backup
    deploy_app
    setup_environment
    setup_pm2
    setup_nginx
    setup_ssl
    health_check
    
    print_status "🎉 Deployment completed successfully!"
    print_status "Application is running at: http://$DOMAIN"
    print_status ""
    print_status "Useful commands:"
    print_status "  View status: pm2 status"
    print_status "  View logs: pm2 logs $PROJECT_NAME"
    print_status "  Restart app: pm2 restart $PROJECT_NAME"
    print_status "  Monitor: pm2 monit"
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "health")
        health_check
        ;;
    "backup")
        create_backup
        ;;
    *)
        echo "Usage: $0 [deploy|health|backup]"
        echo "  deploy: Full deployment (default)"
        echo "  health: Run health check only"
        echo "  backup: Create backup only"
        exit 1
        ;;
esac
