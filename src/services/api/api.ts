import axios from 'axios'
import type { Match, MatchQueryParams } from '../../types/match'

const apiClient = axios.create({
  baseURL: '/mock',
  timeout: 10000,
})

const normalize = (value: string) => value.toLowerCase().trim()

export const getMatches = async (params?: MatchQueryParams): Promise<Match[]> => {
  const response = await apiClient.get<Match[]>('/matches.json')
  let matches = response.data

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

export const getMatchById = async (matchId: string): Promise<Match> => {
  const matches = await getMatches()
  const fixture = matches.find((item) => item.id === matchId)

  if (!fixture) {
    throw new Error('Match not found')
  }

  return fixture
}
