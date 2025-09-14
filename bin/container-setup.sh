#!/bin/bash

# Clean up existing files
rm -rf node_modules/* package-lock.json

# Install dependencies with npm (using legacy peer deps to handle React 18 conflicts)
npm install --legacy-peer-deps

# Build the application
npm run build

# Start the application
npm run start
