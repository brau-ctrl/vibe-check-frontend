require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Groq = require('groq-sdk');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

function extractJSON(text) {
  let cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/gi, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {}

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {}
  }

  throw new Error('Could not extract JSON from response');
}

// POST /api/analyse
app.post('/api/analyse', async (req, res) => {
  try {
    const { post } = req.body;

    if (!post || typeof post !== 'string' || post.trim().length === 0) {
      return res.status(400).json({ error: 'Post content is required' });
    }

    if (post.length > 3000) {
      return res.status(400).json({ error: 'Post is too long (max 3000 characters)' });
    }

    const prompt = `IMPORTANT: Your entire response must be a single raw JSON object. Do not include any text before or after the JSON. Do not wrap it in markdown code blocks. Do not say anything like 'Here is the JSON'. Start your response with { and end with }. Nothing else.

You are LinkedIn Vibe Check — a brutally honest but constructive AI
that reviews LinkedIn posts before they go live. You are witty, direct,
and occasionally savage — but always useful.

Respond ONLY with a valid JSON object. No markdown, no backticks,
no preamble. No extra text before or after the JSON.

{
  "hook_score": <1-10 integer>,
  "cringe_score": <1-10 integer, 10 = maximum cringe>,
  "clarity_score": <1-10 integer>,
  "value_score": <1-10 integer>,
  "engagement_score": <1-10 integer>,
  "verdict": "fire" | "mid" | "good",
  "verdict_line": "<one punchy sentence, max 15 words>",
  "roast": "<2-3 paragraphs. Call out clichés, humble-bragging, vague
             language, emoji overuse, hashtag spam. Say what actually
             works. Keep it sharp and entertaining.>",
  "fixes": ["<fix 1>", "<fix 2>", "<fix 3>"],
  "rewrite_hook": "<Rewrite just the opening line to be stronger.
                    Max 2 sentences.>"
}

Review this LinkedIn post:
${post}
`;

    const fallbackPrompt = `Return ONLY this JSON object filled in for this LinkedIn post.
Start with { and end with }. No other text whatsoever.

{
  "hook_score": <number 1-10>,
  "cringe_score": <number 1-10>,
  "clarity_score": <number 1-10>,
  "value_score": <number 1-10>,
  "engagement_score": <number 1-10>,
  "verdict": "fire" or "mid" or "good",
  "verdict_line": "one sentence max 15 words",
  "roast": "2-3 paragraphs of honest feedback",
  "fixes": ["fix 1", "fix 2", "fix 3"],
  "rewrite_hook": "stronger opening line, max 2 sentences"
}

LinkedIn post to review:
${post}
`;

    let text;
    let parsed;

    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: prompt.split('Review this LinkedIn post:')[0] },
          { role: 'user', content: `Review this LinkedIn post:\n\n${post}` }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });
      text = completion.choices[0].message.content;
      parsed = extractJSON(text);
    } catch (parseError) {
      console.log('First parse attempt failed, raw response:', text);
      // Retry once with fallback prompt if JSON parsing fails
      try {
        const completion = await groq.chat.completions.create({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: fallbackPrompt.split('LinkedIn post to review:')[0] },
            { role: 'user', content: `LinkedIn post to review:\n\n${post}` }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        });
        text = completion.choices[0].message.content;
        parsed = extractJSON(text);
      } catch (retryError) {
        console.error('Groq API error:', retryError);
        return res.status(500).json({ error: 'Failed to parse AI response after retry' });
      }
    }

    // Validate response structure
    const requiredFields = ['hook_score', 'cringe_score', 'clarity_score', 'value_score', 'engagement_score', 'verdict', 'verdict_line', 'roast', 'fixes', 'rewrite_hook'];
    const missingFields = requiredFields.filter(field => !(field in parsed));

    if (missingFields.length > 0) {
      console.error('Invalid response structure, missing fields:', missingFields);
      return res.status(500).json({ error: 'Invalid response format from AI' });
    }

    res.json(parsed);

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/rewrite
app.post('/api/rewrite', async (req, res) => {
  try {
    const { post, fixes } = req.body;

    if (!post || typeof post !== 'string' || post.trim().length === 0) {
      return res.status(400).json({ error: 'Post content is required' });
    }

    if (!Array.isArray(fixes)) {
      return res.status(400).json({ error: 'Fixes must be an array' });
    }

    const prompt = `
You are a LinkedIn content strategist. Rewrite the post below based
on these fixes: ${fixes.join(', ')}.
Make it punchy, valuable, and human. Cut the cringe. Keep the core
message. Return only the rewritten post — no explanation, no preamble.

Original post:
${post}
`;

    const rewriteSystemPrompt = `You are a LinkedIn content strategist. Rewrite the post below based on the fixes. Make it punchy, valuable, and human. Cut the cringe. Keep the core message. Return only the rewritten post — no explanation, no preamble.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: rewriteSystemPrompt },
        { role: 'user', content: `Rewrite this post:\n\n${post}\n\nFixes: ${fixes.join(', ')}` }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    const rewrite = completion.choices[0].message.content.trim().replace(/```[\s\S]*?```/g, '').trim();

    res.json({ rewrite });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
