import { BriefcaseBusiness, Download } from 'lucide-react'
import { CopyEmailButton } from '../../components/CopyEmailButton/CopyEmailButton'
import { DisplayHeading } from '../../components/DisplayHeading/DisplayHeading'
import { Panel } from '../../components/Panel/Panel'
import { PhotoFan } from '../../components/PhotoFan/PhotoFan'
import { RichText } from '../../components/RichText/RichText'
import { about } from '../../content/about'
import { site } from '../../content/site'
import { ui } from '../../content/ui'
import { useCvLink } from '../../hooks/useCvLink'
import { useI18n } from '../../i18n/useI18n'
import styles from './About.module.css'

export function About() {
  const { t, lang } = useI18n()
  const external = ` ${t(ui.external)}`
  const cvLink = useCvLink()

  return (
    <>
      <title>{`${lang === 'pt' ? 'Sobre' : 'About'} — ${site.name}`}</title>

      {/* The whole page is one white panel that rounds off over the footer. */}
      <Panel as="div" flushTop className={styles.page}>
        <section className={styles.hero} aria-labelledby="about-title">
          <DisplayHeading id="about-title" lines={t(about.headline)} className={styles.headline} />
          <p className={styles.lead}>{t(about.lead)}</p>
        </section>

        <PhotoFan photos={about.photos} />

        <div className={styles.bio}>
          {about.intro.map((paragraph, index) => (
            <p key={index} className={styles.paragraph}>
              <RichText text={t(paragraph)} />
            </p>
          ))}

          {about.sections.map((section) => (
            <section key={section.id} className={styles.section} aria-labelledby={`about-${section.id}`}>
              <h2 id={`about-${section.id}`} className={styles.label}>
                {t(section.label)}
              </h2>
              {[t<string | string[]>(section.body)].flat().map((paragraph, index) => (
                <p key={index} className={styles.paragraph}>
                  <RichText text={paragraph} />
                </p>
              ))}
            </section>
          ))}

          <section className={styles.cta} aria-labelledby="about-cta">
            <h2 id="about-cta" className={styles.ctaTitle}>
              {t(about.cta)}
            </h2>
            <div className={styles.ctaActions}>
              <CopyEmailButton />
              <a {...cvLink} className={styles.pill} aria-label={t(ui.cv.description)}>
                {t(ui.cv.download)}
                <Download className={styles.pillIcon} aria-hidden="true" strokeWidth={1.75} />
              </a>
              <a
                href={site.links.linkedin}
                className={styles.circle}
                target="_blank"
                rel="noreferrer"
                aria-label={`LinkedIn${external}`}
                title="LinkedIn"
              >
                <BriefcaseBusiness className={styles.circleIcon} aria-hidden="true" strokeWidth={1.75} />
              </a>
            </div>
          </section>
        </div>
      </Panel>
    </>
  )
}
