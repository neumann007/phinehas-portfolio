'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Echo = {
  id: string
  visitor_token: string
  building: string
  thinking: string
  city: string
  country_code: string
  lat: number
  lng: number
  color: string
  signature_svg: string | null
  created_at: string
}

type Panel = 'none' | 'detail' | 'drop'
type FormState = 'idle' | 'loading' | 'success' | 'error'

const COLORS = [
  '#2dd4bf',
  '#60a5fa',
  '#f59e0b',
  '#a78bfa',
  '#f472b6',
  '#34d399',
  '#fb923c',
  '#e879f9'
]

const FLAG_MAP: Record<string, string> = {
  GH: '🇬🇭',
  DE: '🇩🇪',
  NG: '🇳🇬',
  CA: '🇨🇦',
  JP: '🇯🇵',
  US: '🇺🇸',
  GB: '🇬🇧',
  FR: '🇫🇷',
  IN: '🇮🇳',
  BR: '🇧🇷',
  AU: '🇦🇺',
  ZA: '🇿🇦',
  KE: '🇰🇪',
  SG: '🇸🇬',
  AE: '🇦🇪',
  ES: '🇪🇸',
  IT: '🇮🇹',
  NL: '🇳🇱',
  SE: '🇸🇪',
  NO: '🇳🇴',
  PL: '🇵🇱',
  PT: '🇵🇹',
  RU: '🇷🇺',
  CN: '🇨🇳',
  KR: '🇰🇷',
  MX: '🇲🇽',
  AR: '🇦🇷',
  CO: '🇨🇴',
  EG: '🇪🇬',
  ET: '🇪🇹',
  TZ: '🇹🇿',
  RW: '🇷🇼',
  UG: '🇺🇬',
  CI: '🇨🇮',
  CM: '🇨🇲'
}

function getToken (): string {
  if (typeof window === 'undefined') return ''
  let token = localStorage.getItem('visitor_token')
  if (!token) {
    token = crypto.randomUUID()
    localStorage.setItem('visitor_token', token)
  }
  return token
}

function timeAgo (iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (mins > 0) return `${mins}m ago`
  return 'just now'
}

function FlagImg ({ code }: { code: string }) {
  if (!code || code === 'XX') return <span>🌍</span>
  return (
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      alt={code}
      width={24}
      height={16}
      style={{
        borderRadius: '3px',
        objectFit: 'cover',
        display: 'inline-block'
      }}
    />
  )
}

function SignaturePad ({
  onSave,
  onSkip
}: {
  onSave: (sig: string) => void
  onSkip: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)
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

    ctx.strokeStyle = '#2dd4bf'
    ctx.lineWidth = 2
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

    canvas.addEventListener('mousedown', start)
    canvas.addEventListener('mousemove', move)
    canvas.addEventListener('mouseup', end)
    canvas.addEventListener('touchstart', start, { passive: false })
    canvas.addEventListener('touchmove', move, { passive: false })
    canvas.addEventListener('touchend', end)

    return () => {
      canvas.removeEventListener('mousedown', start)
      canvas.removeEventListener('mousemove', move)
      canvas.removeEventListener('mouseup', end)
      canvas.removeEventListener('touchstart', start)
      canvas.removeEventListener('touchmove', move)
      canvas.removeEventListener('touchend', end)
    }
  }, [])

  const clear = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
  }

  const save = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    onSave(canvas.toDataURL('image/png'))
  }

  return (
    <div className='sig-pad'>
      <div className='sig-pad__label-row'>
        <label className='echoes-drop-label'>Sign your echo</label>
        <button className='sig-pad__clear' onClick={clear} type='button'>
          Clear
        </button>
      </div>
      <div className='sig-pad__canvas-wrap'>
        <canvas
          ref={canvasRef}
          width={280}
          height={100}
          className='sig-pad__canvas'
        />
        <p className='sig-pad__hint'>Sign here with your mouse or finger</p>
      </div>
      <div className='sig-pad__actions'>
        <button
          className='echoes-drop-submit'
          onClick={save}
          disabled={!hasDrawn}
          type='button'
        >
          Save signature →
        </button>
        <button className='sig-pad__skip' onClick={onSkip} type='button'>
          Skip signature
        </button>
      </div>
    </div>
  )
}

// ── Starfield ──────────────────────────────
function Starfield () {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.1,
      o: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.005 + 0.002,
      offset: Math.random() * Math.PI * 2
    }))

    let frame = 0
    let raf: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        const opacity = s.o * (0.5 + 0.5 * Math.sin(frame * s.speed + s.offset))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,255,220,${opacity})`
        ctx.fill()
      })
      frame++
      raf = requestAnimationFrame(draw)
    }

    draw()
    const onResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  )
}

// ── Main page ──────────────────────────────
export default function EchoesPage () {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map())
  const [echoes, setEchoes] = useState<Echo[]>([])
  const [selectedEcho, setSelectedEcho] = useState<Echo | null>(null)
  const [panel, setPanel] = useState<Panel>('none')
  const [formState, setFormState] = useState<FormState>('idle')
  const [building, setBuilding] = useState('')
  const [thinking, setThinking] = useState('')
  const [selectedColor, setSelectedColor] = useState('#2dd4bf')
  const [showSignature, setShowSignature] = useState(false)
  const [hasDropped, setHasDropped] = useState(false)
  const [mapReady, setMapReady] = useState(false)
  const [isSpinning, setIsSpinning] = useState(true)
  const spinRef = useRef(true)
  const frameRef = useRef<number>()

  // Load echoes
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('echoes')
        .select('*')
        .not('lat', 'is', null)
        .not('lng', 'is', null)
        .order('created_at', { ascending: false })
      if (data) setEchoes(data)
      const dropped = localStorage.getItem('echo_dropped')
      if (dropped) setHasDropped(true)
    }
    load()

    const channel = supabase
      .channel('echoes-mapbox')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'echoes'
        },
        payload => {
          const e = payload.new as Echo
          if (e.lat && e.lng) setEchoes(prev => [e, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Init Mapbox
  useEffect(() => {
    if (!mapRef.current || mapReady) return

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: 'globe',
      zoom: 1.8,
      center: [0, 20],
      pitch: 0
    })

    map.on('style.load', () => {
      // Space atmosphere
      map.setFog({
        color: 'rgb(2, 12, 6)',
        'high-color': 'rgb(0, 8, 4)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(1, 6, 3)',
        'star-intensity': 0
      })

      setMapReady(true)
    })

    // Stop spinning on any user interaction
    const stopSpin = () => {
      spinRef.current = false
      setIsSpinning(false)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }

    map.on('mousedown', stopSpin)
    map.on('touchstart', stopSpin)
    map.on('wheel', stopSpin)
    map.on('dblclick', stopSpin)

    mapInstanceRef.current = map

    // Auto-spin
    const spin = () => {
      if (!spinRef.current) return
      const center = map.getCenter()
      center.lng -= 0.08
      map.setCenter(center)
      frameRef.current = requestAnimationFrame(spin)
    }
    frameRef.current = requestAnimationFrame(spin)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      map.remove()
    }
  }, [])

  // Add/update markers
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !mapReady) return

    echoes.forEach(echo => {
      if (markersRef.current.has(echo.id)) return

      const el = document.createElement('div')
      el.className = 'echo-marker'
      el.style.setProperty('--echo-color', echo.color || '#2dd4bf')

      el.innerHTML = `
        <div class="echo-marker__ring"></div>
        <div class="echo-marker__dot"></div>
      `

      el.addEventListener('click', () => {
        setSelectedEcho(echo)
        setPanel('detail')
        map.flyTo({
          center: [echo.lng, echo.lat],
          zoom: Math.max(map.getZoom(), 4),
          duration: 800,
          essential: true
        })
      })

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([echo.lng, echo.lat])
        .addTo(map)

      markersRef.current.set(echo.id, marker)
    })
  }, [echoes, mapReady])

  // Highlight selected marker
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement()
      if (selectedEcho?.id === id) {
        el.classList.add('echo-marker--selected')
      } else {
        el.classList.remove('echo-marker--selected')
      }
    })
  }, [selectedEcho])

  const resetView = () => {
    const map = mapInstanceRef.current
    if (!map) return
    map.flyTo({ center: [0, 20], zoom: 1.8, duration: 1200, essential: true })
    spinRef.current = true
    setIsSpinning(true)
    const spin = () => {
      if (!spinRef.current) return
      const center = map.getCenter()
      center.lng -= 0.08
      map.setCenter(center)
      frameRef.current = requestAnimationFrame(spin)
    }
    frameRef.current = requestAnimationFrame(spin)
  }

  const closePanel = () => {
    setPanel('none')
    setSelectedEcho(null)
  }

  const handleFormNext = () => {
    if (!building.trim() || !thinking.trim()) return
    setShowSignature(true)
  }

  const handleSubmit = async (sig: string | null) => {
    setFormState('loading')

    let lat = 5.6037,
      lng = -0.187,
      city = 'Unknown',
      country_code = 'XX'

    try {
      const geo = await fetch('https://ipapi.co/json/')
      const geoData = await geo.json()
      lat = geoData.latitude || lat
      lng = geoData.longitude || lng
      city = geoData.city || city
      country_code = geoData.country_code || country_code
    } catch {
      /* use defaults */
    }

    const { error } = await supabase.from('echoes').insert([
      {
        visitor_token: getToken(),
        building: building.trim(),
        thinking: thinking.trim(),
        lat,
        lng,
        city,
        country_code,
        color: selectedColor,
        signature_svg: sig
      }
    ])

    if (error) {
      setFormState('error')
      return
    }

    setFormState('success')
    setHasDropped(true)
    localStorage.setItem('echo_dropped', 'true')
    setBuilding('')
    setThinking('')

    const map = mapInstanceRef.current
    if (map) {
      map.flyTo({
        center: [lng, lat],
        zoom: 6,
        duration: 1500,
        essential: true
      })
    }
  }

  return (
    <div className='echoes-page'>
      <Starfield />

      {/* Map */}
      <div ref={mapRef} className='echoes-page__map' />

      {/* Header */}
      <div className='echoes-page__header'>
        <Link href='/' className='echoes-page__back'>
          ← phinehas.xyz
        </Link>
        <div className='echoes-page__title'>
          <span className='echoes-page__title-text'>ECHOES</span>
          <span className='echoes-page__title-sub'>
            A living globe of signals
          </span>
        </div>
        <div className='echoes-page__count'>
          <span className='echoes-count__dot' />
          <span>{echoes.length} echoes</span>
        </div>
      </div>

      {/* Reset button */}
      <button
        className='echoes-reset-btn'
        onClick={resetView}
        title='Reset view'
      >
        <svg
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
        >
          <path d='M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' />
          <path d='M3 3v5h5' />
        </svg>
      </button>

      {/* Right sidebar */}
      <div
        className={`echoes-sidebar ${
          panel !== 'none' ? 'echoes-sidebar--open' : ''
        }`}
      >
        {panel === 'detail' && selectedEcho && (
          <div className='echoes-sidebar__inner'>
            <div className='echoes-sidebar__header'>
              <p className='echoes-sidebar__section-label'>Echo</p>
              <button className='echoes-sidebar__close' onClick={closePanel}>
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

            <div className='echoes-sidebar__location'>
              <FlagImg code={selectedEcho.country_code} />
              <div>
                <p className='echoes-sidebar__city'>{selectedEcho.city}</p>
                <p className='echoes-sidebar__time'>
                  {timeAgo(selectedEcho.created_at)}
                </p>
              </div>
              <div
                className='echoes-sidebar__color-dot'
                style={{ background: selectedEcho.color }}
              />
            </div>

            <div className='echoes-sidebar__field'>
              <p className='echoes-sidebar__field-label'>Building</p>
              <p className='echoes-sidebar__field-value'>
                {selectedEcho.building}
              </p>
            </div>

            <div className='echoes-sidebar__field'>
              <p className='echoes-sidebar__field-label'>
                Can&apos;t stop thinking about
              </p>
              <p className='echoes-sidebar__field-value echoes-sidebar__field-value--italic'>
                &ldquo;{selectedEcho.thinking}&rdquo;
              </p>
            </div>

            {selectedEcho.signature_svg && (
              <div className='echoes-sidebar__field'>
                <p className='echoes-sidebar__field-label'>Signature</p>
                <div className='echoes-sidebar__sig'>
                  <img
                    src={selectedEcho.signature_svg}
                    alt='signature'
                    style={{
                      width: '100%',
                      opacity: 0.85,
                      filter:
                        'invert(1) sepia(1) saturate(3) hue-rotate(120deg)'
                    }}
                  />
                </div>
              </div>
            )}

            <div className='echoes-sidebar__divider' />

            <button
              className='echoes-sidebar__drop-btn'
              onClick={() => {
                setShowSignature(false)
                setFormState('idle')
                setPanel('drop')
              }}
            >
              {hasDropped ? "You've left your trace ✓" : 'Drop your echo →'}
            </button>
          </div>
        )}

        {panel === 'drop' && (
          <div className='echoes-sidebar__inner'>
            <div className='echoes-sidebar__header'>
              <p className='echoes-sidebar__section-label'>
                {showSignature ? 'Sign your echo' : 'Leave your trace'}
              </p>
              <button className='echoes-sidebar__close' onClick={closePanel}>
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

            {formState === 'success' ? (
              <div className='echoes-form-success'>
                <div className='echoes-form-success__icon'>✓</div>
                <p>Your echo is on the globe.</p>
                <p className='echoes-form-success__sub'>Look for your pin.</p>
              </div>
            ) : showSignature ? (
              <SignaturePad
                onSave={sig => handleSubmit(sig)}
                onSkip={() => handleSubmit(null)}
              />
            ) : (
              <>
                <p className='echoes-sidebar__desc'>
                  Your location is detected automatically. No account needed —
                  just your echo.
                </p>
                <div className='echoes-drop-fields'>
                  <div className='echoes-drop-field'>
                    <label className='echoes-drop-label'>
                      What are you building?
                    </label>
                    <input
                      type='text'
                      value={building}
                      onChange={e => setBuilding(e.target.value)}
                      placeholder='A tool for...'
                      maxLength={100}
                      className='echoes-drop-input'
                    />
                  </div>
                  <div className='echoes-drop-field'>
                    <label className='echoes-drop-label'>
                      What can&apos;t you stop thinking about?
                    </label>
                    <input
                      type='text'
                      value={thinking}
                      onChange={e => setThinking(e.target.value)}
                      placeholder='Why does X still work this way...'
                      maxLength={140}
                      className='echoes-drop-input'
                    />
                  </div>
                  <div className='echoes-drop-field'>
                    <label className='echoes-drop-label'>Your echo color</label>
                    <div className='echoes-color-picker'>
                      {COLORS.map(c => (
                        <button
                          key={c}
                          className={`echoes-color-swatch ${
                            selectedColor === c
                              ? 'echoes-color-swatch--active'
                              : ''
                          }`}
                          style={{ background: c }}
                          onClick={() => setSelectedColor(c)}
                          type='button'
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {formState === 'error' && (
                  <p className='echoes-drop-error'>
                    Something went wrong. Try again.
                  </p>
                )}
                <button
                  className='echoes-drop-submit'
                  onClick={handleFormNext}
                  disabled={!building.trim() || !thinking.trim()}
                >
                  Next — sign your echo →
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className='echoes-page__bottom'>
        {panel === 'none' && (
          <button
            className='echoes-page__drop-cta'
            onClick={() => {
              setShowSignature(false)
              setFormState('idle')
              setPanel('drop')
            }}
          >
            {hasDropped ? "✓ You've left your trace" : '↓ Drop your echo'}
          </button>
        )}
        <p className='echoes-page__hint'>
          Click a pin to read an echo · Scroll to zoom
        </p>
      </div>
    </div>
  )
}
