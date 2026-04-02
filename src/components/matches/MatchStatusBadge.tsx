import type { MatchStatus } from '../../types/match'
import { useTheme } from '../../context/ThemeContext'

interface MatchStatusBadgeProps {
  status: MatchStatus
}

const darkStatusClassMap: Record<MatchStatus, string> = {
  LIVE: 'bg-red-600/20 text-red-300 border-red-500/40',
  FINISHED: 'bg-slate-700/60 text-slate-300 border-slate-500/40',
  UPCOMING: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40',
}

const lightStatusClassMap: Record<MatchStatus, string> = {
  LIVE: 'bg-red-100 text-red-700 border-red-200',
  FINISHED: 'bg-slate-200 text-slate-700 border-slate-300',
  UPCOMING: 'bg-emerald-100 text-emerald-700 border-emerald-200',
}

const MatchStatusBadge = ({ status }: MatchStatusBadgeProps) => {
  const { theme } = useTheme()
  const statusClassMap = theme === 'dark' ? darkStatusClassMap : lightStatusClassMap

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClassMap[status]}`}>
      {status}
    </span>
  )
}

export default MatchStatusBadge
