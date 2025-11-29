import React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

export function TrendsChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="muted">No data yet. Add a few reports to see the trend.</p>
  }

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7C4DFF" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#7C4DFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
          <YAxis allowDecimals={false} stroke="rgba(255,255,255,0.7)" />
          <Tooltip
            contentStyle={{
              background: 'rgba(12, 21, 44, 0.95)',
              border: '1px solid rgba(124,77,255,0.4)',
              borderRadius: '12px',
              fontSize: '0.8rem',
            }}
            labelStyle={{ color: '#fff', marginBottom: 4 }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#B388FF"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
