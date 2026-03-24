export default function RoastCard({ result, onRewrite }) {
  const getStamp = () => {
    switch (result.verdict) {
      case 'fire':
        return { label: 'SOLID POST', color: '#1D9E75' }
      case 'mid':
        return { label: 'MID ENERGY', color: '#EF9F27' }
      default:
        return { label: 'NEEDS WORK', color: '#E24B4A' }
    }
  }

  const stamp = getStamp()

  return (
    <div className="roast-section">
      <div className="stamp" style={{ borderColor: stamp.color, color: stamp.color }}>
        {stamp.label}
      </div>
      <div className="verdict-line">{result.verdict_line}</div>

      <div className="mt-6 roast-text">
        <h3 className="section-title">The Roast</h3>
        <p>{result.roast}</p>
      </div>

      <div className="mt-6">
        <h3 className="section-title">Fix These 3 Things</h3>
        <div className="fix-grid">
          {result.fixes.map((fix, idx) => (
            <div className="fix-card" key={idx} style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="fix-number">{idx + 1}</div>
              <div className="fix-text">{fix}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 stronger-hook-card">
        <span className="stronger-label">Use this instead</span>
        <p>{result.rewrite_hook}</p>
      </div>

      <button onClick={onRewrite} className="rebuild-btn">
        Rewrite My Full Post
      </button>
    </div>
  )
}
