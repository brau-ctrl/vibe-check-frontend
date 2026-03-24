# LinkedIn Vibe Check Backend

Express.js API server that powers the LinkedIn Vibe Check app using Google Gemini AI.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
NODE_ENV=development
```

3. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

## API Endpoints

### POST /api/analyse
Analyzes a LinkedIn post and returns scoring and feedback.

**Request:**
```json
{
  "post": "Your LinkedIn post content here..."
}
```

**Response:**
```json
{
  "hook_score": 8,
  "cringe_score": 3,
  "clarity_score": 7,
  "value_score": 9,
  "engagement_score": 6,
  "verdict": "fire",
  "verdict_line": "This post is ready to dominate LinkedIn!",
  "roast": "Full roast text...",
  "fixes": ["Fix 1", "Fix 2", "Fix 3"],
  "rewrite_hook": "Stronger opening line..."
}
```

### POST /api/rewrite
Rewrites a LinkedIn post based on provided fixes.

**Request:**
```json
{
  "post": "Original post content...",
  "fixes": ["Fix 1", "Fix 2", "Fix 3"]
}
```

**Response:**
```json
{
  "rewrite": "Rewritten post content..."
}
```

### GET /health
Health check endpoint.

## Rate Limiting

- 100 requests per 15 minutes per IP
- Configurable in `server.js`

## Error Handling

- 400: Bad request (missing/invalid data)
- 429: Rate limit exceeded
- 500: Server error

## Deployment

Deploy to Vercel, Railway, Render, or any Node.js hosting service. Set the `GEMINI_API_KEY` environment variable.