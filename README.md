# Ask UniMate – BBUC AI Assistant

An AI-powered university assistant for **Bishop Barham University College (BBUC)**, built with React, Vite, Supabase, and deployed on **Vercel**.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **AI**: OpenAI API via Supabase Edge Functions
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Supabase account
- OpenAI API key

### Local Development

```bash
# Install dependencies
npm install

# Copy and fill in environment variables
cp .env.example .env

# Start the dev server
npm run dev
```

### Environment Variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

In your **Supabase project → Edge Functions → Secrets**, set:

```
OPENAI_API_KEY=your_openai_api_key
```

## Deployment on Vercel

1. Push your code to GitHub (or GitLab / Bitbucket).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repository.
3. Vercel will automatically detect the Vite framework from `vercel.json`.
4. Add your environment variables under **Project Settings → Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**.

> The `vercel.json` file handles SPA routing — all paths are rewritten to `index.html` so React Router works correctly.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Lint the codebase |
| `npm run test` | Run tests |
