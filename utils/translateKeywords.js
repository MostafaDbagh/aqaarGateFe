/**
 * Translation utility for property keywords
 * - English → Arabic: for display when locale is ar
 * - Arabic → English: for API search (backend stores English keywords)
 */

// Arabic → English: reverse map for API search (user types Arabic, backend expects English)
const arabicToEnglishKeywords = {
  // Property types
  'شقة': 'Apartment',
  'شقق': 'Apartment',
  'شقة سكنية': 'Apartment',
  'شقق سكنية': 'Apartment',
  'فيلا': 'Villa',
  'فيلا/مزرعة': 'Villa',
  'منزل': 'House',
  'أرض': 'Land',
  'مبنى': 'Building',
  'مكتب': 'Office',
  'تجاري': 'Commercial',
  'تجاري (محلات)': 'Commercial',
  'محل': 'Shop',
  'بيت عطلة': 'Holiday Home',
  'استوديو': 'Studio',
  'بنتهاوس': 'Penthouse',
  'دوبلكس': 'Duplex',
  'ديلوكس': 'Duplex',
  // Features
  'مفروش': 'Furnished',
  'غير مفروش': 'Unfurnished',
  'واسع': 'Spacious',
  'مريح': 'Cozy',
  'مجدّد': 'Renovated',
  'جديد': 'New',
  'حديث': 'Modern',
  'فاخر': 'Luxury',
  'مسبح': 'Pool',
  'حديقة': 'Garden',
  'موقف سيارات': 'Parking',
  'مصعد': 'Elevator',
  'شرفة': 'Balcony',
  'بلكونة': 'Balcony',
  'تراس': 'Terrace',
  'كراج': 'Garage',
  'أمن': 'Security',
  'هادئ': 'Quiet',
  'عائلي': 'Family',
  'استثماري': 'Investment',
  'سكني': 'Residential',
  'قطعة': 'Plot',
  'قطعة أرض': 'Plot',
  // Location
  'وسط المدينة': 'City Center',
  'قريب من الشاطئ': 'Near Beach',
  'إطلالة بحرية': 'Sea View',
  'إطلالة على البحر': 'Sea View',
  'إطلالة جبلية': 'Mountain View',
  'إطلالة على الجبل': 'Mountain View',
  'إطلالة مفتوحة': 'Open View',
  'إطلالة': 'View',
  'مواجه للبحر': 'Beachfront',
  'على الشاطئ': 'Beachfront',
  'موقع ممتاز': 'Prime Location',
  'أفضل سعر': 'Best Price',
  'قابل للتفاوض': 'Negotiable',
  'عاجل': 'Urgent',
  'متاح': 'Available',
  // Status
  'للبيع': 'sale',
  'للإيجار': 'rent',
  'بيع': 'sale',
  'إيجار': 'rent',
  // Cities
  'حلب': 'Aleppo',
  'دمشق': 'Damascus',
  'اللاذقية': 'Latakia',
  'حمص': 'Homs',
  'حماة': 'Hama',
  'طرطوس': 'Tartus',
  'إدلب': 'Idlib',
  'دير الزور': 'Deir ez-Zur',
  'درعا': 'Daraa',
  'السويداء': 'As-Suwayda',
  'الرقة': 'Raqqah',
  // Country (keyword search - not city filter)
  'سوريا': 'Syria',
  'سورية': 'Syria',
  // Finishing
  'اكساء حجري': 'Stone finishing',
  'تشطيب حجري': 'Stone finishing',
  'اكساء عادي': 'Standard finishing',
  'تشطيب عادي': 'Standard finishing',
  'تشطيب دوبلكس': 'Doublex finishing',
  'اكساء ديلوكس': 'Doublex finishing',
  'اكساء سوبر ديلوكس': 'Super doublex finishing',
  'سند أخضر': 'Green Title Deed',
  'طابو أخضر': 'Green Title Deed',
  'قشرة جاهزة': 'Shell house',
  'قبلي(جنوبي)': 'South-facing house',
  'جنوبي': 'South-facing',
  'شمالي': 'North-facing',
  'شرقي': 'East-facing',
  'غربي': 'West-facing',
  'مهوي': 'Well-ventilated',
  'مشمس': 'Bright',
  'مبنى حديث': 'Modern building',
  'مبنى قديم': 'Old building',
};

const keywordTranslations = {
  en: {
    // Common property keywords in English (no translation needed)
  },
  ar: {
    // Common property keywords translations
    'south-facing house': 'منزل جنوبي',
    'north-facing': 'شمالي',
    'east-facing': 'شرقي',
    'west-facing': 'غربي',
    'well-ventilated': 'جيد التهوية',
    'bright': 'مشرق',
    'modern building': 'بناء حديث',
    'old building': 'بناء قديم',
    'spacious': 'واسع',
    'view': 'إطلالة',
    'open view': 'إطلالة مفتوحة',
    'sea view': 'إطلالة بحرية',
    'mountain view': 'إطلالة على الجبل',
    'luxury': 'فاخر',
    'doublex finishing': 'تشطيب دوبلكس',
    'super doublex finishing': 'تشطيب سوبر دوبلكس',
    'standard finishing': 'تشطيب عادي',
    'stone finishing': 'تشطيب حجري',
    'green title deed': 'سند أخضر',
    'shell house': 'قشرة جاهزة',
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
 * Detect if string contains Arabic characters
 * @param {string} str - String to check
 * @returns {boolean}
 */
const hasArabicChars = (str) => /[\u0600-\u06FF]/.test(str || '');

/**
 * Translate Arabic keyword to English for API search.
 * Backend stores propertyKeyword in English; Arabic search fails without this.
 * @param {string} keyword - User input (may be Arabic or English)
 * @returns {string} English keyword for API, or original if no translation
 */
export const translateKeywordForSearch = (keyword) => {
  if (!keyword || typeof keyword !== 'string') return keyword;
  const trimmed = keyword.trim();
  if (!trimmed) return keyword;

  // Exact match first
  const exact = arabicToEnglishKeywords[trimmed];
  if (exact) return exact;

  // Try trimmed without extra spaces (ar.json has " شقة سكنية" with leading space)
  const normalized = trimmed.replace(/\s+/g, ' ').trim();
  const exactNorm = arabicToEnglishKeywords[normalized];
  if (exactNorm) return exactNorm;

  // Only process if contains Arabic
  if (!hasArabicChars(trimmed)) return keyword;

  // Multi-word or comma-separated: try each token
  const tokens = trimmed.split(/[\s,،]+/).map((t) => t.trim()).filter(Boolean);
  const translated = tokens
    .map((t) => arabicToEnglishKeywords[t] || arabicToEnglishKeywords[t.replace(/[،,]/g, '')])
    .filter(Boolean);
  if (translated.length > 0) {
    return translated.join(' ');
  }

  return keyword;
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
  
  // Return original keyword if no translation found (show the tag anyway)
  // This ensures keywords are always visible even if translation is missing
  return trimmedKeyword;
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

