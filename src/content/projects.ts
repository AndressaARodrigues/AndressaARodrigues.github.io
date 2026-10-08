import { Bot, CloudRain, Landmark, type LucideIcon } from 'lucide-react'
import type { Localized } from '../i18n/types'
import type { PillTone } from './home'

export interface ProjectMedia {
  /** Path under /public (image or .mp4 video). */
  src: string
  alt: Localized
  /** Width / height, used to size the tile before it loads. */
  aspectRatio: number
}

export interface Project {
  id: string
  /** Shown as the card title. */
  name: string
  icon: LucideIcon
  tone: PillTone
  /** One-line hook under the name: why the idea matters. */
  tagline: Localized
  /** What the project is and my role in it (2–3 short sentences). */
  summary: Localized
  /** Technology tags under the subtitle. Plain strings read the same in both languages. */
  stack: Array<string | Localized>
  /** Where the card's button goes. Defaults to the GitHub profile. */
  href?: string
  /**
   * Screenshots / videos for the scrolling strip.
   * While empty, neutral tiles in the project's color are shown.
   */
  media: ProjectMedia[]
}

export const projects: Project[] = [
  {
    id: 'labclima',
    name: 'LabClima',
    icon: CloudRain,
    tone: 'blue',
    tagline: {
      pt: 'Qualquer escola pode ser uma estação meteorológica.',
      en: 'Any school can be a weather station.',
    },
    summary: {
      pt: 'Fui uma das idealizadoras e liderei o time deste projeto: uma estação meteorológica de baixo custo que leva dados climáticos locais a uma escola no alto de Porto Alegre, exposta a temporais e quedas de árvores. Os dados viram prevenção e material de aula, e o projeto foi pensado para ser replicado em outras escolas.',
      en: 'I co-founded and led the team behind this project: a low-cost weather station that brings local climate data to a hilltop school in Porto Alegre, exposed to storms and falling trees. The data turns into prevention and classroom material, and the project was designed to be replicated in other schools.',
    },
    stack: ['Raspberry Pi', 'Python', 'Flask', 'MariaDB', 'React', 'TypeScript', 'WebSockets', 'Docker'],
    media: [],
  },
  {
    id: 'tutor',
    name: 'Tutor IA',
    icon: Bot,
    tone: 'lavender',
    tagline: {
      pt: 'IA para apoiar quem está aprendendo a pesquisar.',
      en: 'AI to support people learning how to do research.',
    },
    summary: {
      pt: 'Parte da minha pesquisa de mestrado, em que acompanho de perto como a inteligência artificial pode apoiar o ensino-aprendizagem. O tutor ajuda pesquisadores a definir o tema e avaliar sua viabilidade, guiando por perguntas em vez de entregar respostas prontas.',
      en: "Part of my master's research, where I closely follow how artificial intelligence can support teaching and learning. The tutor helps researchers define their topic and assess its feasibility, guiding them with questions instead of handing out ready-made answers.",
    },
    stack: [
      { pt: 'IA na educação', en: 'AI in education' },
      { pt: 'Pesquisa científica', en: 'Scientific research' },
      'Python',
      'LangGraph',
      'Ollama',
    ],
    media: [],
  },
  {
    id: 'emendas-pix',
    name: 'Emendas Pix',
    icon: Landmark,
    tone: 'mint',
    tagline: {
      pt: 'De dados públicos fragmentados a uma análise clara.',
      en: 'From fragmented public data to a clear analysis.',
    },
    summary: {
      pt: 'Atuei como analista de dados em um projeto sobre recursos públicos: da montagem do dataset, a partir da API do Transferegov, ao pipeline de tratamento e às visualizações que mostram como as Emendas Pix se distribuem por área em Alegrete/RS.',
      en: 'I worked as a data analyst on a public-spending project: from building the dataset out of the Transferegov API to the processing pipeline and the visualizations that show how Emendas Pix funds are distributed across areas in Alegrete/RS.',
    },
    stack: [
      { pt: 'Análise de dados', en: 'Data analysis' },
      { pt: 'Pipeline de dados', en: 'Data pipeline' },
      { pt: 'Visualização de dados', en: 'Data visualization' },
      'API Transferegov',
    ],
    media: [],
  },
]
