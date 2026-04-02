import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import SEO from '../components/common/SEO'
import Loader from '../components/common/Loader'
import MatchStatusBadge from '../components/matches/MatchStatusBadge'
import ServerSelector from '../components/matches/ServerSelector'
import { getMatchById } from '../services/api/api'
import type { Match } from '../types/match'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

const MatchDetailsPage = () => {
  const { matchId = '' } = useParams()
  const [match, setMatch] = useState<Match | null>(null)
  const [selectedServerId, setSelectedServerId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    const loadMatch = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getMatchById(matchId)
        setMatch(response)
        setSelectedServerId(response.streams[0]?.id ?? '')
      } catch {
        setError('match.loadDetailsError')
      } finally {
        setLoading(false)
      }
    }

    void loadMatch()
  }, [matchId])

  const currentServer = useMemo(
    () => match?.streams.find((server) => server.id === selectedServerId),
    [match, selectedServerId],
  )
  useEffect(() => {
    if (!matchId || match?.status !== 'LIVE') return

    const intervalId = window.setInterval(async () => {
      try {
        const updated = await getMatchById(matchId)
        setMatch(updated)
      } catch {
        // Keep current match state; avoid disruptive UI changes while auto-refreshing.
      }
    }, 30000)

    return () => window.clearInterval(intervalId)
  }, [matchId, match?.status])

  if (loading) {
    return <Loader />
  }

  if (error || !match) {
    return (
      <p className={`rounded-lg p-4 ${isDark ? 'bg-red-500/10 text-red-300' : 'bg-red-100 text-red-700'}`}>
        {t(error ?? 'match.notFound')}
      </p>
    )
  }

  return (
    <>
      <SEO
        title={`${match.homeTeam.name} vs ${match.awayTeam.name} | ${t('app.name')}`}
        description={`${match.league} ${t('match.seoDescriptionSuffix')}`}
      />

      <section className="space-y-6">
        <header className="overflow-hidden rounded-2xl border border-white/20">
          <div
            className="relative h-[180px] bg-cover bg-center sm:h-[260px]"
            style={{
              backgroundImage: `url('${match.thumbnail}')`,
            }}
          >
            <div
              className={`absolute inset-0 ${
                isDark
                  ? 'bg-gradient-to-b from-slate-950/55 via-slate-950/45 to-slate-950/85'
                  : 'bg-gradient-to-b from-slate-100/55 via-slate-100/45 to-slate-100/80'
              }`}
            />

            <div className="relative flex h-full items-center justify-center px-4">
              <div className={`grid w-full max-w-4xl grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={match.homeTeam.logo}
                    alt={match.homeTeam.name}
                    className="h-16 w-16 rounded-full border-2 border-white/60 object-cover shadow-lg sm:h-24 sm:w-24"
                    loading="lazy"
                  />
                  <p className="text-lg font-extrabold drop-shadow sm:text-3xl">{match.homeTeam.name}</p>
                </div>

                <p className={`text-5xl font-black tracking-widest drop-shadow-md sm:text-7xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  VS
                </p>

                <div className="flex flex-col items-center gap-2">
                  <img
                    src={match.awayTeam.logo}
                    alt={match.awayTeam.name}
                    className="h-16 w-16 rounded-full border-2 border-white/60 object-cover shadow-lg sm:h-24 sm:w-24"
                    loading="lazy"
                  />
                  <p className="text-lg font-extrabold drop-shadow sm:text-3xl">{match.awayTeam.name}</p>
                </div>
              </div>
            </div>

            <div
              className={`absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3 rounded-xl px-3 py-2 backdrop-blur ${
                isDark ? 'bg-slate-950/60' : 'bg-white/75'
              }`}
            >
              <p className={`text-xs font-semibold sm:text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {match.league} - {match.kickoffTime} - {match.stadium}
              </p>
              <MatchStatusBadge status={match.status} />
            </div>
          </div>
        </header>

        <div className={`overflow-hidden rounded-xl border ${isDark ? 'border-slate-700 bg-black' : 'border-slate-300 bg-white'}`}>
          {currentServer?.iframeUrl ? (
            <iframe
              src={currentServer.iframeUrl}
              title={t('match.playerTitle')}
              className="h-[260px] w-full md:h-[520px]"
              allow="autoplay; fullscreen"
            />
          ) : (
            <div className={`flex h-[260px] flex-col items-center justify-center gap-3 md:h-[520px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <p className="text-lg font-semibold">{t('match.liveCenterTitle')}</p>
              <p className="text-2xl font-extrabold">
                {match.awayTeam.name} {match.score?.away ?? 0} - {match.score?.home ?? 0} {match.homeTeam.name}
              </p>
              <p className="text-sm">
                {match.status === 'LIVE' && typeof match.minute === 'number'
                  ? `${t('match.liveMinute')}: ${match.minute}'`
                  : t('match.liveCenterDescription')}
              </p>
            </div>
          )}
        </div>

        <ServerSelector
          servers={match.streams}
          selectedServerId={selectedServerId}
          onServerChange={setSelectedServerId}
        />
      </section>
    </>
  )
}

export default MatchDetailsPage
