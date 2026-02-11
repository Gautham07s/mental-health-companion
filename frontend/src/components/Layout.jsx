import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Brain, MessageSquare, Activity, LogOut, Wind } from 'lucide-react'
import { motion } from 'framer-motion'
import BreathingExercise from './BreathingExercise'

export default function Layout() {
    const { user, logout } = useAuth()
    const location = useLocation()
    const [showBreathing, setShowBreathing] = useState(false)

    const isActive = (path) => location.pathname === path

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar - Glassmorphism */}
            <div className="w-72 glass-panel m-4 rounded-2xl flex flex-col border-r-0 border-white/5 relative z-20">
                <div className="p-8">
                    <h1 className="text-2xl font-bold flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                        <Brain className="w-8 h-8 text-primary-400" />
                        MindfulAI
                    </h1>
                    <p className="text-xs text-gray-400 mt-2 ml-1">Welcome, <span className="text-primary-300 font-semibold">{user?.username}</span></p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link to="/">
                        <div className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group ${isActive('/') ? 'bg-primary-500/20 text-white shadow-lg border border-primary-500/30' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}>
                            <MessageSquare className={`w-5 h-5 ${isActive('/') ? 'text-primary-300' : 'text-gray-500 group-hover:text-primary-300'}`} />
                            <span className="font-medium">Companion</span>
                        </div>
                    </Link>

                    <Link to="/trends">
                        <div className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group ${isActive('/trends') ? 'bg-accent-500/20 text-white shadow-lg border border-accent-500/30' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}>
                            <Activity className={`w-5 h-5 ${isActive('/trends') ? 'text-accent-300' : 'text-gray-500 group-hover:text-accent-300'}`} />
                            <span className="font-medium">Mood Trends</span>
                        </div>
                    </Link>

                    <button onClick={() => setShowBreathing(!showBreathing)}>
                        <div className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group ${showBreathing ? 'bg-teal-500/20 text-white shadow-lg border border-teal-500/30' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}>
                            <Wind className={`w-5 h-5 ${showBreathing ? 'text-teal-300' : 'text-gray-500 group-hover:text-teal-300'}`} />
                            <span className="font-medium">Breathe</span>
                        </div>
                    </button>
                </nav>

                <div className="p-4 mt-auto">
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-colors border border-red-500/10"
                    >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col m-4 ml-0 rounded-2xl relative overflow-hidden">
                {/* Breathing Overlay */}
                {showBreathing && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-4 z-50 glass-panel rounded-2xl shadow-2xl flex flex-col"
                    >
                        <button
                            onClick={() => setShowBreathing(false)}
                            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white"
                        >
                            ✕
                        </button>
                        <BreathingExercise />
                    </motion.div>
                )}

                {/* Dynamic Content */}
                <main className="flex-1 glass-panel rounded-2xl overflow-hidden shadow-2xl relative border border-white/5">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
