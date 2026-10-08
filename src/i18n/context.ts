import { createContext } from 'react'
import type { Lang, Localized } from './types'

export interface I18nContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  /** Picks the value for the active language. */
  t: <T>(value: Localized<T>) => T
}

export const I18nContext = createContext<I18nContextValue | null>(null)
