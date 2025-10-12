from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routes import auth, gmail, ai

# create tables (dev convenience)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="InboxGenie Backend")

# List of allowed origins (your frontend's address)
origins = [
    "http://localhost:8080",  # Add the default Vite frontend URL
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(gmail.router, prefix="/gmail", tags=["gmail"])
app.include_router(ai.router, prefix="/ai", tags=["ai"])
