/**
 * Translation utility for property keywords
 * Translates common property keywords from English to Arabic
 */

const keywordTranslations = {
  en: {
    // Common property keywords in English (no translation needed)
  },
  ar: {
    // Common property keywords translations
    'luxury': 'فاخر',
    'modern': 'حديث',
    'beachfront': 'على الشاطئ',
    'seaview': 'إطلالة على البحر',
    'mountain view': 'إطلالة على الجبل',
    'city center': 'وسط المدينة',
    'near beach': 'قريب من الشاطئ',
    'furnished': 'مفروش',
    'unfurnished': 'غير مفروش',
    'spacious': 'واسع',
    'cozy': 'مريح',
    'renovated': 'مجدّد',
    'new': 'جديد',
    'villa': 'فيلا',
    'apartment': 'شقة',
    'penthouse': 'بنتهاوس',
    'studio': 'استوديو',
    'duplex': 'دوبلكس',
    'pool': 'مسبح',
    'garden': 'حديقة',
    'parking': 'موقف سيارات',
    'elevator': 'مصعد',
    'balcony': 'شرفة',
    'terrace': 'تراس',
    'garage': 'كراج',
    'security': 'أمن',
    'quiet': 'هادئ',
    'family': 'عائلي',
    'investment': 'استثماري',
    'commercial': 'تجاري',
    'residential': 'سكني',
    'office': 'مكتب',
    'shop': 'محل',
    'land': 'أرض',
    'plot': 'قطعة',
    'prime location': 'موقع ممتاز',
    'best price': 'أفضل سعر',
    'negotiable': 'قابل للتفاوض',
    'urgent': 'عاجل',
    'available': 'متاح',
    'sale': 'للبيع',
    'rent': 'للإيجار',
  }
};

/**
 * Translate a single keyword
 * @param {string} keyword - The keyword to translate
 * @param {string} locale - Current locale ('en' or 'ar')
 * @returns {string} Translated keyword or original if no translation found
 */
export const translateKeyword = (keyword, locale = 'en') => {
  if (!keyword || locale === 'en') {
    return keyword;
  }

  const trimmedKeyword = keyword.trim().toLowerCase();
  
  // Check if translation exists
  if (keywordTranslations[locale] && keywordTranslations[locale][trimmedKeyword]) {
    return keywordTranslations[locale][trimmedKeyword];
  }

  // Return original keyword if no translation found
  return keyword;
};

/**
 * Translate a comma-separated string of keywords
 * @param {string} keywordsString - Comma-separated keywords string
 * @param {string} locale - Current locale ('en' or 'ar')
 * @returns {string} Translated keywords string
 */
export const translateKeywords = (keywordsString, locale = 'en') => {
  if (!keywordsString || locale === 'en') {
    return keywordsString;
  }

  return keywordsString
    .split(',')
    .map(keyword => translateKeyword(keyword, locale))
    .join(',');
};

/**
 * Translate keywords array
 * @param {Array<string>} keywords - Array of keywords
 * @param {string} locale - Current locale ('en' or 'ar')
 * @returns {Array<string>} Array of translated keywords
 */
export const translateKeywordsArray = (keywords, locale = 'en') => {
  if (!keywords || !Array.isArray(keywords) || locale === 'en') {
    return keywords;
  }

  return keywords.map(keyword => translateKeyword(keyword, locale));
};

/**
 * Translates a single property keyword using next-intl translation function.
 * @param {string} keyword - The keyword to translate.
 * @param {Function} t - The translation function from next-intl.
 * @returns {string} The translated keyword, or the original if no translation is found.
 */
export const translateKeywordWithT = (keyword, t) => {
  if (!keyword) return '';
  
  const trimmedKeyword = keyword.trim();
  
  // Skip very short keywords (likely fragments) - minimum 3 characters
  // Also skip single digits or very short numeric strings that are likely fragments
  if (trimmedKeyword.length < 3 || /^\d+$/.test(trimmedKeyword)) {
    return trimmedKeyword;
  }
  
  // Try multiple translation key formats
  const translationAttempts = [
    // 1. Try exact match (case-sensitive) - for keywords like "Green Title Deed", "Sea view", "East-facing"
    trimmedKeyword,
    // 2. Try with first letter capitalized - for "Sea view" -> "Sea View"
    trimmedKeyword.charAt(0).toUpperCase() + trimmedKeyword.slice(1).toLowerCase(),
    // 3. Try normalized format (lowercase, spaces/hyphens to underscores)
    trimmedKeyword.toLowerCase().replace(/[\s-]/g, '_'),
    // 4. Try with commas replaced (for "2,400 shares" -> "2_400_shares")
    trimmedKeyword.toLowerCase().replace(/[\s,-]/g, '_'),
    // 5. Try original format with spaces preserved but lowercase
    trimmedKeyword.toLowerCase(),
    // 6. Try with spaces replaced by underscores only
    trimmedKeyword.replace(/\s+/g, '_'),
    // 7. Try with hyphens replaced by underscores
    trimmedKeyword.replace(/-/g, '_'),
  ];
  
  // Try each format
  // Note: t is already scoped to 'common' namespace (from useTranslations('common'))
  // So we only need 'propertyKeywords.xxx', not 'common.propertyKeywords.xxx'
  for (const attempt of translationAttempts) {
    // Try with propertyKeywords prefix (t is already scoped to 'common')
    const translationKey = `propertyKeywords.${attempt}`;
    
    try {
      // Use defaultValue to avoid errors when translation is missing
      // Set defaultValue to null so we can detect if translation exists
      const translated = t(translationKey, { defaultValue: null });
      
      // If translation found (not the key itself and not null), return it
      if (translated && 
          translated !== translationKey && 
          translated !== null &&
          !translated.startsWith('propertyKeywords.') && 
          !translated.startsWith('common.propertyKeywords.')) {
        return translated;
      }
    } catch (e) {
      // If error, continue to next attempt
      continue;
    }
  }
  
  // Return empty string if no translation found (don't show the tag)
  return '';
};

/**
 * Translates a comma-separated string of property keywords into an array of translated keywords.
 * @param {string} keywordsString - A comma-separated string of keywords.
 * @param {Function} t - The translation function from next-intl.
 * @returns {string[]} An array of translated keywords (only keywords with translations are included).
 */
export const translateKeywordsString = (keywordsString, t) => {
  if (!keywordsString) return [];
  // Filter out empty strings (keywords without translations)
  return keywordsString.split(',').map(keyword => translateKeywordWithT(keyword.trim(), t)).filter(Boolean);
};

