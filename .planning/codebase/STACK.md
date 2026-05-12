# Technology Stack

This is a Next.js-based full-stack portfolio and experimentation platform for a developer. Built with TypeScript, React 19, and modern tooling.

## Language & Runtime

- **Primary Language:** TypeScript 5.x
- **Runtime:** Node.js (via Next.js server)
- **JSX Runtime:** React JSX (via Next.js)
- **Target:** ES2017

## Frameworks & Core Dependencies

- **Framework:** Next.js 16.2.4
  - App Router (file-based routing in `app/`)
  - Server Components and Client Components
  - Built-in API routes at `app/api/*/route.ts`
  
- **UI Library:** React 19.2.4 (with react-dom 19.2.4)
  - Client-side components with 'use client' directive
  - Server-side layout composition

- **Styling:** Tailwind CSS 4 with @tailwindcss/postcss 4
  - Configured via `postcss.config.mjs`
  - PostCSS processing pipeline

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| @anthropic-ai/sdk | 0.91.1 | Claude API integration for AI features |
| @supabase/supabase-js | 2.104.1 | PostgreSQL database client and auth |
| globe.gl | 2.45.3 | 3D globe visualization component |
| next | 16.2.4 | React meta-framework and server runtime |
| react | 19.2.4 | UI component library |
| react-dom | 19.2.4 | React DOM rendering |

## Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| @tailwindcss/postcss | 4 | Tailwind CSS processing |
| @types/node | 20 | Node.js type definitions |
| @types/react | 19 | React type definitions |
| @types/react-dom | 19 | React DOM type definitions |
| eslint | 9 | Code linting |
| eslint-config-next | 16.2.4 | Next.js ESLint rules |
| tailwindcss | 4 | CSS utility framework |
| typescript | 5 | TypeScript compiler |

## Build & Configuration

- **Build Tool:** Next.js built-in bundler (via `next build`)
- **Next Config:** `next.config.ts`
  - Allows dev origin: `192.168.100.147`
  - Image domain allowlist (currently empty)
  
- **PostCSS:** `postcss.config.mjs`
  - Uses @tailwindcss/postcss plugin
  
- **TypeScript:** `tsconfig.json`
  - Module: ESNext
  - Strict mode enabled
  - Path alias: `@/*` maps to root directory
  - Target: ES2017

## Environment Variables

| Variable | Type | Purpose |
|----------|------|---------|
| NEXT_PUBLIC_SUPABASE_URL | Public | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Public | Supabase anonymous key (public-safe) |
| SUPABASE_SERVICE_ROLE_KEY | Private | Supabase service role (server-only) |
| NEXT_PUBLIC_MAPBOX_TOKEN | Public | Mapbox API token for maps |
| ANTHROPIC_API_KEY | Private | Claude API key (server-only) |

See `.env.local` for actual values.

## Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| dev | `next dev` | Start development server with hot reload |
| build | `next build` | Build for production |
| start | `next start` | Start production server |
| lint | `eslint` | Run ESLint checks |

## Directory Structure

- `app/` — Next.js App Router pages and API routes
  - `app/layout.tsx` — Root layout with font loading and metadata
  - `app/page.tsx` — Home page
  - `app/about/`, `app/blog/`, `app/deck/`, `app/work/` — Page routes
  - `app/api/` — API endpoints (echoes, flint, comments, reactions)
  
- `components/` — React components
  - `ThemeProvider.tsx` — Theme context setup
  - `EchoesGlobe.tsx` — 3D globe visualization
  - `FlintTool.tsx` — AI tool component
  - `TakeCard.tsx`, `TakeDetail.tsx` — Content display
  - `ReactionButton.tsx` — Interactive reactions UI
  - Navigation and layout components
  
- `lib/` — Utilities and clients
  - `lib/supabase.ts` — Supabase client initialization
  
- `public/` — Static assets
- `.next/` — Build output (development and production)

## Fonts

- **Sans Serif:** Plus Jakarta Sans (from Google Fonts)
  - CSS Variable: `--font-sans`
  - Weights: 300, 400, 500, 600, 700
  
- **Monospace:** DM Mono (from Google Fonts)
  - CSS Variable: `--font-mono`
  - Weights: 300, 400, 500
