import { createContext, startTransition, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { translate } from '../utils/i18n'

export type LanguageCode = 'en' | 'fr' | 'ar'

interface LanguageContextValue {
  language: LanguageCode
  setLanguage: (language: LanguageCode) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageCode>('en')
  const t = useCallback((key: string): string => translate(language, key), [language])
  const setLanguageSmooth = useCallback((next: LanguageCode) => {
    startTransition(() => setLanguage(next))
  }, [])

  const value = useMemo(() => ({ language, setLanguage: setLanguageSmooth, t }), [language, setLanguageSmooth, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
