import { useEffect, useRef } from 'react'
import styles from './WatchingEyes.module.css'

/** How far the pupil may travel from the center of the eye (px at desktop size). */
const MAX_X = 9
const MAX_Y = 13
/** Where the eyes look before the pointer moves (down and to the right). */
const REST = { x: 0.45, y: 0.6 }

/**
 * Two quote-shaped eyes whose pupils follow the pointer, as in the
 * reference footer. Decorative: hidden from assistive technology.
 */
export function WatchingEyes() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const pupils = Array.from(root.querySelectorAll<HTMLElement>('[data-pupil]'))

    const look = (nx: number, ny: number, el: HTMLElement) => {
      const scale = root.offsetHeight / 66 // keeps travel proportional on smaller screens
      el.style.transform = `translate(${nx * MAX_X * scale}px, ${ny * MAX_Y * scale}px)`
    }
    pupils.forEach((el) => look(REST.x, REST.y, el))

    let frame = 0
    let pointer: { x: number; y: number } | null = null
    let inView = false

    const update = () => {
      frame = 0
      if (!pointer) return
      for (const el of pupils) {
        const eye = el.parentElement!.getBoundingClientRect()
        const dx = pointer.x - (eye.left + eye.width / 2)
        const dy = pointer.y - (eye.top + eye.height / 2)
        const distance = Math.hypot(dx, dy) || 1
        // Full deflection once the pointer is ~200px away; gentler when close.
        const reach = Math.min(1, distance / 200)
        look((dx / distance) * reach, (dy / distance) * reach, el)
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY }
      if (inView && !frame) frame = requestAnimationFrame(update)
    }

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView && pointer && !frame) frame = requestAnimationFrame(update)
    })
    observer.observe(root)
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  return (
    <div ref={rootRef} className={styles.eyes} aria-hidden="true">
      {[0, 1].map((index) => (
        <span key={index} className={styles.eye}>
          <span className={styles.pupil} data-pupil>
            <span className={styles.glint} />
          </span>
        </span>
      ))}
    </div>
  )
}
