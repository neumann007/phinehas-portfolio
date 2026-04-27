'use client'

import Link from 'next/link'

const projects = [
  {
    id: 1,
    title: 'Privacy-First Drug Distribution',
    description:
      'Blockchain-based system decoupling HIV patient identity from distribution records. Built to remove stigma from HIV treatment entirely.',
    category: 'Blockchain · Healthcare',
    stack: ['Blockchain', 'Django', 'React', 'PostgreSQL'],
    year: '2024',
    type: 'solo' as const,
    link: null
  },
  {
    id: 2,
    title: 'VedaTrace Observability SDK',
    description:
      'Python SDK for vedatrace.dev enabling developers to instrument their applications with distributed tracing. Clean API, minimal setup, production-ready from day one.',
    category: 'Python · Developer Tools',
    stack: ['Python', 'FastAPI', 'SDK'],
    year: '2024',
    type: 'collaborated' as const,
    link: 'https://vedatrace.dev'
  },
  {
    id: 3,
    title: 'Token Burn Alert — VS Code',
    description:
      'VS Code extension that monitors context window usage in real time and alerts developers before they burn tokens unnecessarily.',
    category: 'TypeScript · AI Tools',
    stack: ['TypeScript', 'VS Code API'],
    year: '2025',
    type: 'solo' as const,
    link: null
  },
  {
    id: 4,
    title: 'Scrive',
    description:
      'Visual project scaffolding tool. Design your architecture, choose your stack, set your conventions — download a production-ready project structure in seconds.',
    category: 'Developer Tool',
    stack: ['Next.js', 'TypeScript', 'Supabase'],
    year: '2025',
    type: 'solo' as const,
    link: 'https://scrive.dev'
  }
]

type Project = typeof projects[0]

function ProjectCard ({
  project,
  side
}: {
  project: Project
  side: 'left' | 'right'
}) {
  return (
    <div
      style={{
        border: '0.5px solid var(--border)',
        borderRadius: '12px',
        padding: '1.25rem',
        background: 'var(--bg-secondary)',
        width: '100%',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        textAlign: side === 'right' ? 'left' : 'left'
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--teal)'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 4px 20px rgba(15,110,86,0.1)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
      }}
    >
      {/* Top row — category + year */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '0.75rem',
          gap: '0.5rem'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--text-tertiary)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            lineHeight: 1.4
          }}
        >
          {project.category}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--teal)',
            fontWeight: 600,
            flexShrink: 0
          }}
        >
          {project.year}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: '16px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
          lineHeight: 1.3
        }}
      >
        {project.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          lineHeight: 1.75,
          marginBottom: '1rem'
        }}
      >
        {project.description}
      </p>

      {/* Stack tags */}
      <div
        style={{
          display: 'flex',
          gap: '0.4rem',
          flexWrap: 'wrap',
          marginBottom: project.link ? '0.75rem' : '0'
        }}
      >
        {project.stack.map(s => (
          <span
            key={s}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-tertiary)',
              background: 'var(--bg)',
              border: '0.5px solid var(--border)',
              borderRadius: '4px',
              padding: '2px 6px'
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* Link */}
      {project.link && (
        <a
          href={project.link}
          target='_blank'
          rel='noopener noreferrer'
          style={{
            fontSize: '11px',
            color: 'var(--teal)',
            textDecoration: 'none',
            borderBottom: '1px solid var(--teal)',
            paddingBottom: '1px'
          }}
        >
          {project.link.replace('https://', '')} ↗
        </a>
      )}
    </div>
  )
}

export default function Projects () {
  return (
    <main style={{ paddingTop: '72px' }}>
      {/* Page header */}
      <section
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '4rem 1.5rem 3rem'
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            marginBottom: '1.25rem'
          }}
        >
          Projects
        </p>
        <h1
          style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: '0.75rem'
          }}
        >
          Things I&apos;ve built.
        </h1>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: 1.7
          }}
        >
          A timeline of everything — solo and collaborative.
        </p>
      </section>

      {/* Thin divider */}
      <div
        style={{
          height: '0.5px',
          background: 'var(--border)',
          margin: '0 1.5rem'
        }}
      />

      {/* Timeline */}
      <section
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '3rem 1.5rem 4rem'
        }}
      >
        {/* Column headers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 40px 1fr',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ paddingRight: '1.5rem', textAlign: 'right' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--teal)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            >
              Solo Built
            </span>
          </div>
          <div />
          <div style={{ paddingLeft: '1.5rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--teal)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            >
              Collaborated
            </span>
          </div>
        </div>

        {/* Timeline rows */}
        {projects.map(project => (
          <div
            key={project.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 40px 1fr',
              marginBottom: '2rem',
              alignItems: 'center'
            }}
          >
            {/* Left column — solo only */}
            <div style={{ paddingRight: '1.5rem' }}>
              {project.type === 'solo' ? (
                <ProjectCard project={project} side='left' />
              ) : (
                <div />
              )}
            </div>

            {/* Center — dot + line */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                alignSelf: 'stretch',
                position: 'relative'
              }}
            >
              {/* Top line */}
              <div
                style={{
                  width: '1px',
                  flex: 1,
                  background: 'var(--border)',
                  minHeight: '24px'
                }}
              />
              {/* Dot */}
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'var(--teal)',
                  border: '2px solid var(--bg)',
                  flexShrink: 0,
                  zIndex: 1
                }}
              />
              {/* Bottom line */}
              <div
                style={{
                  width: '1px',
                  flex: 1,
                  background: 'var(--border)',
                  minHeight: '24px'
                }}
              />
            </div>

            {/* Right column — collaborated only */}
            <div style={{ paddingLeft: '1.5rem' }}>
              {project.type === 'collaborated' ? (
                <ProjectCard project={project} side='right' />
              ) : (
                <div />
              )}
            </div>
          </div>
        ))}
      </section>

      {/* What's next */}
      <div
        style={{
          height: '0.5px',
          background: 'var(--border)',
          margin: '0 1.5rem'
        }}
      />
      <section
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '3rem 1.5rem'
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            marginBottom: '1rem'
          }}
        >
          What&apos;s next
        </p>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: 1.8,
            maxWidth: '480px',
            marginBottom: '1rem'
          }}
        >
          Always building. If you&apos;re working on something that should exist
          — I want to hear about it.
        </p>
        <Link
          href='/about'
          style={{
            fontSize: '13px',
            color: 'var(--teal)',
            textDecoration: 'none',
            borderBottom: '1px solid var(--teal)',
            paddingBottom: '1px'
          }}
        >
          Get in touch →
        </Link>
      </section>

      {/* Footer */}
      <footer
        style={{
          maxWidth: '960px',
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

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 640px) {
          .timeline-grid {
            grid-template-columns: 1fr !important;
          }
          .timeline-center {
            display: none !important;
          }
          .timeline-right {
            padding-left: 0 !important;
          }
          .timeline-left {
            padding-right: 0 !important;
          }
        }
      `}</style>
    </main>
  )
}
