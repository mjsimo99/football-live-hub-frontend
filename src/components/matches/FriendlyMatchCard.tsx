import type { Match } from '../../types/match'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

interface FriendlyMatchCardProps {
  match: Match
  liveLabel: string
  upcomingLabel: string
  finishedLabel: string
  competitionLabel: string
  channelLabel: string
}

const FriendlyMatchCard = ({
  match,
  liveLabel,
  upcomingLabel,
  finishedLabel,
  competitionLabel,
  channelLabel,
}: FriendlyMatchCardProps) => {
  const { t } = useLanguage()
  const statusMap = {
    LIVE: {
      label: liveLabel,
      className: 'bg-emerald-500/20 text-emerald-700 ring-emerald-500/30',
    },
    UPCOMING: {
      label: upcomingLabel,
      className: 'bg-sky-500/20 text-sky-700 ring-sky-500/30',
    },
    FINISHED: {
      label: finishedLabel,
      className: 'bg-slate-500/20 text-slate-700 ring-slate-500/30',
    },
  } as const

  // Score follows visual order: left team - right team.
  const centerText =
    match.status === 'UPCOMING'
      ? match.kickoffTime
      : `${match.score?.away ?? 0} - ${match.score?.home ?? 0}`

  return (
    <Link
      to={`/matches/${match.id}`}
      className="group block rounded-2xl border border-white/25 bg-white/85 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.20)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.30)] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80"
      aria-label={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
        <div className="flex items-center justify-start gap-3">
          <img
            src={match.awayTeam.logo}
            alt={match.awayTeam.name}
            className="h-12 w-12 rounded-full border-2 border-slate-200 object-cover"
            loading="lazy"
          />
          <p className="text-base font-bold text-slate-800 sm:text-lg">{match.awayTeam.name}</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-extrabold text-slate-900 sm:text-xl">{centerText}</p>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusMap[match.status].className}`}
          >
            {match.status === 'LIVE' && <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />}
            {statusMap[match.status].label}
          </span>
        </div>

        <div className="flex items-center justify-end gap-3">
          <p className="text-base font-bold text-slate-800 sm:text-lg">{match.homeTeam.name}</p>
          <img
            src={match.homeTeam.logo}
            alt={match.homeTeam.name}
            className="h-12 w-12 rounded-full border-2 border-slate-200 object-cover"
            loading="lazy"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-200/70 pt-3 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <span aria-hidden>🏆</span>
          {competitionLabel}: {match.competitionName ?? match.league}
        </p>
        <p className="flex items-center gap-2">
          <span aria-hidden>📺</span>
          {channelLabel}: {match.broadcastChannel ?? t('match.channelFallback')}
        </p>
      </div>
    </Link>
  )
}

export default FriendlyMatchCard
