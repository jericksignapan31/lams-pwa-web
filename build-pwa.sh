#!/bin/bash

# LAMS PWA Build Script
# This script builds the PWA with optimizations

echo "🚀 Starting LAMS PWA Build Process..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/

# Install dependencies if needed
echo "📦 Checking dependencies..."
npm install

# Build production version
echo "🔨 Building production version..."
ng build --configuration production

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    
    # Show build results
    echo "📊 Build Results:"
    echo "- Output directory: dist/lams"
    echo "- Service Worker: Enabled"
    echo "- PWA Features: Enabled"
    
    # Optional: Start local server for testing
    read -p "🌐 Do you want to start local server for testing? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🌐 Starting local server on port 8080..."
        npx http-server dist/lams -p 8080 -c-1
    fi
    
else
    echo "❌ Build failed! Check the errors above."
    exit 1
fi
