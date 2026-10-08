import { site } from '../content/site'
import { useI18n } from '../i18n/useI18n'

/** Anchor props that download the CV in the current site language. */
export function useCvLink() {
  const { t } = useI18n()
  const { href, fileName } = t(site.cv)
  return { href, download: fileName, type: 'application/pdf' }
}
