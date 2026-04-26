import Carousel from '@/components/Carousel'

const projects = [
  {
    number: '01',
    category: 'Blockchain · Healthcare',
    title: 'Privacy-First Drug Distribution',
    description:
      'HIV patients face a painful choice — get medication and risk being seen, or protect privacy and miss treatment. I built a blockchain-based system that removes that choice entirely. Patient identity is decoupled from distribution records. The stigma has nowhere to attach.',
    stack: ['Blockchain', 'Django', 'React', 'PostgreSQL'],
    link: null as string | null,
    linkLabel: null as string | null,
  },
  {
    number: '02',
    category: 'Python · Developer Tools',
    title: 'VedaTrace Observability SDK',
    description:
      'Wrote the Python SDK for vedatrace.dev — enabling developers to instrument their applications with distributed tracing. Clean API, minimal setup, production-ready from day one.',
    stack: ['Python', 'FastAPI', 'SDK', 'Observability'],
    link: 'https://vedatrace.dev',
    linkLabel: 'vedatrace.dev ↗',
  },
  {
    number: '03',
    category: 'TypeScript · AI Tools',
    title: 'Token Burn Alert — VS Code Extension',
    description:
      "Most developers don't realize how much context they're burning until it's too late. A VS Code plugin that monitors context window usage in real time and alerts before unnecessary token loss.",
    stack: ['TypeScript', 'VS Code API', 'AI tools'],
    link: null as string | null,
    linkLabel: null as string | null,
  },
]

export default function Work () {
  return (
    <main style={{ paddingTop: '52px' }}>

      {/* CURRENTLY BUILDING */}
      <section
        style={{
          maxWidth: '960px',
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

      {/* SELECTED WORK */}
      <section
        style={{
          maxWidth: '960px',
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
            marginBottom: '3.5rem'
          }}
        >
          Selected work
        </p>

        {projects.map((project, index) => (
          <div key={project.number}>
            {index > 0 && (
              <div
                style={{
                  height: '0.5px',
                  background: 'var(--border)',
                  margin: '3.5rem 0'
                }}
              />
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr',
                gap: '0 2.5rem',
                alignItems: 'start'
              }}
            >
              {/* Number */}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-tertiary)',
                  paddingTop: '3px',
                  letterSpacing: '0.05em'
                }}
              >
                {project.number}
              </span>

              {/* Content */}
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    color: 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                    marginBottom: '0.85rem'
                  }}
                >
                  {project.category}
                </p>
                <h2
                  style={{
                    fontSize: 'clamp(22px, 3vw, 28px)',
                    fontWeight: 700,
                    letterSpacing: '-0.025em',
                    lineHeight: 1.15,
                    marginBottom: '1rem'
                  }}
                >
                  {project.title}
                </h2>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.85,
                    maxWidth: '580px',
                    marginBottom: '1.5rem'
                  }}
                >
                  {project.description}
                </p>

                {/* Stack + link row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1.5rem'
                  }}
                >
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-tertiary)',
                      letterSpacing: '0.02em'
                    }}
                  >
                    {project.stack.join(' · ')}
                  </p>
                  {project.link ? (
                    <a
                      href={project.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      style={{
                        fontSize: '12px',
                        color: 'var(--teal)',
                        borderBottom: '1px solid var(--teal)',
                        paddingBottom: '1px',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}
                    >
                      {project.linkLabel}
                    </a>
                  ) : (
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-tertiary)',
                        fontStyle: 'italic',
                        flexShrink: 0
                      }}
                    >
                      No live link
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* FOOTER */}
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
