'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Take = {
  id: string
  take: string
  reasoning: string
  tag: string
  date: string
  likes: number
  dislikes: number
}

type Comment = {
  id: string
  take_id: string
  name: string
  comment: string
  likes: number
  dislikes: number
  created_at: string
}

type Props = {
  take: Take
  comments: Comment[]
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

function getToken (): string {
  if (typeof window === 'undefined') return ''
  let token = localStorage.getItem('visitor_token')
  if (!token) {
    token = crypto.randomUUID()
    localStorage.setItem('visitor_token', token)
  }
  return token
}

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

export default function TakeDetail ({ take, comments }: Props) {
  const [takeLikes, setTakeLikes] = useState(take.likes ?? 0)
  const [takeDislikes, setTakeDislikes] = useState(take.dislikes ?? 0)
  const [takeReaction, setTakeReaction] = useState<'like' | 'dislike' | null>(null)
  const [commentReactions, setCommentReactions] = useState<Record<string, 'like' | 'dislike'>>({})
  const [commentLikes, setCommentLikes] = useState<Record<string, number>>(
    Object.fromEntries(comments.map(c => [c.id, c.likes ?? 0]))
  )
  const [commentDislikes, setCommentDislikes] = useState<Record<string, number>>(
    Object.fromEntries(comments.map(c => [c.id, c.dislikes ?? 0]))
  )
  const [copied, setCopied] = useState(false)
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [nameFocused, setNameFocused] = useState(false)
  const [commentFocused, setCommentFocused] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(`reactions_${take.id}`)
    if (stored === 'like' || stored === 'dislike') setTakeReaction(stored)

    const storedComments = localStorage.getItem(`comment_reactions_${take.id}`)
    if (storedComments) {
      try { setCommentReactions(JSON.parse(storedComments)) } catch { /* ignore */ }
    }
  }, [take.id])

  const handleTakeReaction = async (type: 'like' | 'dislike') => {
    const token = getToken()
    const isToggle = takeReaction === type
    const newReaction = isToggle ? null : type

    setTakeLikes(prev =>
      type === 'like'
        ? isToggle ? prev - 1 : prev + 1
        : takeReaction === 'like' ? prev - 1 : prev
    )
    setTakeDislikes(prev =>
      type === 'dislike'
        ? isToggle ? prev - 1 : prev + 1
        : takeReaction === 'dislike' ? prev - 1 : prev
    )
    setTakeReaction(newReaction)

    if (newReaction) {
      localStorage.setItem(`reactions_${take.id}`, newReaction)
    } else {
      localStorage.removeItem(`reactions_${take.id}`)
    }

    await fetch('/api/reactions/take', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ take_id: take.id, visitor_token: token, reaction: newReaction }),
    })
  }

  const handleCommentReaction = async (commentId: string, type: 'like' | 'dislike') => {
    const token = getToken()
    const current = commentReactions[commentId]
    const isToggle = current === type
    const newReaction = isToggle ? null : type

    setCommentLikes(prev => ({
      ...prev,
      [commentId]: type === 'like'
        ? isToggle ? prev[commentId] - 1 : prev[commentId] + 1
        : current === 'like' ? prev[commentId] - 1 : prev[commentId],
    }))
    setCommentDislikes(prev => ({
      ...prev,
      [commentId]: type === 'dislike'
        ? isToggle ? prev[commentId] - 1 : prev[commentId] + 1
        : current === 'dislike' ? prev[commentId] - 1 : prev[commentId],
    }))

    const updated = { ...commentReactions }
    if (newReaction) updated[commentId] = newReaction
    else delete updated[commentId]
    setCommentReactions(updated)
    localStorage.setItem(`comment_reactions_${take.id}`, JSON.stringify(updated))

    await fetch('/api/reactions/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment_id: commentId, visitor_token: token, reaction: newReaction }),
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !comment.trim()) return
    setSubmitStatus('loading')
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ take_id: take.id, name, comment }),
    })
    if (res.ok) {
      setSubmitStatus('success')
      setName('')
      setComment('')
    } else {
      setSubmitStatus('error')
    }
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${take.take}"`)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`

  const reactionBtn = (
    active: boolean,
    onClick: () => void,
    label: string,
  ): React.CSSProperties & { onClick: () => void; children?: never } => ({
    border: `1px solid ${active ? 'var(--teal)' : 'var(--border)'}`,
    background: active ? 'var(--teal)' : 'transparent',
    color: active ? 'white' : 'var(--text-secondary)',
    padding: '6px 14px',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
    onClick,
  } as React.CSSProperties & { onClick: () => void })

  const inputBase: React.CSSProperties = {
    width: '100%',
    border: 'none',
    padding: '8px 0',
    fontSize: '13px',
    background: 'transparent',
    color: 'var(--text-primary)',
    outline: 'none',
    fontFamily: 'inherit',
    letterSpacing: '-0.005em',
  }

  return (
    <section style={{ maxWidth: '960px', margin: '0 auto', padding: '4rem 1.5rem' }}>

      {/* ── Back link ── */}
      <Link
        href='/blog'
        style={{ fontSize: '12px', color: 'var(--text-tertiary)', textDecoration: 'none', display: 'inline-block', marginBottom: '3rem', letterSpacing: '-0.005em' }}
      >
        ← All takes
      </Link>

      {/* ── Tag + date ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--teal)' }}>
          {take.tag}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
          {take.date}
        </span>
      </div>

      {/* ── The take ── */}
      <p style={{ fontSize: 'clamp(24px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginTop: '1rem', marginBottom: '1.5rem', maxWidth: '720px' }}>
        {take.take}
      </p>

      {/* ── Reasoning ── */}
      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.85, maxWidth: '620px', letterSpacing: '-0.005em' }}>
        {take.reasoning}
      </p>

      {/* ── Reaction bar ── */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => handleTakeReaction('like')}
          style={{
            border: `1px solid ${takeReaction === 'like' ? 'var(--teal)' : 'var(--border)'}`,
            background: takeReaction === 'like' ? 'var(--teal)' : 'transparent',
            color: takeReaction === 'like' ? 'white' : 'var(--text-secondary)',
            padding: '6px 14px',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            fontFamily: 'inherit',
          }}
        >
          👍 {takeLikes}
        </button>
        <button
          onClick={() => handleTakeReaction('dislike')}
          style={{
            border: `1px solid ${takeReaction === 'dislike' ? 'var(--teal)' : 'var(--border)'}`,
            background: takeReaction === 'dislike' ? 'var(--teal)' : 'transparent',
            color: takeReaction === 'dislike' ? 'white' : 'var(--text-secondary)',
            padding: '6px 14px',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            fontFamily: 'inherit',
          }}
        >
          👎 {takeDislikes}
        </button>
        <button
          onClick={handleShare}
          style={{
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            padding: '6px 14px',
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {copied ? '✓ Copied!' : '↗ Share'}
        </button>
        <a
          href={twitterUrl}
          target='_blank'
          rel='noopener noreferrer'
          style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-tertiary)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
        >
          Share on X →
        </a>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: '0.5px', background: 'var(--border)', margin: '2.5rem 0' }} />

      {/* ── Comments section ── */}
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '1.75rem' }}>
          {comments.length > 0
            ? `Takes from the room · ${comments.length}`
            : 'No takes yet. Be first.'}
        </p>

        {comments.length > 0 && (
          <div style={{ maxWidth: '620px' }}>
            {comments.map((c, i) => (
              <div key={c.id}>
                <div style={{ paddingBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                      {c.name}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
                      {formatDate(c.created_at)}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7, letterSpacing: '-0.005em', marginBottom: '0.75rem' }}>
                    {c.comment}
                  </p>
                  {/* Comment reactions */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleCommentReaction(c.id, 'like')}
                      style={{
                        border: `1px solid ${commentReactions[c.id] === 'like' ? 'var(--teal)' : 'var(--border)'}`,
                        background: commentReactions[c.id] === 'like' ? 'var(--teal)' : 'transparent',
                        color: commentReactions[c.id] === 'like' ? 'white' : 'var(--text-tertiary)',
                        padding: '3px 10px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        fontFamily: 'inherit',
                      }}
                    >
                      👍 {commentLikes[c.id] ?? 0}
                    </button>
                    <button
                      onClick={() => handleCommentReaction(c.id, 'dislike')}
                      style={{
                        border: `1px solid ${commentReactions[c.id] === 'dislike' ? 'var(--teal)' : 'var(--border)'}`,
                        background: commentReactions[c.id] === 'dislike' ? 'var(--teal)' : 'transparent',
                        color: commentReactions[c.id] === 'dislike' ? 'white' : 'var(--text-tertiary)',
                        padding: '3px 10px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        fontFamily: 'inherit',
                      }}
                    >
                      👎 {commentDislikes[c.id] ?? 0}
                    </button>
                  </div>
                </div>
                {i < comments.length - 1 && (
                  <div style={{ height: '0.5px', background: 'var(--border)', marginBottom: '1.25rem' }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Divider ── */}
      <div style={{ height: '0.5px', background: 'var(--border)', margin: '2.5rem 0' }} />

      {/* ── Comment form ── */}
      <div style={{ maxWidth: '480px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          Leave your take
        </p>

        {submitStatus === 'success' ? (
          <p style={{ fontSize: '13px', color: 'var(--teal)', letterSpacing: '-0.005em' }}>
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
                borderBottom: `0.5px solid ${nameFocused ? 'var(--teal)' : 'var(--border)'}`,
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
                height: '80px',
                resize: 'none',
                borderBottom: `0.5px solid ${commentFocused ? 'var(--teal)' : 'var(--border)'}`,
              }}
            />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)', textAlign: 'right', marginTop: '4px', letterSpacing: '0.04em' }}>
              {comment.length} / 500
            </p>

            {submitStatus === 'error' && (
              <p style={{ fontSize: '12px', color: '#e53e3e', marginTop: '0.5rem', letterSpacing: '-0.005em' }}>
                Something went wrong. Try again.
              </p>
            )}

            <button
              type='submit'
              disabled={submitStatus === 'loading'}
              style={{
                border: '1px solid var(--teal)',
                color: 'var(--teal)',
                background: 'transparent',
                padding: '8px 18px',
                fontSize: '12px',
                cursor: submitStatus === 'loading' ? 'not-allowed' : 'pointer',
                marginTop: '1rem',
                opacity: submitStatus === 'loading' ? 0.6 : 1,
                fontFamily: 'inherit',
                letterSpacing: '-0.005em',
              }}
            >
              {submitStatus === 'loading' ? 'Posting...' : 'Leave your take →'}
            </button>
          </form>
        )}
      </div>

      {/* ── Footer ── */}
      <footer style={{ marginTop: '5rem', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '0.5px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
          Phinehas Newman · 2026
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
          Accra, Ghana
        </span>
      </footer>
    </section>
  )
}
