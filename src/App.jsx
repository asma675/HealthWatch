import React, { useEffect, useState, useMemo } from 'react'
import { TrendsChart } from './components/TrendsChart'
import { StatsCard } from './components/StatsCard'
import { ReportForm } from './components/ReportForm'

const STORAGE_KEY = 'healthwatch_reports_v1'

const ageGroups = [
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55-64',
  '65+',
]

const symptomCategories = [
  'Respiratory (cough, shortness of breath)',
  'Fever / flu-like symptoms',
  'Headache / fatigue',
  'Digestive issues',
  'Other',
]

const environmentIssues = [
  'Heat / humidity',
  'Air quality / smoke',
  'Water taste / smell',
  'Noise / pollution',
  'Other',
]

function loadReports() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveReports(reports) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
  } catch {
    // ignore
  }
}

export default function App() {
  const [reports, setReports] = useState([])
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    setReports(loadReports())
  }, [])

  useEffect(() => {
    saveReports(reports)
  }, [reports])

  const handleSubmitReport = (data) => {
    const newReport = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
    }
    setReports((prev) => [newReport, ...prev])
    setActiveTab('dashboard')
  }

  const stats = useMemo(() => computeStats(reports), [reports])

  return (
    <div className="app-root">
      <div className="app-glow-orbit orbit-1" />
      <div className="app-glow-orbit orbit-2" />

      <header className="app-header glass-panel">
        <div className="brand">
          <div className="brand-icon">
            <span role="img" aria-label="pulse">💠</span>
          </div>
          <div>
            <h1>HealthWatch Communities</h1>
            <p>Community health signals for public-sector decision makers.</p>
          </div>
        </div>
        <nav className="nav-tabs">
          <button
            className={activeTab === 'dashboard' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={activeTab === 'report' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('report')}
          >
            New Report
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'dashboard' && (
          <section className="dashboard-grid">
            <div className="cards-row">
              <StatsCard
                title="Total check-ins"
                value={stats.total}
                subtitle="All-time community submissions"
              />
              <StatsCard
                title="Last 7 days"
                value={stats.last7Days}
                subtitle="Recent activity"
              />
              <StatsCard
                title="Unique regions"
                value={stats.uniqueRegions}
                subtitle="Communities represented"
              />
            </div>

            <div className="panel-row">
              <div className="panel glass-panel">
                <div className="panel-header">
                  <h2>Trend – daily check-ins</h2>
                  <p>Simple view of community signals over the last 14 days.</p>
                </div>
                <TrendsChart data={stats.trendData} />
              </div>
              <div className="panel glass-panel">
                <div className="panel-header">
                  <h2>Top reported categories</h2>
                  <p>Most frequently reported health and environmental issues.</p>
                </div>
                <div className="chips-column">
                  <div>
                    <h3>Symptoms</h3>
                    <div className="chip-row">
                      {stats.topSymptoms.map((item) => (
                        <span key={item.label} className="chip">
                          {item.label} <span className="chip-count">{item.count}</span>
                        </span>
                      ))}
                      {stats.topSymptoms.length === 0 && (
                        <p className="muted">No symptom data yet.</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3>Environment</h3>
                    <div className="chip-row">
                      {stats.topEnvironment.map((item) => (
                        <span key={item.label} className="chip">
                          {item.label} <span className="chip-count">{item.count}</span>
                        </span>
                      ))}
                      {stats.topEnvironment.length === 0 && (
                        <p className="muted">No environment data yet.</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3>Mental health</h3>
                    <p className="muted">
                      {stats.mentalHealthShare > 0
                        ? `${stats.mentalHealthShare}% of check-ins flagged mental health strain.`
                        : 'No mental health signals reported yet.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel glass-panel">
              <div className="panel-header">
                <h2>Sample recent check-ins</h2>
                <p>De-identified view suitable for public dashboards and early-signal monitoring.</p>
              </div>
              {reports.length === 0 && (
                <p className="muted">No reports yet. Switch to “New Report” to add the first community signal.</p>
              )}
              {reports.length > 0 && (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>When</th>
                        <th>Region</th>
                        <th>Age group</th>
                        <th>Symptom</th>
                        <th>Environment</th>
                        <th>Mental health</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.slice(0, 6).map((r) => (
                        <tr key={r.id}>
                          <td>{formatRelative(r.createdAt)}</td>
                          <td>{r.region}</td>
                          <td>{r.ageGroup}</td>
                          <td>{r.symptomCategory}</td>
                          <td>{r.environmentIssue}</td>
                          <td>{r.mentalHealthFlag ? 'Flagged' : 'Not flagged'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'report' && (
          <section className="panel glass-panel">
            <div className="panel-header">
              <h2>New community health check-in</h2>
              <p>
                This demo keeps all data anonymous and on your device using local storage.
                In a real deployment, submissions would be securely aggregated for public health teams.
              </p>
            </div>
            <ReportForm
              ageGroups={ageGroups}
              symptomCategories={symptomCategories}
              environmentIssues={environmentIssues}
              onSubmit={handleSubmitReport}
            />
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Prototype for public-sector health insights – privacy-first, community-driven.
        </p>
      </footer>
    </div>
  )
}

function computeStats(reports) {
  const total = reports.length
  const now = new Date()
  const msInDay = 24 * 60 * 60 * 1000

  const last7Days = reports.filter((r) => {
    const d = new Date(r.createdAt)
    return (now - d) / msInDay <= 7
  }).length

  const regions = new Set(reports.map((r) => r.region.trim()).filter(Boolean))

  // Trend data for last 14 days
  const trendData = []
  for (let i = 13; i >= 0; i--) {
    const day = new Date(now.getTime() - i * msInDay)
    const dayKey = day.toISOString().slice(0, 10)
    const count = reports.filter((r) => r.createdAt.slice(0, 10) === dayKey).length
    trendData.push({
      date: dayKey.slice(5), // MM-DD
      count,
    })
  }

  const symptomCounts = {}
  const envCounts = {}
  let mentalHealthCount = 0

  for (const r of reports) {
    symptomCounts[r.symptomCategory] = (symptomCounts[r.symptomCategory] || 0) + 1
    envCounts[r.environmentIssue] = (envCounts[r.environmentIssue] || 0) + 1
    if (r.mentalHealthFlag) mentalHealthCount += 1
  }

  const topSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([label, count]) => ({ label, count }))

  const topEnvironment = Object.entries(envCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([label, count]) => ({ label, count }))

  const mentalHealthShare = total > 0 ? Math.round((mentalHealthCount / total) * 100) : 0

  return {
    total,
    last7Days,
    uniqueRegions: regions.size,
    trendData,
    topSymptoms,
    topEnvironment,
    mentalHealthShare,
  }
}

function formatRelative(isoString) {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now - date
  const diffMinutes = Math.round(diffMs / (60 * 1000))
  const diffHours = Math.round(diffMs / (60 * 60 * 1000))
  const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000))

  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes} min ago`
  if (diffHours < 24) return `${diffHours} h ago`
  if (diffDays === 1) return 'Yesterday'
  return date.toLocaleDateString()
}
