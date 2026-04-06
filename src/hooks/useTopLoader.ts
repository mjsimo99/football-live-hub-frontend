import { useLayoutEffect, useRef, useState } from 'react'

interface UseTopLoaderOptions {
  maxProgress?: number
  trickleIntervalMs?: number
  minStep?: number
  maxStep?: number
  completeDelayMs?: number
  hideDelayMs?: number
}

interface UseTopLoaderState {
  progress: number
  visible: boolean
}

const DEFAULT_OPTIONS: Required<UseTopLoaderOptions> = {
  maxProgress: 80,
  trickleIntervalMs: 160,
  minStep: 2,
  maxStep: 8,
  completeDelayMs: 300,
  hideDelayMs: 220,
}

export const useTopLoader = (
  trigger: string,
  options?: UseTopLoaderOptions,
): UseTopLoaderState => {
  const {
    maxProgress,
    trickleIntervalMs,
    minStep,
    maxStep,
    completeDelayMs,
    hideDelayMs,
  } = { ...DEFAULT_OPTIONS, ...options }

  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const trickleRef = useRef<number | null>(null)
  const completeRef = useRef<number | null>(null)
  const hideRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    if (trickleRef.current) window.clearInterval(trickleRef.current)
    if (completeRef.current) window.clearTimeout(completeRef.current)
    if (hideRef.current) window.clearTimeout(hideRef.current)

    setVisible(true)
    setProgress(6)

    trickleRef.current = window.setInterval(() => {
      setProgress((current) => {
        if (current >= maxProgress) return current
        const step = Math.random() * (maxStep - minStep) + minStep
        return Math.min(maxProgress, current + step)
      })
    }, trickleIntervalMs)

    completeRef.current = window.setTimeout(() => {
      if (trickleRef.current) {
        window.clearInterval(trickleRef.current)
        trickleRef.current = null
      }

      setProgress(100)

      hideRef.current = window.setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, hideDelayMs)
    }, completeDelayMs)

    return () => {
      if (trickleRef.current) window.clearInterval(trickleRef.current)
      if (completeRef.current) window.clearTimeout(completeRef.current)
      if (hideRef.current) window.clearTimeout(hideRef.current)
    }
  }, [
    trigger,
    maxProgress,
    trickleIntervalMs,
    minStep,
    maxStep,
    completeDelayMs,
    hideDelayMs,
  ])

  return { progress, visible }
}
