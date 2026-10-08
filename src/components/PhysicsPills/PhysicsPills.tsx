import { useEffect, useRef, useState, type RefObject } from 'react'
import type { PillItem } from '../../content/home'
import { useI18n } from '../../i18n/useI18n'
import type { PillScene } from '../../lib/pillPhysics'
import { Pill } from '../Pill/Pill'
import styles from './PhysicsPills.module.css'

interface PhysicsPillsProps {
  items: PillItem[]
  /** The pile keeps as many pills as fit below this element. */
  keepClearRef?: RefObject<HTMLElement | null>
}

/**
 * Decorative pile of draggable pills that fall to the bottom of the
 * positioned parent. Hidden from assistive technology.
 */
export function PhysicsPills({ items, keepClearRef }: PhysicsPillsProps) {
  const { t, lang } = useI18n()
  const containerRef = useRef<HTMLDivElement>(null)
  const pillRefs = useRef<Array<HTMLSpanElement | null>>([])
  const sceneRef = useRef<PillScene | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let cancelled = false
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Pill widths depend on the web fonts, so measure only after they load.
    // The physics engine is loaded on demand to keep it out of the first bundle.
    Promise.all([document.fonts.ready, import('../../lib/pillPhysics')]).then(([, { createPillScene }]) => {
      if (cancelled) return
      const elements = pillRefs.current.filter((el): el is HTMLSpanElement => el !== null)
      const scene = createPillScene(container, elements, {
        reducedMotion,
        keepClear: keepClearRef?.current,
      })
      sceneRef.current = scene
      scene.ready.then(() => {
        if (!cancelled) setReady(true)
      })
    })

    return () => {
      cancelled = true
      sceneRef.current?.destroy()
      sceneRef.current = null
    }
  }, [items, keepClearRef])

  // Labels change width with the language, so the pile is dropped again.
  useEffect(() => {
    void sceneRef.current?.refresh()
  }, [lang])

  return (
    <div ref={containerRef} className={styles.scene} data-ready={ready} aria-hidden="true">
      {items.map((item, index) => (
        <Pill
          key={item.id}
          ref={(el: HTMLSpanElement | null) => {
            pillRefs.current[index] = el
          }}
          tone={item.tone}
          icon={item.icon}
          className={styles.pill}
        >
          {item.label ? t(item.label) : undefined}
        </Pill>
      ))}
    </div>
  )
}
