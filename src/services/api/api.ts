import axios from 'axios'
import type { Match, MatchQueryParams } from '../../types/match'

const normalize = (value: string) => value.toLowerCase().trim()

const SPORTSDB_BASE_URL =
  (import.meta.env.VITE_SPORTSDB_BASE_URL as string | undefined) ?? 'https://www.thesportsdb.com/api/v1/json'
const SPORTSDB_API_KEY = (import.meta.env.VITE_SPORTSDB_API_KEY as string | undefined) ?? '123'

const footballApiClient = axios.create({
  baseURL: `${SPORTSDB_BASE_URL}/${SPORTSDB_API_KEY}`,
  timeout: 10000,
})

interface SportsDbListResponse {
  events: SportsDbMatch[] | null
}

interface SportsDbTeamsResponse {
  teams: SportsDbTeam[] | null
}

interface SportsDbMatch {
  idEvent: string
  strLeague: string
  strHomeTeam: string
  strAwayTeam: string
  strHomeTeamBadge?: string | null
  strAwayTeamBadge?: string | null
  dateEvent: string
  strTime?: string | null
  intHomeScore?: number | string | null
  intAwayScore?: number | string | null
  strStatus?: string | null
  strVenue?: string | null
  strThumb?: string | null
}

interface SportsDbTeam {
  idTeam: string
  strTeam: string
  strTeamShort?: string | null
  strLeague?: string | null
  strStadium?: string | null
  strCountry?: string | null
  strBadge?: string | null
  strLogo?: string | null
  [key: string]: string | number | null | undefined
}

export interface TeamInfoField {
  label: string
  value: string
}

export interface TeamSearchResult {
  id: string
  name: string
  shortName?: string
  league?: string
  stadium?: string
  country?: string
  badge: string
  logo?: string
  fanartUrls: string[]
  mediaGalleryUrls: string[]
  descriptionByLanguage: {
    en?: string
    fr?: string
    ar?: string
    es?: string
  }
  infoFields: TeamInfoField[]
}

const LIVE_STATUSES = new Set(['LIVE', 'IN PROGRESS', '1H', '2H', 'HT', 'HALF TIME'])
const FINISHED_STATUSES = new Set(['FT', 'FULL TIME', 'MATCH FINISHED', 'FINISHED'])

const toMatchStatus = (status: string): Match['status'] => {
  const upper = status.toUpperCase()
  if (LIVE_STATUSES.has(upper)) return 'LIVE'
  if (FINISHED_STATUSES.has(upper)) return 'FINISHED'
  return 'UPCOMING'
}

const toKickoffTime = (time: string | null | undefined): string => {
  if (!time) return '00:00'
  const safeTime = time.slice(0, 5)
  return /^\d{2}:\d{2}$/.test(safeTime) ? safeTime : '00:00'
}

const toScoreNumber = (value: number | string | null | undefined): number | null => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

const mapFixtureToMatch = (fixture: SportsDbMatch): Match => {
  const status = toMatchStatus(fixture.strStatus ?? '')
  const homeScore = toScoreNumber(fixture.intHomeScore)
  const awayScore = toScoreNumber(fixture.intAwayScore)
  const hasGoals = homeScore !== null && awayScore !== null

  return {
    id: fixture.idEvent,
    league: fixture.strLeague || 'Football',
    competitionName: fixture.strLeague || 'Football',
    broadcastChannel: 'Live Coverage',
    date: fixture.dateEvent,
    kickoffTime: toKickoffTime(fixture.strTime),
    status,
    stadium: fixture.strVenue ?? 'TBD',
    homeTeam: {
      id: `t-home-${fixture.idEvent}`,
      name: fixture.strHomeTeam,
      logo: fixture.strHomeTeamBadge ?? 'https://via.placeholder.com/80?text=FC',
    },
    awayTeam: {
      id: `t-away-${fixture.idEvent}`,
      name: fixture.strAwayTeam,
      logo: fixture.strAwayTeamBadge ?? 'https://via.placeholder.com/80?text=FC',
    },
    thumbnail:
      fixture.strThumb ??
      'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop',
    score: hasGoals
      ? {
          home: homeScore ?? 0,
          away: awayScore ?? 0,
        }
      : undefined,
    streams: [],
  }
}

const getApiTargetDate = (requestedDate?: string): string => {
  if (requestedDate) return requestedDate
  return new Date().toISOString().slice(0, 10)
}

const fetchLiveMatchesFromApi = async (params?: MatchQueryParams): Promise<Match[]> => {
  const targetDate = getApiTargetDate(params?.date)
  let events: SportsDbMatch[] = []

  if (params?.status === 'LIVE') {
    const liveResponse = await footballApiClient.get<SportsDbListResponse>('/livescore.php', {
      params: { s: 'Soccer' },
    })
    events = liveResponse.data.events ?? []
  } else {
    const dayResponse = await footballApiClient.get<SportsDbListResponse>('/eventsday.php', {
      params: { d: targetDate, s: 'Soccer' },
    })
    events = dayResponse.data.events ?? []
  }

  let matches = events.map(mapFixtureToMatch)

  if (params?.date) {
    matches = matches.filter((match) => match.date === params.date)
  }

  if (params?.status && params.status !== 'ALL') {
    matches = matches.filter((match) => match.status === params.status)
  }

  if (params?.league) {
    matches = matches.filter(
      (match) => normalize(match.league) === normalize(params.league!),
    )
  }

  if (params?.search) {
    const needle = normalize(params.search)
    matches = matches.filter((match) =>
      [match.homeTeam.name, match.awayTeam.name, match.league]
        .map(normalize)
        .some((value) => value.includes(needle)),
    )
  }

  return matches
}

export const getMatches = async (params?: MatchQueryParams): Promise<Match[]> => {
  return fetchLiveMatchesFromApi(params)
}

export const getMatchById = async (matchId: string): Promise<Match> => {
  const response = await footballApiClient.get<SportsDbListResponse>('/lookupevent.php', {
    params: { id: matchId },
  })
  const fixture = response.data.events?.[0]
  if (!fixture) {
    throw new Error('Match not found')
  }
  return mapFixtureToMatch(fixture)
}

export const searchTeams = async (teamName: string): Promise<TeamSearchResult[]> => {
  const query = teamName.trim()
  if (!query) return []

  const response = await footballApiClient.get<SportsDbTeamsResponse>('/searchteams.php', {
    params: { t: query },
  })

  return (response.data.teams ?? []).map((team) => {
    const importantFieldSpecs: Array<{ label: string; value: string | number | null | undefined }> = [
      { label: 'Short Name', value: team.strTeamShort },
      { label: 'League', value: team.strLeague },
      { label: 'Country', value: team.strCountry },
      { label: 'Location', value: team.strLocation as string | undefined },
      { label: 'Founded', value: team.intFormedYear as string | number | undefined },
      { label: 'Stadium', value: team.strStadium },
      { label: 'Stadium Capacity', value: team.intStadiumCapacity as string | number | undefined },
      { label: 'Website', value: team.strWebsite as string | undefined },
      { label: 'Facebook', value: team.strFacebook as string | undefined },
      { label: 'Twitter', value: team.strTwitter as string | undefined },
      { label: 'Instagram', value: team.strInstagram as string | undefined },
      { label: 'YouTube', value: team.strYoutube as string | undefined },
      { label: 'Keywords', value: team.strKeywords as string | undefined },
    ]

    const fanartUrls = [team.strFanart1, team.strFanart2, team.strFanart3, team.strFanart4]
      .filter((value) => typeof value === 'string' && /^https?:\/\//i.test(value))
      .map((value) => String(value))

    const mediaGalleryUrls = Array.from(
      new Set([
        ...fanartUrls,
        team.strBanner,
        team.strLogo,
        team.strEquipment,
        team.strBadge,
      ]
        .filter((value) => typeof value === 'string' && /^https?:\/\//i.test(value))
        .map((value) => String(value))),
    )

    return {
      id: team.idTeam,
      name: team.strTeam,
      shortName: team.strTeamShort ?? undefined,
      league: team.strLeague ?? undefined,
      stadium: team.strStadium ?? undefined,
      country: team.strCountry ?? undefined,
      badge: team.strBadge ?? 'https://via.placeholder.com/80?text=Team',
      logo: team.strLogo ?? undefined,
      fanartUrls,
      mediaGalleryUrls,
      descriptionByLanguage: {
        en: (team.strDescriptionEN as string | undefined) ?? undefined,
        fr: (team.strDescriptionFR as string | undefined) ?? undefined,
        ar: (team.strDescriptionIL as string | undefined) ?? undefined,
        es: (team.strDescriptionES as string | undefined) ?? undefined,
      },
      infoFields: importantFieldSpecs
        .filter((item) => item.value !== null && item.value !== undefined && String(item.value).trim() !== '')
        .map((item) => ({
          label: item.label,
          value: String(item.value),
        })),
    }
  })
}
