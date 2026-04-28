'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import ReactionButton from '@/components/ReactionButton'

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
      year: 'numeric'
    })
  } catch {
    return iso
  }
}

export default function TakeDetail ({ take, comments }: Props) {
const [takeLikes, setTakeLikes] = useState(take.likes ?? 0)
const [takeDislikes, setTakeDislikes] = useState(take.dislikes ?? 0)

const [takeReaction, setTakeReaction] = useState<'like' | 'dislike' | null>(
  () => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem(`reactions_${take.id}`)
    return stored === 'like' || stored === 'dislike' ? stored : null
  }
)

const [commentReactions, setCommentReactions] = useState<
  Record<string, 'like' | 'dislike'>
>(() => {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(`comment_reactions_${take.id}`)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
})

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


  const handleTakeReaction = useCallback(
    async (type: 'like' | 'dislike') => {
      const token = getToken()
      const isToggle = takeReaction === type
      const newReaction = isToggle ? null : type

      setTakeLikes(prev =>
        type === 'like'
          ? isToggle
            ? prev - 1
            : prev + 1
          : takeReaction === 'like'
          ? prev - 1
          : prev
      )
      setTakeDislikes(prev =>
        type === 'dislike'
          ? isToggle
            ? prev - 1
            : prev + 1
          : takeReaction === 'dislike'
          ? prev - 1
          : prev
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
        body: JSON.stringify({
          take_id: take.id,
          visitor_token: token,
          reaction: newReaction
        })
      })
    },
    [take.id, takeReaction]
  )

  const handleCommentReaction = useCallback(
    async (commentId: string, type: 'like' | 'dislike') => {
      const token = getToken()
      const current = commentReactions[commentId]
      const isToggle = current === type
      const newReaction = isToggle ? null : type

      setCommentLikes(prev => ({
        ...prev,
        [commentId]:
          type === 'like'
            ? isToggle
              ? prev[commentId] - 1
              : prev[commentId] + 1
            : current === 'like'
            ? prev[commentId] - 1
            : prev[commentId]
      }))
      setCommentDislikes(prev => ({
        ...prev,
        [commentId]:
          type === 'dislike'
            ? isToggle
              ? prev[commentId] - 1
              : prev[commentId] + 1
            : current === 'dislike'
            ? prev[commentId] - 1
            : prev[commentId]
      }))

      const updated = { ...commentReactions }
      if (newReaction) updated[commentId] = newReaction
      else delete updated[commentId]
      setCommentReactions(updated)
      localStorage.setItem(
        `comment_reactions_${take.id}`,
        JSON.stringify(updated)
      )

      await fetch('/api/reactions/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment_id: commentId,
          visitor_token: token,
          reaction: newReaction
        })
      })
    },
    [take.id, commentReactions]
  )

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
      body: JSON.stringify({ take_id: take.id, name, comment })
    })
    if (res.ok) {
      setSubmitStatus('success')
      setName('')
      setComment('')
    } else {
      setSubmitStatus('error')
    }
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `"${take.take}"`
  )}&url=${encodeURIComponent(
    typeof window !== 'undefined' ? window.location.href : ''
  )}`

  return (
    <section className='take-detail'>
      {/* Back */}
      <Link href='/blog' className='take-detail__back'>
        ← All takes
      </Link>

      {/* Meta */}
      <div className='take-detail__meta'>
        <span className='mono mono--teal'>{take.tag}</span>
        <span className='mono'>{take.date}</span>
      </div>

      {/* Headline */}
      <h1 className='take-detail__headline'>{take.take}</h1>

      {/* Reasoning */}
      <p className='take-detail__reasoning'>{take.reasoning}</p>

      {/* Reaction bar */}
      <div className='reaction-bar'>
        <ReactionButton
          type='like'
          count={takeLikes}
          active={takeReaction === 'like'}
          onClick={() => handleTakeReaction('like')}
        />
        <ReactionButton
          type='dislike'
          count={takeDislikes}
          active={takeReaction === 'dislike'}
          onClick={() => handleTakeReaction('dislike')}
        />
        <button
          className='reaction-btn reaction-btn--share'
          onClick={handleShare}
        >
          {copied ? '✓ Copied' : '↗ Share'}
        </button>
        <a
          href={twitterUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='share-x'
        >
          Share on X →
        </a>
      </div>

      <div className='divider' style={{ margin: '2.5rem 0' }} />

      {/* Comments */}
      <div className='comments-section'>
        <p className='comments-label'>
          {comments.length > 0
            ? `Takes from the room · ${comments.length}`
            : 'No takes yet. Be first.'}
        </p>

        {comments.length > 0 && (
          <div style={{ maxWidth: '620px' }}>
            {comments.map((c, i) => (
              <div key={c.id} className='comment-item'>
                <div className='comment-item__header'>
                  <span className='comment-item__name'>{c.name}</span>
                  <span className='comment-item__date'>
                    {formatDate(c.created_at)}
                  </span>
                </div>
                <p className='comment-item__text'>{c.comment}</p>
                <div className='comment-item__reactions'>
                  <ReactionButton
                    type='like'
                    count={commentLikes[c.id] ?? 0}
                    active={commentReactions[c.id] === 'like'}
                    onClick={() => handleCommentReaction(c.id, 'like')}
                  />
                  <ReactionButton
                    type='dislike'
                    count={commentDislikes[c.id] ?? 0}
                    active={commentReactions[c.id] === 'dislike'}
                    onClick={() => handleCommentReaction(c.id, 'dislike')}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='divider' style={{ margin: '2.5rem 0' }} />

      {/* Comment form */}
      <div className='comment-form'>
        <p className='comment-form__label'>Leave your take</p>

        {submitStatus === 'success' ? (
          <p className='comment-form__success'>
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
              className='comment-form__input'
              style={{
                borderBottomColor: nameFocused ? 'var(--teal)' : 'var(--border)'
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
              className='comment-form__textarea'
              style={{
                borderBottomColor: commentFocused
                  ? 'var(--teal)'
                  : 'var(--border)'
              }}
            />
            <p className='comment-form__count'>{comment.length} / 500</p>

            {submitStatus === 'error' && (
              <p className='comment-form__error'>
                Something went wrong. Try again.
              </p>
            )}

            <button
              type='submit'
              disabled={submitStatus === 'loading'}
              className='comment-form__submit'
            >
              {submitStatus === 'loading' ? 'Posting...' : 'Leave your take →'}
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <footer className='footer' style={{ marginTop: '5rem' }}>
        <span className='mono'>Phinehas Newman · 2026</span>
        <span className='mono'>Accra, Ghana</span>
      </footer>
    </section>
  )
}
