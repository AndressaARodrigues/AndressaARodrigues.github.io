import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { I18nContext } from './context'
import { LANGS, type Lang, type Localized } from './types'

const STORAGE_KEY = 'portfolio-lang'

function readStoredLang(): Lang | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return LANGS.includes(stored as Lang) ? (stored as Lang) : null
  } catch {
    return null
  }
}

function detectInitialLang(): Lang {
  if (typeof window === 'undefined') return 'pt'
  const stored = readStoredLang()
  if (stored) return stored
  return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitialLang)

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage unavailable (private mode): the choice lasts for this visit */
    }
  }, [])

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: <T,>(localized: Localized<T>) => localized[lang],
    }),
    [lang, setLang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
