import { useMemo, useState } from 'react'
import SEO from '../components/common/SEO'
import MatchCard from '../components/matches/MatchCard'
import SkeletonCard from '../components/common/SkeletonCard'
import { useMatches } from '../hooks/useMatches'
import type { MatchStatus } from '../types/match'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

const SearchPage = () => {
  const { data, loading } = useMatches()
  const { t } = useLanguage()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [league, setLeague] = useState('')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState<MatchStatus | 'ALL'>('ALL')

  const leagues = useMemo(() => Array.from(new Set(data.map((match) => match.league))), [data])

  const filtered = useMemo(
    () =>
      data.filter((match) => {
        const leagueMatch = league ? match.league === league : true
        const dateMatch = date ? match.date === date : true
        const statusMatch = status !== 'ALL' ? match.status === status : true

        return leagueMatch && dateMatch && statusMatch
      }),
    [data, league, date, status],
  )

  return (
    <>
      <SEO
        title={`${t('search.title')} | ${t('app.name')}`}
        description={t('search.seoDescription')}
      />
      <section className="space-y-6">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('search.title')}</h1>

        <div className={`grid gap-3 rounded-xl border p-4 md:grid-cols-3 ${isDark ? 'border-slate-700 bg-slate-900/60' : 'border-slate-200 bg-white'}`}>
          <select
            className={`rounded-md border p-2 ${isDark ? 'border-slate-700 bg-slate-800 text-slate-100' : 'border-slate-300 bg-white text-slate-800'}`}
            value={league}
            onChange={(event) => setLeague(event.target.value)}
          >
            <option value="">{t('search.allLeagues')}</option>
            {leagues.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <input
            className={`rounded-md border p-2 ${isDark ? 'border-slate-700 bg-slate-800 text-slate-100' : 'border-slate-300 bg-white text-slate-800'}`}
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />

          <select
            className={`rounded-md border p-2 ${isDark ? 'border-slate-700 bg-slate-800 text-slate-100' : 'border-slate-300 bg-white text-slate-800'}`}
            value={status}
            onChange={(event) => setStatus(event.target.value as MatchStatus | 'ALL')}
          >
            <option value="ALL">{t('search.allStatus')}</option>
            <option value="LIVE">{t('search.live')}</option>
            <option value="UPCOMING">{t('search.upcoming')}</option>
            <option value="FINISHED">{t('search.finished')}</option>
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)
            : filtered.map((match) => <MatchCard key={match.id} match={match} />)}
        </div>
      </section>
    </>
  )
}

export default SearchPage
