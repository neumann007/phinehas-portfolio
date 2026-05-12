# STRUCTURE.md

Next.js 16 App Router project with clear separation between pages (`app/`), reusable components (`components/`), and utilities (`lib/`).

## Directory Tree

```
phinehas-portfolio/
├── app/                          # App Router — pages & API routes
│   ├── layout.tsx                # Root layout: fonts, metadata, ThemeProvider, Nav, PageTransition
│   ├── page.tsx                  # Home page (client component)
│   ├── globals.css               # CSS variables, theme tokens, all component styles
│   ├── about/
│   │   └── page.tsx              # About: bio, stack logos, photo collage, contact icons
│   ├── projects/
│   │   └── page.tsx              # Projects: timeline layout
│   ├── blog/
│   │   ├── page.tsx              # Blog list: fetches published takes (ISR 60s)
│   │   └── [id]/
│   │       └── page.tsx          # Blog detail: single take + comments (server rendered)
│   ├── deck/
│   │   └── page.tsx              # Signature wall: canvas pad, modal, real-time Supabase
│   ├── work/
│   │   └── page.tsx              # Work showcase with carousel
│   └── api/
│       ├── comments/
│       │   └── route.ts          # POST: add comment to take
│       ├── reactions/
│       │   ├── take/
│       │   │   └── route.ts      # POST: like/dislike a take
│       │   └── comment/
│       │       └── route.ts      # POST: like/dislike a comment
│       ├── flint/
│       │   └── route.ts          # POST: FLINT assessment (stub)
│       └── echoes/
│           └── route.ts          # GET/POST: Echoes globe (stub)
├── components/                   # Shared React components
│   ├── Nav.tsx                   # Top nav: logo, links, theme toggle, mobile menu
│   ├── ThemeProvider.tsx         # React Context for light/dark theme
│   ├── PageTransition.tsx        # Progress bar on route changes
│   ├── GlassFilter.tsx           # SVG filter for glass effect
│   ├── Carousel.tsx              # Auto-rotating slide deck (Scrive/FLINT/Echoes)
│   ├── TakeDetail.tsx            # Blog post view + reactions + comments + form
│   ├── ReactionButton.tsx        # Like/dislike button with animation
│   ├── EchoesGlobe.tsx           # Globe.gl integration (stub)
│   └── FlintTool.tsx             # FLINT assessment UI (stub)
├── lib/
│   └── supabase.ts               # Supabase client singleton
├── public/                       # Static assets (served at /)
│   ├── avatar.jpg                # Nav/mobile menu avatar
│   ├── portrait1.png             # About page photo collage
│   ├── portrait2.png
│   └── portrait3.png
├── next.config.ts                # Next.js config (Turbopack)
├── tsconfig.json                 # TypeScript config — @ alias → ./
├── package.json                  # Dependencies
├── postcss.config.mjs            # PostCSS for Tailwind v4
└── .env.local                    # NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## File → Purpose Map

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root wrapper — sets fonts, metadata, mounts ThemeProvider + Nav + PageTransition |
| `app/page.tsx` | Home — hero section, active build (Scrive), Echoes teaser |
| `app/globals.css` | Single CSS file — all design tokens, component styles, responsive rules |
| `app/about/page.tsx` | About — bio text, photo collage, stack logos, contact icons |
| `app/projects/page.tsx` | Projects — timeline grid of past/current work |
| `app/blog/page.tsx` | Blog list — ISR Supabase query, renders take rows |
| `app/blog/[id]/page.tsx` | Blog detail — wraps TakeDetail component |
| `app/deck/page.tsx` | The Deck — signature wall, canvas draw, Supabase Realtime |
| `app/work/page.tsx` | Work — carousel of featured projects |
| `lib/supabase.ts` | Exports `supabase` — used by pages and API routes |
| `components/Nav.tsx` | Navigation bar (desktop + mobile) with theme toggle |
| `components/ThemeProvider.tsx` | `useTheme()` hook + `data-theme` attribute manager |
| `components/Carousel.tsx` | Slide carousel with dot navigation and auto-advance |
| `components/TakeDetail.tsx` | Full blog post UI — reactions, comments, reply form |
| `components/ReactionButton.tsx` | Reusable like/dislike with pop animation |

## Route → File Mapping

| URL | File |
|-----|------|
| `/` | `app/page.tsx` |
| `/about` | `app/about/page.tsx` |
| `/projects` | `app/projects/page.tsx` |
| `/blog` | `app/blog/page.tsx` |
| `/blog/:id` | `app/blog/[id]/page.tsx` |
| `/deck` | `app/deck/page.tsx` |
| `/work` | `app/work/page.tsx` |
| `/api/comments` | `app/api/comments/route.ts` |
| `/api/reactions/take` | `app/api/reactions/take/route.ts` |
| `/api/reactions/comment` | `app/api/reactions/comment/route.ts` |

## Naming Conventions

- **Pages:** lowercase directory names, `page.tsx` filename
- **Dynamic routes:** bracket syntax — `[id]`
- **Components:** PascalCase — `Nav.tsx`, `ThemeProvider.tsx`
- **API routes:** lowercase with hyphens
- **CSS classes:** kebab-case, BEM-influenced — `nav-bar`, `deck-card__sig-img`, `deck-card--flipped`
- **Utilities/lib:** camelCase — `supabase.ts`

## Co-location Patterns

- Pages own their server-side data fetching (Supabase queries inline)
- Client components co-locate state logic with JSX
- All styles in `app/globals.css` (no CSS modules, no Tailwind utilities on components)
- Supabase client shared via `lib/supabase.ts`
- Static data (projects array, stack list) defined inline in page files

---
*Last mapped: 2026-05-12*
