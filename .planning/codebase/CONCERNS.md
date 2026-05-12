# CONCERNS.md

Several medium-severity issues around missing error handling in API routes and visitor token security. No tests. Two stub features exist in production routing.

---

## HIGH Severity

### Security: ANTHROPIC_API_KEY in .env.local
- **Location:** `.env.local` line 3
- **Issue:** `ANTHROPIC_API_KEY` is stored client-accessible if prefixed wrong. Should be server-only — never in `.env.local` unless strictly used in server-side code with no `NEXT_PUBLIC_` prefix.
- **Fix:** Verify variable has no `NEXT_PUBLIC_` prefix. Audit all usages to confirm it never reaches the browser bundle.

---

## MEDIUM Severity

### Missing error handling in reaction API routes
- **Location:** `app/api/reactions/take/route.ts`, `app/api/reactions/comment/route.ts`
- **Issue:** `.single()` Supabase calls don't check the error object before proceeding. RPC calls (`increment_take_reaction`, `decrement_take_reaction`, `switch_take_reaction`) lack error handling.
- **Fix:** Destructure and check `error` from every Supabase call before using `data`.

### Unsafe type casting in API routes
- **Location:** `app/api/reactions/take/route.ts`, `app/api/reactions/comment/route.ts`, `app/api/comments/route.ts`
- **Issue:** Request bodies cast as `Record<string, unknown>` without runtime validation. Malformed bodies can cause runtime errors or unexpected behavior.
- **Fix:** Use Zod or manual field validation before trusting request body fields.

### Missing try-catch in TakeDetail form submission
- **Location:** `components/TakeDetail.tsx` around line 203
- **Issue:** `handleSubmit` makes a `fetch` call without try-catch. Network failures result in unhandled promise rejections rather than user-facing error state.
- **Fix:** Wrap in try-catch, update error state on catch.

### Visitor token spoofability
- **Location:** `components/TakeDetail.tsx` lines 34-42, `app/deck/page.tsx` lines 17-25
- **Issue:** Anonymous identity via `localStorage` UUID is easily spoofed. No server-side ownership validation before reactions/signatures are accepted.
- **Fix:** Accept current anonymous model as intentional design decision, or add rate limiting / IP-based dedup at the API layer.

### Silent reaction failure with no rollback
- **Location:** `components/TakeDetail.tsx` lines 128, 180
- **Issue:** Fetch calls for reactions apply optimistic updates but don't revert UI state on failure (`!res.ok` sets error but doesn't roll back count).
- **Fix:** Store pre-mutation state and restore it on failure.

---

## LOW Severity

### Large monolithic page/component files
- **Locations:** `app/deck/page.tsx` (436 lines), `app/projects/page.tsx` (451 lines), `components/Carousel.tsx` (442 lines)
- **Issue:** Multiple sub-components defined inline make files hard to navigate and test in isolation.
- **Fix:** Extract `SignaturePad`, `DeckCard`, `SignModal` from deck page; extract project data into a separate constant file.

### Inefficient comment count in blog list
- **Location:** `app/blog/page.tsx` lines 12-25
- **Issue:** Loads all comments to count them instead of using a Supabase aggregate or counter column.
- **Fix:** Use `.select('id', { count: 'exact' })` or maintain a `comment_count` column updated via Supabase trigger.

### Stub endpoints exposed in production routing
- **Locations:** `app/api/flint/route.ts`, `app/api/echoes/route.ts`
- **Issue:** Return placeholder responses — publicly accessible. Not harmful but noisy.
- **Fix:** Add a `NOT_IMPLEMENTED` 501 response or guard with an environment check.

### Hardcoded magic numbers (timeouts)
- **Locations:** `app/deck/page.tsx` (1200ms, 2000ms), various components
- **Issue:** Magic numbers scattered across files with no named constants.
- **Fix:** Extract to named constants at file top.

### CSS duplication in globals.css
- **Location:** `app/globals.css`
- **Issue:** `.contact-icons` and `.contact-icon-btn` are defined three times with partially conflicting rules. `.take-row` and `.take-row__headline` are defined twice.
- **Fix:** Consolidate duplicate selectors into single rules.

### No tests
- **Location:** Entire codebase
- **Issue:** Zero test files. No framework configured. Critical paths (reactions, comments, deck signing) untested.
- **Fix:** Add Vitest + React Testing Library for unit tests; Playwright for E2E on critical flows.

---

## Not Concerns (Intentional)

- **Inline Supabase client in deck page** — was fixed; now imports from `lib/supabase.ts`
- **No Redux/Zustand** — intentionally simple; hooks + Context is appropriate at this scale
- **CSS-only styling** — intentional, no Tailwind utilities on components by design

---
*Last mapped: 2026-05-12*
