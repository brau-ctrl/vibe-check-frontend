import { useState, useEffect } from 'react'

const LOADING_MESSAGES = [
  'Reading your post...',
  'Detecting humble-brags...',
  'Counting unnecessary emojis...',
  'Consulting the LinkedIn algorithm gods...',
  'Almost done roasting...',
]

export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length)
    }, 1500)

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(100, prev + 7))
    }, 150)

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="loading-card p-5 rounded-xl shadow-xl bg-white border border-[#E6EAF0]">
      <p className="text-[#0F3460] font-semibold mb-2">{LOADING_MESSAGES[messageIndex]}</p>
      <div className="w-full h-3 rounded-full bg-[#E8EAF0] overflow-hidden">
        <div style={{ width: `${progress}%` }} className="h-full bg-[#E94560] transition-all duration-150" />
      </div>
    </div>
  )
}
