'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { experiments } from '@/lib/lab-experiments'

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
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
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

function highlight(code: string): string {
  return code.split('\n').map(highlightLine).join('\n')
}

// ── Status bar data (keyed by language) ───────────────────────────────────────

const statusByLang: Record<string, string[]> = {
  python: [
    'FastAPI · Uvicorn running on port 8000',
    'Django · Migrations: 24 applied · 0 pending',
    'Celery · 3 workers active · Queue depth: 0',
    'Redis · Connected · 0ms latency',
  ],
  typescript: [
    'TypeScript · No type errors · ESLint clean',
    'Next.js · HMR active · Page compiled in 214ms',
    'React · 0 hook violations · Bundle: 142kb',
    'Vite · Dev server ready · Hot reload active',
  ],
  go: [
    'Go · go vet passed · No race conditions',
    'Go · goroutines: 4 · heap: 2.1 MB',
    'Go · Build succeeded · Binary: 6.2 MB',
  ],
  rust: [
    'Rust · cargo check · 0 warnings',
    'Rust · cargo build · Compiling (3/8 crates)',
    'Rust · Clippy clean · No unsafe blocks',
  ],
}

const branchByLang: Record<string, string[]> = {
  python:     ['feat/cache-layer', 'feat/auth', 'feat/task-queue', 'main'],
  typescript: ['feat/deck-ui', 'feat/animations', 'main'],
  go:         ['feat/worker-pool', 'feat/router', 'main'],
  rust:       ['feat/bloom-filter', 'main'],
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TheLab() {
  const shuffledExperiments = useMemo(() => {
    const arr = [...experiments]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [])

  const [expIndex, setExpIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('brief')
  const [displayed, setDisplayed] = useState('')
  const [visible, setVisible] = useState(true)
  const [cardVisible, setCardVisible] = useState(false)
  const [shownAnnotations, setShownAnnotations] = useState<number[]>([])
  const [showSummaryCard, setShowSummaryCard] = useState(false)
  const codeRef = useRef<HTMLElement>(null)
  const [linePositions, setLinePositions] = useState<number[]>([])
  const summaryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lineMeasurerRef = useRef<HTMLSpanElement | null>(null)

  const exp = shuffledExperiments[expIndex]
  const act = phase === 'naive' ? exp.naive : phase === 'expert' ? exp.expert : null

  const fadeIn = useCallback((cb: () => void) => {
    setVisible(false)
    setTimeout(() => { cb(); setVisible(true) }, 450)
  }, [])

  // Make card visible immediately after phase/experiment change
  useEffect(() => {
    setCardVisible(false)
    const t = setTimeout(() => setCardVisible(true), 50)
    return () => {
      clearTimeout(t)
      setCardVisible(false)
    }
  }, [phase, expIndex])

  // Brief + verdict hold timers
  useEffect(() => {
    if (phase === 'brief') {
      setDisplayed('')
      setShownAnnotations([])
      const t = setTimeout(() => fadeIn(() => setPhase('naive')), 10000)
      return () => clearTimeout(t)
    }
    if (phase === 'verdict') {
      const t = setTimeout(() => fadeIn(() => {
        setExpIndex(i => (i + 1) % shuffledExperiments.length)
        setPhase('brief')
      }), 10000)
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
    setShowSummaryCard(false)

    let i = 0
    const iv = setInterval(() => {
      i++
      if (i > full.length) {
        clearInterval(iv)
        currentAct.annotations.forEach((ann, idx) => {
          setTimeout(() => setShownAnnotations(prev => [...prev, ann.line]), (idx + 1) * 650)
        })
        const lastAnnDelay = (currentAct.annotations.length - 1) * 600 + 500
        summaryTimerRef.current = setTimeout(() => setShowSummaryCard(true), lastAnnDelay + 1200)
        const next: Phase = phase === 'naive' ? 'expert' : 'verdict'
        setTimeout(() => fadeIn(() => setPhase(next)), 14000)
        return
      }
      setDisplayed(full.slice(0, i))
    }, 120)

    return () => {
      clearInterval(iv)
      if (summaryTimerRef.current) clearTimeout(summaryTimerRef.current)
    }
  }, [expIndex, phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const displayedLines = displayed.split('\n')
  const lineCount = displayedLines.length

  // Measure actual pixel positions of each line from the DOM
  useEffect(() => {
    if (!codeRef.current) return
    const codeEl = codeRef.current
    const text = codeEl.textContent || ''
    const lines = text.split('\n')
    let measurer = lineMeasurerRef.current

    if (!measurer) {
      measurer = document.createElement('span')
      measurer.style.cssText =
        'position:absolute;visibility:hidden;white-space:pre;font-family:inherit;font-size:inherit;line-height:inherit;'
      lineMeasurerRef.current = measurer
    }

    if (measurer.parentElement !== codeEl) {
      codeEl.appendChild(measurer)
    }

    const paddingTop = parseFloat(getComputedStyle(codeEl).paddingTop) || 0
    const positions: number[] = [paddingTop]
    let cumulative = paddingTop

    for (let i = 0; i < lines.length - 1; i++) {
      measurer.textContent = lines[i] || ' '
      const lineH = measurer.getBoundingClientRect().height
      cumulative += lineH
      positions.push(cumulative)
    }

    setLinePositions(positions)
  }, [lineCount])

  useEffect(() => {
    return () => {
      const measurer = lineMeasurerRef.current
      if (measurer?.parentElement) {
        measurer.parentElement.removeChild(measurer)
      }
      lineMeasurerRef.current = null
    }
  }, [])

  const currentCol = displayedLines[displayedLines.length - 1].length + 1
  const lineHeight = linePositions.length > 1 ? linePositions[1] - linePositions[0] : 22

  // Always derive status bar data from experiment's naive language
  const lang = exp.naive.language
  const langLabel = lang.charAt(0).toUpperCase() + lang.slice(1)
  const langMessages = statusByLang[lang] ?? ['Ready']
  const langBranches = branchByLang[lang] ?? ['main']
  const currentMessage = langMessages[expIndex % langMessages.length]
  const currentBranch = langBranches[expIndex % langBranches.length]

  const tabFilename =
    phase === 'naive'  ? exp.naive.filename  :
    phase === 'expert' ? exp.expert.filename :
                         'overview.md'

  return (
    <section className="the-lab">

      {/* brief card */}
      {phase === 'brief' && (
        <div className={`lab-card${cardVisible ? ' lab-card--visible' : ''}`}>
          <p className='lab-brief__num'>{exp.tag}</p>
          <h3 className='lab-brief__title'>{exp.title}</h3>
          <p className='lab-brief__text'>{exp.brief}</p>
        </div>
      )}

      {/* verdict card */}
      {phase === 'verdict' && (
        <div className={`lab-verdict-card${visible ? ' lab-verdict-card--visible' : ''}`}>
          <div className='lab-verdict-card__eyebrow'>
            <span className='lab-verdict-card__icon'>◈</span>
            <span className='lab-verdict-card__label'>The Takeaway</span>
          </div>
          <blockquote className='lab-verdict-card__quote'>
            {exp.verdict}
          </blockquote>
          <div className='lab-verdict-card__footer'>
            <span className='lab-verdict-card__tag'>{exp.tag}</span>
          </div>
        </div>
      )}

      {/* phase cues */}
      {phase === 'naive' && (
        <div className='lab-phase-cue lab-phase-cue--naive'>
          <span className='lab-phase-cue__line' />
          <span className='lab-phase-cue__text'>Here's how most developers approach this...</span>
          <span className='lab-phase-cue__line' />
        </div>
      )}
      {phase === 'expert' && (
        <div className='lab-phase-cue lab-phase-cue--expert'>
          <span className='lab-phase-cue__line' />
          <span className='lab-phase-cue__text'>Here's how a senior engineer rewrites it...</span>
          <span className='lab-phase-cue__line' />
        </div>
      )}

      {/* IDE window — only during code phases */}
      {(phase === 'naive' || phase === 'expert') && act && (
        <div className={`code-typewriter${visible ? ' code-typewriter--visible' : ''}`}>

          {/* titlebar */}
          <div className='code-typewriter__titlebar'>
            <div className='code-typewriter__titlebar-dots'>
              <span className='code-typewriter__dot' style={{ background: '#FF5F57' }} />
              <span className='code-typewriter__dot' style={{ background: '#FEBC2E' }} />
              <span className='code-typewriter__dot' style={{ background: '#28C840' }} />
            </div>
            <span className='code-typewriter__titlebar-text'>phinehas — lab</span>
            <div />
          </div>

          {/* tabbar */}
          <div className='code-typewriter__tabbar'>
            <div className='code-typewriter__tab code-typewriter__tab--active'>
              <span className='code-typewriter__tab-dot' />
              {tabFilename}
            </div>
          </div>

          {/* body */}
          <div className='code-typewriter__body'>
            <div className='code-typewriter__lines' aria-hidden='true'>
              {Array.from({ length: lineCount }, (_, i) => {
                const lineNum = i + 1
                const ann = act.annotations.find(a => a.line === lineNum)
                const isHighlighted = ann && shownAnnotations.includes(lineNum)
                return (
                  <div
                    key={lineNum}
                    className={`code-typewriter__line-number${isHighlighted ? ` code-typewriter__line-number--${ann!.type}` : ''}`}
                    style={{ height: lineHeight || '1.7em' }}
                  >
                    {lineNum}
                  </div>
                )
              })}
            </div>
            <div className='code-typewriter__code-wrap'>
              {act.annotations
                .filter(ann => shownAnnotations.includes(ann.line))
                .map((ann, i) => (
                  <div
                    key={`hl-${i}`}
                    className={`code-typewriter__line-highlight code-typewriter__line-highlight--${ann.type}`}
                    style={{ top: linePositions[ann.line - 1] ?? 0, height: lineHeight }}
                  />
                ))}
              {/* Safe to inject: source text is developer-controlled in lib/lab-experiments.ts, and escapeHtml sanitizes tokens before highlight output. */}
              <code
                ref={codeRef}
                className='code-typewriter__code'
                dangerouslySetInnerHTML={{
                  __html:
                    highlight(displayed) +
                    '<span class="code-typewriter__cursor"></span>',
                }}
              />
              {act.annotations
                .filter(ann => shownAnnotations.includes(ann.line))
                .map((ann, i) => (
                  <div
                    key={i}
                    className={`lab-annotation lab-annotation--${ann.type}`}
                    style={{ top: linePositions[ann.line - 1] ?? 0 }}
                  >
                    <span className='lab-annotation__icon'>
                      {ann.type === 'warning' ? '⚠' : '✦'}
                    </span>
                    <span className='lab-annotation__short'>{ann.short}</span>
                    <div className='lab-annotation__detail'>
                      <div className='lab-annotation__detail-header'>
                        <span className='lab-annotation__detail-icon'>
                          {ann.type === 'warning' ? '⚠' : '✦'}
                        </span>
                        <span className='lab-annotation__detail-title'>
                          {ann.type === 'warning' ? 'Issue' : 'Insight'}
                          {' · '}Line {ann.line}
                        </span>
                      </div>
                      <p className='lab-annotation__detail-body'>{ann.detail}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* statusbar */}
          <div className='code-typewriter__statusbar'>
            <span className='code-typewriter__status-item code-typewriter__status-item--branch'>
              ⎇  {currentBranch}
            </span>
            <span className='code-typewriter__status-item code-typewriter__status-item--message'>
              {currentMessage}
            </span>
            <span className='code-typewriter__status-item code-typewriter__status-item--right'>
              {langLabel}
            </span>
            <span className='code-typewriter__status-item code-typewriter__status-item--right'>
              Ln {lineCount}, Col {currentCol}
            </span>
            <span className='code-typewriter__status-item code-typewriter__status-item--right'>
              UTF-8  LF
            </span>
          </div>

        </div>
      )}

      {/* summary card — auto-appears after all annotations shown */}
      {showSummaryCard && (phase === 'naive' || phase === 'expert') && act && (
        <div className={`lab-summary-card lab-summary-card--${phase}`}>
          <div className='lab-summary-card__header'>
            <span className='lab-summary-card__icon'>
              {phase === 'naive' ? '⚠' : '✦'}
            </span>
            <span className='lab-summary-card__title'>
              {phase === 'naive'
                ? `${act.annotations.length} issues found in this implementation`
                : `${act.annotations.length} engineering decisions that matter`
              }
            </span>
          </div>
          <ul className='lab-summary-card__list'>
            {act.annotations.map((ann, i) => (
              <li key={i} className='lab-summary-card__item'>
                <span className='lab-summary-card__item-line'>L{ann.line}</span>
                <div className='lab-summary-card__item-content'>
                  <span className='lab-summary-card__item-short'>{ann.short}</span>
                  <span className='lab-summary-card__item-detail'>{ann.detail}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

    </section>
  )
}
