# LGU Information Management System - Development Setup Script (PowerShell)

Write-Host "🚀 Setting up LGU Information Management System Backend..." -ForegroundColor Green

function Write-Status {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Status "Node.js version $nodeVersion is installed ✓"
} catch {
    Write-Error "Node.js is not installed. Please install Node.js >= 18.0.0"
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Status "npm version $npmVersion is available ✓"
} catch {
    Write-Error "npm is not available"
    exit 1
}

# Install dependencies
Write-Status "Installing dependencies..."
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to install dependencies"
    exit 1
}

Write-Status "Dependencies installed successfully ✓"

# Copy environment file
if (-not (Test-Path ".env")) {
    Write-Status "Creating .env file from template..."
    Copy-Item ".env.example" ".env"
    Write-Warning "Please update the .env file with your database credentials and other settings"
} else {
    Write-Status ".env file already exists ✓"
}

# Generate Prisma client
Write-Status "Generating Prisma client..."
npm run db:generate

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to generate Prisma client"
    exit 1
}

Write-Status "Prisma client generated successfully ✓"

# Create logs directory
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Name "logs"
    Write-Status "Created logs directory ✓"
}

Write-Status "Setup completed successfully! 🎉"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update your .env file with database credentials"
Write-Host "2. Run database migrations: npm run db:migrate"
Write-Host "3. Seed the database: npm run db:seed"
Write-Host "4. Start development server: npm run dev"
Write-Host ""
Write-Host "Access points:" -ForegroundColor Cyan
Write-Host "- API: http://localhost:3000"
Write-Host "- Health check: http://localhost:3000/health"
Write-Host "- API Documentation: http://localhost:3000/api/docs"
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green
