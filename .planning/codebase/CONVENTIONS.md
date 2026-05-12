# CONVENTIONS.md

Next.js 16 / React 19 / TypeScript portfolio with strict typing, CSS-variable-driven theming, and BEM-style class naming. All styles live in `app/globals.css` — no CSS Modules, no Tailwind utilities on components.

## Component Structure

- **Location:** Pages in `app/*/page.tsx`, reusable components in `components/`
- **Naming:** PascalCase files and exports — `Nav.tsx`, `ReactionButton.tsx`, `ThemeProvider.tsx`
- **`'use client'` directive:** Explicit on all interactive components. Server components (data-fetching pages) omit it.
- **Props pattern:** Typed inline before function — `function DeckCard ({ sig, isNew }: { sig: DeckSignature; isNew: boolean })`
- **Hooks:** Direct React hooks only — `useState`, `useEffect`, `useCallback`, `useRef`, `useContext`. No external state library.

## CSS Approach

- **Single file:** All styles in `app/globals.css` — no CSS Modules, no scoped styles
- **CSS variables:** All design tokens as CSS custom properties on `:root` with dark overrides via `[data-theme='dark']`
  - Colors: `--bg`, `--bg-secondary`, `--text-primary`, `--text-secondary`, `--text-tertiary`, `--teal`, `--teal-light`, `--border`
  - Fonts: `--font-sans`, `--font-mono`
- **Class naming:** BEM-influenced kebab-case
  - Block: `.nav-bar`, `.deck-card`, `.carousel`
  - Element: `.deck-card__front`, `.nav-bar__logo`
  - Modifier: `.deck-card--flipped`, `.nav-link--active`
- **No inline styles:** Dynamic values (animation delays, positioning) are the only exception
- **No Tailwind utilities on components** — Tailwind imported for its reset/base only

## TypeScript

- **Strict mode:** `strict: true` in `tsconfig.json`
- **Type patterns:** Plain object types for props, union types for status/state, `type` over `interface` for simple shapes
- **Non-null assertions:** Used for required env vars — `process.env.NEXT_PUBLIC_SUPABASE_URL!`
- **Path alias:** `@/*` resolves to project root (`tsconfig.json` paths)

## Import Patterns

```ts
// External first
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// Internal with @ alias
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/components/ThemeProvider'
```

- No barrel files — import directly from component file
- `@/` alias for all internal imports

## State Management

- **Local state:** `useState` for component-level (menus, form inputs, animations)
- **Shared state:** React Context via `ThemeProvider` — exposes `{ theme, toggle }` via `useTheme()`
- **Persistence:** `localStorage` for theme preference and visitor identity token
- **Server state:** Supabase queries directly in server components or via Realtime in client components

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Files (components) | PascalCase | `ReactionButton.tsx` |
| Files (utils/lib) | camelCase | `supabase.ts` |
| Files (pages/API) | lowercase | `page.tsx`, `route.ts` |
| Functions | camelCase, verb-based | `handleSubmit`, `closeMenu` |
| Types | PascalCase | `DeckSignature`, `ModalStep` |
| CSS classes | kebab-case BEM | `.deck-card--flipped` |
| Constants | SCREAMING_SNAKE_CASE | `const ICONS = {...}` |

## Error Handling

- **API routes:** Return `{ error: string }` with 400/500 status on failure; `{ success: true }` or data on success
- **Client fetch:** Check `res.ok`, set error state string for display
- **Status pattern:** `'idle' | 'loading' | 'success' | 'error'` union for async UI states
- **Validation:** Length checks and required-field guards before API calls

## Data Fetching

- **Server components:** Direct Supabase client calls (no fetch wrapper)
- **ISR:** `export const revalidate = 60` in `app/blog/page.tsx`
- **Client mutations:** `fetch('/api/endpoint', { method: 'POST', body: JSON.stringify(...) })`
- **Realtime:** Supabase channel subscriptions in `useEffect` (see `app/deck/page.tsx`)
- **Stored procedures:** Supabase RPC for complex operations (`increment_take_reaction`, `switch_take_reaction`)

## Linting

- **ESLint:** v9 flat config in `eslint.config.mjs` — extends `eslint-config-next` (Core Web Vitals + TypeScript)
- **No Prettier:** Formatting via ESLint rules
- **PostCSS:** `postcss.config.mjs` uses `@tailwindcss/postcss` v4

## API Route Design

```ts
// Pattern in app/api/*/route.ts
export async function POST(req: Request) {
  const body = await req.json()
  // validate body fields
  const { data, error } = await supabase.from('table').insert([...])
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
```

---
*Last mapped: 2026-05-12*
