'use client'

import Link from 'next/link'
import Carousel from '@/components/Carousel'

export default function Home() {
  return (
    <main className="page">

      {/* HERO */}
      <section className="hero">
        <p className="mono hero__tag">
          Full-stack engineer
        </p>
        <h1 className="heading-xl hero__headline">
          A developer who thinks
          <br />
          in systems and builds
          <br />
          <span className="teal">things that should exist.</span>
        </h1>
        <p className="text-body hero__desc">
          Full-stack engineer with 3 years building products, developer
          tools, and infrastructure across Django, FastAPI, React,
          Next.js, PostgreSQL, and DevOps.
        </p>
        <div className="hero__actions">
          <Link href="/projects" className="link-teal">See my work ↓</Link>
          <Link href="/about" className="link-muted">About me →</Link>
        </div>
      </section>

      <div className="divider" />

      {/* WHAT I'M UP TO */}
      <section className="section">
        <p className="mono" style={{ marginBottom: '2.5rem' }}>What I&apos;m up to</p>
        <div className="active-build">
          <div className="active-build__header">
            <div className="active-build__status">
              <div className="active-build__dot" />
              <span className="mono">Active build</span>
            </div>
            <span className="mono">scrive.dev</span>
          </div>
          <div className="active-build__body">
            <div className="active-build__info">
              <div>
                <p className="mono mono--teal" style={{ marginBottom: '0.75rem' }}>
                  Developer tool
                </p>
                <h3 className="heading-md" style={{ marginBottom: '1rem' }}>Scrive</h3>
                <p className="text-body" style={{ maxWidth: '320px' }}>
                  Visual project scaffolding. Design your architecture,
                  choose your stack, set your conventions — download a
                  production-ready project in seconds.
                </p>
              </div>
              <div className="active-build__links">
                <a
                  href="https://scrive.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-teal"
                >
                  scrive.dev ↗
                </a>
                <span className="mono">In progress</span>
              </div>
            </div>
            <div className="active-build__mockup">
              <div className="browser-chrome">
                <div className="browser-dot browser-dot--red" />
                <div className="browser-dot browser-dot--yellow" />
                <div className="browser-dot browser-dot--green" />
                <div className="browser-url">scrive.dev</div>
              </div>
              <div className="browser-screen">
                {[
                  { top: '10%', left: '15%' },
                  { top: '25%', left: '80%' },
                  { top: '60%', left: '10%' },
                  { top: '75%', left: '85%' },
                  { top: '45%', left: '90%' },
                  { top: '85%', left: '40%' },
                ].map((p, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      width: '2px',
                      height: '2px',
                      borderRadius: '50%',
                      background: '#2dd4bf',
                      opacity: 0.25,
                      top: p.top,
                      left: p.left,
                    }}
                  />
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
                    <rect x="0" y="0" width="8" height="8" fill="#2dd4bf"/>
                    <rect x="10" y="0" width="8" height="8" fill="white" fillOpacity="0.15"/>
                    <rect x="20" y="0" width="8" height="8" fill="white"/>
                    <rect x="0" y="10" width="8" height="8" fill="white" fillOpacity="0.15"/>
                    <rect x="10" y="10" width="8" height="8" fill="#2dd4bf"/>
                    <rect x="20" y="10" width="8" height="8" fill="white" fillOpacity="0.15"/>
                    <rect x="0" y="20" width="8" height="8" fill="white"/>
                    <rect x="10" y="20" width="8" height="8" fill="white" fillOpacity="0.15"/>
                    <rect x="20" y="20" width="8" height="8" fill="#2dd4bf"/>
                  </svg>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'white', letterSpacing: '0.3em' }}>
                    SCRIVE
                  </span>
                </div>
                <p style={{ fontSize: '16px', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '3px' }}>
                  Before you build —
                </p>
                <p style={{ fontSize: '16px', fontWeight: 900, color: '#2dd4bf', lineHeight: 1.1, marginBottom: '1.25rem' }}>
                  you scrive.
                </p>
                <div style={{ display: 'flex', width: '200px' }}>
                  <div style={{ flex: 1, border: '0.5px solid #333', borderRight: 'none', padding: '6px 10px' }}>
                    <span style={{ fontSize: '9px', color: '#555' }}>your@email.com</span>
                  </div>
                  <div style={{ background: '#2dd4bf', padding: '6px 10px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: '#000' }}>NOTIFY →</span>
                  </div>
                </div>
                <p style={{ fontSize: '8px', color: '#444', marginTop: '6px', fontFamily: 'monospace' }}>
                  Join 2 developers already waiting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ECHOES */}
      <section className="section">
        <p className="mono" style={{ marginBottom: '2rem' }}>Echoes — leave your mark</p>
        <div className="echoes-section">
          <div className="echoes-section__content">
            <h2 className="heading-md" style={{ marginBottom: '1rem' }}>
              Everyone who visits
              <br />
              <span className="teal">leaves a trace.</span>
            </h2>
            <p className="text-body" style={{ maxWidth: '360px', marginBottom: '1.5rem' }}>
              A living globe of signals. Drop your echo — what you&apos;re
              building, what you can&apos;t stop thinking about. Find someone
              on the other side of the world building what you&apos;re building.
            </p>
            <span className="link-teal" style={{ cursor: 'pointer' }}>
              Drop your echo ↓
            </span>
          </div>
          <div className="echoes-placeholder">ECHOES GLOBE</div>
        </div>
      </section>

      <div className="divider" />

      {/* SCRIVE TEASER */}
      <section className="scrive-teaser">
        <svg className="scrive-teaser__rays" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="godray-center" cx="50%" cy="60%" r="60%">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="1" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="600" cy="300" rx="500" ry="200" fill="url(#godray-center)" />
          {[100, 250, 400, 550, 650, 800, 950, 1100].map((x2, i) => (
            <polygon key={i} points={`600,300 ${x2 - 30},0 ${x2 + 30},0`} fill="#2dd4bf" opacity={0.15} />
          ))}
        </svg>
        <div className="scrive-teaser__particles">
          {[
            { left: '5%',  top: '80%', size: 2, duration: '6s',  delay: '0s'    },
            { left: '12%', top: '60%', size: 1, duration: '8s',  delay: '1s'    },
            { left: '20%', top: '90%', size: 2, duration: '7s',  delay: '2s'    },
            { left: '30%', top: '70%', size: 1, duration: '9s',  delay: '0.5s'  },
            { left: '40%', top: '85%', size: 2, duration: '6s',  delay: '3s'    },
            { left: '50%', top: '75%', size: 1, duration: '8s',  delay: '1.5s'  },
            { left: '58%', top: '90%', size: 2, duration: '7s',  delay: '0s'    },
            { left: '65%', top: '65%', size: 1, duration: '9s',  delay: '2.5s'  },
            { left: '72%', top: '80%', size: 2, duration: '6s',  delay: '1s'    },
            { left: '80%', top: '70%', size: 1, duration: '8s',  delay: '3.5s'  },
            { left: '88%', top: '85%', size: 2, duration: '7s',  delay: '0.5s'  },
            { left: '95%', top: '60%', size: 1, duration: '9s',  delay: '2s'    },
          ].map((p, i) => (
            <div
              key={i}
              className="scrive-teaser__particle"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                left: p.left,
                top: p.top,
                animationDuration: p.duration,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>
        <div className="scrive-teaser__content">
          <p className="scrive-teaser__label">Coming soon</p>
          <h2 className="scrive-teaser__heading">Scrive</h2>
          <p className="scrive-teaser__description">
            Visual project scaffolding. Design your architecture before
            you write your first line of code.
          </p>
          <a
            href="https://scrive.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="scrive-teaser__cta"
          >
            Join the waitlist → scrive.dev
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer container">
        <span className="mono">Phinehas Newman · 2026</span>
        <span className="mono">Accra, Ghana</span>
      </footer>

    </main>
  )
}