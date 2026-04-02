import { Link } from 'react-router-dom'
import SEO from '../components/common/SEO'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

const NotFoundPage = () => {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <>
      <SEO
        title={`${t('notFound.title')} | ${t('app.name')}`}
        description={t('notFound.description')}
      />
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>404</h1>
        <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
          {t('notFound.message')}
        </p>
        <Link
          to="/"
          className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-400"
        >
          {t('notFound.backHome')}
        </Link>
      </section>
    </>
  )
}

export default NotFoundPage
