# InboxGenie Backend (Local)

## Prereqs
- Docker & docker-compose (recommended) OR Python 3.11, PostgreSQL, Redis locally.
- Create `.env` from `.env.example` and fill secrets.

## Quick start with Docker Compose (recommended)
(Place docker-compose.yml at project root that starts `backend`, `frontend`, `db`, `redis`.)

```bash
docker-compose up --build
