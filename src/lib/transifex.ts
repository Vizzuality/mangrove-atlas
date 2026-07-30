/**
 * Transifex Live translates the page client-side, but it never updates `<html lang>` — that stays
 * at the `en` baked into the server-rendered layout. Screen readers pick their voice and
 * pronunciation from that attribute, so translated content would be read with an English voice.
 *
 * Every language change in the app goes through `live.translateTo` in one of the two language
 * selectors, so keeping the attribute in sync at those call sites covers the whole app.
 */
export function syncDocumentLanguage(localeCode?: string) {
  if (typeof document === 'undefined' || !localeCode) return;

  // Transifex uses locale codes like `pt_BR`; `lang` expects the BCP 47 form (`pt-BR`).
  document.documentElement.lang = localeCode.replace(/_/g, '-');
}
