import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { site } from '../../content/site'
import { ui } from '../../content/ui'
import { useI18n } from '../../i18n/useI18n'
import styles from './CopyEmailButton.module.css'

type Status = 'idle' | 'done' | 'failed'

/** Copies the email to the clipboard and confirms it in place. */
export function CopyEmailButton({ className }: { className?: string }) {
  const { t } = useI18n()
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    if (status === 'idle') return
    const timer = window.setTimeout(() => setStatus('idle'), 2400)
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

  const Icon = status === 'done' ? Check : Copy

  return (
    <button type="button" onClick={copy} className={[styles.button, className].filter(Boolean).join(' ')}>
      <span aria-live="polite">{t(ui.copyEmail[status])}</span>
      <Icon className={styles.icon} aria-hidden="true" strokeWidth={1.75} />
    </button>
  )
}
