import { useCallback, useEffect, useState } from 'react'
import { getMatches } from '../services/api/api'
import type { Match, MatchQueryParams } from '../types/match'

interface UseMatchesState {
  data: Match[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export const useMatches = (params?: MatchQueryParams): UseMatchesState => {
  const [data, setData] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const league = params?.league
  const date = params?.date
  const status = params?.status
  const search = params?.search
  const paramsKey = `${league ?? ''}|${date ?? ''}|${status ?? ''}|${search ?? ''}`

  const refresh = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      const matches = await getMatches({ league, date, status, search })
      setData(matches)
    } catch {
      setError('common.loadMatchesError')
    } finally {
      setLoading(false)
    }
  }, [league, date, status, search])

  useEffect(() => {
    void refresh()
  }, [refresh, paramsKey])

  return { data, loading, error, refresh }
}
