import { useState, useRef, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Send, User, Bot, AlertTriangle, Lightbulb, Sparkles, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const EMOTION_STYLES = {
    joy: 'emotion-joy',
    sadness: 'emotion-sadness',
    anger: 'emotion-anger',
    fear: 'emotion-fear',
    love: 'emotion-love',
    surprise: 'emotion-surprise',
    neutral: 'emotion-neutral',
    crisis: 'emotion-crisis',
    error: 'emotion-neutral',
}

const EMOTION_EMOJI = {
    joy: '😊', sadness: '😢', anger: '😠', fear: '😨',
    love: '💕', surprise: '😮', neutral: '😐', crisis: '🚨',
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ChatBox() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [historyLoaded, setHistoryLoaded] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [])

    // Load chat history on mount
    useEffect(() => {
        const loadHistory = async () => {
            try {
                const res = await axios.get('http://localhost:8000/history')
                if (res.data && res.data.length > 0) {
                    const history = res.data.map(msg => ({
                        type: msg.sender,
                        text: msg.content,
                        emotion: msg.detected_emotion || undefined,
                        confidence: msg.emotion_confidence || undefined,
                        timestamp: msg.timestamp,
                    }))
                    setMessages(history)
                } else {
                    // Welcome message for new users
                    setMessages([{
                        type: 'bot',
                        text: "Hello! 👋 I'm your virtual companion. I'm here to listen, support, and help you navigate your emotions. How are you feeling today?",
                        emotion: 'neutral',
                        timestamp: new Date().toISOString(),
                    }])
                }
            } catch (err) {
                setMessages([{
                    type: 'bot',
                    text: "Hello! 👋 I'm your virtual companion. How are you feeling today?",
                    emotion: 'neutral',
                    timestamp: new Date().toISOString(),
                }])
            }
            setHistoryLoaded(true)
        }
        loadHistory()
    }, [])

    useEffect(() => {
        if (historyLoaded) scrollToBottom()
    }, [messages, scrollToBottom, historyLoaded])

    const sendMessage = useCallback(async () => {
        if (!input.trim() || loading) return

        const userMsg = { type: 'user', text: input, timestamp: new Date().toISOString() }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)

        try {
            const response = await axios.post('http://localhost:8000/chat', { text: userMsg.text })
            const data = response.data

            const botMsg = {
                type: 'bot',
                text: data.bot_response,
                emotion: data.detected_emotion,
                confidence: data.emotion_confidence,
                recommendation: data.recommendation,
                is_crisis: data.is_crisis,
                timestamp: new Date().toISOString(),
            }
            setMessages(prev => [...prev, botMsg])
        } catch (error) {
            setMessages(prev => [...prev, {
                type: 'bot',
                text: "I'm having trouble connecting right now. Please check if the backend server is running on port 8000.",
                emotion: 'error',
                timestamp: new Date().toISOString(),
            }])
        } finally {
            setLoading(false)
        }
    }, [input, loading])

    return (
        <div className="flex flex-col h-full bg-transparent">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {!historyLoaded && (
                    <div className="flex justify-center py-8">
                        <div className="shimmer w-48 h-4 rounded-full" />
                    </div>
                )}

                <AnimatePresence>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                {/* Avatar */}
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-md ${msg.type === 'user'
                                        ? 'bg-gradient-to-br from-primary-500 to-primary-700'
                                        : 'bg-gradient-to-br from-accent-500 to-accent-700'
                                    }`}>
                                    {msg.type === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                                </div>

                                {/* Message Content */}
                                <div className="flex flex-col gap-1.5">
                                    <div className={`px-4 py-3 rounded-2xl shadow-sm ${msg.type === 'user'
                                            ? 'bg-primary-600/90 text-white rounded-tr-sm'
                                            : 'glass-panel text-gray-100 rounded-tl-sm border-white/5'
                                        }`}>
                                        <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.text}</p>
                                    </div>

                                    {/* Timestamp */}
                                    <div className={`flex items-center gap-1.5 text-[10px] text-gray-500 ${msg.type === 'user' ? 'justify-end' : 'justify-start'} px-1`}>
                                        <Clock size={10} />
                                        {msg.timestamp ? formatTime(msg.timestamp) : ''}
                                    </div>

                                    {/* Emotion Insight Panel */}
                                    {msg.type === 'bot' && msg.emotion && msg.emotion !== 'neutral' && msg.emotion !== 'error' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="rounded-xl p-3 text-xs text-gray-300 ml-1 bg-white/[0.03] border border-white/5"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <Sparkles className="w-3 h-3 text-accent-400" />
                                                <span className="font-bold text-accent-300 uppercase tracking-widest text-[10px]">AI Insight</span>
                                            </div>

                                            {/* Emotion Badge */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${EMOTION_STYLES[msg.emotion] || 'emotion-neutral'}`}>
                                                    {EMOTION_EMOJI[msg.emotion] || '💭'} {msg.emotion}
                                                </span>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="h-1.5 w-14 bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-accent-500 rounded-full transition-all"
                                                            style={{ width: `${(msg.confidence * 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-gray-400 text-[10px]">{(msg.confidence * 100).toFixed(0)}%</span>
                                                </div>
                                            </div>

                                            {/* Recommendation */}
                                            {msg.recommendation && (
                                                <div className="mt-2 bg-white/5 p-2.5 rounded-lg border border-white/5 flex gap-2.5">
                                                    <Lightbulb size={14} className="text-yellow-400 mt-0.5 shrink-0" />
                                                    <span className="text-gray-200 italic text-xs leading-relaxed">"{msg.recommendation}"</span>
                                                </div>
                                            )}

                                            {/* Crisis Alert */}
                                            {msg.is_crisis && (
                                                <div className="mt-2 bg-red-500/20 p-2.5 rounded-lg border border-red-500/50 flex gap-2.5 text-red-200">
                                                    <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
                                                    <span className="font-bold text-xs">Safety Alert — Please seek professional help</span>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start ml-12">
                        <div className="glass-panel px-4 py-3 rounded-2xl rounded-tl-sm text-gray-400 text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                            <div className="w-1.5 h-1.5 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                            <div className="w-1.5 h-1.5 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                            <span className="text-[10px] text-gray-500 ml-1.5">Analyzing & responding...</span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-5 bg-transparent">
                <div className="glass-panel p-2 rounded-2xl flex items-center gap-2 relative shadow-2xl">
                    <input
                        type="text"
                        className="flex-1 bg-transparent border-none text-white px-4 py-3 focus:outline-none placeholder-gray-500 text-sm font-medium"
                        placeholder="Type your thoughts here..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        disabled={loading}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-primary-500/25 active:scale-95"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <p className="text-center text-[10px] text-gray-500/60 mt-2.5 font-medium tracking-wide uppercase">
                    Private & Secure • Local AI • Emotion-Aware
                </p>
            </div>
        </div>
    )
}
