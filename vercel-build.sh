#!/bin/bash
echo "Current directory: $(pwd)"
echo "Listing directories:"
ls -la

# Navigate to the web directory
cd web || exit 1
echo "Changed to web directory: $(pwd)"
echo "Listing web directory:"
ls -la

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application..."
npm run build
