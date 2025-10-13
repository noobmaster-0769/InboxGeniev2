# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

InboxGenie is a modern email management application with AI-powered classification and summarization. It consists of a FastAPI backend with PostgreSQL/Redis for data storage and queuing, and a React TypeScript frontend built with Vite and shadcn/ui components.

## Architecture

### Backend (Python/FastAPI)
- **Framework**: FastAPI with SQLAlchemy ORM
- **Database**: PostgreSQL for persistent storage
- **Cache/Queue**: Redis with Celery for background tasks
- **Authentication**: Google OAuth 2.0 with encrypted token storage
- **AI Integration**: OpenAI API for email classification and summarization
- **Security**: Cryptography library (Fernet) for encrypting sensitive data

### Frontend (React/TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI primitives with shadcn/ui components
- **Styling**: TailwindCSS with custom dark theme
- **State Management**: React Query for server state
- **Routing**: React Router DOM

### Infrastructure
- **Containerization**: Docker with docker-compose for local development
- **Services**: Separate containers for backend, worker, database, and Redis

## Development Commands

### Full Stack Development (Recommended)
```bash
# Start all services (backend, frontend, db, redis, worker)
docker-compose up --build

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f worker

# Stop all services
docker-compose down

# Stop and remove volumes (clean database)
docker-compose down -v
```

### Backend Development
```bash
# Navigate to backend directory
cd backend

# Install dependencies (if running locally without Docker)
pip install -r requirements.txt

# Run FastAPI server (development)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Start Celery worker
celery -A celery_app.celery_app worker --loglevel=info

# Run single test (if tests exist)
python -m pytest tests/test_specific.py -v

# Database migrations (if using Alembic)
alembic upgrade head
```

### Frontend Development
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Key Components and Services

### Backend Services
- **GmailService**: Handles Gmail API integration, fetches and processes emails
- **AIService**: Manages OpenAI API calls for email classification and summarization
- **SpamFilter**: Implements spam detection algorithms
- **Authentication**: Google OAuth flow with encrypted token storage

### Frontend Components
- **EmailCard**: Main email display component with expand/collapse functionality
- **InboxSidebar**: Navigation and filtering interface
- **AIComposer**: AI-powered email composition interface
- **shadcn/ui components**: Reusable UI primitives (buttons, dialogs, forms, etc.)

### Database Models
- **User**: Stores user information and encrypted Google tokens
- **Email**: Stores email data with encrypted AI-generated summaries and classifications

## Configuration and Environment

### Required Environment Variables (Backend)
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `FERNET_KEY`: Encryption key for sensitive data (use Fernet.generate_key())
- `AI_API_KEY`: OpenAI API key
- `DATABASE_URL`: PostgreSQL connection string
- `CELERY_BROKER_URL`: Redis URL for Celery
- `AI_PROVIDER`: Set to "openai" for production, "mock" for development

### Port Configuration
- Backend API: `http://localhost:8000`
- Frontend: `http://localhost:8080`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

## Common Development Tasks

### Testing Email Integration
1. Set up Google OAuth credentials in the Google Cloud Console
2. Configure environment variables in `backend/.env`
3. Start services with `docker-compose up --build`
4. Navigate to `http://localhost:8080` and authenticate with Google
5. Check backend logs to see email fetching process

### Adding New Email Classifications
1. Update the AI prompt in `backend/app/services/ai_service.py`
2. Modify the Email model schema if needed
3. Update frontend EmailCard component to display new categories

### Debugging Authentication Issues
- Check Google OAuth configuration in Google Cloud Console
- Verify redirect URIs match between frontend and backend
- Examine encrypted token storage in the database
- Review CORS settings in backend main.py

### Working with Celery Tasks
- Monitor Celery worker logs: `docker-compose logs -f worker`
- Add new background tasks in `celery_app.py`
- Trigger tasks from FastAPI routes using `.delay()` method

## Security Considerations

- All sensitive data (tokens, AI summaries) is encrypted using Fernet before database storage
- Google OAuth tokens are refreshed automatically when expired
- CORS is configured for local development ports
- Never commit actual environment variables or API keys to version control

## Troubleshooting

### Common Issues
1. **Port conflicts**: Ensure ports 8000, 8080, 5432, and 6379 are available
2. **Database connection**: Check PostgreSQL is running and connection string is correct
3. **Google OAuth errors**: Verify client credentials and redirect URI configuration
4. **Celery worker not processing**: Check Redis connection and worker logs
5. **AI service failures**: Validate OpenAI API key and check rate limits

### Development Tips
- Use `docker-compose logs -f <service>` to monitor real-time logs
- Frontend hot-reload is enabled in development mode
- Backend auto-reloads when code changes (if running with --reload)
- Database persists between restarts unless volumes are removed