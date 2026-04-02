import { createContext, useContext, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useMatches } from '../hooks/useMatches'
import type { Match } from '../types/match'

interface LiveMatchesContextValue {
  liveMatches: Match[]
  loading: boolean
  error: string | null
}

const LiveMatchesContext = createContext<LiveMatchesContextValue | undefined>(undefined)

export const LiveMatchesProvider = ({ children }: { children: ReactNode }) => {
  const { data, loading, error, refresh } = useMatches({ status: 'LIVE' })

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void refresh()
    }, 30000)

    return () => window.clearInterval(intervalId)
  }, [refresh])

  const value = useMemo(
    () => ({
      liveMatches: data,
      loading,
      error,
    }),
    [data, loading, error],
  )

  return <LiveMatchesContext.Provider value={value}>{children}</LiveMatchesContext.Provider>
}

export const useLiveMatches = (): LiveMatchesContextValue => {
  const context = useContext(LiveMatchesContext)

  if (!context) {
    throw new Error('useLiveMatches must be used within LiveMatchesProvider')
  }

  return context
}
