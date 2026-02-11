import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Shield, Loader2, Check, X } from 'lucide-react';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    // Password strength
    const strength = useMemo(() => {
        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 10) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    }, [password]);

    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'][strength];
    const strengthColor = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-400'][strength];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 4) {
            setError('Password must be at least 4 characters');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await register(username, password);
            navigate('/login');
        } catch (err) {
            setError('Username may already exist');
        } finally {
            setIsLoading(false);
        }
    };

    const rules = [
        { label: 'At least 6 characters', met: password.length >= 6 },
        { label: 'Contains a number', met: /[0-9]/.test(password) },
        { label: 'Contains uppercase', met: /[A-Z]/.test(password) },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Floating Orbs */}
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />

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
                        className="w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4 glow-ring"
                    >
                        <Shield className="text-white w-8 h-8" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-white mb-2">Join MindfulAI</h2>
                    <p className="text-gray-400">Begin your journey to better mental health</p>
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
                        <label className="block text-sm font-medium text-gray-300 mb-2">Choose Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all placeholder-gray-500"
                            placeholder="unique_username"
                            required
                            disabled={isLoading}
                        />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Create Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all placeholder-gray-500"
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                        />

                        {/* Password Strength Bar */}
                        {password && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3">
                                <div className="flex gap-1 mb-1.5">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : 'bg-gray-700'}`} />
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400">{strengthLabel}</p>

                                {/* Rules Checklist */}
                                <div className="mt-2 space-y-1">
                                    {rules.map((rule) => (
                                        <div key={rule.label} className={`flex items-center gap-2 text-xs transition-colors ${rule.met ? 'text-green-400' : 'text-gray-500'}`}>
                                            {rule.met ? <Check size={12} /> : <X size={12} />}
                                            {rule.label}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-accent-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <>
                                <UserPlus size={20} />
                                Create Account
                            </>
                        )}
                    </motion.button>
                </form>

                <p className="mt-6 text-center text-gray-400 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-accent-400 hover:text-accent-300 font-medium transition-colors">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
