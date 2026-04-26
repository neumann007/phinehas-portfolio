'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'

export default function Nav () {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()

  const links = [
    { href: '/work', label: 'Work' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
  ]

  const navStyle = theme === 'dark'
    ? {
        backgroundColor: 'rgba(10,10,10,0.85)',
        borderBottom: '0.5px solid rgba(255,255,255,0.06)',
        boxShadow: '0 1px 0 rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
      }
    : {
        backgroundColor: 'var(--nav-bg)',
        borderBottom: '0.5px solid rgba(255,255,255,0.15)',
        boxShadow: '0 1px 0 rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.1)',
      }

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        ...navStyle,
      }}
    >
      <div
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Name — home link */}
        <Link
          href='/'
          style={{
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.04em',
            color: 'var(--text-primary)',
            textDecoration: 'none',
          }}
        >
          Phinehas Newman
        </Link>

        {/* Nav links + theme toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: '12px',
                color: pathname === link.href ? 'var(--teal)' : 'var(--text-tertiary)',
                textDecoration: 'none',
                fontWeight: pathname === link.href ? 500 : 400,
                borderBottom: pathname === link.href
                  ? '1px solid var(--teal)'
                  : '1px solid transparent',
                paddingBottom: '1px',
                transition: 'all 0.15s ease',
              }}
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={toggle}
            aria-label='Toggle theme'
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: 'var(--text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              marginLeft: '0.5rem',
            }}
          >
            {theme === 'dark' ? (
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
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
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}
