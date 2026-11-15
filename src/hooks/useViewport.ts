import { useEffect, useState } from 'react'

export function useViewport() {
  const get = () => ({
    w: typeof window === 'undefined' ? 1440 : document.documentElement.clientWidth,
    h: typeof window === 'undefined' ? 900 : window.innerHeight,
  })
  const [vp, setVp] = useState(get)
  useEffect(() => {
    let raf = 0
    let lastW = window.innerWidth
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        // Ignore pure-height changes on touch (mobile URL bar) to avoid layout jumps.
        const touch = matchMedia('(pointer: coarse)').matches
        if (touch && window.innerWidth === lastW) return
        lastW = window.innerWidth
        setVp(get())
      })
    }
    window.addEventListener('resize', on)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', on)
    }
  }, [])
  return vp
}

export function useMedia(q: string) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && matchMedia(q).matches)
  useEffect(() => {
    const mq = matchMedia(q)
    const on = () => setM(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [q])
  return m
}
