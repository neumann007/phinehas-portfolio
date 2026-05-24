'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/components/ThemeProvider'
import { useState, useEffect } from 'react'

const links = [
  { href: '/projects', label: 'Projects' },
  { href: '/deck', label: 'Deck' },
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
              <span aria-hidden='true'>{isDark ? '☀' : '☾'}</span>
            </button>
          </div>

          {/* Mobile right side */}
          <div className='nav-links nav-links--mobile'>
            <button
              className='nav-toggle'
              onClick={toggle}
              aria-label='Toggle theme'
            >
              <span aria-hidden='true'>{isDark ? '☀' : '☾'}</span>
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
              <span aria-hidden='true'>×</span>
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
                <span aria-hidden='true'>→</span>
              </Link>
            ))}
          </nav>

          <div className='mobile-menu__footer'>
            {/* <p className='mono'>Open to work</p> */}
            <p className='mono'>2026</p>
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
