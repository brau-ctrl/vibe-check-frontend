export default function PostInput({
  post,
  onPostChange,
  onVibeCheck,
  onClear,
  isLoading,
}) {
  const charCount = post.length
  const isLong = charCount > 3000
  const isWarning = charCount >= 2500 && charCount <= 3000

  const getCharCountColor = () => {
    if (isLong) return 'text-red-600 dark:text-red-400'
    if (isWarning) return 'text-amber-600 dark:text-amber-400'
    return 'text-slate-500 dark:text-slate-400'
  }

  return (
    <div className="space-y-4">
      <textarea
        value={post}
        onChange={(e) => onPostChange(e.target.value)}
        placeholder="Type or paste your LinkedIn post... we won't judge. Well, actually we will. That's the whole point."
        className="w-full min-h-[220px] p-4 rounded-xl border border-[#D9E2EE] bg-white focus:outline-none focus:ring-2 focus:ring-[#E94560] resize-y transition"
      />

      <div className="flex items-center justify-between">
        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
          isLong ? 'bg-[#FEE2E2] text-[#B42318]' : isWarning ? 'bg-[#FFFAEB] text-[#B45309]' : 'bg-[#F2F4F7] text-[#66798B]'
        }`}>
          {charCount} / 3000
        </span>
        {isLong && <span className="text-xs text-[#B42318]">Too long — keep under 3000</span>}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={onVibeCheck}
          disabled={!post.trim() || isLoading}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-white font-bold bg-[#E94560] transition transform hover:scale-[1.02] ${isLoading ? 'animate-pulse' : ''} ${!post.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Roasting...' : 'Vibe Check It'}
        </button>

        <button
          onClick={onClear}
          className="w-full sm:w-auto px-3 py-2 rounded-xl text-[#64748B] bg-[#F8FAFC] hover:bg-[#E2E8F0] text-sm"
        >
          Clear
        </button>
      </div>

      <p className="text-xs text-[#94A3B8]">
        Your post is never stored. Results are for entertainment and improvement purposes.
      </p>
    </div>
  )
}
