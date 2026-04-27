'use client'

import { useState } from 'react'

type Take = {
  id: string
  take: string
  reasoning: string
  tag: string
  date: string
  order_index: number
}

type Comment = {
  id: string
  take_id: string
  name: string
  comment: string
  created_at: string
}

type Props = {
  take: Take
  comments: Comment[]
}

type Status = 'idle' | 'loading' | 'success' | 'error'

function formatDate (iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export default function TakeCard ({ take, comments }: Props) {
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [nameFocused, setNameFocused] = useState(false)
  const [commentFocused, setCommentFocused] = useState(false)

  const charCount = comment.length

  async function handleSubmit (e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !comment.trim()) return

    setStatus('loading')

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ take_id: take.id, name, comment }),
      })

      if (!res.ok) {
        setStatus('error')
        return
      }

      setStatus('success')
      setName('')
      setComment('')
    } catch {
      setStatus('error')
    }
  }

  const inputBase: React.CSSProperties = {
    width: '100%',
    border: 'none',
    borderBottom: '0.5px solid var(--border)',
    padding: '8px 0',
    fontSize: '13px',
    background: 'transparent',
    color: 'var(--text-primary)',
    outline: 'none',
    fontFamily: 'inherit',
    letterSpacing: '-0.005em',
  }

  return (
    <div style={{ padding: '2.5rem 0' }}>

      {/* ── Tag + date ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--teal)',
          }}
        >
          {take.tag}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            letterSpacing: '0.04em',
          }}
        >
          {take.date}
        </span>
      </div>

      {/* ── The take ── */}
      <p
        style={{
          fontSize: 'clamp(18px, 2.5vw, 26px)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          color: 'var(--text-primary)',
          maxWidth: '680px',
        }}
      >
        {take.take}
      </p>

      {/* ── Reasoning ── */}
      <p
        style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          lineHeight: 1.8,
          maxWidth: '580px',
          marginTop: '0.75rem',
          letterSpacing: '-0.005em',
        }}
      >
        {take.reasoning}
      </p>

      {/* ── Comments ── */}
      {comments.length > 0 && (
        <div style={{ marginTop: '2rem', maxWidth: '580px' }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.1em',
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}
          >
            {comments.length} {comments.length === 1 ? 'take' : 'takes'}
          </p>
          {comments.map((c, i) => (
            <div key={c.id}>
              <div style={{ paddingBottom: '1rem' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '0.35rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {c.name}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--text-tertiary)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {formatDate(c.created_at)}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    letterSpacing: '-0.005em',
                  }}
                >
                  {c.comment}
                </p>
              </div>
              {i < comments.length - 1 && (
                <div
                  style={{
                    height: '0.5px',
                    background: 'var(--border)',
                    marginBottom: '1rem',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Comment form ── */}
      <div style={{ marginTop: '2rem', maxWidth: '480px' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
          }}
        >
          Leave your take
        </p>

        {status === 'success' ? (
          <p
            style={{
              fontSize: '13px',
              color: 'var(--teal)',
              letterSpacing: '-0.005em',
            }}
          >
            Take posted. It&apos;ll appear once approved.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type='text'
              placeholder='Your name'
              value={name}
              onChange={e => setName(e.target.value)}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              maxLength={60}
              required
              style={{
                ...inputBase,
                borderBottomColor: nameFocused ? 'var(--teal)' : 'var(--border)',
              }}
            />

            <textarea
              placeholder='Your take on this...'
              value={comment}
              onChange={e => setComment(e.target.value)}
              onFocus={() => setCommentFocused(true)}
              onBlur={() => setCommentFocused(false)}
              maxLength={500}
              required
              style={{
                ...inputBase,
                display: 'block',
                marginTop: '1rem',
                height: '60px',
                resize: 'none',
                borderBottomColor: commentFocused ? 'var(--teal)' : 'var(--border)',
              }}
            />

            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: charCount > 450 ? 'var(--teal)' : 'var(--text-tertiary)',
                letterSpacing: '0.04em',
                marginTop: '0.4rem',
                textAlign: 'right',
              }}
            >
              {charCount} / 500
            </p>

            {status === 'error' && (
              <p
                style={{
                  fontSize: '12px',
                  color: '#e53e3e',
                  marginTop: '0.5rem',
                  letterSpacing: '-0.005em',
                }}
              >
                Something went wrong. Try again.
              </p>
            )}

            <button
              type='submit'
              disabled={status === 'loading'}
              style={{
                border: '1px solid var(--teal)',
                color: 'var(--teal)',
                background: 'transparent',
                padding: '8px 18px',
                fontSize: '12px',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                marginTop: '1rem',
                opacity: status === 'loading' ? 0.6 : 1,
                letterSpacing: '-0.005em',
                fontFamily: 'inherit',
              }}
            >
              {status === 'loading' ? 'Posting...' : 'Leave your take →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
