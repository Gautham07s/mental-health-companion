import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Brain, MessageSquare, Activity, LogOut, Wind, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import BreathingExercise from './BreathingExercise'

const quotes = [
    "You don't have to control your thoughts. You just have to stop letting them control you.",
    "Happiness can be found even in the darkest of times, if one only remembers to turn on the light.",
    "The only way out is through.",
    "You are not your illness. You have a name, a history, a personality. Staying yourself is part of the battle.",
    "It's okay to not be okay — as long as you are not giving up.",
    "Mental health is not a destination, but a process.",
    "Be patient with yourself. Self-growth is tender.",
    "You are allowed to take up space.",
]

export default function Layout() {
    const { user, logout } = useAuth()
    const location = useLocation()
    const [showBreathing, setShowBreathing] = useState(false)

    const isActive = (path) => location.pathname === path

    // Pick a daily quote based on the day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
    const dailyQuote = quotes[dayOfYear % quotes.length]

    const navItems = [
        { path: '/', icon: MessageSquare, label: 'Companion', color: 'primary' },
        { path: '/trends', icon: Activity, label: 'Mood Trends', color: 'accent' },
    ]

    return (
        <div className="flex h-screen overflow-hidden relative">
            {/* Background Orbs */}
            <div className="orb orb-1" />
            <div className="orb orb-2" />

            {/* Sidebar */}
            <motion.div
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="w-72 glass-panel m-4 rounded-2xl flex flex-col border-r-0 border-white/5 relative z-20"
            >
                {/* Brand */}
                <div className="p-8 pb-4">
                    <h1 className="text-2xl font-bold flex items-center gap-3 gradient-text">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shadow-md">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        MindfulAI
                    </h1>
                    <p className="text-xs text-gray-400 mt-3 ml-1">
                        Welcome, <span className="text-primary-300 font-semibold">{user?.username}</span>
                    </p>
                </div>

                {/* Daily Quote Widget */}
                <div className="mx-4 mb-4 p-4 rounded-xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                        <span className="text-[10px] uppercase tracking-widest text-accent-300 font-bold">Daily Thought</span>
                    </div>
                    <p className="text-xs text-gray-300 italic leading-relaxed">"{dailyQuote}"</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1.5">
                    {navItems.map((item) => (
                        <Link to={item.path} key={item.path}>
                            <div className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive(item.path)
                                    ? `bg-${item.color}-500/20 text-white shadow-lg border border-${item.color}-500/30`
                                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                }`}>
                                {isActive(item.path) && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className={`absolute left-0 top-0 bottom-0 w-1 bg-${item.color}-400 rounded-r-full`}
                                    />
                                )}
                                <item.icon className={`w-5 h-5 ${isActive(item.path) ? `text-${item.color}-300` : `text-gray-500 group-hover:text-${item.color}-300`
                                    }`} />
                                <span className="font-medium text-sm">{item.label}</span>
                            </div>
                        </Link>
                    ))}

                    <button onClick={() => setShowBreathing(!showBreathing)} className="w-full">
                        <div className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 group ${showBreathing ? 'bg-teal-500/20 text-white shadow-lg border border-teal-500/30' : 'hover:bg-white/5 text-gray-400 hover:text-white'
                            }`}>
                            <Wind className={`w-5 h-5 ${showBreathing ? 'text-teal-300' : 'text-gray-500 group-hover:text-teal-300'}`} />
                            <span className="font-medium text-sm">Breathe</span>
                        </div>
                    </button>
                </nav>

                <div className="p-4 mt-auto">
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-colors border border-red-500/10 hover:border-red-500/20"
                    >
                        <LogOut size={16} />
                        <span className="text-sm font-medium">Sign Out</span>
                    </button>
                </div>
            </motion.div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col m-4 ml-0 rounded-2xl relative overflow-hidden">
                {/* Breathing Overlay */}
                <AnimatePresence>
                    {showBreathing && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-4 z-50 glass-panel rounded-2xl shadow-2xl flex flex-col"
                        >
                            <button
                                onClick={() => setShowBreathing(false)}
                                className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white z-10"
                            >
                                ✕
                            </button>
                            <BreathingExercise />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Dynamic Content */}
                <main className="flex-1 glass-panel rounded-2xl overflow-hidden shadow-2xl relative border border-white/5">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
