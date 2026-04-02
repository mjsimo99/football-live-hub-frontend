import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

const MainLayout = () => {
  const { language } = useLanguage()
  const { theme } = useTheme()

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language])

  return (
    <div className={theme === 'dark' ? 'min-h-screen bg-slate-950 text-slate-100' : 'min-h-screen bg-slate-100 text-slate-900'}>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
