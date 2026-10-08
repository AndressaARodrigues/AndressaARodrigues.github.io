import {
  Accessibility,
  BookOpen,
  Braces,
  Bug,
  Coffee,
  Crosshair,
  MousePointerClick,
  Radio,
  Rocket,
  Sparkle,
  SquareTerminal,
  TestTubeDiagonal,
  Timer,
  type LucideIcon,
} from 'lucide-react'
import type { Localized } from '../i18n/types'

export type PillTone = 'yellow' | 'orange' | 'mint' | 'lime' | 'lavender' | 'pink' | 'blue' | 'neutral'

export interface PillItem {
  id: string
  /** Omit for an icon-only (circular) pill. */
  label?: Localized
  icon: LucideIcon
  tone: PillTone
}

/**
 * Rich text convention used by <RichText>: **strong** and *emphasis*.
 * Headline and subtitle are arrays of lines; each entry is one line on
 * tablet/desktop and wraps naturally on phones.
 */
export const hero = {
  hello: { pt: 'Olá', en: 'Hello' },
  intro: { pt: 'Sou a Andressa', en: "I'm Andressa" },
  headline: {
    pt: ['Construo software', 'em que as pessoas', 'podem *confiar.*'],
    en: ['I build software', 'people can *trust.*'],
  },
  subtitle: {
    pt: ['Sou **engenheira de software**, com olhar atento para design', 'e dedicada a criar produtos de alta qualidade.'],
    en: ["I'm a **software engineer** with a keen eye for design,", 'dedicated to building high-quality products.'],
  },
} satisfies Record<string, Localized<string | string[]>>

export const workLabel: Localized = {
  pt: 'PROJETOS',
  en: 'PROJECTS',
}

/**
 * Pills for the hero pile, in priority order: the pile keeps as many as fit
 * in its row budget (2 rows on desktop/tablet, 3 on phones), dropping the
 * last ones on narrower screens. Positions are shuffled when they fall.
 */
export const pills: PillItem[] = [
  { id: 'ship', label: { pt: 'ENTREGANDO FEATURES', en: 'SHIPPING FEATURES' }, icon: Rocket, tone: 'orange' },
  { id: 'types', label: { pt: 'TIPANDO TUDO', en: 'TYPING EVERYTHING' }, icon: Braces, tone: 'mint' },
  { id: 'tests', label: { pt: 'ESCREVENDO TESTES', en: 'WRITING TESTS' }, icon: TestTubeDiagonal, tone: 'lavender' },
  { id: 'center', label: { pt: 'CENTRALIZANDO DIVS', en: 'CENTERING DIVS' }, icon: Crosshair, tone: 'lime' },
  { id: 'coffee', icon: Coffee, tone: 'yellow' },
  { id: 'bugs', label: { pt: 'CAÇANDO BUGS', en: 'HUNTING BUGS' }, icon: Bug, tone: 'pink' },
  { id: 'terminal', icon: SquareTerminal, tone: 'orange' },
  { id: 'realtime', label: { pt: 'DADOS EM TEMPO REAL', en: 'STREAMING DATA' }, icon: Radio, tone: 'blue' },
  { id: 'a11y', label: { pt: 'CUIDANDO DA A11Y', en: 'CARING ABOUT A11Y' }, icon: Accessibility, tone: 'yellow' },
  { id: 'sparkle', icon: Sparkle, tone: 'lavender' },
  { id: 'docs', label: { pt: 'LENDO DOCS', en: 'READING DOCS' }, icon: BookOpen, tone: 'neutral' },
  { id: 'click', icon: MousePointerClick, tone: 'neutral' },
  { id: 'timer', icon: Timer, tone: 'blue' },
]
