import { useTheme } from '../../context/ThemeContext'
import { useLanguage } from '../../context/LanguageContext'

const Footer = () => {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const isDark = theme === 'dark'

  return (
    <footer className={`border-t ${isDark ? 'border-slate-700/60 bg-slate-950' : 'border-slate-300 bg-white'}`}>
      <div
        className={`mx-auto flex max-w-6xl flex-col gap-3 p-6 text-sm md:flex-row md:items-center md:justify-between ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}
      >
        <p>
          © {new Date().getFullYear()} {t('app.name')}. {t('footer.rights')}
        </p>
        <div className="flex gap-4">
          <a className={isDark ? 'hover:text-emerald-300' : 'hover:text-emerald-700'} href="#">
            {t('footer.privacy')}
          </a>
          <a className={isDark ? 'hover:text-emerald-300' : 'hover:text-emerald-700'} href="#">
            {t('footer.terms')}
          </a>
          <a className={isDark ? 'hover:text-emerald-300' : 'hover:text-emerald-700'} href="#">
            {t('footer.contact')}
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
