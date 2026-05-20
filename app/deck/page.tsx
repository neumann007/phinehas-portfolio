'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

type DeckSignature = {
  id: string
  visitor_token: string
  signature_svg: string
  nickname: string
  comment: string
  created_at: string
}

type ModalStep = 'sign' | 'details' | 'success'

function getToken (): string {
  if (typeof window === 'undefined') return ''
  let token = localStorage.getItem('visitor_token')
  if (!token) {
    token = crypto.randomUUID()
    localStorage.setItem('visitor_token', token)
  }
  return token
}

// function timeAgo (iso: string): string {
//   const diff = Date.now() - new Date(iso).getTime()
//   const mins = Math.floor(diff / 60000)
//   const hours = Math.floor(mins / 60)
//   const days = Math.floor(hours / 24)
//   if (days > 0) return `${days}d ago`
//   if (hours > 0) return `${hours}h ago`
//   if (mins > 0) return `${mins}m ago`
//   return 'just now'
// }

// ── Signature Pad ──────────────────────────────────────────────────────────────
function SignaturePad ({ onSave }: { onSave: (sig: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)
  const strokesRef = useRef<ImageData[]>([])
  const [hasDrawn, setHasDrawn] = useState(false)

  const getPos = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      }
    }
    return {
      x: ((e as MouseEvent).clientX - rect.left) * scaleX,
      y: ((e as MouseEvent).clientY - rect.top) * scaleY
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.strokeStyle = '#1a1008'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const start = (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      drawing.current = true
      lastPos.current = getPos(e, canvas)
    }
    const move = (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      if (!drawing.current || !lastPos.current) return
      const pos = getPos(e, canvas)
      ctx.beginPath()
      ctx.moveTo(lastPos.current.x, lastPos.current.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
      lastPos.current = pos
      setHasDrawn(true)
    }
    const end = () => {
      drawing.current = false
      lastPos.current = null
    }
    const endAndSave = () => {
      if (drawing.current) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        strokesRef.current.push(imageData)
      }
      drawing.current = false
      lastPos.current = null
    }

    canvas.addEventListener('mousedown', start)
    canvas.addEventListener('mousemove', move)
    canvas.addEventListener('mouseup', endAndSave)
    canvas.addEventListener('mouseleave', end)
    canvas.addEventListener('touchstart', start, { passive: false })
    canvas.addEventListener('touchmove', move, { passive: false })
    canvas.addEventListener('touchend', endAndSave)

    return () => {
      canvas.removeEventListener('mousedown', start)
      canvas.removeEventListener('mousemove', move)
      canvas.removeEventListener('mouseup', endAndSave)
      canvas.removeEventListener('mouseleave', end)
      canvas.removeEventListener('touchstart', start)
      canvas.removeEventListener('touchmove', move)
      canvas.removeEventListener('touchend', endAndSave)
    }
  }, [])

  const clear = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    strokesRef.current = []
    setHasDrawn(false)
  }

  const undoStroke = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    strokesRef.current.pop()
    const prev = strokesRef.current[strokesRef.current.length - 1]
    if (prev) {
      ctx.putImageData(prev, 0, 0)
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setHasDrawn(false)
    }
  }

  const save = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    onSave(canvas.toDataURL('image/png'))
  }

  return (
    <div className='deck-sigpad'>
      <div className='deck-sigpad__header'>
        <span className='deck-sigpad__label'>Draw your signature</span>
        <button className='deck-sigpad__clear' onClick={undoStroke} type='button'>
          Undo
        </button>
        <button className='deck-sigpad__clear' onClick={clear} type='button'>
          Clear
        </button>
      </div>
      <div className='deck-sigpad__canvas-wrap'>
        <canvas
          ref={canvasRef}
          width={440}
          height={260}
          className='deck-sigpad__canvas'
        />
        <p className='deck-sigpad__hint'>Use your mouse or finger</p>
      </div>
      <button
        className='deck-sigpad__save'
        onClick={save}
        disabled={!hasDrawn}
        type='button'
      >
        Use this signature →
      </button>
    </div>
  )
}

// ── Flip Card ──────────────────────────────────────────────────────────────────
function DeckCard ({ sig, isNew }: { sig: DeckSignature; isNew: boolean }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className={`deck-card ${flipped ? 'deck-card--flipped' : ''} ${
        isNew ? 'deck-card--new' : ''
      }`}
      onClick={() => setFlipped(f => !f)}
      title={flipped ? 'Click to flip back' : 'Click to reveal'}
    >
      <div className='deck-card__inner'>
        {/* Front — signature */}
        <div className='deck-card__front'>
          <img
            src={sig.signature_svg}
            alt={`${sig.nickname}'s signature`}
            className='deck-card__sig-img'
          />
          {/* <span className='deck-card__time'>{timeAgo(sig.created_at)}</span> */}
        </div>
        {/* Back — thought + nickname */}
        <div className='deck-card__back'>
          <p className='deck-card__comment'>&ldquo;{sig.comment}&rdquo;</p>
          <span className='deck-card__nickname'>— {sig.nickname}</span>
        </div>
      </div>
    </div>
  )
}

// ── Sign Modal ─────────────────────────────────────────────────────────────────
function SignModal ({
  onClose,
  onSuccess
}: {
  onClose: () => void
  onSuccess: (sig: DeckSignature) => void
}) {
  const [step, setStep] = useState<ModalStep>('sign')
  const [signatureData, setSignatureData] = useState('')
  const [nickname, setNickname] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignSave = (sig: string) => {
    setSignatureData(sig)
    setStep('details')
  }

  const handleSubmit = async () => {
    if (!nickname.trim() || !comment.trim()) return
    setLoading(true)
    setError('')

    const { data, error: err } = await supabase
      .from('deck_signatures')
      .insert([
        {
          visitor_token: getToken(),
          signature_svg: signatureData,
          nickname: nickname.trim(),
          comment: comment.trim()
        }
      ])
      .select()
      .single()

    if (err || !data) {
      setError('Something went wrong. Try again.')
      setLoading(false)
      return
    }

    localStorage.setItem('deck_signed', 'true')
    setStep('success')
    setTimeout(() => onSuccess(data as DeckSignature), 1200)
  }

  // Close on overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className='deck-modal-overlay' onClick={handleOverlayClick}>
      <div className='deck-modal'>
        {step !== 'success' && (
          <div className='deck-modal__header'>
            <div className='deck-modal__header-left'>
              {step === 'details' && (
                <button
                  className='deck-modal__back'
                  onClick={() => setStep('sign')}
                  type='button'
                >
                  ←
                </button>
              )}
              <h2 className='deck-modal__title'>
                {step === 'sign' ? 'Sign the Deck' : 'Leave your mark'}
              </h2>
            </div>
            <button
              className='deck-modal__close'
              onClick={onClose}
              type='button'
            >
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
              >
                <line x1='18' y1='6' x2='6' y2='18' />
                <line x1='6' y1='6' x2='18' y2='18' />
              </svg>
            </button>
          </div>
        )}

        {step === 'sign' && <SignaturePad onSave={handleSignSave} />}

        {step === 'details' && (
          <div className='deck-modal__details'>
            <div className='deck-modal__field'>
              <label className='deck-modal__label'>Nickname</label>
              <input
                type='text'
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder='What do people call you?'
                maxLength={30}
                className='deck-modal__input'
                autoFocus
              />
            </div>
            <div className='deck-modal__field'>
              <label className='deck-modal__label'>
                Leave a thought
                <span className='deck-modal__char'>{comment.length}/120</span>
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder='Something on your mind...'
                maxLength={120}
                rows={3}
                className='deck-modal__textarea'
              />
            </div>
            {error && <p className='deck-modal__error'>{error}</p>}
            <button
              className='deck-modal__submit'
              onClick={handleSubmit}
              disabled={!nickname.trim() || !comment.trim() || loading}
              type='button'
            >
              {loading ? 'Signing...' : 'Add to Deck →'}
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className='deck-modal__success'>
            <div className='deck-modal__success-icon'>✓</div>
            <p className='deck-modal__success-text'>
              Your card is on the wall.
            </p>
            <p className='deck-modal__success-sub'>
              Find it at the top of the Deck.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function DeckPage () {
  const [signatures, setSignatures] = useState<DeckSignature[]>([])
  const [hasSigned, setHasSigned] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [newCardId, setNewCardId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('deck_signatures')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setSignatures(data)
      if (localStorage.getItem('deck_signed')) setHasSigned(true)
    }
    load()

    const channel = supabase
      .channel('deck-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'deck_signatures' },
        payload => {
          const s = payload.new as DeckSignature
          setSignatures(prev => {
            if (prev.find(p => p.id === s.id)) return prev
            return [s, ...prev]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleSuccess = (sig: DeckSignature) => {
    setSignatures(prev => {
      if (prev.find(p => p.id === sig.id)) return prev
      return [sig, ...prev]
    })
    setHasSigned(true)
    setShowModal(false)
    setNewCardId(sig.id)
    setTimeout(() => setNewCardId(null), 2000)
  }

  return (
    <div className='page deck-page'>
      {/* Page header */}
      <div className='deck-page__hero'>
        <div className='deck-page__hero-text'>
          <p className='mono mono--teal'>The Deck</p>
          {/* <h1 className='heading-lg'>Everyone who passed through.</h1> */}
          {/* <p className='text-body deck-page__subtitle'>
            {signatures.length === 0
              ? 'No signatures yet. Be the first.'
              : `${signatures.length} ${
                  signatures.length === 1 ? 'signature' : 'signatures'
                } on the wall. Click any card to read their thought.`}
          </p> */}
        </div>
        {!hasSigned ? (
          <button className='deck-page__cta' onClick={() => setShowModal(true)}>
            Add to Deck →
          </button>
        ) : (
          <span className='deck-page__signed'>✓ You&apos;re on the Deck</span>
        )}
      </div>

      {/* The wall */}
      <div className='deck-wall'>
        {signatures.length === 0 ? (
          <div className='deck-empty'>
            <p>The Deck is empty. Add a card.</p>
          </div>
        ) : (
          <div className='deck-grid'>
            {signatures.map(sig => (
              <DeckCard key={sig.id} sig={sig} isNew={sig.id === newCardId} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <SignModal
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}
