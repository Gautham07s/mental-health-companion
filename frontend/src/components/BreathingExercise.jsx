import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wind } from 'lucide-react'

export default function BreathingExercise() {
    const [phase, setPhase] = useState('inhale') // inhale, hold, exhale
    const [statusText, setStatusText] = useState('Breathe In')

    useEffect(() => {
        const cycle = async () => {
            // Inhale (4s)
            setPhase('inhale')
            setStatusText('Inhale Deeply...')
            await new Promise(r => setTimeout(r, 4000))

            // Hold (7s)
            setPhase('hold')
            setStatusText('Hold Your Breath')
            await new Promise(r => setTimeout(r, 7000))

            // Exhale (8s)
            setPhase('exhale')
            setStatusText('Slowly Exhale...')
            await new Promise(r => setTimeout(r, 8000))

            cycle()
        }

        cycle()

        return () => { } // Cleanup not strictly needed for this loop logic but good practice
    }, [])

    return (
        <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden h-full min-h-[300px]">
            <h3 className="text-xl font-bold mb-6 text-primary-200 flex items-center gap-2">
                <Wind className="w-5 h-5" />
                4-7-8 Breathing
            </h3>

            <div className="relative flex items-center justify-center w-64 h-64">
                {/* Outer Glow Ring */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-primary-500/20 blur-xl"
                    animate={{
                        scale: phase === 'inhale' ? 1.5 : phase === 'hold' ? 1.5 : 1,
                        opacity: phase === 'hold' ? 0.6 : 0.4,
                    }}
                    transition={{ duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 8 : 0 }}
                />

                {/* Breathing Circle */}
                <motion.div
                    className="w-40 h-40 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 shadow-lg flex items-center justify-center z-10"
                    animate={{
                        scale: phase === 'inhale' ? 1.2 : phase === 'hold' ? 1.2 : 0.8,
                    }}
                    transition={{ duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 8 : 0 }}
                >
                    <span className="text-2xl font-bold text-white drop-shadow-md">
                        {phase === 'inhale' ? '4s' : phase === 'hold' ? '7s' : '8s'}
                    </span>
                </motion.div>
            </div>

            <motion.p
                key={statusText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-lg font-medium text-primary-100"
            >
                {statusText}
            </motion.p>
        </div>
    )
}
