import { FileText, FolderOpen, Mail, Smile, type LucideIcon } from 'lucide-react'
import type { MouseEvent } from 'react'
import { Link, useLocation } from 'react-router'
import { mailto, site } from '../../content/site'
import { ui } from '../../content/ui'
import type { Localized } from '../../i18n/types'
import { useCvLink } from '../../hooks/useCvLink'
import { useScrollingDown } from '../../hooks/useScrollDirection'
import { useI18n } from '../../i18n/useI18n'
import styles from './SiteNav.module.css'

type NavItem = { id: string; label: Localized; icon: LucideIcon } & (
  | { kind: 'page'; to: string }
  | { kind: 'section'; to: { pathname: string; hash: string } }
  | { kind: 'cv' }
)

const NAV_ITEMS: NavItem[] = [
  { id: 'work', label: ui.nav.work, icon: FolderOpen, kind: 'section', to: { pathname: '/', hash: '#work' } },
  { id: 'about', label: ui.nav.about, icon: Smile, kind: 'page', to: '/about' },
  { id: 'cv', label: ui.nav.cv, icon: FileText, kind: 'cv' },
]

export function SiteNav() {
  const { t, lang, setLang } = useI18n()
  const { pathname } = useLocation()
  const nextLang = lang === 'pt' ? 'en' : 'pt'
  // Hides while scrolling down, comes back on scroll up (as in the reference).
  // Keyboard focus inside the nav always brings it back (see CSS).
  const hidden = useScrollingDown()
  const cvLink = useCvLink()

  // "Work" on the home page: scroll to the projects instead of navigating
  // (navigating to the same URL would not move the page).
  function goToSection(event: MouseEvent<HTMLAnchorElement>, hash: string) {
    if (pathname !== '/') return
    const section = document.getElementById(hash.slice(1))
    if (!section) return
    event.preventDefault()
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    section.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
    section.focus({ preventScroll: true })
  }

  return (
    <header className={styles.header} data-hidden={hidden}>
      <nav className={styles.nav} aria-label={t(ui.nav.label)}>
        <Link to="/" className={`${styles.circle} ${styles.logo}`} aria-label={`${site.name} — ${t(ui.nav.home)}`}>
          <span aria-hidden="true">{site.initials}</span>
        </Link>

        <ul className={styles.links}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const content = (
              <>
                <Icon className={styles.icon} aria-hidden="true" strokeWidth={1.75} />
                <span className={styles.label}>{t(item.label)}</span>
              </>
            )
            return (
              <li key={item.id}>
                {item.kind === 'cv' ? (
                  <a {...cvLink} className={styles.link} aria-label={t(ui.cv.description)} title={t(ui.cv.description)}>
                    {content}
                  </a>
                ) : (
                  <Link
                    to={item.to}
                    className={styles.link}
                    aria-current={item.kind === 'page' && pathname === item.to ? 'page' : undefined}
                    onClick={item.kind === 'section' ? (event) => goToSection(event, item.to.hash) : undefined}
                  >
                    {content}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>

        <button
          type="button"
          className={`${styles.circle} ${styles.lang}`}
          onClick={() => setLang(nextLang)}
          aria-label={t(ui.nav.switchLang)}
          lang={nextLang === 'pt' ? 'pt-BR' : 'en'}
        >
          <span aria-hidden="true">{nextLang.toUpperCase()}</span>
        </button>

        <a href={mailto} className={`${styles.circle} ${styles.mail}`} aria-label={t(ui.nav.email)}>
          <Mail className={styles.icon} aria-hidden="true" strokeWidth={1.75} />
        </a>
      </nav>
    </header>
  )
}
