import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../../content/projects'
import { site } from '../../content/site'
import { ui } from '../../content/ui'
import { useStickyFit } from '../../hooks/useStickyFit'
import { useI18n } from '../../i18n/useI18n'
import tones from '../../styles/tones.module.css'
import { DragStrip } from '../DragStrip/DragStrip'
import { MediaTile } from '../MediaTile/MediaTile'
import styles from './ProjectCard.module.css'

/**
 * Width / height of placeholder tiles until real media is added. Taken from
 * the reference strip (tiles about 0.8 and 0.76 as wide as they are tall).
 */
const PLACEHOLDER_RATIOS = [0.81, 0.76, 0.81, 1.12]

/**
 * One project. Cards stick to the top of the viewport and the next card
 * slides over the previous one (see the CSS for which cards stick).
 */
export function ProjectCard({ project }: { project: Project }) {
  const { t } = useI18n()
  const cardRef = useRef<HTMLElement>(null)
  useStickyFit(cardRef)
  const { icon: Icon } = project
  const titleId = `project-${project.id}`

  return (
    <article ref={cardRef} className={styles.card} aria-labelledby={titleId}>
      <header className={styles.header}>
        <div className={styles.text}>
          <h3 id={titleId} className={styles.title}>
            <span className={`${styles.thumb} ${tones[project.tone]}`} aria-hidden="true">
              <Icon strokeWidth={1.75} />
            </span>
            {project.name}
          </h3>

          <p className={styles.tagline}>{t(project.tagline)}</p>
          <p className={styles.summary}>{t(project.summary)}</p>

          <ul className={styles.tags} aria-label={t(ui.projects.stack)}>
            {project.stack.map((item) => {
              const label = typeof item === 'string' ? item : t(item)
              return <li key={label}>{label}</li>
            })}
          </ul>
        </div>

        <a
          href={project.href ?? site.links.github}
          className={styles.cta}
          target="_blank"
          rel="noreferrer"
          aria-label={`${t(ui.projects.viewOnGithub)}: ${project.name} ${t(ui.external)}`}
        >
          {t(ui.projects.viewOnGithub)}
          <ArrowUpRight className={styles.ctaIcon} aria-hidden="true" strokeWidth={2} />
        </a>
      </header>

      <DragStrip tone={project.tone}>
        {project.media.length > 0
          ? project.media.map((media) => (
              <MediaTile
                key={media.src}
                kind={media.src.endsWith('.mp4') ? 'video' : 'image'}
                src={media.src}
                alt={t(media.alt)}
                aspectRatio={media.aspectRatio}
              />
            ))
          : PLACEHOLDER_RATIOS.map((ratio, index) => (
              <MediaTile
                key={index}
                kind="placeholder"
                icon={project.icon}
                tone={project.tone}
                aspectRatio={ratio}
                variant={index}
              />
            ))}
      </DragStrip>
    </article>
  )
}
