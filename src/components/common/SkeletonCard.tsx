import { useTheme } from '../../context/ThemeContext'

const SkeletonCard = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className={`animate-pulse space-y-3 rounded-2xl border p-4 ${isDark ? 'border-slate-700 bg-slate-900/60' : 'border-slate-200 bg-white'}`}>
      <div className={`h-32 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
      <div className={`h-4 w-1/2 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
      <div className={`h-4 w-2/3 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
      <div className={`h-8 w-1/3 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
    </div>
  )
}

export default SkeletonCard
