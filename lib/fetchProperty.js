/**
 * Server-side utility to fetch a single property by ID.
 * Used for generateMetadata, notFound checks, and SSR.
 * Uses native fetch (no Axios) for server compatibility.
 */

function isValidId(id) {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return false;
  }
  return id.trim().length > 0;
}

export async function fetchProperty(id) {
  if (!id || !isValidId(id)) {
    return null;
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aqaargatebe2.onrender.com/api';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${apiUrl}/listing/${id}`, {
        next: { revalidate: 60 },
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return null;
      }

      let data;
      try {
        data = await response.json();
      } catch {
        return null;
      }

      const property = data?.data || data;

      if (!property || property.isDeleted === true || property.isSold === true) {
        return null;
      }

      if (!property._id && !property.id) {
        return null;
      }

      return property;
    } catch {
      clearTimeout(timeoutId);
      return null;
    }
  } catch {
    return null;
  }
}
