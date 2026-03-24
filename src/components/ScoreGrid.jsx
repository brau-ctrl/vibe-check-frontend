import { useState, useEffect } from 'react'

function gaugeColor(score, isInverted) {
  const value = isInverted ? 11 - score : score
  if (value <= 4) return '#E24B4A'
  if (value <= 7) return '#EF9F27'
  return '#1D9E75'
}

function Gauge({ score, label, isInverted = false }) {
  const [display, setDisplay] = useState(0)
  const radius = 44
  const circumference = Math.PI * radius

  useEffect(() => {
    let raf
    const startTime = performance.now()
    const duration = 800

    const animate = (time) => {
      const elapsed = Math.min(time - startTime, duration)
      const progress = elapsed / duration
      setDisplay(Math.round(score * progress))
      if (elapsed < duration) raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [score])

  const pct = Math.max(0, Math.min(100, (display / 10) * 100))
  const dash = (pct / 100) * circumference
  const offset = circumference - dash

  return (
    <div className="gauge-card">
      <div className="gauge-svg">
        <svg viewBox="0 0 100 54" width="100" height="54">
          <path
            d="M 9 50 A 43 43 0 0 1 91 50"
            fill="none"
            stroke="#E6EAF0"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 9 50 A 43 43 0 0 1 91 50"
            fill="none"
            stroke={gaugeColor(score, isInverted)}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
          />
        </svg>
        <div className="gauge-value" style={{ color: gaugeColor(score, isInverted) }}>
          {display}
        </div>
      </div>
      <div className="gauge-label">{label}</div>
    </div>
  )
}

export default function ScoreGrid({ result }) {
  if (!result) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      <Gauge score={result.hook_score} label="Hook" />
      <Gauge score={result.cringe_score} label="Cringe" isInverted />
      <Gauge score={result.clarity_score} label="Clarity" />
      <Gauge score={result.value_score} label="Value" />
      <Gauge score={result.engagement_score} label="Engagement" />
    </div>
  )
}
