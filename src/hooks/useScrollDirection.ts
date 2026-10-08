import { useEffect, useState } from 'react'

/** Pixels scrolled in one direction before the state flips (ignores jitter). */
const THRESHOLD = 8
/** Near the top of the page the nav is always shown. */
const TOP_ZONE = 120

/**
 * True while the visitor is scrolling down past the top of the page,
 * false when they scroll up or are near the top.
 */
export function useScrollingDown() {
  const [down, setDown] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    let frame = 0

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const y = window.scrollY
        if (y < TOP_ZONE) {
          setDown(false)
          last = y
          return
        }
        if (Math.abs(y - last) < THRESHOLD) return
        setDown(y > last)
        last = y
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return down
}
