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

    cleaned[key] = value;
  });

  return cleaned;
}
