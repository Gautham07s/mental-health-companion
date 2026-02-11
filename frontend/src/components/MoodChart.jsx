import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Activity, BarChart3 } from 'lucide-react'

export default function MoodChart({ data }) {
    const hasData = data && data.length > 0

    return (
        <div className="glass-panel rounded-2xl p-6 h-full flex flex-col">
            <h3 className="text-lg font-bold mb-4 text-primary-200 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Mood Trends
            </h3>

            {hasData ? (
                <div className="flex-1 w-full min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis
                                dataKey="date"
                                stroke="#64748b"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                domain={[0, 1]}
                                tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                    borderColor: 'rgba(255,255,255,0.08)',
                                    backdropFilter: 'blur(8px)',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '12px',
                                    padding: '8px 12px',
                                }}
                                itemStyle={{ color: '#38bdf8' }}
                                labelStyle={{ color: '#94a3b8', fontSize: '11px' }}
                                formatter={(value, name) => [`${(value * 100).toFixed(1)}%`, 'Confidence']}
                            />
                            <Area
                                type="monotone"
                                dataKey="confidence"
                                stroke="#0ea5e9"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorMood)"
                                dot={{ fill: '#0ea5e9', r: 3, strokeWidth: 0 }}
                                activeDot={{ r: 5, fill: '#38bdf8', stroke: '#0f172a', strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                /* Empty State */
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                        <BarChart3 className="w-8 h-8 text-gray-600" />
                    </div>
                    <h4 className="text-gray-400 font-medium mb-1">No mood data yet</h4>
                    <p className="text-gray-500 text-sm max-w-xs">
                        Start chatting with your companion — your emotional journey will appear here automatically.
                    </p>
                </div>
            )}
        </div>
    )
}
