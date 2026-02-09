import { translateKeywordForSearch } from '../utils/translateKeywords';

export function cleanParams(params) {
  const cleaned = {};

  Object.entries(params).forEach(([key, value]) => {
    // Skip empty, null, undefined, empty arrays, or empty objects
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === "object" &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0)
    ) {
      return;
    }

    // Custom condition: skip if key is rooms, beds, or baths AND value is not a number
    if (["rooms", "beds", "baths"].includes(key)) {
      if (isNaN(Number(value))) {
        return;
      }
    }

    // Convert keyword delimiter from ||| to comma for API compatibility
    // Translate Arabic keywords to English (backend stores English propertyKeyword)
    if (key === "keyword" && typeof value === "string") {
      let val = value.replace(/\|\|\|/g, ', ');
      val = translateKeywordForSearch(val);
      cleaned[key] = val;
    } else if ((key === "cities" || key === "city") && typeof value === "string") {
      // Translate Arabic city names to English for API
      let val = translateKeywordForSearch(value);
      cleaned[key] = val;
    } else {
      cleaned[key] = value;
    }
  });

  return cleaned;
}
