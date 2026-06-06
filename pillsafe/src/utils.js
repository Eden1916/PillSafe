/**
 * Returns the localized string from a translatable object.
 * Falls back to English if the requested language is not available.
 * @param {object} obj - Object with language keys (en, am, or, ...)
 * @param {string} lang - Language code
 * @returns {string}
 */
export function t(obj, lang) {
  return obj[lang] || obj["en"] || "";
}
