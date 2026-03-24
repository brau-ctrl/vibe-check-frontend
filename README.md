# LinkedIn Vibe Check

An AI-powered tool that roasts and scores your LinkedIn posts before you publish them.

## Features

- **Smart Scoring**: Get metrics on hook strength, clarity, value, engagement, and cringe levels
- **Brutal Honesty**: Receive constructive criticism that actually helps you improve
- **AI Rewriting**: Get a rewritten version of your post with the feedback incorporated
- **Instant Feedback**: See detailed roasts, specific fixes, and stronger opening lines
- **Secure**: Your API key stays in your browser — no backend server
- **Dark Mode**: Clean, modern UI with full dark mode support
- **Mobile Friendly**: Works great on mobile, tablet, and desktop

## Getting Started

### Prerequisites

- Node.js 16+ ([download](https://nodejs.org/))
- Google Gemini API key ([get one free](https://aistudio.google.com))

**Note:** You'll need Node.js installed to run both the frontend and backend.

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install backend dependencies:
```bash
npm install
```

3. Configure your API key in `backend/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start the backend server:
```bash
npm run dev
```
The backend will run on `http://localhost:3001`

### Frontend Setup

1. In a new terminal, navigate back to the root directory:
```bash
cd ..
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and import your repository
4. For the frontend, Vercel auto-detects Vite settings
5. For the backend, you'll need to deploy it separately (see below)
6. Click "Deploy" — done!

### Deploy Backend to Vercel/Railway/Render

1. Deploy the `backend/` folder as a separate service
2. Set environment variables: `GEMINI_API_KEY`
3. Update the frontend's `API_BASE_URL` in `src/utils/claudeApi.js` to point to your deployed backend

### Deploy Frontend to Netlify

1. Run `npm run build` in the root directory
2. Go to [netlify.com/drop](https://netlify.com/drop)
3. Drag the `dist/` folder into the drop zone
4. Your site is live!

### Deploy Anywhere Else

Any static host works for the frontend (GitHub Pages, AWS S3, etc.):

```bash
npm run build
# Upload the contents of the 'dist/' folder
```

For the backend, deploy to any Node.js hosting service.

## How It Works

1. **Paste your post** into the textarea
2. **Click "Vibe Check It"** and the backend hits Gemini automatically
3. **Review the scores** — hook, clarity, value, engagement, and cringe levels
4. **Read the roast** — detailed feedback on what works and what doesn't
5. **Check the fixes** — 3 actionable improvements
6. **Try a rewrite** — click "Rewrite My Full Post" and copy the result

## Built With

- **React** — UI library
- **Vite** — Fast build tool
- **Tailwind CSS** — Utility-first CSS framework
- **Express.js** — Backend web framework
- **Google Gemini API** — AI-powered analysis and rewriting
- **Node.js** — JavaScript runtime

## API Key Security

## API Key Security

⚠️ **Important**: Your Google Gemini API key is stored server-side in the backend's `.env` file. It is never exposed to the frontend or users. The backend handles all API communication securely.

- For development: Configure the key in `backend/.env`
- For production: Set the `GEMINI_API_KEY` environment variable on your hosting platform
- Never commit API keys to version control

## Example Post

Try the example post to see how it works:

> "I am thrilled to share that after 3 incredible years at this amazing company, I have been promoted to Senior Manager! This journey has taught me so much about resilience, leadership, and showing up every single day. I want to thank my manager, my team, and everyone who believed in me. The future is bright. Let's go! 🙏🚀 #Grateful #Leadership #CareerGrowth #Blessed"

This is a classic LinkedIn humble-brag post that the Vibe Check will absolutely roast. 😄

## Troubleshooting

### "API Error" 

- Check that the Gemini key is configured in `backend/.env`
- Verify it at [aistudio.google.com](https://aistudio.google.com)
- Ensure you don't have extra spaces

### "Connection failed" error

- Check your internet connection
- Ensure Gemini API is available
- Try again in a few seconds

### Blank results or "Couldn't read the response"

- The API may have returned an unexpected format
- Try a shorter post (under 3000 characters)
- Refresh the page and try again

## License

MIT — Feel free to use and modify this for personal or commercial projects.

## Feedback & Contributions

Found a bug? Have an idea? Feel free to open an issue or submit a pull request.

---

**Made with ❤️ to roast LinkedIn posts into greatness**
