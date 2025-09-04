import { useLocale } from 'next-intl';
import { isRtlLang } from 'rtl-detect';

export default function useTextDirection(locale: string) {
  const defaultLocale = useLocale();
  if (!locale) locale = defaultLocale;
  return isRtlLang(locale) ? 'rtl' : 'ltr';
}

// Utility function for server components
export function getTextDirection(locale: string) {
  return isRtlLang(locale) ? 'rtl' : 'ltr';
}
