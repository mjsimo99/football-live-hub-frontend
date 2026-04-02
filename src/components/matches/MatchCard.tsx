import { Link } from 'react-router-dom'
import type { Match } from '../../types/match'
import MatchStatusBadge from './MatchStatusBadge'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'

interface MatchCardProps {
  match: Match
}

const MatchCard = ({ match }: MatchCardProps) => {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const scoreText = match.score
    ? `${match.score.home} - ${match.score.away}`
    : match.status === 'UPCOMING'
      ? match.kickoffTime
      : '0 - 0'

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        isDark ? 'border-slate-700 bg-slate-900/70 hover:border-emerald-400/40' : 'border-slate-200 bg-white hover:border-emerald-500/40'
      }`}
    >
      <div className="flex items-center justify-between p-4 pb-0">
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>
          {match.kickoffTime}
        </span>
        <MatchStatusBadge status={match.status} />
      </div>

      <div className="flex flex-1 flex-col space-y-4 p-4">
        <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{match.league}</p>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="flex flex-col items-center gap-2 text-center">
            <img
              src={match.homeTeam.logo}
              alt={match.homeTeam.name}
              className="h-11 w-11 rounded-full border border-slate-300/70 object-cover"
              loading="lazy"
            />
            <p className={`text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {match.homeTeam.name}
            </p>
          </div>

          <div className="text-center">
            <p className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {scoreText}
            </p>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{match.stadium || '-'}</p>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <img
              src={match.awayTeam.logo}
              alt={match.awayTeam.name}
              className="h-11 w-11 rounded-full border border-slate-300/70 object-cover"
              loading="lazy"
            />
            <p className={`text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {match.awayTeam.name}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-1">
          <Link
            to={`/matches/${match.id}`}
            className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
          >
            {t('match.detailsButton')}
          </Link>
        </div>
      </div>
      {/* preserve card spacing and avoid sudden layout changes */}
      <div className="sr-only">
        {match.homeTeam.name} vs {match.awayTeam.name}
      </div>
    </article>
  )
}

export default MatchCard
