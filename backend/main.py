from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from jose import JWTError, jwt
from contextlib import asynccontextmanager

# Import Agents
from .agents.emotion_agent import EmotionAnalysisAgent
from .agents.conversation_agent import ConversationAgent
from .agents.crisis_agent import CrisisDetectionAgent
from .agents.support_agent import SupportAgent

# Import Database & Auth
from .database import engine, Base, get_db
from .models import Message, EmotionLog, User
from .auth import verify_password, get_password_hash, create_access_token, SECRET_KEY, ALGORITHM

# Global Agent Instances (Initialized in lifespan)
agents: Dict[str, Any] = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load Agents on Startup
    print("Initializing Agents...")
    agents["emotion"] = EmotionAnalysisAgent()
    agents["crisis"] = CrisisDetectionAgent()
    agents["conversation"] = ConversationAgent()
    agents["support"] = SupportAgent()
    print("All Agents Initialized.")
    yield
    # Clean up on Shutdown (if needed)
    agents.clear()

# Initialize Database
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Database setup error (sanity check): {e}")

# Initialize App
app = FastAPI(title="Mental Health Virtual Companion API", lifespan=lifespan)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 Scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Pydantic Models
class UserCreate(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ChatRequest(BaseModel):
    text: str

class ChatResponse(BaseModel):
    bot_response: str
    detected_emotion: str
    emotion_confidence: float
    recommendation: str | None = None
    is_crisis: bool = False

# Dependency: Get Current User
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

@app.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/")
def read_root():
    return {"status": "Mental Health Companion Backend is Running"}

@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_text = request.text
    
    # 1. Crisis Detection
    is_crisis, crisis_msg = agents["crisis"].check_crisis(user_text)
    
    # Save User Message with User ID
    user_msg_entry = Message(
        sender="user", 
        content=user_text, 
        is_crisis=1 if is_crisis else 0,
        user_id=current_user.id
    )
    
    if is_crisis:
        user_msg_entry.detected_emotion = "crisis"
        db.add(user_msg_entry)
        
        bot_msg_entry = Message(sender="bot", content=crisis_msg, user_id=current_user.id)
        db.add(bot_msg_entry)
        db.commit()
        
        return ChatResponse(
            bot_response=crisis_msg,
            detected_emotion="crisis",
            emotion_confidence=1.0,
            recommendation="Please seek professional help immediately.",
            is_crisis=True
        )

    # 2. Emotion Analysis
    emotion_result = agents["emotion"].analyze(user_text)
    emotion = emotion_result['label']
    confidence = emotion_result['score']
    
    user_msg_entry.detected_emotion = emotion
    user_msg_entry.emotion_confidence = confidence
    db.add(user_msg_entry)

    # Log Emotion
    emotion_log = EmotionLog(emotion=emotion, confidence=confidence, user_id=current_user.id)
    db.add(emotion_log)

    # 3. Support Recommendation
    recommendation = None
    if emotion in ["sadness", "fear", "anger"]:
        recommendation = agents["support"].get_recommendation(emotion)

    # 4. Conversation Generation
    bot_reply = agents["conversation"].generate_response(user_text)
    
    bot_msg_entry = Message(sender="bot", content=bot_reply, user_id=current_user.id)
    db.add(bot_msg_entry)
    
    db.commit()
    
    return ChatResponse(
        bot_response=bot_reply,
        detected_emotion=emotion,
        emotion_confidence=confidence,
        recommendation=recommendation,
        is_crisis=False
    )

@app.get("/history")
def get_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Get last 50 messages for current user only
    messages = db.query(Message).filter(Message.user_id == current_user.id).order_by(Message.timestamp.desc()).limit(50).all()
    return messages[::-1]

@app.get("/trends")
def get_trends(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Get logs for current user only
    logs = db.query(EmotionLog).filter(EmotionLog.user_id == current_user.id).order_by(EmotionLog.timestamp.desc()).limit(20).all()
    return logs
