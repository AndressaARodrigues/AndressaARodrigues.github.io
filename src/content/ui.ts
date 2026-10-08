import type { Localized } from '../i18n/types'

/** Interface strings (labels, buttons, accessible names). */
export const ui = {
  skipToContent: { pt: 'Pular para o conteúdo', en: 'Skip to content' },
  nav: {
    label: { pt: 'Navegação principal', en: 'Main navigation' },
    home: { pt: 'Início', en: 'Home' },
    work: { pt: 'Projetos', en: 'Work' },
    about: { pt: 'Sobre', en: 'About' },
    cv: { pt: 'CV', en: 'CV' },
    email: { pt: 'Enviar e-mail', en: 'Send an email' },
    switchLang: { pt: 'Ver em inglês', en: 'View in Portuguese' },
  },
  cv: {
    /** Visible label of the About page button. */
    download: { pt: 'Baixar CV', en: 'Download CV' },
    /** Accessible name and tooltip of the CV links (keeps the visible "CV"). */
    description: { pt: 'Baixar CV em PDF', en: 'Download CV as PDF' },
  },
  projects: {
    viewOnGithub: { pt: 'Ver no GitHub', en: 'View on GitHub' },
    stack: { pt: 'Tecnologias', en: 'Technologies' },
    drag: { pt: 'Arraste', en: 'Drag' },
  },
  moreWork: {
    before: { pt: 'Mais', en: 'More' },
    after: { pt: 'projetos', en: 'Work' },
    label: { pt: 'ver mais projetos no GitHub', en: 'see more projects on GitHub' },
    view: { pt: 'Ver', en: 'View' },
  },
  footer: {
    title: { pt: 'Vamos conversar?', en: "Let's talk." },
    subtitle: {
      pt: 'Minha caixa de entrada está sempre aberta.',
      en: 'My inbox is always open.',
    },
    madeIn: { pt: 'Feito em Porto Alegre', en: 'Made in Porto Alegre' },
    linksLabel: { pt: 'Contato e perfis', en: 'Contact and profiles' },
    email: { pt: 'Enviar e-mail', en: 'Send an email' },
    copyEmail: { pt: 'Clique para copiar o e-mail', en: 'Click to copy email' },
    linkedin: { pt: 'LinkedIn', en: 'LinkedIn' },
    github: { pt: 'GitHub', en: 'GitHub' },
  },
  copyEmail: {
    idle: { pt: 'Copiar e-mail', en: 'Copy email' },
    done: { pt: 'E-mail copiado', en: 'Email copied' },
    failed: { pt: 'Não foi possível copiar', en: "Couldn't copy" },
  },
  external: { pt: '(abre em nova aba)', en: '(opens in a new tab)' },
} satisfies Record<string, Localized | Record<string, Localized>>
