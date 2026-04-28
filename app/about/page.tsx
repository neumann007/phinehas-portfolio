'use client'

import Link from 'next/link'

export default function About () {
  const stack = {
    left: ['Django', 'FastAPI', 'PostgreSQL', 'Docker', 'Python'],
    right: ['React', 'Next.js', 'TypeScript', 'DevOps', 'Git & CI/CD']
  }

  return (
    <main className='page'>
      {/* Header */}
      <div className='about-header'>
        <p className='mono' style={{ marginBottom: '1.25rem' }}>
          About
        </p>
        <h1 className='heading-lg' style={{ marginBottom: '0.75rem' }}>
          Phinehas Ebigya Newman Quarshie
        </h1>
        <p className='text-sm'>
          Full-stack engineer · Accra, Ghana · Open to work
        </p>
      </div>

      <div className='divider' />

      {/* Story */}
      <div className='about-section'>
        <p className='mono' style={{ marginBottom: '1.5rem' }}>
          Story
        </p>
        <p
          className='text-body'
          style={{ maxWidth: '620px', marginBottom: '1.25rem' }}
        >
          I build things that should exist. Not because someone asked — because
          I looked around and noticed the gap. The drug system nobody built for
          HIV patients who deserve privacy. The observability tool that needed a
          better SDK. The VS Code plugin that saves developers from burning
          tokens they didn&apos;t know they were wasting.
        </p>
        <p className='text-body' style={{ maxWidth: '620px' }}>
          I&apos;ve been building for 3 years across the full stack — Django,
          FastAPI, React, Next.js, PostgreSQL — and deep into DevOps because I
          believe the way software runs is just as important as the way
          it&apos;s written. I&apos;m based in Accra, Ghana. Currently open to
          full-stack, backend, frontend, DevOps, and product engineering roles.
        </p>
      </div>

      <div className='divider' />

      {/* Belief */}
      <div className='about-section'>
        <p className='mono' style={{ marginBottom: '1.5rem' }}>
          Belief
        </p>
        <h2
          className='heading-md'
          style={{ maxWidth: '600px', marginBottom: '1rem', lineHeight: 1.4 }}
        >
          &ldquo;Software development is like childbirth. It&apos;ll cost you
          now. You reap years later.&rdquo;
        </h2>
        <p className='mono'>— Phinehas Newman</p>
      </div>

      <div className='divider' />

      {/* Stack */}
      <div className='about-section'>
        <p className='mono' style={{ marginBottom: '1.5rem' }}>
          Stack
        </p>
        <div className='stack-grid'>
          {stack.left.map((item, i) => (
            <div key={item} className='stack-item'>
              <div className='stack-dot' />
              {item}
            </div>
          ))}
          {stack.right.map((item, i) => (
            <div key={item} className='stack-item'>
              <div className='stack-dot' />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className='divider' />

      {/* FLINT */}
      <div className='about-section'>
        <p className='mono' style={{ marginBottom: '1.5rem' }}>
          FLINT — Opportunity Finder
        </p>
        <div className='flint-section'>
          <div className='flint-section__content'>
            <h2
              className='heading-sm'
              style={{
                maxWidth: '360px',
                marginBottom: '1rem',
                lineHeight: 1.4
              }}
            >
              Your story already qualifies you for more than you know.
            </h2>
            <p
              className='text-body'
              style={{ maxWidth: '400px', marginBottom: '1.5rem' }}
            >
              Built for African creatives. Answer 7 questions about who you are
              and what you&apos;ve built. FLINT reveals the opportunities you
              didn&apos;t know existed.
            </p>
            <button className='btn-ghost'>Try FLINT →</button>
          </div>
          <div className='flint-placeholder'>
            <span className='mono mono--teal'>FLINT TOOL</span>
            <span className='mono' style={{ marginTop: '4px' }}>
              Coming soon
            </span>
          </div>
        </div>
      </div>

      <div className='divider' />

      {/* Contact */}
      <div className='about-section'>
        <p className='mono' style={{ marginBottom: '1.5rem' }}>
          Contact
        </p>
        <h2 className='heading-lg' style={{ marginBottom: '1rem' }}>
          Let&apos;s build something.
        </h2>
        <p
          className='text-body'
          style={{ maxWidth: '480px', marginBottom: '2rem' }}
        >
          Open to full-stack, backend, frontend, DevOps, and product engineering
          roles. If you&apos;re working on something that should exist — I want
          to hear about it.
        </p>
        <div className='contact-table'>
          <div className='contact-row'>
            <span className='text-sm'>Email</span>
            <a href='mailto:phinehasnewman@gmail.com' className='link-teal'>
              phinehasnewman@gmail.com ↗
            </a>
          </div>
          <div className='contact-row'>
            <span className='text-sm'>GitHub</span>
            <a
              href='https://github.com/neumann007'
              target='_blank'
              rel='noopener noreferrer'
              className='link-muted'
            >
              github.com/neumann007 ↗
            </a>
          </div>
          <div className='contact-row'>
            <span className='text-sm'>LinkedIn</span>
            <a
              href='https://linkedin.com/in/phinehas-newman-6b2957165'
              target='_blank'
              rel='noopener noreferrer'
              className='link-muted'
            >
              Phinehas Newman ↗
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className='footer'>
        <span className='mono'>Phinehas Newman · 2026</span>
        <span className='mono'>Accra, Ghana</span>
      </footer>
    </main>
  )
}
