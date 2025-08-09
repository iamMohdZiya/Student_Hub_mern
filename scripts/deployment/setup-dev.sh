#!/bin/bash

# StudentHub Development Environment Setup Script
# This script sets up the development environment

set -e

echo "🛠️ Setting up StudentHub Development Environment"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check for required tools
check_requirements() {
    print_status "Checking requirements..."
    
    command -v node >/dev/null 2>&1 || { print_error "Node.js is required. Please install Node.js 18+"; exit 1; }
    command -v npm >/dev/null 2>&1 || { print_error "npm is required but not installed."; exit 1; }
    command -v git >/dev/null 2>&1 || { print_error "Git is required but not installed."; exit 1; }
    
    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js 16+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_status "Node.js version: $(node --version) ✅"
    print_status "npm version: $(npm --version) ✅"
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Backend environment
    if [ ! -f "backend/.env" ]; then
        print_status "Creating backend/.env from template..."
        cp .env.example backend/.env
        
        # Generate a random JWT secret
        if command -v openssl >/dev/null 2>&1; then
            JWT_SECRET=$(openssl rand -hex 64)
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                sed -i '' "s/your-super-secret-jwt-key-here-change-this-to-something-secure/$JWT_SECRET/" backend/.env
            else
                # Linux
                sed -i "s/your-super-secret-jwt-key-here-change-this-to-something-secure/$JWT_SECRET/" backend/.env
            fi
            print_status "Generated JWT secret ✅"
        else
            print_warning "OpenSSL not found. Please manually update JWT_SECRET in backend/.env"
        fi
    else
        print_status "backend/.env already exists ✅"
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install backend dependencies
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    # Install frontend dependencies
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    print_status "Dependencies installed ✅"
}

# Setup directories
setup_directories() {
    print_status "Setting up directories..."
    
    # Create upload directories
    mkdir -p backend/uploads/profiles
    mkdir -p backend/uploads/posts
    mkdir -p backend/logs
    
    # Copy default profile image if it doesn't exist
    if [ ! -f "backend/uploads/profiles/default.png" ] && [ -f "backend/uploads/profiles/default.png.example" ]; then
        cp backend/uploads/profiles/default.png.example backend/uploads/profiles/default.png
    fi
    
    print_status "Directories created ✅"
}

# Check database connection
check_database() {
    print_status "Checking database connection..."
    
    # Check if MongoDB is running locally
    if command -v mongosh >/dev/null 2>&1; then
        if mongosh --eval "db.runCommand('ping')" --quiet >/dev/null 2>&1; then
            print_status "MongoDB connection successful ✅"
        else
            print_warning "MongoDB is not running or not accessible"
            print_warning "Make sure MongoDB is installed and running, or update MONGO_URI in backend/.env"
        fi
    elif command -v mongo >/dev/null 2>&1; then
        if mongo --eval "db.runCommand('ping')" --quiet >/dev/null 2>&1; then
            print_status "MongoDB connection successful ✅"
        else
            print_warning "MongoDB is not running or not accessible"
        fi
    else
        print_warning "MongoDB client not found. Please install MongoDB or update MONGO_URI in backend/.env to use MongoDB Atlas"
    fi
}

# Setup git hooks (optional)
setup_git_hooks() {
    if [ -d ".git" ]; then
        print_status "Setting up git hooks..."
        
        # Pre-commit hook for linting
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."

# Check if frontend code exists and run lint
if [ -d "frontend/src" ]; then
    cd frontend
    npm run lint || {
        echo "Frontend linting failed. Please fix the errors and try again."
        exit 1
    }
    cd ..
fi

echo "Pre-commit checks passed!"
EOF
        
        chmod +x .git/hooks/pre-commit
        print_status "Git hooks setup ✅"
    fi
}

# Create development scripts
create_dev_scripts() {
    print_status "Creating development scripts..."
    
    # Create package.json in root if it doesn't exist
    if [ ! -f "package.json" ]; then
        cat > package.json << 'EOF'
{
  "name": "studenthub",
  "version": "1.0.0",
  "description": "StudentHub - Full Stack Student Network Platform",
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "build": "cd frontend && npm run build && mv dist ../backend/public",
    "start": "cd backend && npm start",
    "install:all": "npm install && cd backend && npm install && cd ../frontend && npm install",
    "clean": "rm -rf backend/node_modules frontend/node_modules node_modules backend/public",
    "test": "echo 'No tests specified yet'"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
EOF
        npm install
        print_status "Root package.json created ✅"
    fi
    
    # Create development launcher script
    cat > start-dev.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting StudentHub Development Environment"
echo "Backend will run on: http://localhost:3000"
echo "Frontend will run on: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
npm run dev
EOF
    chmod +x start-dev.sh
    
    print_status "Development scripts created ✅"
}

# Print setup summary
print_summary() {
    print_status ""
    print_status "🎉 Development environment setup complete!"
    print_status ""
    print_status "Next steps:"
    print_status "1. Update backend/.env with your database and API credentials"
    print_status "2. Start development servers:"
    print_status "   ./start-dev.sh"
    print_status "   OR"
    print_status "   npm run dev"
    print_status ""
    print_status "Development URLs:"
    print_status "• Backend API: http://localhost:3000"
    print_status "• Frontend App: http://localhost:5173"
    print_status "• Health Check: http://localhost:3000/health"
    print_status ""
    print_status "Useful commands:"
    print_status "• npm run dev - Start both servers"
    print_status "• npm run dev:backend - Start backend only"
    print_status "• npm run dev:frontend - Start frontend only"
    print_status "• npm run build - Build frontend for production"
    print_status ""
    print_status "Configuration files:"
    print_status "• Backend config: backend/.env"
    print_status "• Frontend config: frontend/vite.config.js"
}

# Main setup process
main() {
    check_requirements
    setup_environment
    install_dependencies
    setup_directories
    check_database
    setup_git_hooks
    create_dev_scripts
    print_summary
}

# Run main function
main
