# TubeStamp

A dark-themed Next.js app to generate YouTube timestamps. Features include:

- Tailwind CSS styling and PostCSS
- React Query provider
- YouTube Data API route using `YOUTUBE_API_KEY`
- Chapter parsing from descriptions with fallback auto-generation
- Copy-to-clipboard for chapters
- Health check endpoint: `/api/health`

## Getting started

1. Copy `.env.example` to `.env.local` and set `YOUTUBE_API_KEY`.
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`

## Testing

- `npm test` runs Jest tests.

## CI

- GitHub Actions workflow builds and tests PRs automatically.
