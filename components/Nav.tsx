'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'
import Image from 'next/image'

export default function Nav () {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()

  const links = [
    { href: '/projects', label: 'Projects' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' }
  ]

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        padding: '12px 1.5rem',
        pointerEvents: 'none'
      }}
    >
      <nav
        style={{
          width: '100%',
          maxWidth: '900px',
          pointerEvents: 'all',
          backgroundColor:
            theme === 'dark' ? 'rgba(10,10,10,0.75)' : 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(32px) saturate(200%)',
          WebkitBackdropFilter: 'blur(32px) saturate(200%)',
          borderRadius: '14px',
          border:
            theme === 'dark'
              ? '0.5px solid rgba(255,255,255,0.08)'
              : '0.5px solid rgba(0,0,0,0.08)',
          boxShadow:
            theme === 'dark'
              ? '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
              : '0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
          padding: '0 1.25rem',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Avatar + name */}
        <Link
          href='/'
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {/* <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700,
              color: 'white',
              flexShrink: 0,
              fontFamily: 'var(--font-sans)',
            }}
          >
            PN
          </div> */}
          <Image
            src='/avatar.jpg'
            alt='Phinehas Newman'
            width={28}
            height={28}
            style={{
              borderRadius: '50%',
              objectFit: 'cover',
              flexShrink: 0
            }}
          />
          <span
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              letterSpacing: '0.01em'
            }}
          >
            Phinehas Newman
          </span>
        </Link>

        {/* Nav links + theme toggle */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {links.map(link => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: '12px',
                  color: active
                    ? theme === 'dark'
                      ? 'white'
                      : '#0a0a0a'
                    : 'var(--text-tertiary)',
                  textDecoration: 'none',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  transition: 'all 0.15s ease',
                  background: active
                    ? theme === 'dark'
                      ? 'rgba(255,255,255,0.1)'
                      : 'rgba(0,0,0,0.07)'
                    : 'transparent',
                  backdropFilter: active ? 'blur(8px)' : 'none',
                  fontWeight: active ? 500 : 400
                }}
                onMouseEnter={e => {
                  if (!active) {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background =
                      theme === 'dark'
                        ? 'rgba(255,255,255,0.07)'
                        : 'rgba(0,0,0,0.05)'
                    el.style.backdropFilter = 'blur(8px)'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background = 'transparent'
                    el.style.backdropFilter = 'none'
                  }
                }}
              >
                {link.label}
              </Link>
            )
          })}

          <button
            onClick={toggle}
            aria-label='Toggle theme'
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '5px 8px',
              color: 'var(--text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              marginLeft: '4px'
            }}
          >
            {theme === 'dark' ? (
              <svg
                width='15'
                height='15'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
              >
                <circle cx='12' cy='12' r='5' />
                <line x1='12' y1='1' x2='12' y2='3' />
                <line x1='12' y1='21' x2='12' y2='23' />
                <line x1='4.22' y1='4.22' x2='5.64' y2='5.64' />
                <line x1='18.36' y1='18.36' x2='19.78' y2='19.78' />
                <line x1='1' y1='12' x2='3' y2='12' />
                <line x1='21' y1='12' x2='23' y2='12' />
                <line x1='4.22' y1='19.78' x2='5.64' y2='18.36' />
                <line x1='18.36' y1='5.64' x2='19.78' y2='4.22' />
              </svg>
            ) : (
              <svg
                width='15'
                height='15'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
              >
                <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
              </svg>
            )}
          </button>
        </div>
      </nav>
    </div>
  )
}
