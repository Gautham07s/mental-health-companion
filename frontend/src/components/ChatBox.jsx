import { useState, useRef, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Send, User, Bot, AlertTriangle, Lightbulb, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ChatBox() {
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: "Hello! I'm your virtual companion. How are you feeling today?",
            emotion: 'neutral'
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages, scrollToBottom])

    const sendMessage = useCallback(async () => {
        if (!input.trim() || loading) return

        const userMsg = { type: 'user', text: input }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)

        try {
            const response = await axios.post('http://localhost:8000/chat', {
                text: userMsg.text
            })

            const data = response.data

            const botMsg = {
                type: 'bot',
                text: data.bot_response,
                emotion: data.detected_emotion,
                confidence: data.emotion_confidence,
                recommendation: data.recommendation,
                is_crisis: data.is_crisis
            }

            setMessages(prev => [...prev, botMsg])
        } catch (error) {
            console.error("API Error:", error)
            setMessages(prev => [...prev, {
                type: 'bot',
                text: "I'm having trouble connecting to my brain (backend). Please check if the server is running.",
                emotion: 'error'
            }])
        } finally {
            setLoading(false)
        }
    }, [input, loading])

    return (
        <div className="flex flex-col h-full bg-transparent">

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <AnimatePresence>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] flex gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                                {/* Avatar */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg ${msg.type === 'user'
                                        ? 'bg-gradient-to-br from-primary-500 to-primary-700'
                                        : 'bg-gradient-to-br from-accent-500 to-accent-700'
                                    }`}>
                                    {msg.type === 'user' ? <User size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
                                </div>

                                {/* Message Content */}
                                <div className="flex flex-col gap-2">
                                    <div className={`p-5 rounded-2xl shadow-md backdrop-blur-sm ${msg.type === 'user'
                                            ? 'bg-primary-600/90 text-white rounded-tr-sm'
                                            : 'glass-panel text-gray-100 rounded-tl-sm border-white/5'
                                        }`}>
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                    </div>

                                    {/* Explainable AI / Insights (Only for Bot messages) */}
                                    {msg.type === 'bot' && msg.emotion && msg.emotion !== 'neutral' && msg.emotion !== 'error' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="glass-card rounded-xl p-3 text-xs text-gray-300 ml-1 border-l-4 border-l-accent-500"
                                        >
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <Sparkles className="w-3 h-3 text-accent-400" />
                                                <span className="font-bold text-accent-300 uppercase tracking-widest text-[10px]">Emotion Detected</span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="capitalize text-sm font-medium text-white">{msg.emotion}</span>
                                                <div className="h-1.5 w-16 bg-gray-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-accent-500 rounded-full"
                                                        style={{ width: `${(msg.confidence * 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-gray-400">{(msg.confidence * 100).toFixed(0)}%</span>
                                            </div>

                                            {/* Recommendation Card */}
                                            {msg.recommendation && (
                                                <div className="mt-3 bg-white/5 p-3 rounded-lg border border-white/5 flex gap-3">
                                                    <Lightbulb size={16} className="text-yellow-400 mt-0.5 shrink-0" />
                                                    <span className="text-gray-200 italic">"{msg.recommendation}"</span>
                                                </div>
                                            )}

                                            {/* Crisis Alert */}
                                            {msg.is_crisis && (
                                                <div className="mt-3 bg-red-500/20 p-3 rounded-lg border border-red-500/50 flex gap-3 text-red-200">
                                                    <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
                                                    <span className="font-bold">Safety Alert Triggered</span>
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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start ml-14"
                    >
                        <div className="glass-panel px-4 py-3 rounded-2xl rounded-tl-sm text-gray-400 text-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                            <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                            <span className="text-xs text-gray-500 ml-2">Thinking...</span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-transparent">
                <div className="glass-panel p-2 rounded-2xl flex items-center gap-2 relative shadow-2xl">
                    <input
                        type="text"
                        className="flex-1 bg-transparent border-none text-white px-4 py-3 focus:outline-none placeholder-gray-400 font-medium"
                        placeholder="Type your thoughts here..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        disabled={loading}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        className="p-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-primary-500/25 active:scale-95"
                    >
                        <Send size={20} />
                    </button>
                </div>
                <p className="text-center text-[10px] text-gray-500 mt-3 font-medium tracking-wide uppercase">
                    Private & Secure • Local AI Companion
                </p>
            </div>
        </div>
    )
}
