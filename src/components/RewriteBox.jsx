import { useState } from 'react'

export default function RewriteBox({ rewrite, onCopy, onCheckVersion, isCheckingVersion }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(rewrite)
    setCopied(true)
    if (onCopy) onCopy()
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rewrite-wrapper animate-fadeIn">
      <h3 className="section-title">Rewritten Version</h3>
      <div className="rewrite-box">
        <p>{rewrite}</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button onClick={handleCopy} className="small-btn">
          {copied ? '✓ Copied!' : 'Copy to Clipboard'}
        </button>
        <button onClick={onCheckVersion} disabled={isCheckingVersion} className="small-btn primary">
          {isCheckingVersion ? 'Checking...' : 'Check This Version'}
        </button>
      </div>
    </div>
  )
}
