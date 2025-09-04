#!/bin/bash

# Big Five API - AWS Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Default values
STAGE="dev"
BUILD=true
DEPLOY=true

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --stage)
            STAGE="$2"
            shift 2
            ;;
        --no-build)
            BUILD=false
            shift
            ;;
        --no-deploy)
            DEPLOY=false
            shift
            ;;
        --help)
            echo "Usage: $0 [--stage STAGE] [--no-build] [--no-deploy]"
            echo ""
            echo "Options:"
            echo "  --stage STAGE    Deployment stage (dev, prod) [default: dev]"
            echo "  --no-build       Skip build step"
            echo "  --no-deploy      Skip deployment step"
            echo "  --help           Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

print_info "Starting deployment for stage: $STAGE"

# Check prerequisites
print_info "Checking prerequisites..."

# Check if serverless is installed
if ! command -v serverless &> /dev/null; then
    print_error "Serverless Framework is not installed. Install it with: npm install -g serverless"
    exit 1
fi

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS CLI is not configured or credentials are invalid"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating basic configuration..."
    cat > .env << EOF
# AWS Configuration
AWS_REGION=us-east-1
AWS_PROFILE=default

# Environment
NODE_ENV=development
EOF
    print_success "Created basic .env file (no database configuration needed)"
fi

print_success "Prerequisites check passed"

# Build step
if [ "$BUILD" = true ]; then
    print_info "Building Lambda functions..."

    # Install dependencies
    if [ ! -d "node_modules" ]; then
        print_info "Installing dependencies..."
        npm install --legacy-peer-deps
    fi

    # Build TypeScript
    print_info "Compiling TypeScript..."
    npx tsc --project tsconfig-lambda.json

    print_success "Build completed"
else
    print_info "Skipping build step"
fi

# Deploy step
if [ "$DEPLOY" = true ]; then
    print_info "Deploying to AWS..."

    # Deploy with serverless
    serverless deploy --stage $STAGE

    print_success "Deployment completed successfully!"

    # Get API endpoint
    API_ENDPOINT=$(serverless info --stage $STAGE | grep -o 'https://[^"]*')

    if [ -n "$API_ENDPOINT" ]; then
        print_success "API Endpoint: $API_ENDPOINT"
        print_info "Available endpoints:"
        echo "  GET  $API_ENDPOINT/assessment/questions"
        echo "  POST $API_ENDPOINT/assessment/questions"
        echo "  POST $API_ENDPOINT/assessment/answers"
        echo "  POST $API_ENDPOINT/assessment/results"
        echo "  GET  $API_ENDPOINT/assessment/history"
        echo "  GET  $API_ENDPOINT/assessment/status"
    fi
else
    print_info "Skipping deployment step"
fi

print_success "Script completed!"
