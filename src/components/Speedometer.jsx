import { useState, useEffect } from 'react'

export default function Speedometer({ result }) {
  const [displayScore, setDisplayScore] = useState(0)
  const [displayAngle, setDisplayAngle] = useState(-90)

  if (!result) return null

  // Calculate weighted overall score
  const overallScore =
    result.hook_score * 0.25 +
    result.clarity_score * 0.2 +
    result.value_score * 0.25 +
    result.engagement_score * 0.2 +
    (10 - result.cringe_score) * 0.1

  const finalScore = Math.round(overallScore * 10) / 10
  const finalAngle = ((finalScore - 1) / 9) * 180 - 90

  // Segment labels and colors
  const segments = [
    { label: 'WEAK', color: '#E24B4A' },
    { label: 'CRINGE', color: '#EF9F27' },
    { label: 'BOT', color: '#F5D020' },
    { label: 'NGMI', color: '#97C459' },
    { label: 'EXCELLENT', color: '#1D9E75' },
  ]

  // Get current segment label and color
  const segmentIndex = Math.floor((finalScore - 1) / 2)
  const currentSegment = segments[Math.min(segmentIndex, 4)]

  useEffect(() => {
    let animationFrame
    let startTime = performance.now()
    const duration = 1200

    const animate = (time) => {
      const elapsed = Math.min(time - startTime, duration)
      const progress = elapsed / duration

      // Ease-out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3)

      setDisplayScore(finalScore * easeProgress)
      setDisplayAngle(-90 + (finalAngle + 90) * easeProgress)

      if (elapsed < duration) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [finalScore, finalAngle])

  return (
    <div className="speedometer-container">
      <div className="speedometer-wrapper">
        <svg viewBox="0 0 320 180" width="320" height="180" className="speedometer-svg">
          {/* Background arc */}
          <path
            d="M 40 160 A 120 120 0 0 1 280 160"
            fill="none"
            stroke="#E6EAF0"
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* Segment 1 - WEAK */}
          <path
            d="M 40 160 A 120 120 0 0 1 96 42"
            fill="none"
            stroke="#E24B4A"
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* Segment 2 - CRINGE */}
          <path
            d="M 96 42 A 120 120 0 0 1 160 20"
            fill="none"
            stroke="#EF9F27"
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* Segment 3 - BOT */}
          <path
            d="M 160 20 A 120 120 0 0 1 224 42"
            fill="none"
            stroke="#F5D020"
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* Segment 4 - NGMI */}
          <path
            d="M 224 42 A 120 120 0 0 1 280 160"
            fill="none"
            stroke="#97C459"
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* Segment 5 - EXCELLENT (already in last arc) */}
          {/* Note: The full arc from 40,160 to 280,160 covers all segments */}

          {/* Needle */}
          <g transform={`rotate(${displayAngle} 160 160)`}>
            <line x1="160" y1="160" x2="160" y2="50" stroke="#1A1A2E" strokeWidth="8" strokeLinecap="round" />
            <polygon points="155,160 165,160 160,175" fill="#1A1A2E" />
          </g>

          {/* Centre hub */}
          <circle cx="160" cy="160" r="12" fill="#1A1A2E" />

          {/* Segment labels */}
          <text x="50" y="175" fontSize="11" fontWeight="bold" fill="#E24B4A" textAnchor="middle">
            WEAK
          </text>
          <text x="110" y="175" fontSize="11" fontWeight="bold" fill="#EF9F27" textAnchor="middle">
            CRINGE
          </text>
          <text x="160" y="175" fontSize="11" fontWeight="bold" fill="#F5D020" textAnchor="middle">
            BOT
          </text>
          <text x="210" y="175" fontSize="11" fontWeight="bold" fill="#97C459" textAnchor="middle">
            NGMI
          </text>
          <text x="270" y="175" fontSize="11" fontWeight="bold" fill="#1D9E75" textAnchor="middle">
            EXCELLENT
          </text>
        </svg>
      </div>

      <div className="speedometer-readout">
        <div className="speedometer-score">
          {displayScore.toFixed(1)} / 10
        </div>
        <div className="speedometer-label" style={{ color: currentSegment.color }}>
          {currentSegment.label}
        </div>
      </div>
    </div>
  )
}
