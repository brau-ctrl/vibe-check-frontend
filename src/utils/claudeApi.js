const BASE_URL = import.meta.env.VITE_API_URL || "https://vibe-check-backend-0wld.onrender.com";

const ANALYSE_SYSTEM_PROMPT = `You are LinkedIn Vibe Check — a brutally honest but constructive AI that reviews LinkedIn posts before they go live. You are witty, direct, and occasionally savage — but always useful. You don't sugarcoat, but you're never mean for the sake of it.

Respond ONLY with a valid JSON object. No markdown, no backticks, no preamble.

{
  "hook_score": <1-10 integer>,
  "cringe_score": <1-10 integer, 10 = maximum cringe>,
  "clarity_score": <1-10 integer>,
  "value_score": <1-10 integer>,
  "engagement_score": <1-10 integer>,
  "verdict": "fire" | "mid" | "good",
  "verdict_line": "<one punchy sentence, max 15 words>",
  "roast": "<2-3 paragraphs. Call out clichés, humble-bragging, vague language, emoji overuse, hashtag spam. Say what actually works. Keep it sharp.>",
  "fixes": ["<fix 1>", "<fix 2>", "<fix 3>"],
  "rewrite_hook": "<Rewrite just the opening line to be stronger. Max 2 sentences.>"
}`

const REWRITE_SYSTEM_PROMPT = `You are a LinkedIn content strategist. Rewrite the provided post based on the feedback given. Make it punchy, valuable, and human. Cut the cringe. Keep the core message. Return only the rewritten post — no explanation, no preamble.`

export async function analysePost(post, apiKey) {
  if (!post || !post.trim()) {
    throw new Error('Post content is required')
  }

  try {
    const response = await fetch(`${API_BASE_URL}/analyse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post: post.trim(),
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      const errorMsg = errorData?.error || 'API request failed'
      throw new Error(errorMsg)
    }

    const result = await response.json()
    return result
  } catch (err) {
    if (err.message.includes('fetch')) {
      throw new Error('Connection failed — check your internet and try again')
    }
    throw err
  }
}

export async function rewritePost(post, fixes, apiKey) {
  if (!post || !post.trim()) {
    throw new Error('Post content is required')
  }

  if (!Array.isArray(fixes)) {
    throw new Error('Fixes must be an array')
  }

  try {
    const response = await fetch(`${API_BASE_URL}/rewrite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post: post.trim(),
        fixes,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      const errorMsg = errorData?.error || 'API request failed'
      throw new Error(errorMsg)
    }

    const data = await response.json()
    return data.rewrite
  } catch (err) {
    if (err.message.includes('fetch')) {
      throw new Error('Connection failed — check your internet and try again')
    }
    throw err
  }
}
