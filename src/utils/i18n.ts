import ar from '../i18n/ar.json'
import en from '../i18n/en.json'
import fr from '../i18n/fr.json'
import type { LanguageCode } from '../context/LanguageContext'

const dictionaries = { en, fr, ar } as const

const getNestedValue = (obj: unknown, path: string): string | undefined => {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj) as string | undefined
}

export const translate = (language: LanguageCode, key: string): string => {
  const value = getNestedValue(dictionaries[language], key)
  if (typeof value === 'string') {
    return value
  }
  return key
}
