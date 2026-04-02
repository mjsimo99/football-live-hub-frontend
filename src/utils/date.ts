export const getTodayDate = (): string => new Date().toISOString().split('T')[0]

export const formatDateLabel = (isoDate: string, locale = 'en-US'): string =>
  new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(isoDate))
