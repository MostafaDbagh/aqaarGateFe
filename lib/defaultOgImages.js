/**
 * Default OG images for all pages - same as home page.
 * Used for consistent link preview across WhatsApp, Facebook, etc.
 * hero.jpg first: 612x408 meets WhatsApp min 300x200 (og.png is 180x180 and may be rejected).
 */
export function getDefaultOgImages(baseUrl, locale = 'en') {
  return [
    { url: `${baseUrl}/images/cities/hero.jpg`, width: 612, height: 408, alt: 'AqaarGate Real Estate', type: 'image/jpeg' },
    { url: `${baseUrl}/${locale}/opengraph-image`, width: 1200, height: 630, alt: 'AqaarGate Real Estate', type: 'image/png' },
    { url: `${baseUrl}/images/logo/og.png`, width: 180, height: 180, alt: 'AqaarGate Real Estate', type: 'image/png' },
  ];
}

export function getDefaultOgImageUrls(baseUrl, locale = 'en') {
  return [
    `${baseUrl}/images/cities/hero.jpg`,
    `${baseUrl}/${locale}/opengraph-image`,
    `${baseUrl}/images/logo/og.png`,
  ];
}
