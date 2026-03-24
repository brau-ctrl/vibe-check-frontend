import { useState } from 'react'
import { analysePost, rewritePost } from '../utils/claudeApi'

export function useVibeCheck() {
  const [post, setPost] = useState('')
  const [result, setResult] = useState(null)
  const [rewrite, setRewrite] = useState(null)
  const [loading, setLoading] = useState(false)
  const [rewriteLoading, setRewriteLoading] = useState(false)
  const [error, setError] = useState(null)

  const runVibeCheck = async () => {
    if (!post.trim()) {
      setError('Please add a post to analyze')
      return
    }

    setLoading(true)
    setError(null)
    setRewrite(null)

    try {
      const analysisResult = await analysePost(post)
      setResult(analysisResult)
    } catch (err) {
      setError(err.message || 'Failed to analyse post')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const runRewrite = async () => {
    if (!result) {
      setError('No analysis result to rewrite')
      return
    }

    setRewriteLoading(true)
    setError(null)

    try {
      const rewriteResult = await rewritePost(post, result.fixes)
      setRewrite(rewriteResult)
    } catch (err) {
      setError(err.message || 'Failed to rewrite post')
    } finally {
      setRewriteLoading(false)
    }
  }

  return {
    post,
    setPost,
    result,
    rewrite,
    loading,
    rewriteLoading,
    error,
    runVibeCheck,
    runRewrite,
  }
}

export default useVibeCheck
