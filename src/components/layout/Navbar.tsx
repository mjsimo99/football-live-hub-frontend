import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      isActive
        ? 'bg-emerald-400 text-slate-950'
        : isDark
          ? 'text-slate-200 hover:bg-slate-800/80 hover:text-white'
          : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
    }`

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
        isDark
          ? 'border-slate-700/50 bg-slate-950/80'
          : 'border-slate-300/80 bg-white/75'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink
          to="/"
          className={`text-lg font-extrabold md:text-xl ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}
        >
          {t('app.name')}
        </NavLink>
        <button
          className={`rounded-md border px-3 py-2 md:hidden ${isDark ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-700'}`}
          onClick={() => setIsOpen((prev) => !prev)}
          type="button"
        >
          {t('navbar.menu')}
        </button>

        <div className={`${isOpen ? 'flex' : 'hidden'} items-center gap-2 md:flex`}>
          <NavLink to="/" className={linkClass}>
            {t('navbar.home')}
          </NavLink>
          <NavLink to="/search" className={linkClass}>
            {t('navbar.search')}
          </NavLink>
          <div className="relative">
            <select
              aria-label={t('navbar.languageLabel')}
              value={language}
              onChange={(event) => setLanguage(event.target.value as 'en' | 'fr' | 'ar')}
              className={`appearance-none rounded-full border px-3 py-2 text-sm font-semibold outline-none transition focus:ring-2 ${
                isDark
                  ? 'border-emerald-400/40 bg-slate-900/80 text-emerald-200 shadow-[0_0_0_1px_rgba(16,185,129,0.15)] hover:border-emerald-300 focus:border-emerald-300 focus:ring-emerald-400/30'
                  : 'border-emerald-600/35 bg-white text-emerald-800 shadow-[0_0_0_1px_rgba(5,150,105,0.12)] hover:border-emerald-600 focus:border-emerald-600 focus:ring-emerald-600/20'
              }`}
            >
              <option value="en">English</option>
              <option value="fr">Francais</option>
              <option value="ar">العربية</option>
            </select>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
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
