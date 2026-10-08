import { useEffect, useRef } from 'react'
import styles from './ScrollProgress.module.css'

/** Thin yellow bar along the top edge that fills as the page is scrolled. */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      barRef.current?.style.setProperty('--progress', String(progress))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // The page grows as images and fonts load.
    const observer = new ResizeObserver(schedule)
    observer.observe(document.body)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      observer.disconnect()
    }
  }, [])

  return <div ref={barRef} className={styles.bar} aria-hidden="true" />
}
