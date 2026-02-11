import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import ChatBox from './components/ChatBox'
import Login from './pages/Login'
import Register from './pages/Register'
import MoodChart from './components/MoodChart'
import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { TrendingUp, Brain, Zap, Calendar } from 'lucide-react'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center mx-auto mb-4 glow-ring">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <p className="text-gray-400 text-sm">Loading your sanctuary...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  return children;
};

// Trends Page Component
const TrendsPage = () => {
  const [data, setData] = useState([]);
  const [rawLogs, setRawLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8000/trends');
        setRawLogs(res.data);
        const chartData = res.data.map(log => ({
          date: new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          confidence: log.confidence,
          emotion: log.emotion,
        })).reverse();
        setData(chartData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Compute stats
  const stats = useMemo(() => {
    if (rawLogs.length === 0) return null;

    const totalSessions = rawLogs.length;
    const avgConfidence = rawLogs.reduce((sum, l) => sum + l.confidence, 0) / totalSessions;

    // Most common emotion
    const emotionCounts = {};
    rawLogs.forEach(l => {
      emotionCounts[l.emotion] = (emotionCounts[l.emotion] || 0) + 1;
    });
    const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];

    return { totalSessions, avgConfidence, topEmotion: topEmotion[0], topEmotionCount: topEmotion[1], emotionCounts };
  }, [rawLogs]);

  const EMOTION_COLORS = {
    joy: '#facc15', sadness: '#3b82f6', anger: '#ef4444', fear: '#a855f7',
    love: '#ec4899', surprise: '#10b981', neutral: '#6b7280', crisis: '#dc2626',
  };

  return (
    <div className="p-6 h-full flex flex-col overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold mb-1 gradient-text">Your Emotional Journey</h2>
        <p className="text-gray-400 text-sm mb-6">Track patterns and gain insights into your wellbeing</p>
      </motion.div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-4 border"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-400" />
              </div>
              <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Sessions</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalSessions}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-4 border"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-accent-400" />
              </div>
              <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Avg Confidence</span>
            </div>
            <p className="text-2xl font-bold text-white">{(stats.avgConfidence * 100).toFixed(0)}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-xl p-4 border"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-yellow-400" />
              </div>
              <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Top Emotion</span>
            </div>
            <p className="text-2xl font-bold text-white capitalize">{stats.topEmotion}</p>
          </motion.div>
        </div>
      )}

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex-1 min-h-[280px]"
      >
        <MoodChart data={data} />
      </motion.div>

      {/* Emotion Distribution */}
      {stats && stats.emotionCounts && Object.keys(stats.emotionCounts).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 glass-panel rounded-2xl p-5"
        >
          <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">Emotion Distribution</h3>
          <div className="space-y-2.5">
            {Object.entries(stats.emotionCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([emotion, count]) => {
                const pct = (count / stats.totalSessions) * 100;
                return (
                  <div key={emotion} className="flex items-center gap-3">
                    <span className="text-xs text-gray-300 capitalize w-20 shrink-0">{emotion}</span>
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: EMOTION_COLORS[emotion] || '#6b7280' }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-10 text-right">{pct.toFixed(0)}%</span>
                  </div>
                );
              })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<ChatBox />} />
            <Route path="trends" element={<TrendsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
