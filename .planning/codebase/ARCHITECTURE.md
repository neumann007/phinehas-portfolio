# ARCHITECTURE.md

Next.js 16 App Router portfolio and interactive web platform with hybrid rendering (SSG/SSR/CSR) backed by Supabase PostgreSQL.

## Architectural Pattern

- **Pattern:** Full-stack Next.js App Router (no separate backend)
- **Rendering:** Mixed — server components for data fetching, client components for interactivity
- **Database:** Supabase (PostgreSQL + Realtime subscriptions)
- **API layer:** Next.js Route Handlers under `app/api/`

## Rendering Strategy

| Route | Strategy | Reason |
|-------|----------|--------|
| `/` | CSR (`'use client'`) | Interactive carousel, hero |
| `/about` | Server component | Static content |
| `/projects` | Server component | Static data |
| `/blog` | SSR + ISR (60s revalidation) | Supabase fetch |
| `/blog/[id]` | SSR + ISR | Dynamic take + comments |
| `/deck` | CSR (`'use client'`) | Canvas signature pad, Realtime |
| `/work` | Mixed | Carousel is client |

## Layers

```
Request
  │
  ├── App Router (app/)
  │     ├── Server Components — fetch data from Supabase directly
  │     ├── Client Components — React state, canvas, real-time
  │     └── Route Handlers (app/api/) — REST endpoints for mutations
  │
  ├── Components (components/)
  │     ├── Layout: Nav, ThemeProvider, PageTransition
  │     └── Feature: Carousel, TakeDetail, ReactionButton, EchoesGlobe, FlintTool
  │
  └── Lib (lib/)
        └── supabase.ts — shared Supabase client (singleton)
```

## Data Flow

### Blog reads (server-side)
```
Supabase → app/blog/page.tsx (fetch, ISR 60s) → TakeDetail component
```

### Reactions / Comments (client-side mutations)
```
User action → ReactionButton/form → POST /api/reactions/* or /api/comments → Supabase → optimistic UI update
```

### Deck signatures (real-time)
```
Load: Supabase SELECT → setSignatures
Write: canvas → INSERT via supabase client → localStorage flag
Live: Supabase channel ('deck-live') → postgres_changes INSERT → prepend to state
```

### Theme
```
localStorage ('theme') → ThemeProvider context → data-theme attr on <html>
```

## Key Entry Points

- `app/layout.tsx` — root layout: fonts, metadata, ThemeProvider, Nav, PageTransition
- `app/page.tsx` — home (client component)
- `lib/supabase.ts` — database client (used by both server and client components)

## Server vs Client Split

**Server components:** `app/about/page.tsx`, `app/projects/page.tsx`, `app/blog/page.tsx`, `app/blog/[id]/page.tsx`

**Client components (`'use client'`):** `app/page.tsx`, `app/deck/page.tsx`, `app/work/page.tsx`, `components/Nav.tsx`, `components/ThemeProvider.tsx`, `components/Carousel.tsx`, `components/TakeDetail.tsx`, `components/ReactionButton.tsx`, `components/PageTransition.tsx`

## Key Abstractions

- `ThemeProvider` + `useTheme` hook — global light/dark state via React Context
- `supabase` singleton in `lib/supabase.ts` — all DB access goes through here
- `getToken()` in `app/deck/page.tsx` — anonymous visitor identity via localStorage UUID

## Stub / Incomplete Features

- `components/EchoesGlobe.tsx` — globe.gl integration, not fully wired
- `components/FlintTool.tsx` — FLINT assessment tool, stub
- `app/api/flint/route.ts` — stub POST handler
- `app/api/echoes/route.ts` — stub GET/POST handler

---
*Last mapped: 2026-05-12*
