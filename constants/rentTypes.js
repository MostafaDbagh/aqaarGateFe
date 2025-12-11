// Centralized rent type constants and normalization
// Used across multiple components for consistency

/**
 * Map to normalize rent type variations to standard backend format
 * Handles variations like "three months" -> "three-month"
 */
export const rentTypeNormalizationMap = {
  'three months': 'three-month',
  'three-month': 'three-month',
  'three_months': 'three-month',
  '3 months': 'three-month',
  '3-month': 'three-month',
  'six months': 'six-month',
  'six-month': 'six-month',
  'six_months': 'six-month',
  '6 months': 'six-month',
  '6-month': 'six-month',
  'one year': 'one-year',
  'one-year': 'one-year',
  'one_year': 'one-year',
  '1 year': 'one-year',
  '1-year': 'one-year',
  'yearly': 'yearly',
  'year': 'yearly',
  'monthly': 'monthly',
  'month': 'monthly',
  'weekly': 'weekly',
  'week': 'weekly',
  'daily': 'daily',
  'day': 'daily'
};

/**
 * Normalize a rent type value to standard backend format
 * @param {string} rentType - The rent type value to normalize
 * @returns {string} - Normalized rent type value
 */
export const normalizeRentType = (rentType) => {
  if (!rentType) return 'monthly'; // Default
  
  const rentTypeLower = rentType.toLowerCase().trim();
  return rentTypeNormalizationMap[rentTypeLower] || rentTypeLower;
};

/**
 * Valid rent type values that match backend enum
 * Backend enum: ['monthly', 'three-month', 'six-month', 'one-year', 'yearly', 'weekly', 'daily']
 */
export const validRentTypes = [
  'monthly',
  'three-month',
  'six-month',
  'one-year',
  'yearly',
  'weekly',
  'daily'
];

// Export as default for convenience
export default {
  normalizeRentType,
  rentTypeNormalizationMap,
  validRentTypes
};

