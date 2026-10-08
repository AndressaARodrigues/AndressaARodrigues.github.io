import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { Check, Copy } from 'lucide-react'
import { site } from '../../content/site'
import { ui } from '../../content/ui'
import { useI18n } from '../../i18n/useI18n'
import { FitText } from '../FitText/FitText'
import styles from './SiteFooter.module.css'

type Status = 'idle' | 'done' | 'failed'

/**
 * The big name in the footer. Clicking it copies the email address; on mouse
 * pointers a yellow "Click to copy email" pill follows the cursor, offset to
 * the lower right as in the reference.
 */
export function CopyNameButton() {
  const { t } = useI18n()
  const tipRef = useRef<HTMLSpanElement>(null)
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    if (status === 'idle') return
    const timer = window.setTimeout(() => setStatus('idle'), 2000)
    return () => window.clearTimeout(timer)
  }, [status])

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email)
      setStatus('done')
    } catch {
      setStatus('failed')
    }
  }

  function moveTip(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    tipRef.current?.style.setProperty('--tip-x', `${event.clientX - rect.left}px`)
    tipRef.current?.style.setProperty('--tip-y', `${event.clientY - rect.top}px`)
    event.currentTarget.dataset.tip = 'visible'
  }

  const tipText = status === 'idle' ? t(ui.footer.copyEmail) : t(ui.copyEmail[status])
  const TipIcon = status === 'done' ? Check : Copy

  return (
    <button
      type="button"
      className={styles.nameButton}
      onClick={copy}
      onPointerEnter={moveTip}
      onPointerMove={moveTip}
      onPointerLeave={(event) => delete event.currentTarget.dataset.tip}
      aria-label={`${t(ui.footer.copyEmail)}: ${site.email}`}
    >
      <FitText
        as="span"
        lines={[site.firstName, site.lastName]}
        className={styles.name}
        lineClassName={styles.nameLine}
      />
      <span ref={tipRef} className={styles.tip} aria-hidden="true">
        {tipText}
        <TipIcon className={styles.tipIcon} strokeWidth={1.75} />
      </span>
      <span className="visually-hidden" aria-live="polite">
        {status === 'idle' ? '' : t(ui.copyEmail[status])}
      </span>
    </button>
  )
}
