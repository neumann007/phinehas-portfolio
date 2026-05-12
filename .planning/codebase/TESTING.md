# TESTING.md

No test framework configured. Zero test files exist in the codebase. Coverage is 0%.

## Current State

- **Framework:** None installed
- **Test files:** None — no `*.test.*` or `*.spec.*` files in `app/`, `components/`, or `lib/`
- **Coverage:** 0%
- **CI/CD:** No GitHub Actions workflows configured

## What's Not Tested

- Component rendering and interaction (Nav, ReactionButton, Carousel, TakeDetail)
- API route handlers (`/api/comments`, `/api/reactions/*`)
- Supabase queries (blog list, take detail, deck signatures)
- State management (ThemeProvider theme toggle, localStorage persistence)
- Form flows (comment submission, deck signing modal)
- Utility functions (`timeAgo`, `getToken`)

## Dependencies (None)

`package.json` contains no testing libraries:
- No `jest` / `vitest`
- No `@testing-library/react`
- No `playwright` / `cypress`
- No `@testing-library/user-event`

## Recommended Setup (if tests are added)

**Unit + Component tests:** Vitest + React Testing Library
```bash
npm install -D vitest @testing-library/react @testing-library/user-event @vitejs/plugin-react jsdom
```

**E2E tests:** Playwright
```bash
npm init playwright@latest
```

**Coverage:** `@vitest/coverage-v8`

## Critical Paths to Test First

1. `/api/reactions/take` — like/dislike logic with optimistic updates
2. `/api/comments` — comment validation and insertion
3. `ThemeProvider` — theme persistence across renders
4. `app/deck/page.tsx` — canvas signature capture, modal flow, Supabase insert
5. `components/TakeDetail.tsx` — reaction state, comment form, error handling

## Mocking Strategy (when implemented)

- **Supabase:** Mock `lib/supabase.ts` exports — `vi.mock('@/lib/supabase')`
- **Next.js navigation:** Mock `next/navigation` (`usePathname`, `useRouter`)
- **localStorage:** Use `jsdom`'s built-in implementation or `vi.stubGlobal`
- **fetch:** `vi.stubGlobal('fetch', vi.fn())` for API route tests

---
*Last mapped: 2026-05-12*
