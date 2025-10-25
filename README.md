# 🧞‍♂️ InboxGenie - AI-Powered Email Assistant

**Transform Your Email Experience with AI Intelligence**

InboxGenie is a full-stack AI-powered email augmentation dashboard that acts as an intelligent layer on top of your Gmail account. It provides AI-driven email classification, smart composition, and summarization to help you manage your inbox more efficiently.

## ✨ Features

### Core Features
- 🔐 **Google OAuth 2.0 Login** - Secure authentication with Gmail
- 📧 **Real Gmail Integration** - Fetch and display your actual emails
- 🔒 **Secure Token Management** - Encrypted storage of access tokens
- 🗄️ **PostgreSQL Database** - Persistent storage with SQLAlchemy ORM
- 🐳 **Dockerized Deployment** - Complete containerization

### AI Features
- 🤖 **AI Email Classification** - Automatically categorize emails (Important, Promotion, General, Spam)
- 📝 **AI Email Summarization** - Generate concise 1-2 sentence summaries
- ✍️ **AI Tone Rewriting** - Rewrite emails in different tones (Professional, Casual, Friendly, Formal)
- 🤖 **AI Auto-Reply Generation** - Context-aware automatic replies
- ⚡ **AI Smart Reply Suggestions** - Multiple intelligent reply options
- ⚙️ **Async AI Processing** - Background processing with Celery workers

### Email Management
- ⭐ **Star Functionality** - Persistent starring with sidebar count
- 📁 **Archive/Delete/Move** - Full email management actions
- ✅ **Mark as Read** - Email status management
- 🔍 **Search & Filter** - Real-time email filtering
- 📱 **Responsive Design** - Works on all screen sizes

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Google Cloud Console account
- OpenAI API key

### 1. Environment Setup

Create your environment file:
```bash
# Copy the example file
cp backend/env.example backend/.env

# Edit the file with your values
nano backend/.env
```

Fill in your `.env` file:
```env
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=inboxgenie
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Generate with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
FERNET_KEY=your_generated_fernet_key_here

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

# AI Configuration
AI_PROVIDER=openai
AI_API_KEY=your_openai_api_key_here

# Celery/Redis
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0
```

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Gmail API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Set **Application type** to "Web application"
6. Add **Authorized redirect URIs**: `http://localhost:8000/auth/google/callback`
7. Copy **Client ID** and **Client Secret** to your `.env` file

### 3. OpenAI API Key

1. Get your API key from [OpenAI Platform](https://platform.openai.com/)
2. Add it to your `.env` file as `AI_API_KEY`

### 4. Generate Fernet Key

```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

### 5. Start the Application

**Option A: Using the startup script (Recommended)**
```bash
./start.sh
```

**Option B: Manual Docker Compose**
```bash
docker-compose up --build
```

**Option C: Manual setup**
```bash
# Terminal 1: Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Terminal 3: Celery Worker
cd backend
celery -A celery_app.celery_app worker --loglevel=info

# Terminal 4: Redis (if not using Docker)
redis-server
```

## 🌐 Access Points

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Database**: localhost:5432 (postgres/password)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Services   │
│   (React/Vite)  │◄──►│   (FastAPI)     │◄──►│   (OpenAI)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Docker        │    │   PostgreSQL    │    │   Celery        │
│   Container     │    │   Database      │    │   Workers       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Redis         │    │   Gmail API     │
                       │   Message       │    │   Integration   │
                       │   Broker        │    │                 │
                       └─────────────────┘    └─────────────────┘
```

## 🔧 API Endpoints

### Authentication
- `GET /auth/google/login` - Initiate Google OAuth
- `GET /auth/google/callback` - Handle OAuth callback

### Gmail Integration
- `GET /gmail/inbox` - Fetch user's emails
- `POST /gmail/archive/{email_id}` - Archive email
- `POST /gmail/trash/{email_id}` - Move to trash
- `POST /gmail/inbox/{email_id}` - Move to inbox
- `POST /gmail/mark-read/{email_id}` - Mark as read

### AI Services
- `POST /ai/classify` - Classify email content
- `POST /ai/summarize` - Generate email summary
- `POST /ai/rewrite` - Rewrite email tone
- `POST /ai/auto-reply` - Generate auto-reply
- `POST /ai/smart-reply` - Generate smart replies
- `POST /ai/process-emails` - Process emails asynchronously
- `GET /ai/health` - Check AI service status

## 🛠️ Development

### Project Structure
```
InboxGeniev2/
├── backend/
│   ├── app/
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── models.py       # Database models
│   │   ├── database.py     # Database connection
│   │   └── config.py       # Configuration
│   ├── celery_app.py       # Celery tasks
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── hooks/          # Custom hooks
│   └── package.json        # Node dependencies
├── docker-compose.yml      # Docker orchestration
└── Dockerfile             # Backend container
```

### Database Schema
- **users**: User profiles and encrypted tokens
- **emails**: Email data with AI metadata
- **ai_classification_enc**: Encrypted AI classification results
- **ai_summary_enc**: Encrypted AI summaries

## 🔒 Security Features

- **Encrypted Token Storage**: All OAuth tokens encrypted with Fernet
- **Secure AI Processing**: AI results encrypted before database storage
- **CORS Protection**: Configured for specific origins
- **Environment Variables**: Sensitive data in environment files

## 🐛 Troubleshooting

### Common Issues

1. **"No user found in database"**
   - Make sure you've completed Google OAuth login first
   - Check if the user was created in the database

2. **"OpenAI API error"**
   - Verify your OpenAI API key is correct
   - Check if you have sufficient API credits

3. **"Google OAuth error"**
   - Verify redirect URI matches exactly: `http://localhost:8000/auth/google/callback`
   - Check if Gmail API is enabled in Google Cloud Console

4. **"Database connection error"**
   - Ensure PostgreSQL is running
   - Check database credentials in `.env` file

5. **"Celery worker not starting"**
   - Ensure Redis is running
   - Check Redis connection URL

### Logs
```bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f worker
docker-compose logs -f frontend
```

## 📈 Performance

- **Async Processing**: AI tasks run in background with Celery
- **Database Optimization**: Indexed fields for fast queries
- **Caching**: Redis for task result caching
- **Containerization**: Isolated services for scalability

## 🚀 Production Deployment

For production deployment:

1. **Environment Variables**: Use secure environment variable management
2. **Database**: Use managed PostgreSQL service
3. **Redis**: Use managed Redis service
4. **SSL**: Enable HTTPS for all endpoints
5. **Monitoring**: Add logging and monitoring services
6. **Scaling**: Use multiple Celery workers for AI processing

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the API documentation at `/docs`

---

**Built with ❤️ using FastAPI, React, OpenAI, and Docker**