import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import ChatBox from './components/ChatBox'
import Login from './pages/Login'
import Register from './pages/Register'
import MoodChart from './components/MoodChart'
import { useState, useEffect } from 'react'
import axios from 'axios'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center text-primary-400">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

// Trends Page Component (Wrapper)
const TrendsPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8000/trends');
        // Transform for chart if needed
        const chartData = res.data.map(log => ({
          date: new Date(log.timestamp).toLocaleDateString(),
          confidence: log.confidence
        })).reverse();
        setData(chartData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8 h-full flex flex-col">
      <h2 className="text-3xl font-bold mb-6 text-white">Your Emotional Journey</h2>
      <div className="flex-1">
        <MoodChart data={data} />
      </div>
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
