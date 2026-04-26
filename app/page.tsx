'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Carousel from '@/components/Carousel'

export default function Home () {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main style={{ paddingTop: '52px' }}>
      {/* HERO */}
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
            href='/work'
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

      {/* DIVIDER */}
      <div
        style={{ height: '0.5px', background: 'var(--border)', margin: '0 1.5rem' }}
      />

      {/* CURRENTLY BUILDING */}
      <section
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          padding: '4rem 1.5rem'
        }}
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
          Currently building
        </p>
        <Carousel />
      </section>

      {/* DIVIDER */}
      <div
        style={{ height: '0.5px', background: 'var(--border)', margin: '0 1.5rem' }}
      />

      {/* ECHOES TEASER */}
      <section
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          padding: '4rem 1.5rem'
        }}
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
              {`A living globe of signals. Drop your echo — what you're building,
              what you can't stop thinking about. Find someone on the other side
              of the world building what you're building.`}
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
          {/* Globe placeholder — replaced when EchoesGlobe is built */}
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

      {/* DIVIDER */}
      <div
        style={{ height: '0.5px', background: 'var(--border)', margin: '0 1.5rem' }}
      />

      {/* SCRIVE TEASER — intentionally dark in both modes */}
      <section
        style={{
          background: '#020c06',
          padding: '3.5rem 1.5rem'
        }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.1em',
              color: '#2dd4bf',
              textTransform: 'uppercase',
              marginBottom: '1rem'
            }}
          >
            Coming soon
          </p>
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'white',
              marginBottom: '0.75rem'
            }}
          >
            Scrive
          </h2>
          <p
            style={{
              fontSize: '13px',
              color: '#9FE1CB',
              lineHeight: 1.8,
              maxWidth: '440px',
              marginBottom: '1.5rem'
            }}
          >
            Visual project scaffolding. Design your architecture before you
            write your first line of code.
          </p>
          <Link
            href='https://scrive.dev'
            target='_blank'
            style={{
              display: 'inline-block',
              border: '0.5px solid #2dd4bf',
              padding: '8px 18px',
              fontSize: '12px',
              color: '#2dd4bf',
              textDecoration: 'none',
              letterSpacing: '0.04em'
            }}
          >
            Join the waitlist → scrive.dev
          </Link>
        </div>
      </section>

      {/* FOOTER */}
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
          style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)' }}
        >
          Phinehas Newman · 2026
        </span>
        <span
          style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)' }}
        >
          Accra, Ghana
        </span>
      </footer>
    </main>
  )
}
