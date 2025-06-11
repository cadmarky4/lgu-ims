#!/bin/bash

# LGU Information Management System - Development Setup Script

echo "🚀 Setting up LGU Information Management System Backend..."

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
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js >= 18.0.0"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    print_error "Node.js version $NODE_VERSION is too old. Please upgrade to >= 18.0.0"
    exit 1
fi

print_status "Node.js version $NODE_VERSION is compatible ✓"

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    print_warning "PostgreSQL CLI not found. Please ensure PostgreSQL is installed and running."
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

print_status "Dependencies installed successfully ✓"

# Copy environment file
if [ ! -f ".env" ]; then
    print_status "Creating .env file from template..."
    cp .env.example .env
    print_warning "Please update the .env file with your database credentials and other settings"
else
    print_status ".env file already exists ✓"
fi

# Generate Prisma client
print_status "Generating Prisma client..."
npm run db:generate

if [ $? -ne 0 ]; then
    print_error "Failed to generate Prisma client"
    exit 1
fi

print_status "Prisma client generated successfully ✓"

# Create logs directory
if [ ! -d "logs" ]; then
    mkdir logs
    print_status "Created logs directory ✓"
fi

print_status "Setup completed successfully! 🎉"
echo ""
echo "Next steps:"
echo "1. Update your .env file with database credentials"
echo "2. Run database migrations: npm run db:migrate"
echo "3. Seed the database: npm run db:seed"
echo "4. Start development server: npm run dev"
echo ""
echo "Access points:"
echo "- API: http://localhost:3000"
echo "- Health check: http://localhost:3000/health"
echo "- API Documentation: http://localhost:3000/api/docs"
echo ""
echo "Happy coding! 🚀"
