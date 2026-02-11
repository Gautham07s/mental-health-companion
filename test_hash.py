from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

try:
    password = "secretpassword"
    print(f"Hashing password: '{password}' (len={len(password)})")
    hashed = pwd_context.hash(password)
    print(f"Hashed: {hashed}")
except Exception as e:
    print(f"Error hashing with bcrypt: {e}")

# Try pbkdf2_sha256 just in case
pwd_context_sha = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
try:
    hashed_sha = pwd_context_sha.hash(password)
    print(f"Hashed with pbkdf2_sha256: {hashed_sha}")
except Exception as e:
    print(f"Error hashing with pbkdf2_sha256: {e}")
