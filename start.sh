#!/bin/bash

# InboxGenie Startup Script
echo "🚀 Starting InboxGenie..."

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "❌ Error: backend/.env file not found!"
    echo "📝 Please create backend/.env file with your configuration."
    echo "💡 Copy backend/env.example to backend/.env and fill in your values."
    exit 1
fi

# Check if required environment variables are set
echo "🔍 Checking environment configuration..."

# Source the .env file to check variables
source backend/.env

if [ -z "$GOOGLE_CLIENT_ID" ] || [ "$GOOGLE_CLIENT_ID" = "your_google_client_id_here" ]; then
    echo "❌ Error: GOOGLE_CLIENT_ID not set in backend/.env"
    exit 1
fi

if [ -z "$GOOGLE_CLIENT_SECRET" ] || [ "$GOOGLE_CLIENT_SECRET" = "your_google_client_secret_here" ]; then
    echo "❌ Error: GOOGLE_CLIENT_SECRET not set in backend/.env"
    exit 1
fi

if [ -z "$AI_API_KEY" ] || [ "$AI_API_KEY" = "your_openai_api_key_here" ]; then
    echo "❌ Error: AI_API_KEY not set in backend/.env"
    exit 1
fi

if [ -z "$FERNET_KEY" ] || [ "$FERNET_KEY" = "your_fernet_key_here" ]; then
    echo "❌ Error: FERNET_KEY not set in backend/.env"
    echo "💡 Generate one with: python -c \"from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())\""
    exit 1
fi

echo "✅ Environment configuration looks good!"

# Start the application
echo "🐳 Starting Docker Compose..."
docker-compose up --build

echo "🎉 InboxGenie is running!"
echo "🌐 Frontend: http://localhost:8080"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
