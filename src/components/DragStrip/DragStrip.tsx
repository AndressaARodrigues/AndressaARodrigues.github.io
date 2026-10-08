import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Hand, HandGrab } from 'lucide-react'
import type { PillTone } from '../../content/home'
import { ui } from '../../content/ui'
import { useI18n } from '../../i18n/useI18n'
import tones from '../../styles/tones.module.css'
import styles from './DragStrip.module.css'

/** Auto-scroll speed measured on the reference recording (px per second). */
const AUTO_SPEED = 36
/** Share of the release velocity kept after each 60fps frame. */
const FRICTION = 0.94
/** Pointer travel (px) that turns a press into a drag. */
const DRAG_THRESHOLD = 4

interface DragStripProps {
  children: ReactNode
  /** Color of the "Drag" cursor pill. */
  tone: PillTone
}

/**
 * Endless horizontal strip that drifts slowly to the left and can be dragged
 * (mouse, pen or touch) with inertia. On mouse pointers a "Drag" pill in the
 * project's color follows the cursor. With reduced motion it stops drifting
 * but can still be dragged.
 */
export function DragStrip({ children, tone }: DragStripProps) {
  const { t } = useI18n()
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const groupRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const [copies, setCopies] = useState(2)
  const [dragging, setDragging] = useState(false)

  // Enough copies to cover the strip plus one group of slack for wrapping.
  useLayoutEffect(() => {
    const root = rootRef.current
    const group = groupRef.current
    if (!root || !group) return
    const update = () => {
      const groupWidth = group.offsetWidth
      if (!groupWidth) return
      setCopies(Math.max(2, Math.ceil(root.clientWidth / groupWidth) + 1))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(root)
    observer.observe(group)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    const group = groupRef.current
    const cursor = cursorRef.current
    if (!root || !track || !group || !cursor) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const speed = reducedMotion ? 0 : AUTO_SPEED

    let offset = 0
    let velocity = 0 // px per frame, from a released drag
    let frameId = 0
    let lastTime = 0
    let inView = false
    let drag: { pointerId: number; startX: number; startOffset: number; lastX: number; lastTime: number; moved: boolean } | null = null

    const period = () => group.offsetWidth + Number.parseFloat(getComputedStyle(track).columnGap || '0')
    const apply = () => {
      const p = period()
      if (p > 0) offset = ((offset % p) + p) % p
      track.style.transform = `translate3d(${-offset}px, 0, 0)`
    }

    const frame = (now: number) => {
      const dt = Math.min(now - lastTime, 64)
      lastTime = now
      if (!drag) {
        offset += (speed * dt) / 1000 + velocity * (dt / 16.67)
        velocity *= FRICTION ** (dt / 16.67)
        if (Math.abs(velocity) < 0.05) velocity = 0
      }
      apply()
      if (shouldRun()) frameId = requestAnimationFrame(frame)
      else frameId = 0
    }

    const shouldRun = () => inView && !document.hidden && (speed > 0 || velocity !== 0 || drag !== null)
    const start = () => {
      if (frameId || !shouldRun()) return
      lastTime = performance.now()
      frameId = requestAnimationFrame(frame)
    }

    // ---- Drag -------------------------------------------------------------
    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startOffset: offset,
        lastX: event.clientX,
        lastTime: event.timeStamp,
        moved: false,
      }
      velocity = 0
      start()
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') moveCursor(event)
      if (!drag || event.pointerId !== drag.pointerId) return
      const dx = event.clientX - drag.startX
      if (!drag.moved && Math.abs(dx) > DRAG_THRESHOLD) {
        drag.moved = true
        root.setPointerCapture(event.pointerId)
        setDragging(true)
      }
      if (!drag.moved) return
      const dt = Math.max(1, event.timeStamp - drag.lastTime)
      velocity = (-(event.clientX - drag.lastX) / dt) * 16.67
      drag.lastX = event.clientX
      drag.lastTime = event.timeStamp
      offset = drag.startOffset - dx
      apply()
    }

    const endDrag = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.pointerId) return
      // A pause before letting go means no fling.
      if (event.timeStamp - drag.lastTime > 80) velocity = 0
      drag = null
      setDragging(false)
      start()
    }

    // A real drag must not also count as a click on what is under the pointer.
    const onClickCapture = (event: MouseEvent) => {
      if (root.dataset.justDragged === 'true') {
        event.preventDefault()
        event.stopPropagation()
      }
    }
    const markDragged = () => {
      if (!drag?.moved) return
      root.dataset.justDragged = 'true'
      window.setTimeout(() => delete root.dataset.justDragged, 0)
    }

    // ---- "Drag" cursor pill -----------------------------------------------
    const moveCursor = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect()
      cursor.style.transform = `translate3d(${event.clientX - rect.left}px, ${event.clientY - rect.top}px, 0) translate(-50%, -50%)`
    }
    const showCursor = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      moveCursor(event)
      root.dataset.cursor = 'visible'
    }
    const hideCursor = () => delete root.dataset.cursor

    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      start()
    })
    intersection.observe(root)
    document.addEventListener('visibilitychange', start)

    root.addEventListener('pointerdown', onPointerDown)
    root.addEventListener('pointermove', onPointerMove)
    root.addEventListener('pointerup', markDragged, true)
    root.addEventListener('pointerup', endDrag)
    root.addEventListener('pointercancel', endDrag)
    root.addEventListener('pointerenter', showCursor)
    root.addEventListener('pointerleave', hideCursor)
    root.addEventListener('click', onClickCapture, true)
    apply()

    return () => {
      cancelAnimationFrame(frameId)
      intersection.disconnect()
      document.removeEventListener('visibilitychange', start)
      root.removeEventListener('pointerdown', onPointerDown)
      root.removeEventListener('pointermove', onPointerMove)
      root.removeEventListener('pointerup', markDragged, true)
      root.removeEventListener('pointerup', endDrag)
      root.removeEventListener('pointercancel', endDrag)
      root.removeEventListener('pointerenter', showCursor)
      root.removeEventListener('pointerleave', hideCursor)
      root.removeEventListener('click', onClickCapture, true)
    }
  }, [])

  const Icon = dragging ? HandGrab : Hand

  return (
    <div ref={rootRef} className={styles.strip} data-dragging={dragging}>
      <div ref={trackRef} className={styles.track}>
        {Array.from({ length: copies }, (_, index) => (
          <div
            key={index}
            ref={index === 0 ? groupRef : undefined}
            className={styles.group}
            aria-hidden={index > 0 ? true : undefined}
            inert={index > 0 ? true : undefined}
          >
            {children}
          </div>
        ))}
      </div>

      <span ref={cursorRef} className={`${styles.cursor} ${tones[tone]}`} aria-hidden="true">
        {t(ui.projects.drag)}
        <Icon className={styles.cursorIcon} strokeWidth={1.75} />
      </span>
    </div>
  )
}
