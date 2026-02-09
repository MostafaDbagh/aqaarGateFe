/**
 * Default OG images for all pages - og.png only.
 */
export function getDefaultOgImages(baseUrl, locale = 'en') {
  return [
    { url: `${baseUrl}/images/logo/og.png`, width: 180, height: 180, alt: 'AqaarGate Real Estate', type: 'image/png' },
  ];
}

export function getDefaultOgImageUrls(baseUrl, locale = 'en') {
  return [
    `${baseUrl}/images/logo/og.png`,
  ];
}
