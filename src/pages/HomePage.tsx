import { useMemo, useState } from 'react'
import SEO from '../components/common/SEO'
import FriendlyMatchCard from '../components/matches/FriendlyMatchCard'
import { useMatches } from '../hooks/useMatches'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import type { Match } from '../types/match'

type DayTab = 'yesterday' | 'today' | 'tomorrow'

const getCairoIsoDate = (dayOffset: number): string => {
  const base = new Date()
  base.setDate(base.getDate() + dayOffset)

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Cairo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(base)

  const year = parts.find((part) => part.type === 'year')?.value ?? '1970'
  const month = parts.find((part) => part.type === 'month')?.value ?? '01'
  const day = parts.find((part) => part.type === 'day')?.value ?? '01'

  return `${year}-${month}-${day}`
}

const byKickoffTime = (a: Match, b: Match): number => a.kickoffTime.localeCompare(b.kickoffTime)

const getMatchesForTab = (matches: Match[], selectedDate: string, tab: DayTab): Match[] => {
  const byDate = matches.filter((match) => match.date === selectedDate).sort(byKickoffTime)

  if (tab === 'yesterday') return byDate.filter((match) => match.status === 'FINISHED')
  if (tab === 'tomorrow') return byDate.filter((match) => match.status === 'UPCOMING')
  return byDate
}

const HomePage = () => {
  const [activeDay, setActiveDay] = useState<DayTab>('today')
  const { language, t } = useLanguage()
  const { theme } = useTheme()
  const isRtl = language === 'ar'
  const isDark = theme === 'dark'
  const dayToDateMap = useMemo(
    () => ({
      yesterday: getCairoIsoDate(-1),
      today: getCairoIsoDate(0),
      tomorrow: getCairoIsoDate(1),
    }),
    [],
  )
  const selectedDate = dayToDateMap[activeDay]
  const { data: allMatches, loading, error } = useMatches({ date: selectedDate })
  const activeIndex = activeDay === 'yesterday' ? 0 : activeDay === 'today' ? 1 : 2

  const filteredMatches = useMemo(
    () => getMatchesForTab(allMatches, selectedDate, activeDay),
    [allMatches, selectedDate, activeDay],
  )

  return (
    <>
      <SEO
        title={`${t('home.pageTitle')} | ${t('app.name')}`}
        description={t('home.seoDescription')}
      />
      <section
        dir={isRtl ? 'rtl' : 'ltr'}
        className={`relative overflow-hidden rounded-3xl px-4 py-8 sm:px-6 ${
          isDark
            ? 'bg-gradient-to-b from-[#0f172a] via-[#111c34] to-[#020617]'
            : 'bg-gradient-to-b from-[#f8fafc] via-[#eef6ff] to-[#e8f7f0]'
        }`}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1600&auto=format&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-slate-950/55' : 'bg-white/55'}`} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_40%)]" />
        <div className="mx-auto max-w-[800px] space-y-6">
          <header
            className={`relative space-y-4 rounded-2xl p-4 backdrop-blur-xl ${
              isDark ? 'border border-white/10 bg-white/5' : 'border border-slate-200 bg-white/70 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="rounded-full bg-gradient-to-r from-orange-500 to-rose-600 px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:brightness-110"
              >
                {t('home.schedule')}
              </button>
              <p className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{t('home.timezone')}</p>
            </div>

            <div
              className={`rounded-xl border px-4 py-3 ${
                isDark
                  ? 'border-white/15 bg-slate-900/35'
                  : 'border-slate-200 bg-white/80'
              }`}
            >
              <p className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {t('home.introTitle')}
              </p>
              <p className={`mt-1 text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {t('home.introText')}
              </p>
            </div>
          </header>

          <div className={`relative rounded-full p-1 backdrop-blur ${isDark ? 'bg-white/10' : 'bg-slate-200/80'}`}>
            <div
              className={`absolute top-1 h-[calc(100%-0.5rem)] w-[calc((100%-0.5rem)/3)] rounded-full transition-transform duration-300 ${
                isDark ? 'bg-white' : 'bg-slate-900'
              }`}
              style={{
                [isRtl ? 'right' : 'left']: '0.25rem',
                transform: `translateX(${isRtl ? '-' : ''}${activeIndex * 100}%)`,
              }}
            />
            <div className="relative grid grid-cols-3">
              <button
                type="button"
                onClick={() => setActiveDay('yesterday')}
                className={`rounded-full py-2 text-sm font-bold transition ${
                  activeDay === 'yesterday'
                    ? isDark ? 'text-slate-900' : 'text-white'
                    : isDark ? 'text-slate-100' : 'text-slate-700'
                }`}
              >
                {t('home.yesterday')}
              </button>
              <button
                type="button"
                onClick={() => setActiveDay('today')}
                className={`rounded-full py-2 text-sm font-bold transition ${
                  activeDay === 'today'
                    ? isDark ? 'text-slate-900' : 'text-white'
                    : isDark ? 'text-slate-100' : 'text-slate-700'
                }`}
              >
                {t('home.today')}
              </button>
              <button
                type="button"
                onClick={() => setActiveDay('tomorrow')}
                className={`rounded-full py-2 text-sm font-bold transition ${
                  activeDay === 'tomorrow'
                    ? isDark ? 'text-slate-900' : 'text-white'
                    : isDark ? 'text-slate-100' : 'text-slate-700'
                }`}
              >
                {t('home.tomorrow')}
              </button>
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-6 flex max-w-[800px] flex-col gap-4">
          {error && (
            <p className={`rounded-xl p-3 text-center ${isDark ? 'bg-rose-500/15 text-rose-100' : 'bg-rose-100 text-rose-700'}`}>
              {t(error)}
            </p>
          )}

          {!loading && filteredMatches.length === 0 && (
            <p className={`rounded-xl p-4 text-center ${isDark ? 'bg-white/10 text-slate-100' : 'bg-white/80 text-slate-700'}`}>{t('home.empty')}</p>
          )}

          {!loading && filteredMatches.map((match) => (
            <FriendlyMatchCard
              key={match.id}
              match={match}
              liveLabel={t('home.live')}
              upcomingLabel={t('home.upcoming')}
              finishedLabel={t('home.finished')}
              competitionLabel={t('home.competition')}
              channelLabel={t('home.channel')}
            />
          ))}

          {loading && (
            <div className="space-y-3">
              <p
                className={`rounded-xl px-4 py-2 text-center text-sm font-semibold ${
                  isDark ? 'bg-white/10 text-slate-200' : 'bg-white/80 text-slate-700'
                }`}
              >
                {t('common.loading')}
              </p>
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className={`overflow-hidden rounded-2xl border p-4 ${
                    isDark ? 'border-white/15 bg-slate-900/45' : 'border-slate-200 bg-white/85'
                  }`}
                >
                  <div className="animate-pulse space-y-3">
                    <div className={`h-4 w-40 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                    <div className="grid grid-cols-3 items-center gap-3">
                      <div className={`h-10 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                      <div className={`h-6 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                      <div className={`h-10 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                    </div>
                    <div className={`h-3 w-full rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default HomePage
