# 🧠 MindfulAI – Mental Health Virtual Companion

An AI-powered mental health companion that provides empathetic conversations, real-time emotion analysis, crisis detection, and mood tracking — all running locally on your machine for complete privacy.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 💬 **AI Chat** | Conversations powered by Facebook's BlenderBot for empathetic, context-aware responses |
| 🎭 **Emotion Detection** | Real-time sentiment analysis using a fine-tuned transformer model |
| 🚨 **Crisis Detection** | Automatic detection of crisis-level messages with immediate safety resources |
| 📊 **Mood Dashboard** | Track your emotional trends over time with interactive charts |
| 🌬️ **Breathing Exercise** | Guided 4-7-8 breathing with animated progress ring & pause/resume |
| 🔐 **Authentication** | Secure JWT-based login with per-user data isolation |
| 🎨 **Glassmorphism UI** | Premium dark theme with animated floating orbs, gradients & micro-animations |

---

## 🛠️ Tech Stack

**Backend:**
- Python 3.11 + FastAPI
- SQLAlchemy + SQLite
- HuggingFace Transformers (BlenderBot, Emotion Classifier)
- JWT Authentication (python-jose + passlib)

**Frontend:**
- React 19 + Vite
- Tailwind CSS 3
- Framer Motion (animations)
- Recharts (mood visualizations)
- Lucide React (icons)

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Clone the Repository
```bash
git clone https://github.com/Gautham07s/mental-health-companion.git
cd mental-health-companion
```

### 2. Backend Setup
```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000
```
> First startup will download AI models (~750MB). Subsequent starts are instant.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Open the App
Navigate to `http://localhost:5173` (or the port shown in terminal).

---

## 📁 Project Structure

```
mental_health_virtual_companion/
├── backend/
│   ├── agents/
│   │   ├── emotion_agent.py      # Transformer-based emotion classifier
│   │   ├── conversation_agent.py # BlenderBot conversation engine
│   │   ├── crisis_agent.py       # Keyword + pattern crisis detector
│   │   └── support_agent.py      # Emotion-aware recommendations
│   ├── main.py                   # FastAPI app with all endpoints
│   ├── models.py                 # SQLAlchemy models (User, Message, EmotionLog)
│   ├── database.py               # Database engine & session
│   ├── auth.py                   # JWT + password hashing
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/           # ChatBox, Layout, MoodChart, BreathingExercise
│   │   ├── pages/                # Login, Register
│   │   ├── context/              # AuthContext (JWT management)
│   │   ├── App.jsx               # Routes & TrendsPage
│   │   └── index.css             # Glassmorphism design system
│   ├── index.html
│   └── package.json
└── README.md
```

---

## 🔒 Privacy

All AI models run **locally**. No data is sent to external servers. Your conversations are stored in a local SQLite database (`mental_health.db`) and are only accessible to your authenticated account.

---

## 📄 License

This project is for educational and personal use.
