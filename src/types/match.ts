export type MatchStatus = 'LIVE' | 'FINISHED' | 'UPCOMING'

export interface Team {
  id: string
  name: string
  logo: string
}

export interface StreamServer {
  id: string
  name: string
  iframeUrl: string
}

export interface Match {
  id: string
  league: string
  competitionName?: string
  broadcastChannel?: string
  date: string
  kickoffTime: string
  status: MatchStatus
  stadium: string
  homeTeam: Team
  awayTeam: Team
  thumbnail: string
  minute?: number
  score?: {
    home: number
    away: number
  }
  streams: StreamServer[]
}

export interface MatchQueryParams {
  league?: string
  date?: string
  status?: MatchStatus | 'ALL'
  search?: string
}
