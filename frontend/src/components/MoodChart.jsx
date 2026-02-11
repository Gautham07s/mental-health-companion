import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Activity } from 'lucide-react'

export default function MoodChart({ data }) {
    // Mock data if empty
    const chartData = data && data.length > 0 ? data : [
        { date: 'Mon', confidence: 0.2 },
        { date: 'Tue', confidence: 0.5 },
        { date: 'Wed', confidence: 0.4 },
        { date: 'Thu', confidence: 0.8 },
        { date: 'Fri', confidence: 0.6 },
        { date: 'Sat', confidence: 0.9 },
        { date: 'Sun', confidence: 0.7 },
    ]

    return (
        <div className="glass-panel rounded-2xl p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold mb-4 text-primary-200 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Mood Trends
            </h3>

            <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="date"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                borderColor: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(4px)',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                            itemStyle={{ color: '#38bdf8' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="confidence"
                            stroke="#0ea5e9"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorMood)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
