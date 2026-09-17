import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../theme/ThemeProvider'

export function SiteHeader() {
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isDark = theme === 'dark'

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`.trim()}>
      <div className="site-header__inner">
        <Link to="/products" className="site-header__brand" aria-label="Restart Technology">
          <img src="/fullwhitelogo.svg" alt="Restart Technology" width={190} height={32} />
          <span className="site-header__chip">Catalog</span>
        </Link>

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={isDark}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.6 3.1a8.8 8.8 0 1 0 6.3 15.5 8 8 0 0 1-8.8-12.6 8.8 8.8 0 0 0 2.5-2.9Z"
      />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 7.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 7.2ZM12 2.5a1 1 0 0 1 1 1V5a1 1 0 0 1-2 0V3.5a1 1 0 0 1 1-1Zm0 15.5a1 1 0 0 1 1 1v1.5a1 1 0 0 1-2 0V19a1 1 0 0 1 1-1ZM3.5 11a1 1 0 0 1 1-1H6a1 1 0 0 1 0 2H4.5a1 1 0 0 1-1-1Zm15.5 0a1 1 0 0 1 1-1H21.5a1 1 0 0 1 0 2H20a1 1 0 0 1-1-1ZM5.6 5.6a1 1 0 0 1 1.4 0l1.1 1.1a1 1 0 0 1-1.4 1.4L5.6 7a1 1 0 0 1 0-1.4Zm10.3 10.3a1 1 0 0 1 1.4 0l1.1 1.1a1 1 0 1 1-1.4 1.4l-1.1-1.1a1 1 0 0 1 0-1.4ZM18.4 5.6a1 1 0 0 1 0 1.4L17.3 8.1a1 1 0 1 1-1.4-1.4l1.1-1.1a1 1 0 0 1 1.4 0ZM8.1 15.9a1 1 0 0 1 0 1.4L7 18.4A1 1 0 1 1 5.6 17l1.1-1.1a1 1 0 0 1 1.4 0Z"
      />
    </svg>
  )
}
