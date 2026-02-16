/**
 * Default OG images for all pages - absolute URLs required for WhatsApp/Facebook.
 * 1200x630 recommended for link previews.
 */
export function getDefaultOgImages(baseUrl, locale = 'en') {
  const absoluteUrl = `${baseUrl}/images/logo/og.png`;
  return [
    { url: absoluteUrl, width: 1200, height: 630, alt: 'AqaarGate Real Estate', type: 'image/png' },
    { url: absoluteUrl, width: 400, height: 400, alt: 'AqaarGate' },
  ];
}

export function getDefaultOgImageUrls(baseUrl, locale = 'en') {
  return [`${baseUrl}/images/logo/og.png`];
}
