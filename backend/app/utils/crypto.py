# backend/app/utils/crypto.py
from cryptography.fernet import Fernet
from app.config import FERNET_KEY

_key = FERNET_KEY
if isinstance(_key, str):
    _key = _key.encode()

fernet = Fernet(_key)

def encrypt_text(plain: str | None) -> str | None:
    if plain is None:
        return None
    return fernet.encrypt(plain.encode()).decode()

def decrypt_text(token: str | None) -> str | None:
    if token is None:
        return None
    return fernet.decrypt(token.encode()).decode()
