'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

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
  created_at: string
}

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

function getRandomColor () {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
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

export default function EchoesGlobe () {
  const globeRef = useRef<HTMLDivElement>(null)
  const globeInstanceRef = useRef<any>(null)
  const [echoes, setEchoes] = useState<Echo[]>([])
  const [hoveredEcho, setHoveredEcho] = useState<Echo | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formState, setFormState] = useState<FormState>('idle')
  const [building, setBuilding] = useState('')
  const [thinking, setThinking] = useState('')
  const [buildingFocused, setBuildingFocused] = useState(false)
  const [thinkingFocused, setThinkingFocused] = useState(false)
  const [hasDropped, setHasDropped] = useState(false)

  // Fetch echoes
  const fetchEchoes = useCallback(async () => {
    const { data } = await supabase
      .from('echoes')
      .select('*')
      .not('lat', 'is', null)
      .not('lng', 'is', null)
      .order('created_at', { ascending: false })
    if (data) setEchoes(data)
  }, [])

  useEffect(() => {
    fetchEchoes()

    // Check if already dropped
    const dropped = localStorage.getItem('echo_dropped')
    if (dropped) setHasDropped(true)

    // Realtime subscription
    const channel = supabase
      .channel('echoes-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'echoes'
        },
        payload => {
          const newEcho = payload.new as Echo
          if (newEcho.lat && newEcho.lng) {
            setEchoes(prev => [newEcho, ...prev])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchEchoes])

  // Init globe
  useEffect(() => {
    if (!globeRef.current || echoes.length === 0) return

    let Globe: any
    let instance: any

    const init = async () => {
      const GlobeGL = (await import('globe.gl')).default
      if (!globeRef.current) return

      const isDark =
        document.documentElement.getAttribute('data-theme') === 'dark'

      instance = GlobeGL()(globeRef.current)
        .width(globeRef.current.clientWidth)
        .height(globeRef.current.clientHeight)
        .backgroundColor('rgba(0,0,0,0)')
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
        .atmosphereColor('#2dd4bf')
        .atmosphereAltitude(0.08)
        .pointsData(echoes)
        .pointLat('lat')
        .pointLng('lng')
        .pointColor((d: any) => d.color || '#2dd4bf')
        .pointAltitude(0.02)
        .pointRadius(0.4)
        .pointsMerge(false)
        .onPointHover((point: any) => {
          setHoveredEcho(point as Echo | null)
          if (globeRef.current) {
            globeRef.current.style.cursor = point ? 'pointer' : 'default'
          }
        })
        .onPointClick((point: any) => {
          setHoveredEcho(point as Echo)
        })

      // Auto rotate
      instance.controls().autoRotate = true
      instance.controls().autoRotateSpeed = 0.4
      instance.controls().enableZoom = false

      // Point to Accra on load
      instance.pointOfView({ lat: 5.6037, lng: -0.187, altitude: 2 }, 1000)

      globeInstanceRef.current = instance
    }

    init()

    return () => {
      if (globeInstanceRef.current) {
        globeInstanceRef.current._destructor?.()
      }
    }
  }, [echoes.length > 0])

  // Update points when echoes change
  useEffect(() => {
    if (globeInstanceRef.current && echoes.length > 0) {
      globeInstanceRef.current.pointsData(echoes)
    }
  }, [echoes])

  const handleSubmit = async () => {
    if (!building.trim() || !thinking.trim()) return
    setFormState('loading')

    // Get approximate location from IP
    let lat = 0
    let lng = 0
    let city = 'Unknown'
    let country_code = 'XX'

    try {
      const geo = await fetch('https://ipapi.co/json/')
      const geoData = await geo.json()
      lat = geoData.latitude || 0
      lng = geoData.longitude || 0
      city = geoData.city || 'Unknown'
      country_code = geoData.country_code || 'XX'
    } catch {
      // fallback to Accra if geolocation fails
      lat = 5.6037
      lng = -0.187
    }

    const token = getToken()
    const color = getRandomColor()

    const { error } = await supabase.from('echoes').insert([
      {
        visitor_token: token,
        building: building.trim(),
        thinking: thinking.trim(),
        lat,
        lng,
        city,
        country_code,
        color
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

    // Fly to their location
    if (globeInstanceRef.current) {
      globeInstanceRef.current.pointOfView({ lat, lng, altitude: 1.5 }, 1500)
    }

    setTimeout(() => {
      setShowForm(false)
      setFormState('idle')
    }, 3000)
  }

  return (
    <div className='echoes-wrapper'>
      {/* Globe */}
      <div className='echoes-globe-container'>
        <div ref={globeRef} className='echoes-globe' />

        {/* Hovered echo preview */}
        {hoveredEcho && (
          <div className='echoes-preview'>
            <div
              className='echoes-preview__dot'
              style={{ background: hoveredEcho.color }}
            />
            <div>
              <p className='echoes-preview__location'>
                {hoveredEcho.city}
                {hoveredEcho.country_code
                  ? `, ${hoveredEcho.country_code}`
                  : ''}
              </p>
              <p className='echoes-preview__building'>
                Building: {hoveredEcho.building}
              </p>
              {hoveredEcho.thinking && (
                <p className='echoes-preview__thinking'>
                  &ldquo;{hoveredEcho.thinking}&rdquo;
                </p>
              )}
            </div>
          </div>
        )}

        {/* Echo count */}
        <div className='echoes-count'>
          <span className='echoes-count__dot' />
          <span className='mono'>
            {echoes.length} echo{echoes.length !== 1 ? 's' : ''} dropped
          </span>
        </div>
      </div>

      {/* Form panel */}
      <div
        className={`echoes-form-panel ${
          showForm ? 'echoes-form-panel--open' : ''
        }`}
      >
        <div className='echoes-form-panel__inner'>
          <div className='echoes-form-panel__header'>
            <p className='mono mono--teal'>Drop your echo</p>
            <button
              className='echoes-form-panel__close'
              onClick={() => setShowForm(false)}
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

          {formState === 'success' ? (
            <div className='echoes-form-panel__success'>
              <div className='echoes-form-panel__success-icon'>✓</div>
              <p>Your echo is on the globe.</p>
              <p
                className='mono'
                style={{ marginTop: '0.5rem', fontSize: '11px' }}
              >
                Flying to your location...
              </p>
            </div>
          ) : (
            <>
              <p className='echoes-form-panel__desc'>
                Leave a trace. Tell the globe what you&apos;re building and what
                you can&apos;t stop thinking about.
              </p>

              <div className='echoes-form-fields'>
                <div>
                  <label className='echoes-form-label'>
                    What are you building?
                  </label>
                  <input
                    type='text'
                    value={building}
                    onChange={e => setBuilding(e.target.value)}
                    placeholder='A tool for...'
                    maxLength={100}
                    className='echoes-form-input'
                    style={{
                      borderBottomColor: buildingFocused
                        ? 'var(--teal)'
                        : 'var(--border)'
                    }}
                    onFocus={() => setBuildingFocused(true)}
                    onBlur={() => setBuildingFocused(false)}
                  />
                </div>
                <div>
                  <label className='echoes-form-label'>
                    What can&apos;t you stop thinking about?
                  </label>
                  <input
                    type='text'
                    value={thinking}
                    onChange={e => setThinking(e.target.value)}
                    placeholder='Why does X still work this way...'
                    maxLength={140}
                    className='echoes-form-input'
                    style={{
                      borderBottomColor: thinkingFocused
                        ? 'var(--teal)'
                        : 'var(--border)'
                    }}
                    onFocus={() => setThinkingFocused(true)}
                    onBlur={() => setThinkingFocused(false)}
                  />
                </div>
              </div>

              {formState === 'error' && (
                <p className='echoes-form-error'>
                  Something went wrong. Try again.
                </p>
              )}

              <button
                className='echoes-form-submit'
                onClick={handleSubmit}
                disabled={
                  formState === 'loading' ||
                  !building.trim() ||
                  !thinking.trim()
                }
              >
                {formState === 'loading' ? 'Dropping...' : 'Drop your echo →'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Drop echo trigger */}
      {!showForm && (
        <div className='echoes-trigger'>
          <button
            className='echoes-trigger__btn'
            onClick={() => setShowForm(true)}
          >
            {hasDropped ? "You've left your trace ✓" : 'Drop your echo ↓'}
          </button>
        </div>
      )}
    </div>
  )
}
