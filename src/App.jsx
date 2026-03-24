import { useState, useEffect } from 'react'
import PostInput from './components/PostInput'
import Speedometer from './components/Speedometer'
import RoastCard from './components/RoastCard'
import RewriteBox from './components/RewriteBox'
import LoadingState from './components/LoadingState'
import { useVibeCheck } from './hooks/useVibeCheck'
import './App.css'

export default function App() {
  const [postsRoasted, setPostsRoasted] = useState(847 + Math.floor(Math.random() * (1200 - 847 + 1)))
  const {
    post,
    setPost,
    result,
    rewrite,
    loading,
    rewriteLoading,
    error,
    runVibeCheck,
    runRewrite,
  } = useVibeCheck()

  useEffect(() => {
    let active = true
    const schedule = () => {
      const delay = 20000 + Math.floor(Math.random() * 20000)
      setTimeout(() => {
        if (!active) return
        setPostsRoasted((prev) => prev + 1)
        schedule()
      }, delay)
    }
    schedule()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (result) {
      setPostsRoasted((prev) => prev + 1)
    }
  }, [result])

  const handleClear = () => {
    setPost('')
  }

  const handleVibeCheck = () => {
    runVibeCheck()
  }

  const handleRewrite = () => {
    runRewrite()
  }

  const handleCheckRewrite = async () => {
    if (rewrite) {
      setPost(rewrite)
      setTimeout(() => {
        runVibeCheck()
      }, 0)
    }
  }

  return (
    <div className="app-shell">
      <div className="top-accent-bar" />
      <div className="min-h-screen bg-[#F5F7FA] py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="mb-8 rounded-2xl bg-white shadow-lg border border-[#E6EAF0] p-8 text-center relative overflow-hidden">
            <div className="badge-free inline-flex items-center gap-2 px-3 py-1.5 font-bold uppercase tracking-widest text-white rounded-full">
              <span className="status-dot" />
              FREE TO USE
            </div>
            <h1 className="mt-4 text-5xl md:text-6xl font-extrabold text-[#0F3460] leading-tight">
              LinkedIn Vibe Check
            </h1>
            <p className="mt-3 text-xl text-[#4E5F7A]">
              Paste your post. Get roasted. Post better.
            </p>
            <p className="mt-4 text-sm text-[#66798B] tracking-wide">
              <span className="font-semibold">{postsRoasted}</span> posts roasted today
            </p>
          </header>

          {error && (
            <div className="mb-6 rounded-xl border border-[#F5C2C7] bg-[#FFF3F5] p-4 text-[#B42318]">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside className="lg:col-span-5 card p-6">
              <div className="mb-4 flex items-center gap-2 text-[#0F3460] font-bold text-lg">
                <span className="fire-icon" /> Drop Your Post Here
              </div>
              <PostInput
                post={post}
                onPostChange={setPost}
                onVibeCheck={handleVibeCheck}
                onClear={handleClear}
                isLoading={loading}
              />
            </aside>

            <main className="lg:col-span-7 card p-6 relative overflow-hidden">
              {loading && (
                <div className="loading-overlay">
                  <LoadingState />
                </div>
              )}

              {!loading && !result && (
                <div className="text-center py-12">
                  <div className="empty-illustration mx-auto mb-4" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-[#0F3460] mb-2">Your roast appears here</h2>
                  <p className="text-[#556E8A] mb-5">We'll score your hook, cringe level, clarity, value, and engagement — then tell you exactly what to fix.</p>
                  <div className="flex flex-wrap justify-center gap-2 mb-5">
                    <span className="pill">Instant scores</span>
                    <span className="pill">Real fixes</span>
                    <span className="pill">Free rewrite</span>
                  </div>

                  {/* <div className="max-w-xl mx-auto rounded-xl border border-[#D9E2EE] bg-[#F8FAFC] p-4 text-left text-sm text-[#64748B]" style={{ opacity: 0.85 }}>
                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#4E5F7A] mb-2">
                      <span className="px-2 py-1 rounded-full bg-[#E6EBF5]">Example result</span>
                    </div>
                    <p className="font-medium text-[#0F3460] mb-1">verdict: MID ENERGY</p>
                    <p className="mb-1">"Solid narrative but too much humble-brag. Trim the platitudes and add a punchy, specific outcome."</p>
                    <p className="text-xs">Fixes: cut buzzwords, include data point, add clear CTA.</p>
                  </div> */}
                </div>
              )}

              {!loading && result && (
                <div className="animate-fadeIn">
                  <Speedometer result={result} />
                  <RoastCard result={result} onRewrite={handleRewrite} />
                  {rewrite && (
                    <RewriteBox
                      rewrite={rewrite}
                      onCopy={() => {}}
                      onCheckVersion={handleCheckRewrite}
                      isCheckingVersion={rewriteLoading}
                    />
                  )}
                </div>
              )}
            </main>
          </div>

          <footer className="mt-8 text-center text-sm text-[#64748B]">
            LinkedIn Vibe Check — Built by <a href="https://www.linkedin.com/in/victor-sunday-32a3823a0" target="_blank" rel="noopener noreferrer" className="text-[#0F3460] font-bold hover:underline">Sunday Victor</a>. Powered by Gemini AI.
          </footer>
        </div>
      </div>
    </div>
  )
}
