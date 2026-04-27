const leftStack = ['Django', 'FastAPI', 'PostgreSQL', 'Docker', 'Python']
const rightStack = ['React', 'Next.js', 'TypeScript', 'DevOps', 'Git & CI/CD']

const contactRows = [
  {
    label: 'Email',
    display: 'phinehasnewman@gmail.com ↗',
    href: 'mailto:phinehasnewman@gmail.com',
    teal: true,
  },
  {
    label: 'GitHub',
    display: 'github.com/neumann007 ↗',
    href: 'https://github.com/neumann007',
    teal: false,
  },
  {
    label: 'LinkedIn',
    display: 'Phinehas Newman ↗',
    href: 'https://linkedin.com/in/phinehas-newman',
    teal: false,
  },
]

const monoLabel: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  letterSpacing: '0.1em',
  color: 'var(--text-tertiary)',
  textTransform: 'uppercase',
  marginBottom: '2rem',
}

const section: React.CSSProperties = {
  maxWidth: '960px',
  margin: '0 auto',
  padding: '3.5rem 1.5rem',
}

const divider: React.CSSProperties = {
  height: '0.5px',
  background: 'var(--border)',
  margin: '0 1.5rem',
}

export const metadata = { title: 'About — Phinehas Newman' }

export default function About () {
  return (
    <main style={{ paddingTop: '72px' }}>
      <style>{`
        @media (max-width: 640px) {
          .flint-layout {
            flex-direction: column !important;
          }
          .flint-placeholder {
            width: 100% !important;
          }
        }
      `}</style>

      {/* ── SECTION 1 — Identity ── */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '4rem 1.5rem 3rem' }}>
        <p style={{ ...monoLabel, marginBottom: '1.5rem' }}>About</p>
        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            marginBottom: '1rem',
          }}
        >
          Phinehas Ebigya Newman Quarshie
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Full-stack engineer · Accra, Ghana · Open to work
        </p>
      </section>

      <div style={divider} />

      {/* ── SECTION 2 — Story ── */}
      <section style={section}>
        <p style={monoLabel}>Story</p>
        <p
          style={{
            fontSize: '15px',
            lineHeight: 1.85,
            color: 'var(--text-secondary)',
            maxWidth: '620px',
            marginBottom: '1.5rem',
            letterSpacing: '-0.005em',
          }}
        >
          I build things that should exist. Not because someone asked — because I looked
          around and noticed the gap. The drug system nobody built for HIV patients who
          deserve privacy. The observability tool that needed a better SDK. The VS Code
          plugin that saves developers from burning tokens they didn&apos;t know they were
          wasting.
        </p>
        <p
          style={{
            fontSize: '15px',
            lineHeight: 1.85,
            color: 'var(--text-secondary)',
            maxWidth: '620px',
            letterSpacing: '-0.005em',
          }}
        >
          I&apos;ve been building for 3 years across the full stack — Django, FastAPI,
          React, Next.js, PostgreSQL — and deep into DevOps because I believe the way
          software runs is just as important as the way it&apos;s written. I&apos;m based
          in Accra, Ghana. Currently open to full-stack, backend, frontend, DevOps, and
          product engineering roles.
        </p>
      </section>

      <div style={divider} />

      {/* ── SECTION 3 — Belief ── */}
      <section style={section}>
        <p style={monoLabel}>Belief</p>
        <blockquote
          style={{
            fontSize: 'clamp(22px, 3vw, 32px)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.2,
            maxWidth: '600px',
            marginBottom: '1.25rem',
            fontStyle: 'normal',
          }}
        >
          &ldquo;Software development is like childbirth. It&apos;ll cost you now. You
          reap years later.&rdquo;
        </blockquote>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            letterSpacing: '0.05em',
          }}
        >
          — Phinehas Newman
        </p>
      </section>

      <div style={divider} />

      {/* ── SECTION 4 — Stack ── */}
      <section style={section}>
        <p style={monoLabel}>Stack</p>
        <div style={{ display: 'flex', gap: '4rem' }}>
          {[leftStack, rightStack].map((col, ci) => (
            <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
              {col.map(tech => (
                <div
                  key={tech}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.35rem 0' }}
                >
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: 'var(--teal)',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{tech}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <div style={divider} />

      {/* ── SECTION 5 — FLINT ── */}
      <section style={section}>
        <p style={monoLabel}>FLINT — Opportunity Finder</p>
        <div
          className='flint-layout'
          style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}
        >
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
                maxWidth: '360px',
                marginBottom: '1rem',
              }}
            >
              Your story already qualifies you for more than you know.
            </h2>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: '1.75rem',
              }}
            >
              Built for African creatives. Answer 7 questions about who you are and what
              you&apos;ve built. FLINT reveals the opportunities you didn&apos;t know
              existed.
            </p>
            <button
              style={{
                border: '1px solid var(--teal)',
                color: 'var(--teal)',
                padding: '10px 20px',
                fontSize: '13px',
                background: 'none',
                cursor: 'pointer',
                borderRadius: 0,
                letterSpacing: '-0.005em',
              }}
            >
              Try FLINT →
            </button>
          </div>

          <div
            className='flint-placeholder'
            style={{
              width: '280px',
              height: '200px',
              background: '#0a0a0a',
              border: '0.5px solid var(--border)',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--teal)',
                letterSpacing: '0.1em',
              }}
            >
              FLINT TOOL
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-tertiary)',
                letterSpacing: '0.06em',
              }}
            >
              Coming soon
            </span>
          </div>
        </div>
      </section>

      <div style={divider} />

      {/* ── SECTION 6 — Contact ── */}
      <section style={section}>
        <p style={monoLabel}>Contact</p>
        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            marginBottom: '1rem',
          }}
        >
          Let&apos;s build something.
        </h2>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: 1.8,
            maxWidth: '480px',
            marginBottom: '2rem',
            letterSpacing: '-0.005em',
          }}
        >
          Open to full-stack, backend, frontend, DevOps, and product engineering roles.
          If you&apos;re working on something that should exist — I want to hear about it.
        </p>

        <div style={{ maxWidth: '560px' }}>
          {contactRows.map(row => (
            <div
              key={row.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 0',
                borderBottom: '0.5px solid var(--border)',
              }}
            >
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {row.label}
              </span>
              <a
                href={row.href}
                target={row.href.startsWith('mailto') ? undefined : '_blank'}
                rel={row.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                style={{
                  fontSize: '13px',
                  color: row.teal ? 'var(--teal)' : 'var(--text-tertiary)',
                  textDecoration: 'none',
                  letterSpacing: '-0.005em',
                }}
              >
                {row.display}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '0.5px solid var(--border)',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
          Phinehas Newman · 2026
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
          Accra, Ghana
        </span>
      </footer>
    </main>
  )
}
