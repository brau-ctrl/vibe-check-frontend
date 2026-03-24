import { useState, useEffect } from 'react'

export default function ApiKeyInput({ onKeyChange }) {
  const [isCollapsed, setIsCollapsed] = useState(true)

  useEffect(() => {
    // Since API key is handled server-side, we don't need to store it
    onKeyChange('server-side')
  }, [])

  if (isCollapsed) {
    return (
      <div className="mb-6">
        <button
          onClick={() => setIsCollapsed(false)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="text-sm font-medium">Backend Connected</span>
          <span className="text-xs text-slate-500">Click for info</span>
        </button>
      </div>
    )
  }

  return (
    <div className="mb-6 card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">API Configuration</h3>
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-lg leading-none"
        >
          ×
        </button>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          This app now uses a backend server with Google Gemini API.
          API keys are configured server-side for security.
        </p>

        <p className="text-xs text-slate-500 dark:text-slate-500">
          Backend running on <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">localhost:3001</code>
        </p>
      </div>
    </div>
  )
}
