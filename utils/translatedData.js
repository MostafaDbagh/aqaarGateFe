/**
 * Utility functions to work with translated API responses
 * 
 * The backend now returns translated values but also includes original values
 * for filtering purposes (e.g., propertyTypeOriginal, cityOriginal, etc.)
 */

/**
 * Get the original value from a translated field
 * @param {Object} item - Item from API response
 * @param {string} field - Field name (e.g., 'propertyType', 'city', 'status')
 * @returns {string} Original value or translated value if original not available
 */
export function getOriginalValue(item, field) {
  const originalField = `${field}Original`;
  return item[originalField] || item[field];
}

/**
 * Get the translated value from a field
 * @param {Object} item - Item from API response
 * @param {string} field - Field name (e.g., 'propertyType', 'city', 'status')
 * @returns {string} Translated value
 */
export function getTranslatedValue(item, field) {
  return item[field];
}

/**
 * Check if an item has translated data (has original fields)
 * @param {Object} item - Item from API response
 * @returns {boolean} True if item has original fields
 */
export function hasTranslatedData(item) {
  if (!item) return false;
  return Object.keys(item).some(key => key.endsWith('Original'));
}

/**
 * Get all original values from a translated item
 * @param {Object} item - Item from API response
 * @returns {Object} Object with original values
 */
export function getAllOriginalValues(item) {
  if (!item) return {};
  
  const originalValues = {};
  Object.keys(item).forEach(key => {
    if (key.endsWith('Original')) {
      const fieldName = key.replace('Original', '');
      originalValues[fieldName] = item[key];
    }
  });
  
  return originalValues;
}

/**
 * Example usage:
 * 
 * const listing = {
 *   propertyType: "شقة", // Translated
 *   propertyTypeOriginal: "Apartment", // Original
 *   city: "دمشق", // Translated
 *   cityOriginal: "Damascus" // Original
 * };
 * 
 * // Get original for filtering
 * const originalType = getOriginalValue(listing, 'propertyType'); // "Apartment"
 * 
 * // Get translated for display
 * const displayType = getTranslatedValue(listing, 'propertyType'); // "شقة"
 */






