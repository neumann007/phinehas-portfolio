# External Integrations

This portfolio integrates with multiple external services for AI, data, maps, and real-time collaboration features.

## External APIs

### Claude API (Anthropic)

- **Package:** @anthropic-ai/sdk 0.91.1
- **Auth Method:** API Key (`ANTHROPIC_API_KEY` environment variable)
- **Used In:**
  - Likely used by `components/FlintTool.tsx` for AI-powered tooling
  - Server-side API routes can leverage Claude for processing
- **Endpoints:** REST API via SDK (https://api.anthropic.com)
- **Rate Limits:** Standard Anthropic API plan limits apply

### Mapbox API

- **API Token:** `NEXT_PUBLIC_MAPBOX_TOKEN` (public)
- **Used In:** Map visualizations (referenced in components)
- **Endpoints:** Mapbox REST/Vector Tile APIs
- **Auth Method:** API key in URL or headers

## Database

### Supabase (PostgreSQL)

- **Type:** PostgreSQL relational database hosted on Supabase
- **Project URL:** `https://cxiyjloihegltbijdyez.supabase.co`
- **Client Library:** @supabase/supabase-js 2.104.1
- **Auth Method:** 
  - Public (anon) key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Service role key: `SUPABASE_SERVICE_ROLE_KEY` (server-only)
  
- **Client Initialization:** `lib/supabase.ts`
  ```typescript
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  ```

### Database Tables & Schema

#### Tables Identified:
1. **take_comments**
   - Columns: `take_id`, `name`, `comment`
   - Used in: `app/api/comments/route.ts`
   - Validation: name max 60 chars, comment max 500 chars

2. **take_reactions**
   - Columns: `take_id`, `visitor_token`, `reaction`
   - Used in: `app/api/reactions/take/route.ts`
   - Operations: insert, update, delete, RPC functions

3. **comment_reactions**
   - Columns: `comment_id`, `visitor_token`, `reaction`
   - Used in: `app/api/reactions/comment/route.ts`
   - Operations: insert, update, delete, RPC functions

#### Remote Procedures (RPCs):
- `increment_take_reaction(p_take_id, p_reaction)` — Increment reaction counter
- `decrement_take_reaction(p_take_id, p_reaction)` — Decrement reaction counter
- `switch_take_reaction(p_take_id, p_old_reaction, p_new_reaction)` — Update reaction type
- `increment_comment_reaction(p_comment_id, p_reaction)` — Increment comment reaction
- `decrement_comment_reaction(p_comment_id, p_reaction)` — Decrement comment reaction
- `switch_comment_reaction(p_comment_id, p_old_reaction, p_new_reaction)` — Update comment reaction

## Data Visualization

### Globe.gl

- **Package:** globe.gl 2.45.3
- **Used In:** `components/EchoesGlobe.tsx`
- **Purpose:** 3D globe visualization for "Echoes" feature (global signal/echo display)
- **Integration:** Client-side React component

## Authentication

- **Auth Provider:** Supabase Auth (built into @supabase/supabase-js)
- **Auth Method:** JWT tokens (embedded in public anon key)
- **Session Management:** Managed by Supabase client SDK
- **Visitor Tracking:** Uses `visitor_token` for anonymous reactions/comments (likely localStorage-based)

## Monitoring & Analytics

- **No explicit analytics SDK found** in dependencies
- **Built-in:** Next.js built-in Core Web Vitals monitoring
- **ESLint Config:** eslint-config-next includes core-web-vitals checks

## Asset Hosting & CDN

- **Static Assets:** `public/` directory served by Next.js
- **Image Domains:** Configured in `next.config.ts` (currently empty allowlist)
- **Font Delivery:** Google Fonts (Plus Jakarta Sans, DM Mono)

## Email / Notifications

- **No email service SDK found** in dependencies
- **Waitlist:** Scrive.dev waitlist (external, not in this codebase)

## API Routes

### Implemented Endpoints

| Route | Method | Purpose |
|-------|--------|---------|
| `app/api/comments/route.ts` | POST | Submit comment on a "take" |
| `app/api/reactions/take/route.ts` | POST | React to a take (emoji/reaction) |
| `app/api/reactions/comment/route.ts` | POST | React to a comment |
| `app/api/echoes/route.ts` | GET, POST | Echoes API (coming soon) |
| `app/api/flint/route.ts` | POST | FLINT tool API (coming soon) |

### Request/Response Pattern

All API routes:
- Validate incoming JSON
- Return error messages and HTTP status codes
- Use Supabase client for data operations
- Support RPC calls for computed operations

## Webhooks

- **No webhooks configured** — data flows are request/response based

## Third-Party SDKs Summary

| SDK | Version | Purpose |
|-----|---------|---------|
| @anthropic-ai/sdk | 0.91.1 | Claude AI API |
| @supabase/supabase-js | 2.104.1 | PostgreSQL database + auth |
| globe.gl | 2.45.3 | 3D globe visualization |
| next | 16.2.4 | Framework and HTTP server |

## Configuration Files

- `.env.local` — All external credentials and API keys
- `next.config.ts` — Allowed dev origins, image domain rules
- `tsconfig.json` — Compiler settings for API usage
