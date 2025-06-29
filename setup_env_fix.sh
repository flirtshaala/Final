#!/bin/bash

# Fix for environment setup script
# This replaces the problematic setup_env.sh with a working version

echo "Setting up React Native environment..."

# Check if ulimit is available, if not, skip it
if command -v ulimit >/dev/null 2>&1; then
    echo "Setting file descriptor limits..."
    ulimit -n 4096 2>/dev/null || echo "Warning: Could not set ulimit"
else
    echo "Warning: ulimit command not available, skipping..."
fi

# Set up Android environment variables if not already set
if [ -z "$ANDROID_HOME" ]; then
    echo "Warning: ANDROID_HOME not set. Please set it to your Android SDK path."
fi

if [ -z "$ANDROID_SDK_ROOT" ]; then
    echo "Warning: ANDROID_SDK_ROOT not set. Please set it to your Android SDK path."
fi

echo "Environment setup completed."