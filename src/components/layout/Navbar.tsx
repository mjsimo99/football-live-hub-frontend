import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useLanguage, type LanguageCode } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex w-full items-center justify-center rounded-full border px-4 py-2 text-center text-sm font-semibold transition md:w-auto ${
      isActive
        ? 'border-emerald-400 bg-emerald-400 text-slate-950'
        : isDark
          ? 'border-slate-600 text-slate-200 hover:border-slate-500 hover:bg-slate-800/80 hover:text-white'
          : 'border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-200 hover:text-slate-900'
    }`

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const closeMobileMenu = () => setIsOpen(false)

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
        isDark
          ? 'border-slate-700/50 bg-slate-950/80'
          : 'border-slate-300/80 bg-white/75'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <NavLink
          to="/"
          onClick={closeMobileMenu}
          className={`text-lg font-extrabold md:text-xl ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}
        >
          {t('app.name')}
        </NavLink>
        <button
          aria-expanded={isOpen}
          aria-label={t('navbar.menu')}
          className={`group relative flex h-11 w-11 items-center justify-center rounded-xl border transition md:hidden ${
            isDark
              ? 'border-slate-700 bg-slate-900/70 text-slate-200 hover:border-emerald-300/60'
              : 'border-slate-300 bg-white/95 text-slate-700 hover:border-emerald-600/50'
          }`}
          onClick={() => setIsOpen((prev) => !prev)}
          type="button"
        >
          <span
            className={`absolute h-0.5 w-5 rounded-full transition ${
              isOpen ? 'translate-y-0 rotate-45' : '-translate-y-1.5'
            } ${isDark ? 'bg-slate-100' : 'bg-slate-800'}`}
          />
          <span
            className={`absolute h-0.5 w-5 rounded-full transition ${
              isOpen ? 'opacity-0' : 'opacity-100'
            } ${isDark ? 'bg-slate-100' : 'bg-slate-800'}`}
          />
          <span
            className={`absolute h-0.5 w-5 rounded-full transition ${
              isOpen ? 'translate-y-0 -rotate-45' : 'translate-y-1.5'
            } ${isDark ? 'bg-slate-100' : 'bg-slate-800'}`}
          />
        </button>

        <div
          className={`${
            isOpen ? 'flex' : 'hidden'
          } w-full flex-col gap-3 rounded-2xl border p-4 shadow-xl md:flex md:w-auto md:flex-row md:items-center md:gap-2 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none ${
            isDark ? 'border-slate-700/70 bg-slate-900/95' : 'border-slate-200 bg-white/95'
          }`}
        >
          <div className="grid w-full grid-cols-3 items-center gap-2 md:ml-1 md:flex md:w-auto">
            <NavLink to="/" onClick={closeMobileMenu} className={linkClass}>
              {t('navbar.home')}
            </NavLink>
            <NavLink to="/search" onClick={closeMobileMenu} className={linkClass}>
              {t('navbar.search')}
            </NavLink>
            <div className="relative">
              <select
                aria-label={t('navbar.languageLabel')}
                value={language}
                onChange={(event) => {
                  setLanguage(event.target.value as LanguageCode)
                  closeMobileMenu()
                }}
                className={`w-full appearance-none rounded-full border px-3 py-2 text-center text-sm font-semibold outline-none transition focus:ring-2 md:w-auto ${
                  isDark
                    ? 'border-emerald-400/40 bg-slate-900/80 text-emerald-200 shadow-[0_0_0_1px_rgba(16,185,129,0.15)] hover:border-emerald-300 focus:border-emerald-300 focus:ring-emerald-400/30'
                    : 'border-emerald-600/35 bg-white text-emerald-800 shadow-[0_0_0_1px_rgba(5,150,105,0.12)] hover:border-emerald-600 focus:border-emerald-600 focus:ring-emerald-600/20'
                }`}
              >
                <option value="en">English</option>
                <option value="es">Espanol</option>
                <option value="fr">Francais</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              toggleTheme()
              closeMobileMenu()
            }}
            className={`w-full rounded-full border px-4 py-2 text-sm font-semibold transition md:w-auto ${
              isDark
                ? 'border-amber-300/50 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isDark ? t('navbar.lightMode') : t('navbar.darkMode')}
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
