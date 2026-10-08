export const LANGS = ['pt', 'en'] as const

export type Lang = (typeof LANGS)[number]

/** A value that exists once per supported language. */
export type Localized<T = string> = Record<Lang, T>
