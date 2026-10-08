import { useLayoutEffect, type RefObject } from 'react'

/**
 * For `position: sticky` elements that may be taller than the viewport.
 * Sets `--sticky-top` to `min(0, viewport height − element height)`, so a
 * tall element scrolls until its bottom edge is visible and only then sticks.
 * With a plain `top: 0`, whatever sits below the fold would never be seen
 * before the next element slides over it.
 */
export function useStickyFit(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      const top = Math.min(0, window.innerHeight - el.offsetHeight)
      el.style.setProperty('--sticky-top', `${top}px`)
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    window.addEventListener('resize', update)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [ref])
}
