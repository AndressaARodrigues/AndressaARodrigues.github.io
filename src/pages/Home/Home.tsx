import { useRef } from 'react'
import { Avatar } from '../../components/Avatar/Avatar'
import { DisplayHeading } from '../../components/DisplayHeading/DisplayHeading'
import { MoreWork } from '../../components/MoreWork/MoreWork'
import { Panel } from '../../components/Panel/Panel'
import { PhysicsPills } from '../../components/PhysicsPills/PhysicsPills'
import { ProjectCard } from '../../components/ProjectCard/ProjectCard'
import { RichText } from '../../components/RichText/RichText'
import { hero, pills, workLabel } from '../../content/home'
import { projects } from '../../content/projects'
import { site } from '../../content/site'
import { useStickyFit } from '../../hooks/useStickyFit'
import { useI18n } from '../../i18n/useI18n'
import styles from './Home.module.css'

export function Home() {
  const { t, lang } = useI18n()
  const heroRef = useRef<HTMLElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  // The hero stays put while the projects panel slides over it.
  useStickyFit(heroRef)

  return (
    <>
      <title>{`${site.name} — ${lang === 'pt' ? 'Engenheira de Software' : 'Software Engineer'}`}</title>

      <section ref={heroRef} className={styles.hero} aria-labelledby="hero-title">
        <div ref={heroContentRef} className={styles.heroContent}>
          <p className={styles.hello}>
            <span>{t(hero.hello)}</span>
            <Avatar />
            <span>{t(hero.intro)}</span>
          </p>

          <DisplayHeading id="hero-title" lines={t(hero.headline)} />

          <p className={styles.subtitle}>
            {t(hero.subtitle).map((line, index) => (
              <span key={index} className={styles.subtitleLine}>
                <RichText text={line} />{' '}
              </span>
            ))}
          </p>
        </div>

        {/* Sits behind the pile, like the reference; it also labels the projects section. */}
        <h2 id="work-title" className={styles.workLabel}>
          {t(workLabel)}
        </h2>

        <PhysicsPills items={pills} keepClearRef={heroContentRef} />
      </section>

      <Panel id="work" className={styles.work} aria-labelledby="work-title" tabIndex={-1}>
        <div className={styles.projects}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <MoreWork />
      </Panel>
    </>
  )
}
