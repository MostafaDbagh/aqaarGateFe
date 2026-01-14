/**
 * City Translation Constants
 * Single source of truth for city name translations (English to Arabic)
 * 
 * This file contains the mapping of English city names to their Arabic translations.
 * All components should import and use these constants instead of defining their own mappings.
 */

// City translation map: English name -> Arabic name
export const CITY_TRANSLATION_MAP = {
  'Latakia': 'اللاذقية',
  'Damascus': 'دمشق',
  'Aleppo': 'حلب',
  'Homs': 'حمص',
  'Hama': 'حماة',
  'Idlib': 'إدلب',
  'Deir ez-Zur': 'دير الزور',
  'Deir ez-Zor': 'دير الزور', // Alternative spelling
  'Daraa': 'درعا',
  'Tartus': 'طرطوس',
  'Tartous': 'طرطوس', // Alternative spelling
  'As-Suwayda': 'السويداء',
  'Raqqah': 'الرقة'
};

/**
 * Translate city name from English to Arabic
 * @param {string} cityName - The English city name
 * @param {string} locale - The current locale ('ar' or 'en')
 * @returns {string} - The translated city name if locale is 'ar', otherwise returns the original name
 */
export const translateCity = (cityName, locale = 'en') => {
  if (!cityName || locale !== 'ar') {
    return cityName;
  }
  return CITY_TRANSLATION_MAP[cityName] || cityName;
};

/**
 * Get city translation map based on locale
 * @param {string} locale - The current locale ('ar' or 'en')
 * @returns {Object} - The translation map if locale is 'ar', otherwise returns empty object
 */
export const getCityTranslationMap = (locale = 'en') => {
  if (locale === 'ar') {
    return CITY_TRANSLATION_MAP;
  }
  return {};
};

// Export as default for convenience
export default {
  CITY_TRANSLATION_MAP,
  translateCity,
  getCityTranslationMap
};

