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

function highlight(code: string): string {
  return code.split('\n').map(highlightLine).join('\n')
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
      const t = setTimeout(() => fadeIn(() => setPhase('naive')), 10000)
      return () => clearTimeout(t)
    }
    if (phase === 'verdict') {
      const t = setTimeout(() => fadeIn(() => {
        setExpIndex(i => (i + 1) % experiments.length)
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

    let i = 0
    const iv = setInterval(() => {
      i++
      if (i > full.length) {
        clearInterval(iv)
        currentAct.annotations.forEach((_, idx) => {
          setTimeout(() => setShownAnnotations(prev => [...prev, idx]), (idx + 1) * 650)
        })
        const next: Phase = phase === 'naive' ? 'expert' : 'verdict'
        setTimeout(() => fadeIn(() => setPhase(next)), 14000)
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

  const tabFilename =
    phase === 'naive'  ? exp.naive.filename  :
    phase === 'expert' ? exp.expert.filename :
                         'overview.md'

  const statusMessage =
    phase === 'naive'   ? '⚠ naive approach'    :
    phase === 'expert'  ? '✓ expert refactor'    :
    phase === 'verdict' ? `verdict · ${exp.tag}` :
                          `experiment ${exp.number} of ${experiments.length}`

  return (
    <section className="the-lab">

      {/* tag strip */}
      <div className="lab-tracker">
        <span className="lab-tracker__counter">The Lab</span>
        <span className="lab-tracker__tag">{exp.tag}</span>
      </div>

      {/* IDE window — identical class structure to CodeTypewriter */}
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
          {(phase === 'brief' || phase === 'verdict') ? (
            <div className='lab-brief'>
              <p className='lab-brief__num'>
                {phase === 'verdict' ? `Verdict · ${exp.tag}` : exp.tag}
              </p>
              <h3 className='lab-brief__title'>{exp.title}</h3>
              <p className='lab-brief__text'>
                {phase === 'verdict' ? exp.verdict : exp.brief}
              </p>
            </div>
          ) : (
            act && (
              <>
                <div className='code-typewriter__lines' aria-hidden='true'>
                  {Array.from({ length: lineCount }, (_, i) => {
                    const lineNum = i + 1
                    const ann = act.annotations.find(
                      (a, idx) => a.line === lineNum && shownAnnotations.includes(idx),
                    )
                    return (
                      <div
                        key={lineNum}
                        className={`code-typewriter__line-number${ann ? ` code-typewriter__line-number--${ann.type}` : ''}`}
                      >
                        {lineNum}
                      </div>
                    )
                  })}
                </div>
                <code
                  className='code-typewriter__code'
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(displayed) +
                      '<span class="code-typewriter__cursor"></span>',
                  }}
                />
              </>
            )
          )}
        </div>

        {/* statusbar */}
        <div className='code-typewriter__statusbar'>
          <span className='code-typewriter__status-item code-typewriter__status-item--branch'>
            ⎇  feat/lab
          </span>
          <span className='code-typewriter__status-item code-typewriter__status-item--message'>
            {statusMessage}
          </span>
          <span className='code-typewriter__status-item code-typewriter__status-item--right'>
            {act ? act.language : 'markdown'}
          </span>
          {(phase === 'naive' || phase === 'expert') && (
            <span className='code-typewriter__status-item code-typewriter__status-item--right'>
              Ln {lineCount}
            </span>
          )}
        </div>

      </div>

      {/* annotation pills */}
      {activeAnnotations.length > 0 && (
        <div className='lab-annotations'>
          {activeAnnotations.map((ann, i) => (
            <div key={i} className={`lab-annotation lab-annotation--${ann.type}`}>
              <div className='lab-annotation__header'>
                <span className='lab-annotation__icon'>{ann.type === 'warning' ? '⚠' : '●'}</span>
                <span className='lab-annotation__short'>{ann.short}</span>
                <span className='lab-annotation__line'>L{ann.line}</span>
              </div>
              <p className='lab-annotation__detail'>{ann.detail}</p>
            </div>
          ))}
        </div>
      )}

    </section>
  )
}
