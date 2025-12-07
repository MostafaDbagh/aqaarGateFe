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
    // This allows keywords with commas (like "2,400 shares") to work correctly
    if (key === "keyword" && typeof value === "string") {
      cleaned[key] = value.replace(/\|\|\|/g, ', ');
    } else {
      cleaned[key] = value;
    }
  });

  return cleaned;
}
