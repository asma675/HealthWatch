import React from 'react'

export function StatsCard({ title, value, subtitle }) {
  return (
    <div className="stats-card glow-border">
      <div className="stats-main">
        <h3>{title}</h3>
        <p className="stats-value">{value}</p>
      </div>
      <p className="stats-subtitle">{subtitle}</p>
    </div>
  )
}
