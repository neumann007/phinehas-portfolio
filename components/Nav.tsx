'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/components/ThemeProvider'
import { useState, useEffect } from 'react'

const links = [
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' }
]

export default function Nav () {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const openMenu = () => {
    setMenuOpen(true)
    document.documentElement.classList.add('menu-open')
  }

  const closeMenu = () => {
    setMenuOpen(false)
    document.documentElement.classList.remove('menu-open')
  }

  const isDark = theme === 'dark'

  return (
    <>
      <div className='nav-wrapper'>
        <nav
          className={`nav-bar ${isDark ? 'nav-bar--dark' : 'nav-bar--light'} ${
            scrolled ? 'nav-bar--scrolled' : ''
          }`}
        >
          <Link href='/' className='nav-logo' onClick={closeMenu}>
            <Image
              src='/avatar.jpg'
              alt='Phinehas Newman'
              width={28}
              height={28}
              className='nav-avatar'
            />
            <span className='nav-name'>Phinehas Newman</span>
          </Link>

          {/* Desktop links */}
          <div className='nav-links nav-links--desktop'>
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${
                  pathname === link.href ? 'nav-link--active' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              className='nav-toggle'
              onClick={toggle}
              aria-label='Toggle theme'
            >
              {isDark ? (
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

          {/* Mobile right side */}
          <div className='nav-links nav-links--mobile'>
            <button
              className='nav-toggle'
              onClick={toggle}
              aria-label='Toggle theme'
            >
              {isDark ? (
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
            <button
              className={`nav-hamburger ${
                menuOpen ? 'nav-hamburger--open' : ''
              }`}
              onClick={menuOpen ? closeMenu : openMenu}
              aria-label='Toggle menu'
            >
              <span className='nav-hamburger__line' />
              <span className='nav-hamburger__line' />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}
        onClick={closeMenu}
      >
        <div
          className={`mobile-menu__panel ${
            menuOpen ? 'mobile-menu__panel--open' : ''
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className='mobile-menu__header'>
            <div className='mobile-menu__identity'>
              <Image
                src='/avatar.jpg'
                alt='Phinehas Newman'
                width={36}
                height={36}
                className='mobile-menu__avatar'
              />
              <div>
                <p className='mobile-menu__name'>Phinehas Newman</p>
                <p className='mobile-menu__role'>Full-stack engineer · Accra</p>
              </div>
            </div>
            <button
              className='mobile-menu__close'
              onClick={closeMenu}
              aria-label='Close menu'
            >
              <svg
                width='18'
                height='18'
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

          <nav className='mobile-menu__nav'>
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={`mobile-menu__link ${
                  pathname === link.href ? 'mobile-menu__link--active' : ''
                }`}
                style={{ animationDelay: menuOpen ? `${i * 0.06}s` : '0s' }}
                onClick={closeMenu}
              >
                <span className='mobile-menu__link-label'>{link.label}</span>
                <svg
                  width='14'
                  height='14'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M5 12h14M12 5l7 7-7 7' />
                </svg>
              </Link>
            ))}
          </nav>

          <div className='mobile-menu__footer'>
            <p className='mono'>Open to work · 2026</p>
            <a
              href='mailto:phinehasnewman@gmail.com'
              className='link-teal'
              style={{ fontSize: '12px' }}
            >
              phinehasnewman@gmail.com
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
