import { BriefcaseBusiness, Code, FileText, Mail, type LucideIcon } from 'lucide-react'
import { mailto, site } from '../../content/site'
import { ui } from '../../content/ui'
import type { Localized } from '../../i18n/types'
import { useCvLink } from '../../hooks/useCvLink'
import { useI18n } from '../../i18n/useI18n'
import { WatchingEyes } from '../WatchingEyes/WatchingEyes'
import { CopyNameButton } from './CopyNameButton'
import styles from './SiteFooter.module.css'

const YEAR = new Date().getFullYear()

type FooterLink = { id: string; label: Localized; icon: LucideIcon } & (
  | { kind: 'mail' | 'external'; href: string }
  | { kind: 'cv' }
)

const LINKS: FooterLink[] = [
  { id: 'email', label: ui.footer.email, icon: Mail, kind: 'mail', href: mailto },
  { id: 'cv', label: ui.cv.description, icon: FileText, kind: 'cv' },
  { id: 'linkedin', label: ui.footer.linkedin, icon: BriefcaseBusiness, kind: 'external', href: site.links.linkedin },
  { id: 'github', label: ui.footer.github, icon: Code, kind: 'external', href: site.links.github },
]

export function SiteFooter() {
  const { t } = useI18n()
  const cvLink = useCvLink()

  return (
    <footer className={styles.footer}>
      <WatchingEyes />

      <div className={styles.connect}>
        <p className={styles.message}>
          <span>{t(ui.footer.title)}</span>
          <span>{t(ui.footer.subtitle)}</span>
        </p>

        <ul className={styles.links} aria-label={t(ui.footer.linksLabel)}>
          {LINKS.map((item) => {
            const Icon = item.icon
            const name = item.kind === 'external' ? `${t(item.label)} ${t(ui.external)}` : t(item.label)
            const linkProps =
              item.kind === 'cv'
                ? cvLink
                : item.kind === 'external'
                  ? { href: item.href, target: '_blank', rel: 'noreferrer' }
                  : { href: item.href }
            return (
              <li key={item.id}>
                <a {...linkProps} className={styles.circle} aria-label={name} title={t(item.label)}>
                  <Icon className={styles.icon} aria-hidden="true" strokeWidth={1.75} />
                </a>
              </li>
            )
          })}
        </ul>
      </div>

      <CopyNameButton />

      <div className={styles.legal}>
        <p>
          © {YEAR} {site.name}
        </p>
        <p>{t(ui.footer.madeIn)}</p>
      </div>
    </footer>
  )
}
