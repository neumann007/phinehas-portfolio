'use client'

import { useState, useEffect, useCallback } from 'react'
import { experiments, Annotation } from '@/lib/lab-experiments'

type Phase = 'brief' | 'naive' | 'expert' | 'verdict'

// ── Syntax highlighter ────────────────────────────────────────────────────────

const KEYWORDS = new Set([
  'import','from','export','default','function','const','let','var',
  'return','if','else','for','while','class','extends','new','this',
  'async','await','try','catch','throw','type','interface','enum',
  'true','false','null','undefined','void','any','string','number',
  'boolean','readonly','static','public','private','protected',
  'def','pass','lambda','global','nonlocal','yield','with','as',
  'in','not','and','or','is','None','True','False',
  'func','package','go','defer','chan','select','range','make',
  'append','len','cap','struct',
  'fn','mut','use','pub','mod','impl','trait','where',
  'match','Some','Ok','Err','self','Self','super',
])

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function highlightLine(line: string): string {
  const hiIdx = (() => {
    const h = line.indexOf('#')
    const s = line.indexOf('//')
    if (h >= 0 && (s < 0 || h < s)) return h
    return s
  })()
  const body = hiIdx >= 0 ? line.slice(0, hiIdx) : line
  const comment = hiIdx >= 0 ? line.slice(hiIdx) : ''
  const hl = body.replace(
    /(["'`])(?:(?!\1)[^\\]|\\.)*?\1|\b\d+(?:\.\d+)?\b|@[a-zA-Z_]\w*|\b[a-zA-Z_]\w*\b/g,
    m => {
      if (/^["'`]/.test(m)) return `<span class="hl-s">${escapeHtml(m)}</span>`
      if (/^\d/.test(m))    return `<span class="hl-n">${escapeHtml(m)}</span>`
      if (/^@/.test(m))     return `<span class="hl-d">${escapeHtml(m)}</span>`
      if (KEYWORDS.has(m))  return `<span class="hl-k">${escapeHtml(m)}</span>`
      if (/^[A-Z]/.test(m)) return `<span class="hl-t">${escapeHtml(m)}</span>`
      return escapeHtml(m)
    },
  )
  return hl + (comment ? `<span class="hl-c">${escapeHtml(comment)}</span>` : '')
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TheLab() {
  const [expIndex, setExpIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('brief')
  const [displayed, setDisplayed] = useState('')
  const [visible, setVisible] = useState(true)
  const [shownAnnotations, setShownAnnotations] = useState<number[]>([])

  const exp = experiments[expIndex]
  const act = phase === 'naive' ? exp.naive : phase === 'expert' ? exp.expert : null

  const fadeIn = useCallback((cb: () => void) => {
    setVisible(false)
    setTimeout(() => { cb(); setVisible(true) }, 450)
  }, [])

  // Brief + verdict hold timers
  useEffect(() => {
    if (phase === 'brief') {
      setDisplayed('')
      setShownAnnotations([])
      const t = setTimeout(() => fadeIn(() => setPhase('naive')), 6000)
      return () => clearTimeout(t)
    }
    if (phase === 'verdict') {
      const t = setTimeout(() => fadeIn(() => {
        setExpIndex(i => (i + 1) % experiments.length)
        setPhase('brief')
      }), 7000)
      return () => clearTimeout(t)
    }
  }, [expIndex, phase, fadeIn])

  // Typing for naive + expert
  useEffect(() => {
    if (phase !== 'naive' && phase !== 'expert') return
    const currentAct = phase === 'naive' ? exp.naive : exp.expert
    const full = currentAct.code
    setDisplayed('')
    setShownAnnotations([])

    let i = 0
    const iv = setInterval(() => {
      i++
      if (i > full.length) {
        clearInterval(iv)
        currentAct.annotations.forEach((_, idx) => {
          setTimeout(() => setShownAnnotations(prev => [...prev, idx]), (idx + 1) * 650)
        })
        const hold = currentAct.annotations.length * 650 + 2200
        const next: Phase = phase === 'naive' ? 'expert' : 'verdict'
        setTimeout(() => fadeIn(() => setPhase(next)), hold)
        return
      }
      setDisplayed(full.slice(0, i))
    }, 28)

    return () => clearInterval(iv)
  }, [expIndex, phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const displayedLines = displayed.split('\n')
  const lineCount = displayedLines.length
  const activeAnnotations: Annotation[] =
    act ? shownAnnotations.map(i => act.annotations[i]).filter(Boolean) : []

  const titlebarFile =
    phase === 'brief'   ? 'overview.md'      :
    phase === 'naive'   ? exp.naive.filename  :
    phase === 'expert'  ? exp.expert.filename :
                          'verdict.md'

  return (
    <section className="the-lab">

      {/* tag strip */}
      <div className="lab-tracker">
        <span className="lab-tracker__counter">The Lab</span>
        <span className="lab-tracker__tag">{exp.tag}</span>
      </div>

      {/* IDE window */}
      <div
        className="lab-ide"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.45s ease' }}
      >
        {/* titlebar */}
        <div className="lab-titlebar">
          <div className="lab-titlebar__dots">
            <span className="lab-dot" style={{ background: '#FF5F57' }} />
            <span className="lab-dot" style={{ background: '#FEBC2E' }} />
            <span className="lab-dot" style={{ background: '#28C840' }} />
          </div>
          <span className="lab-titlebar__file">{titlebarFile}</span>
          <span className={`lab-phase-badge lab-phase-badge--${phase}`}>{phase}</span>
        </div>

        {/* brief */}
        {phase === 'brief' && (
          <div className="lab-brief">
            <p className="lab-brief__num">Experiment {String(exp.number).padStart(2, '0')}</p>
            <h3 className="lab-brief__title">{exp.title}</h3>
            <p className="lab-brief__text">{exp.brief}</p>
          </div>
        )}

        {/* code view */}
        {(phase === 'naive' || phase === 'expert') && act && (
          <div className="lab-code-view">
            <div className="lab-gutter">
              {displayedLines.map((_, i) => {
                const n = i + 1
                const isActive = act.annotations.some(
                  (a, idx) => a.line === n && shownAnnotations.includes(idx),
                )
                return (
                  <div
                    key={n}
                    className={`lab-line-num${isActive ? ' lab-line-num--marked' : ''}`}
                  >
                    {n}
                  </div>
                )
              })}
            </div>
            <div className="lab-code-scroll">
              <pre className="lab-pre">
                {displayedLines.map((line, i) => {
                  const n = i + 1
                  const isActive = act.annotations.some(
                    (a, idx) => a.line === n && shownAnnotations.includes(idx),
                  )
                  const isLast = i === displayedLines.length - 1
                  return (
                    <div
                      key={n}
                      className={`lab-code-line${isActive ? ' lab-code-line--marked' : ''}`}
                    >
                      <code
                        dangerouslySetInnerHTML={{
                          __html:
                            highlightLine(line) +
                            (isLast ? '<span class="lab-cursor">▋</span>' : ''),
                        }}
                      />
                    </div>
                  )
                })}
              </pre>
            </div>
          </div>
        )}

        {/* verdict */}
        {phase === 'verdict' && (
          <div className="lab-verdict">
            <svg
              className="lab-verdict__check"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p className="lab-verdict__text">{exp.verdict}</p>
          </div>
        )}

        {/* statusbar */}
        <div className="lab-statusbar">
          <span className="lab-status lab-status--branch">⎇  feat/performance</span>
          <span className={`lab-status lab-status--phase lab-status--${phase}`}>
            {phase === 'naive' ? '⚠ naive' : phase === 'expert' ? '✓ expert' : phase}
          </span>
          <span className="lab-status lab-status--right">
            {act ? act.language : 'markdown'}
          </span>
          {(phase === 'naive' || phase === 'expert') && (
            <span className="lab-status lab-status--right">Ln {lineCount}</span>
          )}
        </div>
      </div>

      {/* annotation pills */}
      {activeAnnotations.length > 0 && (
        <div className="lab-annotations">
          {activeAnnotations.map((ann, i) => (
            <div key={i} className={`lab-annotation lab-annotation--${ann.type}`}>
              <div className="lab-annotation__header">
                <span className="lab-annotation__icon">{ann.type === 'warning' ? '⚠' : '●'}</span>
                <span className="lab-annotation__short">{ann.short}</span>
                <span className="lab-annotation__line">L{ann.line}</span>
              </div>
              <p className="lab-annotation__detail">{ann.detail}</p>
            </div>
          ))}
        </div>
      )}

    </section>
  )
}
