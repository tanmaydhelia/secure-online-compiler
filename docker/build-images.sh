#!/bin/bash

echo "🐳 Building Docker images for CodeRunner..."

# Build C++ image
echo "Building C++ runtime..."
docker build -t coderunner-cpp ./cpp/

# Build Python image
echo "Building Python runtime..."
docker build -t coderunner-python ./python/

# Build Java image
echo "Building Java runtime..."
docker build -t coderunner-java ./java/

echo "✅ All Docker images built successfully!"
echo ""
echo "Available images:"
docker images | grep coderunner