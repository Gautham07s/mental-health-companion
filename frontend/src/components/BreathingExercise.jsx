import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Wind, Play, Pause, RotateCcw } from 'lucide-react'

const PHASES = [
    { name: 'inhale', label: 'Inhale Deeply...', duration: 4, scale: 1.2 },
    { name: 'hold', label: 'Hold Your Breath', duration: 7, scale: 1.2 },
    { name: 'exhale', label: 'Slowly Exhale...', duration: 8, scale: 0.8 },
]

export default function BreathingExercise() {
    const [phaseIndex, setPhaseIndex] = useState(0)
    const [secondsLeft, setSecondsLeft] = useState(PHASES[0].duration)
    const [isRunning, setIsRunning] = useState(true)
    const [cycleCount, setCycleCount] = useState(0)
    const intervalRef = useRef(null)

    const phase = PHASES[phaseIndex]
    const totalDuration = phase.duration
    const progress = 1 - (secondsLeft / totalDuration)

    useEffect(() => {
        if (!isRunning) {
            clearInterval(intervalRef.current)
            return
        }

        intervalRef.current = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    // Move to next phase
                    setPhaseIndex((pi) => {
                        const next = (pi + 1) % PHASES.length
                        if (next === 0) setCycleCount((c) => c + 1)
                        return next
                    })
                    // We calculate the next duration inside a callback to avoid stale state
                    return PHASES[(phaseIndex + 1) % PHASES.length].duration
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(intervalRef.current)
    }, [isRunning, phaseIndex])

    const reset = () => {
        setPhaseIndex(0)
        setSecondsLeft(PHASES[0].duration)
        setCycleCount(0)
        setIsRunning(false)
    }

    // SVG progress ring
    const radius = 90
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference * (1 - progress)

    return (
        <div className="flex flex-col items-center justify-center text-center h-full min-h-[300px] p-8">
            <h3 className="text-xl font-bold mb-2 text-primary-200 flex items-center gap-2">
                <Wind className="w-5 h-5" />
                4-7-8 Breathing
            </h3>
            <p className="text-xs text-gray-400 mb-8">
                {cycleCount > 0 ? `${cycleCount} cycle${cycleCount > 1 ? 's' : ''} completed` : 'Follow the rhythm to relax'}
            </p>

            <div className="relative flex items-center justify-center w-56 h-56 mb-6">
                {/* Outer Glow */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-primary-500/15 blur-2xl"
                    animate={{
                        scale: phase.scale * 1.2,
                        opacity: phase.name === 'hold' ? 0.5 : 0.3,
                    }}
                    transition={{ duration: phase.name === 'inhale' ? 4 : phase.name === 'exhale' ? 8 : 0.5 }}
                />

                {/* SVG Progress Ring */}
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 200 200">
                    <circle
                        cx="100" cy="100" r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="4"
                    />
                    <motion.circle
                        cx="100" cy="100" r={radius}
                        fill="none"
                        stroke="url(#progressGradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                    <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#d946ef" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Breathing Circle */}
                <motion.div
                    className="w-36 h-36 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 shadow-lg flex flex-col items-center justify-center z-10"
                    animate={{ scale: phase.scale }}
                    transition={{ duration: phase.name === 'inhale' ? 4 : phase.name === 'exhale' ? 8 : 0.5 }}
                >
                    <span className="text-3xl font-bold text-white drop-shadow-md">{secondsLeft}s</span>
                    <span className="text-[10px] text-white/70 uppercase tracking-widest mt-1 font-medium">{phase.name}</span>
                </motion.div>
            </div>

            {/* Status Text */}
            <motion.p
                key={phase.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-medium text-primary-100 mb-6"
            >
                {phase.label}
            </motion.p>

            {/* Controls */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 transition-colors border border-primary-500/20 text-sm font-medium"
                >
                    {isRunning ? <Pause size={16} /> : <Play size={16} />}
                    {isRunning ? 'Pause' : 'Resume'}
                </button>
                <button
                    onClick={reset}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors border border-white/10 text-sm font-medium"
                >
                    <RotateCcw size={16} />
                    Reset
                </button>
            </div>
        </div>
    )
}
