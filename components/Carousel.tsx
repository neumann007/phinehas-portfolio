'use client'

import { useEffect, useState } from 'react'

const slides = [
  {
    number: '01',
    category: 'Developer tool',
    title: 'Scrive',
    description:
      'Visual project scaffolding. Design your architecture, choose your stack, set your conventions — download a production-ready project structure in seconds.',
    link: 'https://scrive.dev',
    linkLabel: 'scrive.dev ↗',
    url: 'scrive.dev',
    screen: 'scrive',
  },
  {
    number: '02',
    category: 'Opportunity tool',
    title: 'FLINT',
    description:
      `Built for African creatives. Your story already qualifies you for more than you know. Answer 7 questions — discover what you've earned.`,
    link: null,
    linkLabel: 'In portfolio',
    url: 'phinehas.xyz/#flint',
    screen: 'flint',
  },
  {
    number: '03',
    category: 'Interactive globe',
    title: 'ECHOES',
    description:
      `A living globe of signals. Every visitor leaves a trace — what they're building, what they can't stop thinking about.`,
    link: null,
    linkLabel: 'In portfolio',
    url: 'phinehas.xyz/#echoes',
    screen: 'echoes',
  },
]

function ScriveMockup() {
  return (
    <div style={{ background: '#000', padding: '2rem 1.5rem', minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{ position: 'absolute', width: '3px', height: '3px', borderRadius: '50%', background: '#2dd4bf', opacity: 0.25, top: `${[15, 30, 65, 75, 45][i]}%`, left: `${[10, 80, 20, 85, 50][i]}%` }} />
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
        <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
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
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'white', letterSpacing: '0.35em' }}>SCRIVE</span>
      </div>
      <p style={{ fontSize: '20px', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '4px' }}>Before you build —</p>
      <p style={{ fontSize: '20px', fontWeight: 900, color: '#2dd4bf', lineHeight: 1.1, marginBottom: '1.5rem' }}>you scrive.</p>
      <div style={{ display: 'flex', width: '240px' }}>
        <div style={{ flex: 1, border: '0.5px solid #333', borderRight: 'none', padding: '8px 12px' }}>
          <span style={{ fontSize: '10px', color: '#555' }}>your@email.com</span>
        </div>
        <div style={{ background: '#2dd4bf', padding: '8px 12px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#000' }}>NOTIFY ME →</span>
        </div>
      </div>
      <p style={{ fontSize: '9px', color: '#444', marginTop: '8px' }}>Join 2 developers already waiting.</p>
    </div>
  )
}

function FlintMockup() {
  return (
    <div style={{ background: '#0a0a0a', padding: '2rem 1.5rem', minHeight: '200px' }}>
      <div style={{ maxWidth: '320px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          <div style={{ width: '20px', height: '20px', background: '#2dd4bf', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '6px', height: '6px', background: '#000' }} />
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'white', letterSpacing: '0.2em' }}>FLINT</span>
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: '9px', color: '#555', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>STEP 2 OF 7 · PROFILE INTERVIEW</p>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>{`Walk me through something you made that you're genuinely proud of.`}</p>
        <p style={{ fontSize: '10px', color: '#555', marginBottom: '1rem' }}>Tell the story — not the spec</p>
        <textarea style={{ width: '100%', background: '#111', border: '0.5px solid #222', borderBottom: '1px solid #2dd4bf', color: '#ccc', fontSize: '11px', padding: '10px', resize: 'none', height: '55px', fontFamily: 'inherit', outline: 'none' }} placeholder="I built a drug distribution system for..." readOnly />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
          <div style={{ background: '#2dd4bf', padding: '6px 14px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#000' }}>Continue →</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '3px', marginTop: '1rem' }}>
          {[...Array(7)].map((_, i) => (
            <div key={i} style={{ height: '2px', flex: 1, background: i < 2 ? '#2dd4bf' : '#1a3a2a', borderRadius: '2px' }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function EchoesMockup() {
  return (
    <div style={{ background: '#020c06', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <svg width="280" height="200" viewBox="0 0 280 200">
        <defs>
          <radialGradient id="g" cx="45%" cy="40%">
            <stop offset="0%" stopColor="#0d2a1a"/>
            <stop offset="100%" stopColor="#020c06"/>
          </radialGradient>
        </defs>
        <circle cx="140" cy="100" r="70" fill="url(#g)" stroke="#0d3320" strokeWidth="1"/>
        <ellipse cx="140" cy="100" rx="38" ry="70" fill="none" stroke="#0a2015" strokeWidth="0.5"/>
        <ellipse cx="140" cy="100" rx="70" ry="22" fill="none" stroke="#0a2015" strokeWidth="0.5"/>
        <circle cx="102" cy="80" r="3.5" fill="#2dd4bf" opacity="0.9"/>
        <circle cx="102" cy="80" r="7" fill="#2dd4bf" opacity="0.15"/>
        <circle cx="158" cy="92" r="3" fill="#2dd4bf" opacity="0.8"/>
        <circle cx="125" cy="115" r="3.5" fill="#2dd4bf" opacity="0.85"/>
        <circle cx="172" cy="108" r="2.5" fill="#2dd4bf" opacity="0.7"/>
        <circle cx="138" cy="82" r="2" fill="#2dd4bf" opacity="0.6"/>
        <line x1="102" y1="80" x2="158" y2="92" stroke="#2dd4bf" strokeWidth="0.5" opacity="0.2"/>
        <line x1="125" y1="115" x2="158" y2="92" stroke="#2dd4bf" strokeWidth="0.5" opacity="0.15"/>
        <circle cx="140" cy="100" r="71" fill="none" stroke="#020c06" strokeWidth="12" opacity="0.9"/>
      </svg>
      <div style={{ position: 'absolute', bottom: '12px', left: '16px' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '9px', color: '#2dd4bf', letterSpacing: '0.06em' }}>7 echoes · 4 countries · 1 connection</p>
      </div>
    </div>
  )
}

export default function Carousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  const slide = slides[current]

  return (
    <div>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', color: 'var(--text-tertiary)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            {slide.number} · {slide.category}
          </p>
          <h3 className="serif" style={{ fontSize: '22px', fontWeight: 700, marginBottom: '0.75rem' }}>
            {slide.title}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
            {slide.description}
          </p>
          {slide.link ? (
            <a href={slide.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--teal)', borderBottom: '1px solid var(--teal)', paddingBottom: '1px', textDecoration: 'none' }}>
              {slide.linkLabel}
            </a>
          ) : (
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>{slide.linkLabel}</span>
          )}
        </div>

        {/* Browser mockup */}
        <div style={{ width: '320px', flexShrink: 0, background: '#1a1a1a', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ background: '#2a2a2a', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }} />
            <div style={{ flex: 1, background: '#1a1a1a', borderRadius: '4px', padding: '3px 10px', marginLeft: '8px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '9px', color: '#555', letterSpacing: '0.04em' }}>{slide.url}</span>
            </div>
          </div>
          <div style={{ transition: 'opacity 0.3s ease' }}>
            {slide.screen === 'scrive' && <ScriveMockup />}
            {slide.screen === 'flint' && <FlintMockup />}
            {slide.screen === 'echoes' && <EchoesMockup />}
          </div>
        </div>

      </div>

      {/* Dot navigation */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '1.5rem', alignItems: 'center' }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? '20px' : '6px',
              height: '6px',
              borderRadius: i === current ? '3px' : '50%',
              background: i === current ? 'var(--teal)' : 'var(--border)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.2s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}