# InboxGenie - AI-Powered Email Management Dashboard

An intelligent email management system that uses AI to automatically categorize emails, provide smart summaries, and assist with email composition. Built with FastAPI backend and React frontend.

## ✨ Features

### 🤖 AI-Powered Features
- **Smart Email Classification**: Automatically categorizes emails (Urgent, Important, Task, Promotion, General)
- **AI Email Summaries**: One-click AI-generated summaries for long emails
- **Smart Compose**: AI-assisted email composition with tone selection (Professional, Casual, Friendly, Formal)
- **Auto Reply**: Intelligent auto-reply generation
- **Smart Reply**: Context-aware reply suggestions

### 🎨 Modern UI
- **Violet-themed Design**: Beautiful gradient backgrounds and animations
- **Animated Landing Page**: Floating particles and glowing effects
- **Responsive Design**: Works on desktop and mobile
- **Email Expansion**: Click to expand emails with smooth animations
- **Real-time Search**: Instant email filtering

### 🔐 Authentication
- **Google OAuth 2.0**: Secure login with Google accounts
- **Session Management**: Persistent authentication
- **Secure Token Storage**: Encrypted token handling

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Google Cloud Console account
- OpenAI API key (for AI features)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd InboxGeniev2
```

### 2. Backend Setup

#### Create Environment File
```bash
cd backend
cp .env.example .env
```

#### Configure Environment Variables
Edit `backend/.env` with your credentials:

```env
# Database
DATABASE_URL=postgresql://postgres:password@db:5432/inboxgenie

# Redis
REDIS_URL=redis://redis:6379

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

# OpenAI API (Get from OpenAI)
OPENAI_API_KEY=your_openai_api_key

# Fernet Key (Generate with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())")
FERNET_KEY=your_fernet_key

# JWT Secret
JWT_SECRET_KEY=your_jwt_secret_key
```

#### Generate Fernet Key
```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

### 3. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Gmail API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set **Authorized redirect URIs** to: `http://localhost:8000/auth/google/callback`
6. Copy Client ID and Client Secret to your `.env` file

### 4. OpenAI Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add the key to your `.env` file

### 5. Run the Application

#### Using Docker Compose (Recommended)
```bash
# From project root
docker-compose up --build
```

#### Manual Setup
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🏗️ Project Structure

```
InboxGeniev2/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   └── models.py       # Database models
│   ├── requirements.txt
│   └── .env               # Environment variables
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   └── services/      # API services
│   └── package.json
├── docker-compose.yml     # Docker orchestration
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `REDIS_URL` | Redis connection string | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `FERNET_KEY` | Encryption key for tokens | Yes |
| `JWT_SECRET_KEY` | JWT signing secret | Yes |

### Google OAuth Scopes
The application requests these Gmail permissions:
- `https://www.googleapis.com/auth/gmail.readonly`
- `https://www.googleapis.com/auth/gmail.send`
- `https://www.googleapis.com/auth/userinfo.email`

## 🎯 Usage

### 1. Login
- Click "Login" on the landing page
- Authorize with your Google account
- Grant Gmail permissions

### 2. Email Management
- **View Emails**: Browse your inbox with AI categorization
- **Search**: Use the search bar to find specific emails
- **Categories**: Filter by Urgent, Important, Task, Promotion
- **Expand**: Click emails to see full content

### 3. AI Features
- **Smart Compose**: Click "Smart Compose" in sidebar
- **Reply**: Click "Reply" on any email
- **AI Summary**: Click "Show AI Summary" on expanded emails
- **Tone Selection**: Choose Professional, Casual, Friendly, or Formal

### 4. Email Actions
- **Star**: Mark important emails
- **Archive**: Move emails to archive
- **Delete**: Move emails to trash
- **Reply**: Start AI-powered reply

## 🐛 Troubleshooting

### Common Issues

1. **"Could not translate host name 'db'"**
   - Make sure you're running with Docker Compose
   - Check if all services are running: `docker-compose ps`

2. **Google OAuth errors**
   - Verify redirect URI in Google Cloud Console
   - Check Client ID and Secret in `.env`
   - Ensure Gmail API is enabled

3. **OpenAI API errors**
   - Verify API key is correct
   - Check API usage limits
   - Ensure sufficient credits

4. **Database connection issues**
   - Check PostgreSQL is running
   - Verify DATABASE_URL format
   - Check database permissions

### Debug Commands
```bash
# Check Docker services
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart services
docker-compose restart

# Rebuild containers
docker-compose up --build --force-recreate
```

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use strong, unique Fernet keys
- Rotate API keys regularly
- Monitor API usage and costs
- Use HTTPS in production

## 📝 Development

### Adding New Features
1. Backend: Add routes in `app/routes/`
2. Frontend: Add components in `src/components/`
3. Update API service in `src/services/api.ts`

### Testing
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation at `/docs`
3. Open an issue on GitHub

---

**InboxGenie** - Transform your email experience with AI intelligence! 🚀
