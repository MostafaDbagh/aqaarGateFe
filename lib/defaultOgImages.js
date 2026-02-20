/**
 * Open Graph (OG) image helper – ensures consistent sharing for en & ar.
 *
 * Rules (all points covered):
 * - Image: always static – same logo for both en and ar (this file).
 * - Other details: dynamic by language – title, description, url, locale come from
 *   each page's generateMetadata(params) using params.locale (ar vs en).
 * - Every page that can be shared must set openGraph.images and twitter.images
 *   (either via this helper or direct /images/logo/og.png). Root and [locale]
 *   layouts provide a default so nested pages inherit the static image.
 * - Absolute URLs required for WhatsApp/Facebook. 1200x630 recommended.
 */
const STATIC_OG_IMAGE_PATH = '/images/logo/og.png';

export function getDefaultOgImages(baseUrl, _locale = 'en') {
  const absoluteUrl = `${baseUrl}${STATIC_OG_IMAGE_PATH}`;
  return [
    { url: absoluteUrl, width: 1200, height: 630, alt: 'AqaarGate Real Estate', type: 'image/png' },
    { url: absoluteUrl, width: 400, height: 400, alt: 'AqaarGate' },
  ];
}

export function getDefaultOgImageUrls(baseUrl, _locale = 'en') {
  return [`${baseUrl}${STATIC_OG_IMAGE_PATH}`];
}
