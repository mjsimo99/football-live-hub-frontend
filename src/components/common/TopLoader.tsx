import { useLocation } from 'react-router-dom'
import { useTopLoader } from '../../hooks/useTopLoader'

interface TopLoaderProps {
  colorClassName?: string
  heightClassName?: string
  maxProgress?: number
  trickleIntervalMs?: number
  completeDelayMs?: number
  hideDelayMs?: number
  direction?: 'ltr' | 'rtl'
}

const TopLoader = ({
  colorClassName = 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500',
  heightClassName = 'h-[3px]',
  maxProgress = 80,
  trickleIntervalMs = 160,
  completeDelayMs = 420,
  hideDelayMs = 220,
  direction = 'ltr',
}: TopLoaderProps) => {
  const location = useLocation()
  const { progress, visible } = useTopLoader(
    `${location.pathname}${location.search}${location.hash}`,
    { maxProgress, trickleIntervalMs, completeDelayMs, hideDelayMs },
  )

  if (!visible) return null

  return (
    <div className={`pointer-events-none fixed left-0 right-0 top-0 z-[9999] ${heightClassName}`}>
      <div
        className={`${heightClassName} ${colorClassName} transition-[width,opacity] duration-200 ease-in-out`}
        style={{
          width: `${progress}%`,
          marginLeft: direction === 'rtl' ? 'auto' : 0,
          marginRight: direction === 'rtl' ? 0 : 'auto',
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  )
}

export default TopLoader
