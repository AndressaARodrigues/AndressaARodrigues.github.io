import { useEffect, useRef } from 'react'
import { Eye, Images } from 'lucide-react'
import { projects } from '../../content/projects'
import { site } from '../../content/site'
import { ui } from '../../content/ui'
import { useI18n } from '../../i18n/useI18n'
import tones from '../../styles/tones.module.css'
import styles from './MoreWork.module.css'

/** How quickly the "View" pill catches up with the cursor (share per 60fps frame). */
const FOLLOW = 0.22

/**
 * "More [folder] Work" link at the end of the projects panel.
 *
 * Reference behavior (screen recordings):
 * - the yellow "View" pill trails the mouse anywhere over the link area;
 * - only hovering the folder itself opens it: three preview cards fan out,
 *   the front flap tips forward, and a gloss sweeps across the flap while it
 *   moves (opening and closing);
 * - keyboard focus opens it as well.
 *
 * In the reference it opens the Playground; here it opens the GitHub
 * profile. The cards show each project's first image, or its color and icon
 * until images are added.
 */
export function MoreWork() {
  const { t } = useI18n()
  const linkRef = useRef<HTMLAnchorElement>(null)
  const folderRef = useRef<HTMLSpanElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const previews = projects.slice(0, 3)

  useEffect(() => {
    const link = linkRef.current
    const folder = folderRef.current
    const pill = pillRef.current
    if (!link || !folder || !pill) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ---- Open / close (data-open drives the CSS, including the gloss) -----
    const setOpen = (open: boolean) => {
      if ((link.dataset.open === 'true') === open) return
      link.dataset.open = String(open)
    }
    const onFolderEnter = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') setOpen(true)
    }
    const onFolderLeave = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && !link.matches(':focus-visible')) setOpen(false)
    }
    const onFocus = () => {
      if (link.matches(':focus-visible')) setOpen(true)
    }
    const onBlur = () => setOpen(false)

    // ---- "View" pill --------------------------------------------------------
    let target = { x: 0, y: 0 }
    let current = { x: 0, y: 0 }
    let frame = 0

    const place = () => {
      pill.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`
    }
    const tick = () => {
      current.x += (target.x - current.x) * FOLLOW
      current.y += (target.y - current.y) * FOLLOW
      place()
      const settled = Math.abs(target.x - current.x) < 0.3 && Math.abs(target.y - current.y) < 0.3
      frame = settled ? 0 : requestAnimationFrame(tick)
    }
    const local = (event: PointerEvent) => {
      const rect = link.getBoundingClientRect()
      return { x: event.clientX - rect.left, y: event.clientY - rect.top }
    }
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      target = local(event)
      current = { ...target } // appear under the cursor, then trail it
      place()
      link.dataset.pill = 'visible'
    }
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      target = local(event)
      if (reducedMotion) {
        current = { ...target }
        place()
      } else if (!frame) {
        frame = requestAnimationFrame(tick)
      }
    }
    const onLeave = () => delete link.dataset.pill

    folder.addEventListener('pointerenter', onFolderEnter)
    folder.addEventListener('pointerleave', onFolderLeave)
    link.addEventListener('focus', onFocus)
    link.addEventListener('blur', onBlur)
    link.addEventListener('pointerenter', onEnter)
    link.addEventListener('pointermove', onMove)
    link.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      folder.removeEventListener('pointerenter', onFolderEnter)
      folder.removeEventListener('pointerleave', onFolderLeave)
      link.removeEventListener('focus', onFocus)
      link.removeEventListener('blur', onBlur)
      link.removeEventListener('pointerenter', onEnter)
      link.removeEventListener('pointermove', onMove)
      link.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div className={styles.section}>
      <a ref={linkRef} href={site.links.github} className={styles.link} target="_blank" rel="noreferrer">
        <span className={styles.word}>{t(ui.moreWork.before)}</span>

        <span ref={folderRef} className={styles.folder} aria-hidden="true">
          <span className={styles.folderInner}>
            <span className={styles.back} />
            {previews.map((project, index) => {
              const image = project.media.find((media) => !media.src.endsWith('.mp4'))
              const Icon = project.icon
              return (
                <span key={project.id} className={`${styles.card} ${styles[`card${index}`]} ${tones[project.tone]}`}>
                  {image ? <img src={image.src} alt="" loading="lazy" decoding="async" /> : <Icon strokeWidth={1.5} />}
                </span>
              )
            })}
            <span className={styles.front}>
              <Images className={styles.frontIcon} strokeWidth={1.5} />
              <span className={styles.gloss} />
            </span>
          </span>
        </span>

        <span className={styles.word}>{t(ui.moreWork.after)}</span>
        <span className="visually-hidden">
          {' '}
          — {t(ui.moreWork.label)} {t(ui.external)}
        </span>

        <span ref={pillRef} className={styles.pill} aria-hidden="true">
          {t(ui.moreWork.view)}
          <Eye className={styles.pillIcon} strokeWidth={1.75} />
        </span>
      </a>
    </div>
  )
}
