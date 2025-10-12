# InboxGenie — Phase 1 (Local)

Local-ready sample for InboxGenie: FastAPI backend, React frontend, Postgres, Redis & Celery.

## Prerequisites
- Docker & Docker Compose
- Create Google OAuth client (see below)
- Populate `.env` (see `.env.example`)

## Quickstart
1. Copy `.env.example` → `.env` and fill values (FERNET_KEY, Google client id/secret).
2. Build & run:
   ```bash
   docker-compose up --build
