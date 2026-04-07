import { useEffect, useMemo, useState } from 'react'
import SEO from '../components/common/SEO'
import MatchCard from '../components/matches/MatchCard'
import SkeletonCard from '../components/common/SkeletonCard'
import { useMatches } from '../hooks/useMatches'
import type { MatchStatus } from '../types/match'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { searchTeams, type TeamSearchResult } from '../services/api/api'

type SearchMode = 'matches' | 'teams'

const SearchPage = () => {
  const [searchMode, setSearchMode] = useState<SearchMode>('matches')
  const [teamQuery, setTeamQuery] = useState('')
  const { data, loading } = useMatches()
  const { t, language } = useLanguage()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [league, setLeague] = useState('')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState<MatchStatus | 'ALL'>('ALL')
  const [teams, setTeams] = useState<TeamSearchResult[]>([])
  const [selectedTeam, setSelectedTeam] = useState<TeamSearchResult | null>(null)
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false)
  const [fanartIndex, setFanartIndex] = useState(0)
  const [showTeamSuggestions, setShowTeamSuggestions] = useState(false)
  const [teamsLoading, setTeamsLoading] = useState(false)
  const [teamsError, setTeamsError] = useState<string | null>(null)

  const leagues = useMemo(() => Array.from(new Set(data.map((match) => match.league))), [data])

  const filtered = useMemo(
    () =>
      data.filter((match) => {
        const teamNeedle = teamQuery.trim().toLowerCase()
        const teamMatch = teamNeedle
          ? match.homeTeam.name.toLowerCase().includes(teamNeedle) || match.awayTeam.name.toLowerCase().includes(teamNeedle)
          : true
        const leagueMatch = league ? match.league === league : true
        const dateMatch = date ? match.date === date : true
        const statusMatch = status !== 'ALL' ? match.status === status : true

        return teamMatch && leagueMatch && dateMatch && statusMatch
      }),
    [data, teamQuery, league, date, status],
  )
  const teamSuggestions = useMemo(() => teams.slice(0, 6), [teams])
  const suggestionCompletion = useMemo(() => {
    const query = teamQuery.trim().toLowerCase()
    if (!query) return ''
    const match = teamSuggestions.find((team) => team.name.toLowerCase().startsWith(query))
    return match?.name ?? ''
  }, [teamQuery, teamSuggestions])
  const selectedTeamFanartUrls = useMemo(() => {
    if (!selectedTeam) return []
    return selectedTeam.mediaGalleryUrls.length > 0 ? selectedTeam.mediaGalleryUrls : selectedTeam.fanartUrls
  }, [selectedTeam])
  const selectedTeamGeneralFields = useMemo(() => {
    if (!selectedTeam) return []
    return selectedTeam.infoFields
  }, [selectedTeam])
  const selectedTeamDescription = useMemo(() => {
    if (!selectedTeam) return ''

    if (language === 'fr') return selectedTeam.descriptionByLanguage.fr ?? selectedTeam.descriptionByLanguage.en ?? ''
    if (language === 'es') return selectedTeam.descriptionByLanguage.es ?? selectedTeam.descriptionByLanguage.en ?? ''
    if (language === 'ar') return selectedTeam.descriptionByLanguage.ar ?? selectedTeam.descriptionByLanguage.en ?? ''
    return selectedTeam.descriptionByLanguage.en ?? ''
  }, [selectedTeam, language])

  useEffect(() => {
    setFanartIndex(0)
  }, [selectedTeam?.id, isTeamDialogOpen])

  useEffect(() => {
    if (!isTeamDialogOpen || selectedTeamFanartUrls.length <= 1) return

    const intervalId = window.setInterval(() => {
      setFanartIndex((current) => (current + 1) % selectedTeamFanartUrls.length)
    }, 3000)

    return () => window.clearInterval(intervalId)
  }, [isTeamDialogOpen, selectedTeamFanartUrls.length])

  useEffect(() => {
    if (searchMode !== 'teams') return

    const query = teamQuery.trim()
    if (!query) {
      setTeams([])
      setSelectedTeam(null)
      setTeamsError(null)
      setShowTeamSuggestions(false)
      return
    }

    const timer = window.setTimeout(async () => {
      try {
        setTeamsLoading(true)
        setTeamsError(null)
        const result = await searchTeams(query)
        setTeams(result)
        setShowTeamSuggestions(true)
      } catch {
        setTeamsError('Unable to search teams right now.')
      } finally {
        setTeamsLoading(false)
      }
    }, 350)

    return () => window.clearTimeout(timer)
  }, [searchMode, teamQuery])

  return (
    <>
      <SEO
        title={`${t('search.title')} | ${t('app.name')}`}
        description={t('search.seoDescription')}
      />
      <section className="space-y-6">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('search.title')}</h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSearchMode('matches')}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              searchMode === 'matches'
                ? 'border-emerald-400 bg-emerald-400 text-slate-950'
                : isDark
                  ? 'border-slate-600 text-slate-200 hover:border-emerald-400'
                  : 'border-slate-300 text-slate-700 hover:border-emerald-600'
            }`}
          >
            Match Search
          </button>
          <button
            type="button"
            onClick={() => setSearchMode('teams')}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              searchMode === 'teams'
                ? 'border-emerald-400 bg-emerald-400 text-slate-950'
                : isDark
                  ? 'border-slate-600 text-slate-200 hover:border-emerald-400'
                  : 'border-slate-300 text-slate-700 hover:border-emerald-600'
            }`}
          >
            Team Search
          </button>
        </div>

        <div
          className={`grid gap-3 rounded-xl border p-4 md:grid-cols-4 ${
            isDark ? 'border-slate-700 bg-slate-900/60' : 'border-slate-200 bg-white'
          }`}
        >
          <div className={`${searchMode === 'teams' ? 'relative md:col-span-4' : ''}`}>
            <input
              className={`w-full rounded-xl border px-4 py-2.5 ${
                isDark
                  ? 'border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-400'
                  : 'border-slate-300 bg-white text-slate-800 placeholder:text-slate-500'
              }`}
              type="search"
              value={teamQuery}
              onFocus={() => {
                if (searchMode === 'teams' && teamSuggestions.length > 0) setShowTeamSuggestions(true)
              }}
              onBlur={() => {
                window.setTimeout(() => setShowTeamSuggestions(false), 140)
              }}
              onChange={(event) => {
                setTeamQuery(event.target.value)
                if (searchMode === 'teams') setSelectedTeam(null)
              }}
              placeholder={searchMode === 'teams' ? 'Search equipe (rea -> Real Madrid)' : 'Search teams (Barca, Real, Arsenal...)'}
            />
            {searchMode === 'teams' && suggestionCompletion && suggestionCompletion.toLowerCase() !== teamQuery.trim().toLowerCase() && (
              <button
                type="button"
                onClick={() => setTeamQuery(suggestionCompletion)}
                className={`mt-2 inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                  isDark
                    ? 'border-slate-600 bg-slate-800 text-slate-200 hover:border-emerald-400'
                    : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-emerald-500'
                }`}
              >
                API suggestion: {suggestionCompletion}
              </button>
            )}
            {searchMode === 'teams' && showTeamSuggestions && teamQuery.trim() && teamSuggestions.length > 0 && (
              <div
                className={`absolute z-20 mt-2 w-full rounded-xl border shadow-2xl ${
                  isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'
                }`}
              >
                {teamSuggestions.map((team) => (
                  <button
                    key={`suggest-${team.id}`}
                    type="button"
                    onClick={() => {
                      setTeamQuery(team.name)
                      setSelectedTeam(team)
                      setIsTeamDialogOpen(true)
                      setShowTeamSuggestions(false)
                    }}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left transition ${
                      isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                    }`}
                  >
                    <img src={team.badge} alt={team.name} className="h-9 w-9 rounded-full object-cover" loading="lazy" />
                    <div className="min-w-0">
                      <p className={`truncate text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{team.name}</p>
                      <p className={`truncate text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{team.league ?? 'Unknown League'}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          {searchMode === 'matches' && (
            <>
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
            </>
          )}
        </div>

        {searchMode === 'matches' ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)
              : filtered.map((match) => <MatchCard key={match.id} match={match} />)}
          </div>
        ) : (
          <div className="space-y-4">
            {teamsError && (
              <p className={`rounded-lg border p-3 text-sm ${isDark ? 'border-rose-500/40 bg-rose-500/10 text-rose-200' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                {teamsError}
              </p>
            )}
            <section
              className={`rounded-2xl border p-4 ${
                isDark ? 'border-emerald-400/20 bg-gradient-to-br from-slate-900 to-slate-950' : 'border-emerald-200 bg-gradient-to-br from-white to-emerald-50/60'
              }`}
            >
              <p className={`text-sm font-semibold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>Equipe Discovery</p>
              <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Professional team finder powered by live API. Start typing and let API suggestions complete club names for you.
              </p>
            </section>
            {teamsLoading && (
              <div className="grid gap-3 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)}
              </div>
            )}
            {!teamsLoading && teamQuery.trim() && teams.length === 0 && !teamsError && (
              <p className={`rounded-lg border p-3 text-sm ${isDark ? 'border-slate-700 bg-slate-900/60 text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}>
                No teams found.
              </p>
            )}
            {!teamsLoading && teams.length > 0 && (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {teams.map((team) => (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => {
                      setSelectedTeam(team)
                      setIsTeamDialogOpen(true)
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                      selectedTeam?.id === team.id
                        ? 'border-emerald-400 bg-emerald-400/10'
                        : isDark
                          ? 'border-slate-700 bg-slate-900/60 hover:border-emerald-400/70'
                          : 'border-slate-200 bg-white hover:border-emerald-500/70'
                    }`}
                  >
                    <img src={team.badge} alt={team.name} className="h-14 w-14 rounded-full object-cover" loading="lazy" />
                    <div className="min-w-0">
                      <p className={`truncate text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{team.name}</p>
                      <p className={`truncate text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{team.league ?? 'Unknown League'}</p>
                      <p className={`truncate text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{team.stadium ?? 'Unknown Stadium'}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
      {searchMode === 'teams' && selectedTeam && isTeamDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close details"
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setIsTeamDialogOpen(false)}
          />
          <section
            role="dialog"
            aria-modal="true"
            className={`relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border shadow-2xl ${
              isDark ? 'border-slate-700 bg-slate-900 text-slate-100' : 'border-slate-200 bg-white text-slate-900'
            }`}
          >
            <header className={`flex items-start justify-between border-b p-5 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="flex items-center gap-3">
                <img src={selectedTeam.badge} alt={selectedTeam.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-emerald-400/60" loading="lazy" />
                <div>
                  <h2 className="text-xl font-bold">{selectedTeam.name}</h2>
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{selectedTeam.league ?? 'Unknown League'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTeamDialogOpen(false)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
                  isDark ? 'border-slate-600 text-slate-200 hover:border-emerald-400' : 'border-slate-300 text-slate-700 hover:border-emerald-600'
                }`}
              >
                Close
              </button>
            </header>

            <div className="max-h-[75vh] overflow-auto p-5">
              <details
                open={selectedTeamFanartUrls.length > 0}
                className={`mb-4 rounded-xl border p-4 ${isDark ? 'border-emerald-400/30 bg-slate-800/50' : 'border-emerald-200 bg-emerald-50/50'}`}
              >
                <summary className="cursor-pointer list-none text-sm font-bold tracking-wide">
                  Club Media Carousel ({selectedTeamFanartUrls.length})
                </summary>
                {selectedTeamFanartUrls.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    <div className="relative overflow-hidden rounded-2xl border border-black/10">
                      <img
                        src={selectedTeamFanartUrls[fanartIndex]}
                        alt={`${selectedTeam.name} fanart ${fanartIndex + 1}`}
                        className="h-64 w-full object-cover sm:h-80"
                        loading="lazy"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                      <p className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white">
                        {fanartIndex + 1} / {selectedTeamFanartUrls.length}
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      {selectedTeamFanartUrls.map((_, index) => (
                        <span
                          key={`${selectedTeam.id}-fanart-dot-${index}`}
                          className={`h-2.5 w-2.5 rounded-full transition ${
                            fanartIndex === index
                              ? 'bg-emerald-400'
                              : isDark
                                ? 'bg-slate-600'
                                : 'bg-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className={`mt-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>No fanart images available.</p>
                )}
              </details>

              {selectedTeamDescription && (
                <section
                  className={`mb-4 rounded-xl border p-4 ${
                    isDark ? 'border-slate-700 bg-slate-800/50 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold uppercase tracking-wide">Description</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{selectedTeamDescription}</p>
                </section>
              )}

              <div className="grid gap-2">
                {selectedTeamGeneralFields.map((field) => (
                  <div
                    key={`${selectedTeam.id}-${field.label}`}
                    className={`rounded-lg border p-3 ${
                      isDark ? 'border-slate-700 bg-slate-800/60 text-slate-200' : 'border-slate-200 bg-slate-50/80 text-slate-700'
                    }`}
                  >
                    <p className="text-xs font-bold uppercase tracking-wide">{field.label}</p>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm">{field.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  )
}

export default SearchPage
