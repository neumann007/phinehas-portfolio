import Link from 'next/link'

export default function Home () {
  return (
    <main style={{ paddingTop: '72px' }}>
      {/* ── HERO ── */}
      <section
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          padding: '6rem 1.5rem 5rem'
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            color: 'var(--text-tertiary)',
            marginBottom: '2rem',
            textTransform: 'uppercase'
          }}
        >
          Accra, Ghana · Full-stack engineer · Open to work
        </p>

        <h1
          style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            lineHeight: 1.05,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '2.5rem',
            maxWidth: '720px'
          }}
        >
          A developer who thinks
          <br />
          in systems and builds
          <br />
          <span style={{ color: 'var(--teal)', fontWeight: 800 }}>
            things that should exist.
          </span>
        </h1>

        <p
          style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            lineHeight: 1.8,
            maxWidth: '480px',
            marginBottom: '2.5rem'
          }}
        >
          Full-stack engineer with 3 years building products, developer tools,
          and infrastructure across Django, FastAPI, React, Next.js, PostgreSQL,
          and DevOps.
        </p>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link
            href='/projects'
            style={{
              fontSize: '13px',
              color: 'var(--teal)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--teal)',
              paddingBottom: '2px'
            }}
          >
            See my work ↓
          </Link>
          <Link
            href='/about'
            style={{
              fontSize: '13px',
              color: 'var(--text-tertiary)',
              textDecoration: 'none'
            }}
          >
            About me →
          </Link>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div
        style={{
          height: '0.5px',
          background: 'var(--border)',
          margin: '0 1.5rem'
        }}
      />

      {/* ── WHAT I'M UP TO ── */}
      <section
        style={{ maxWidth: '960px', margin: '0 auto', padding: '4rem 1.5rem' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            marginBottom: '2.5rem'
          }}
        >
          What I&apos;m up to
        </p>

        <div
          style={{
            border: '0.5px solid var(--border)',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'var(--bg-secondary)'
          }}
        >
          {/* Tool header */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '0.5px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 6px #22c55e'
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-tertiary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}
              >
                Active build
              </span>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-tertiary)'
              }}
            >
              scrive.dev
            </span>
          </div>

          {/* Tool content — two columns */}
          <div style={{ display: 'flex', minHeight: '280px' }}>
            {/* Left — info */}
            <div
              style={{
                flex: 1,
                padding: '2rem 1.5rem',
                borderRight: '0.5px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--teal)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '0.75rem'
                  }}
                >
                  Developer tool
                </p>
                <h3
                  style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    letterSpacing: '-0.025em',
                    color: 'var(--text-primary)',
                    marginBottom: '1rem',
                    lineHeight: 1.1
                  }}
                >
                  Scrive
                </h3>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.8,
                    maxWidth: '320px'
                  }}
                >
                  Visual project scaffolding. Design your architecture, choose
                  your stack, set your conventions — download a production-ready
                  project in seconds.
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  marginTop: '1.5rem',
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}
              >
                <a
                  href='https://scrive.dev'
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{
                    fontSize: '12px',
                    color: 'var(--teal)',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--teal)',
                    paddingBottom: '1px'
                  }}
                >
                  scrive.dev ↗
                </a>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-tertiary)'
                  }}
                >
                  In progress
                </span>
              </div>
            </div>

            {/* Right — browser mockup */}
            <div
              style={{
                width: '340px',
                flexShrink: 0,
                background: '#000',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Browser chrome */}
              <div
                style={{
                  background: '#1a1a1a',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#ff5f57'
                  }}
                />
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#febc2e'
                  }}
                />
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#28c840'
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    background: '#111',
                    borderRadius: '4px',
                    padding: '3px 10px',
                    marginLeft: '8px'
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      color: '#555'
                    }}
                  >
                    scrive.dev
                  </span>
                </div>
              </div>
              {/* Screen */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '1.5rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {[
                  { top: '10%', left: '15%' },
                  { top: '25%', left: '80%' },
                  { top: '60%', left: '10%' },
                  { top: '75%', left: '85%' },
                  { top: '45%', left: '90%' },
                  { top: '85%', left: '40%' }
                ].map((pos, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      width: '2px',
                      height: '2px',
                      borderRadius: '50%',
                      background: '#2dd4bf',
                      opacity: 0.25,
                      top: pos.top,
                      left: pos.left
                    }}
                  />
                ))}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '1rem'
                  }}
                >
                  <svg width='16' height='16' viewBox='0 0 28 28' fill='none'>
                    <rect x='0' y='0' width='8' height='8' fill='#2dd4bf' />
                    <rect
                      x='10'
                      y='0'
                      width='8'
                      height='8'
                      fill='white'
                      fillOpacity='0.15'
                    />
                    <rect x='20' y='0' width='8' height='8' fill='white' />
                    <rect
                      x='0'
                      y='10'
                      width='8'
                      height='8'
                      fill='white'
                      fillOpacity='0.15'
                    />
                    <rect x='10' y='10' width='8' height='8' fill='#2dd4bf' />
                    <rect
                      x='20'
                      y='10'
                      width='8'
                      height='8'
                      fill='white'
                      fillOpacity='0.15'
                    />
                    <rect x='0' y='20' width='8' height='8' fill='white' />
                    <rect
                      x='10'
                      y='20'
                      width='8'
                      height='8'
                      fill='white'
                      fillOpacity='0.15'
                    />
                    <rect x='20' y='20' width='8' height='8' fill='#2dd4bf' />
                  </svg>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: 'white',
                      letterSpacing: '0.3em'
                    }}
                  >
                    SCRIVE
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: 900,
                    color: 'white',
                    lineHeight: 1.1,
                    marginBottom: '3px'
                  }}
                >
                  Before you build —
                </p>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: 900,
                    color: '#2dd4bf',
                    lineHeight: 1.1,
                    marginBottom: '1.25rem'
                  }}
                >
                  you scrive.
                </p>
                <div style={{ display: 'flex', width: '200px' }}>
                  <div
                    style={{
                      flex: 1,
                      border: '0.5px solid #333',
                      borderRight: 'none',
                      padding: '6px 10px'
                    }}
                  >
                    <span style={{ fontSize: '9px', color: '#555' }}>
                      your@email.com
                    </span>
                  </div>
                  <div style={{ background: '#2dd4bf', padding: '6px 10px' }}>
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        color: '#000'
                      }}
                    >
                      NOTIFY →
                    </span>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: '8px',
                    color: '#444',
                    marginTop: '6px',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  Join 2 developers already waiting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div
        style={{
          height: '0.5px',
          background: 'var(--border)',
          margin: '0 1.5rem'
        }}
      />

      {/* ── ECHOES TEASER ── */}
      <section
        style={{ maxWidth: '860px', margin: '0 auto', padding: '4rem 1.5rem' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            marginBottom: '2rem'
          }}
        >
          Echoes — leave your mark
        </p>
        <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                marginBottom: '1rem'
              }}
            >
              Everyone who visits
              <br />
              <span style={{ color: 'var(--teal)', fontWeight: 700 }}>
                leaves a trace.
              </span>
            </h2>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                maxWidth: '360px',
                marginBottom: '1.5rem'
              }}
            >
              {`A living globe of signals. Drop your echo — what you're building, what you can't stop thinking about. Find someone on the other side of the world building what you're building.`}
            </p>
            <span
              style={{
                fontSize: '12px',
                color: 'var(--teal)',
                borderBottom: '1px solid var(--teal)',
                paddingBottom: '2px',
                cursor: 'pointer'
              }}
            >
              Drop your echo ↓
            </span>
          </div>
          <div
            style={{
              width: '280px',
              height: '280px',
              background: '#020c06',
              borderRadius: '8px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2dd4bf',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.08em'
            }}
          >
            ECHOES GLOBE
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div
        style={{
          height: '0.5px',
          background: 'var(--border)',
          margin: '0 1.5rem'
        }}
      />

      {/* SCRIVE TEASER */}
      <section className='scrive-teaser'>
        {/* God rays */}
        <svg
          className='scrive-teaser__rays'
          viewBox='0 0 1200 300'
          preserveAspectRatio='xMidYMid slice'
          xmlns='http://www.w3.org/2000/svg'
        >
          <defs>
            <radialGradient id='godray-center' cx='50%' cy='60%' r='60%'>
              <stop offset='0%' stopColor='#2dd4bf' stopOpacity='1' />
              <stop offset='100%' stopColor='#2dd4bf' stopOpacity='0' />
            </radialGradient>
          </defs>
          <ellipse
            cx='600'
            cy='300'
            rx='500'
            ry='200'
            fill='url(#godray-center)'
          />
          {[
            { x1: 600, x2: 100 },
            { x1: 600, x2: 250 },
            { x1: 600, x2: 400 },
            { x1: 600, x2: 550 },
            { x1: 600, x2: 650 },
            { x1: 600, x2: 800 },
            { x1: 600, x2: 950 },
            { x1: 600, x2: 1100 }
          ].map((ray, i) => (
            <polygon
              key={i}
              points={`${ray.x1},300 ${ray.x2 - 30},0 ${ray.x2 + 30},0`}
              fill='#2dd4bf'
              opacity={0.15}
            />
          ))}
        </svg>

        {/* Particles */}
        <div className='scrive-teaser__particles'>
          {[
            { left: '5%', top: '80%', size: 2, duration: '6s', delay: '0s' },
            { left: '12%', top: '60%', size: 1, duration: '8s', delay: '1s' },
            { left: '20%', top: '90%', size: 2, duration: '7s', delay: '2s' },
            { left: '30%', top: '70%', size: 1, duration: '9s', delay: '0.5s' },
            { left: '40%', top: '85%', size: 2, duration: '6s', delay: '3s' },
            { left: '50%', top: '75%', size: 1, duration: '8s', delay: '1.5s' },
            { left: '58%', top: '90%', size: 2, duration: '7s', delay: '0s' },
            { left: '65%', top: '65%', size: 1, duration: '9s', delay: '2.5s' },
            { left: '72%', top: '80%', size: 2, duration: '6s', delay: '1s' },
            { left: '80%', top: '70%', size: 1, duration: '8s', delay: '3.5s' },
            { left: '88%', top: '85%', size: 2, duration: '7s', delay: '0.5s' },
            { left: '95%', top: '60%', size: 1, duration: '9s', delay: '2s' }
          ].map((p, i) => (
            <div
              key={i}
              className='scrive-teaser__particle'
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                left: p.left,
                top: p.top,
                animationDuration: p.duration,
                animationDelay: p.delay
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className='scrive-teaser__content'>
          <p className='scrive-teaser__label'>Coming soon</p>
          <h2 className='scrive-teaser__heading'>Scrive</h2>
          <p className='scrive-teaser__description'>
            Visual project scaffolding. Design your architecture before you
            write your first line of code.
          </p>
          <a
            href='https://scrive.dev'
            target='_blank'
            rel='noopener noreferrer'
            className='scrive-teaser__cta'
          >
            Join the waitlist → scrive.dev
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '0.5px solid var(--border)'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-tertiary)'
          }}
        >
          Phinehas Newman · 2026
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-tertiary)'
          }}
        >
          Accra, Ghana
        </span>
      </footer>
    </main>
  )
}
