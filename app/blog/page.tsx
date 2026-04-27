import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

export const revalidate = 60

export const metadata = { title: 'Takes — Phinehas Newman' }

type TakeRow = {
  id: string
  take: string
  tag: string
  date: string
  likes: number
  dislikes: number
  order_index: number
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const divider: React.CSSProperties = {
  height: '0.5px',
  background: 'var(--border)',
  margin: '0 1.5rem',
}

const monoSm: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  letterSpacing: '0.08em',
}

export default async function Blog () {
  const [{ data: takes }, { data: commentCounts }] = await Promise.all([
    supabase
      .from('takes')
      .select('id, take, tag, date, likes, dislikes, order_index')
      .eq('published', true)
      .order('order_index', { ascending: true }),
    supabase
      .from('take_comments')
      .select('take_id')
      .eq('approved', true),
  ])

  const countMap: Record<string, number> = {}
  commentCounts?.forEach(c => {
    countMap[c.take_id] = (countMap[c.take_id] ?? 0) + 1
  })

  const takeList: TakeRow[] = takes ?? []

  return (
    <main style={{ paddingTop: '72px' }}>

      {/* ── HEADER ── */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '4rem 1.5rem 3rem' }}>
        <p style={{ ...monoSm, letterSpacing: '0.1em', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          Takes
        </p>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, maxWidth: '600px' }}>
          Opinions on software, tools, and the industry.
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '0.75rem', letterSpacing: '-0.005em' }}>
          Short. Punchy. I mean them.
        </p>
      </section>

      <div style={divider} />

      {/* ── TAKES LIST ── */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '0 1.5rem' }}>
        {takeList.length === 0 ? (
          <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', padding: '3rem 0' }}>
            No takes yet. Check back soon.
          </p>
        ) : (
          takeList.map((take, index) => (
            <div key={take.id}>
              <TakeRow take={take} commentCount={countMap[take.id] ?? 0} />
              {index < takeList.length - 1 && (
                <div style={{ height: '0.5px', background: 'var(--border)' }} />
              )}
            </div>
          ))
        )}
      </section>

      <div style={divider} />

      {/* ── CTA ── */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
        <p style={{ ...monoSm, letterSpacing: '0.1em', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '2rem' }}>
          Got a take?
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8, letterSpacing: '-0.005em' }}>
          Disagree with something? Have a stronger opinion? I&apos;m always up for the argument.
        </p>
        <a
          href='mailto:phinehasnewman@gmail.com'
          style={{ fontSize: '13px', color: 'var(--teal)', textDecoration: 'none', marginTop: '0.75rem', display: 'block' }}
        >
          phinehasnewman@gmail.com →
        </a>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ maxWidth: '960px', margin: '0 auto', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '0.5px solid var(--border)' }}>
        <span style={{ ...monoSm, color: 'var(--text-tertiary)' }}>Phinehas Newman · 2026</span>
        <span style={{ ...monoSm, color: 'var(--text-tertiary)' }}>Accra, Ghana</span>
      </footer>
    </main>
  )
}

// ── Row sub-component (server, no state needed) ──────────────────────────
function TakeRow ({ take, commentCount }: { take: TakeRow; commentCount: number }) {
  return (
    <Link
      href={`/blog/${take.id}`}
      style={{ display: 'block', padding: '2rem 0', textDecoration: 'none', color: 'inherit' }}
      className='take-row'
    >
      <style>{`
        .take-row:hover .take-headline { color: var(--teal); }
        .take-row .take-headline { transition: color 0.15s ease; }
      `}</style>

      {/* Tag + date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal)' }}>
          {take.tag}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
          {take.date}
        </span>
      </div>

      {/* Take headline */}
      <p className='take-headline' style={{ fontWeight: 700, fontSize: '20px', letterSpacing: '-0.02em', lineHeight: 1.3, color: 'var(--text-primary)', marginBottom: '1rem' }}>
        {take.take}
      </p>

      {/* Metadata row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-tertiary)' }}>
          👍 {take.likes ?? 0}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-tertiary)' }}>
          👎 {take.dislikes ?? 0}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-tertiary)' }}>
          💬 {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: '14px', color: 'var(--text-tertiary)' }}>→</span>
      </div>
    </Link>
  )
}
