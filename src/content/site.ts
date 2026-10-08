import avatarPhoto from '../assets/avatar.webp'
import type { Localized } from '../i18n/types'

/** A file to download, with the name it is saved under. */
export interface DownloadFile {
  href: string
  fileName: string
}

/**
 * Personal data used across the site. Edit here, not in components.
 */
export const site = {
  name: 'Andressa Rodrigues',
  firstName: 'Andressa',
  lastName: 'Rodrigues',
  initials: 'AR',
  location: 'Porto Alegre',
  email: 'andressa.rodrigues19@outlook.com',
  /**
   * Round profile photo next to "Hello" (src/assets/avatar.webp, 128×128).
   * Set to null to show the initials instead.
   */
  avatarSrc: avatarPhoto as string | null,
  /**
   * CV in each language, served from /public/cv. CV links download the file
   * that matches the site language, saved as `fileName`.
   */
  cv: {
    pt: { href: `${import.meta.env.BASE_URL}cv/Andressa_Rodrigues_CV_PT.pdf`, fileName: 'Andressa_Rodrigues_CV_PT.pdf' },
    en: { href: `${import.meta.env.BASE_URL}cv/Andressa_Rodrigues_CV_EN.pdf`, fileName: 'Andressa_Rodrigues_CV_EN.pdf' },
  } as Localized<DownloadFile>,
  links: {
    linkedin: 'https://www.linkedin.com/in/andressaar',
    github: 'https://github.com/AndressaARodrigues',
  },
} as const

export const mailto = `mailto:${site.email}`
