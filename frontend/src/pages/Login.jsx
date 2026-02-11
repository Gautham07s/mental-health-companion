import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Lock, Brain, Shield, Activity, Loader2 } from 'lucide-react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Invalid username or password');
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        { icon: Brain, label: 'AI-Powered Conversations', desc: 'Empathetic responses powered by BlenderBot' },
        { icon: Shield, label: 'Private & Secure', desc: 'Your data stays on your machine' },
        { icon: Activity, label: 'Mood Tracking', desc: 'Visualize your emotional journey' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Floating Orbs */}
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />

            <div className="flex gap-8 items-center max-w-4xl w-full relative z-10">
                {/* Left — Feature Showcase (hidden on small screens) */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="hidden lg:flex flex-col gap-6 flex-1"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shadow-lg">
                            <Brain className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-bold gradient-text">MindfulAI</h1>
                    </div>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Your private, AI-powered mental health companion. Talk freely, track your emotions, and build healthier habits.
                    </p>

                    <div className="space-y-4 mt-4">
                        {features.map((feat, i) => (
                            <motion.div
                                key={feat.label}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.15 }}
                                className="glass-card rounded-xl p-4 flex items-start gap-4"
                            >
                                <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center shrink-0">
                                    <feat.icon className="w-5 h-5 text-primary-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white text-sm">{feat.label}</p>
                                    <p className="text-gray-400 text-xs mt-0.5">{feat.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right — Login Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass-panel p-8 rounded-2xl w-full max-w-md relative z-10"
                >
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                            className="w-16 h-16 bg-gradient-to-br from-primary-400 to-accent-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4 glow-ring"
                        >
                            <Lock className="text-white w-8 h-8" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-gray-400">Sign in to your private sanctuary</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg mb-6 text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all placeholder-gray-500"
                                placeholder="Enter your username"
                                required
                                disabled={isLoading}
                            />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all placeholder-gray-500"
                                placeholder="••••••••"
                                required
                                disabled={isLoading}
                            />
                        </motion.div>

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {isLoading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    Sign In
                                </>
                            )}
                        </motion.button>
                    </form>

                    <p className="mt-6 text-center text-gray-400 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                            Create one
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
