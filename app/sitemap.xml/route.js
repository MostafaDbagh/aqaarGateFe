// Sitemap Route Handler for AqaarGate Real Estate
// Fixes standalone build trace; serves /sitemap.xml with same logic as metadata sitemap

const logger = {
  error: (...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(...args);
    }
  },
};

function getBaseUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';
  return url.replace(/\/+$/, '');
}

async function getProperties() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aqaargatebe2.onrender.com/api';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(`${apiUrl}/listing/search?limit=1000&approvalStatus=approved&isSold=false&isDeleted=false`, {
      next: { revalidate: 3600 },
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
    });
    clearTimeout(timeoutId);
    if (!response.ok) return [];
    const data = await response.json();
    let properties = Array.isArray(data) ? data : (data.data || data.listings || data.results || []);
    if (!properties?.length) properties = data?.listings?.data || data?.results?.data || data?.results || [];
    const filtered = (properties || []).filter((p) => p && (p._id || p.id) && (p.approvalStatus === 'approved' || !p.approvalStatus) && p.isSold !== true && p.isDeleted !== true);
    return filtered.slice(0, 1000);
  } catch (e) {
    if (e.name !== 'AbortError') logger.error('Sitemap getProperties:', e);
    return [];
  }
}

async function getAgents() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aqaargatebe2.onrender.com/api';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(`${apiUrl}/agents?limit=500&isBlocked=false`, {
      next: { revalidate: 3600 },
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
    });
    clearTimeout(timeoutId);
    if (!response.ok) return [];
    const data = await response.json();
    let agents = Array.isArray(data) ? data : (data.data || data.results || []);
    if (!agents?.length) agents = data?.agents?.data || data?.results?.data || [];
    const filtered = (agents || []).filter((a) => a && (a._id || a.id) && a.isBlocked !== true);
    return filtered.slice(0, 500);
  } catch (e) {
    if (e.name !== 'AbortError') logger.error('Sitemap getAgents:', e);
    return [];
  }
}

async function getBlogs() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aqaargatebe2.onrender.com/api';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(`${apiUrl}/blog?limit=500&status=published`, {
      next: { revalidate: 3600 },
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
    });
    clearTimeout(timeoutId);
    if (!response.ok) return [];
    const data = await response.json();
    let blogs = Array.isArray(data) ? data : (data.data || data.results || []);
    if (!blogs?.length) blogs = data?.blogs?.data || data?.results?.data || [];
    const filtered = (blogs || []).filter((b) => b && (b._id || b.id) && b.status === 'published');
    return filtered.slice(0, 500);
  } catch (e) {
    if (e.name !== 'AbortError') logger.error('Sitemap getBlogs:', e);
    return [];
  }
}

function safeLastModified(date) {
  const d = date ? new Date(date) : new Date();
  return isNaN(d.getTime()) ? new Date() : d;
}

function escapeXml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const revalidate = 3600;

export async function GET() {
  const baseUrl = getBaseUrl();
  const [propertiesResult, agentsResult, blogsResult] = await Promise.allSettled([getProperties(), getAgents(), getBlogs()]);
  const properties = propertiesResult.status === 'fulfilled' ? propertiesResult.value : [];
  const agents = agentsResult.status === 'fulfilled' ? agentsResult.value : [];
  const blogs = blogsResult.status === 'fulfilled' ? blogsResult.value : [];

  const now = new Date().toISOString();

  const propertyUrls = (properties || [])
    .filter((p) => p && (p._id || p.id))
    .flatMap((p) => {
      const id = String(p._id || p.id).trim();
      if (!id) return [];
      const lm = safeLastModified(p.updatedAt).toISOString();
      return [
        { url: `${baseUrl}/en/property-detail/${id}`, lastmod: lm, changefreq: 'daily', priority: '0.8' },
        { url: `${baseUrl}/ar/property-detail/${id}`, lastmod: lm, changefreq: 'daily', priority: '0.8' },
      ];
    });

  const agentUrls = (agents || [])
    .filter((a) => a && (a._id || a.id))
    .flatMap((a) => {
      const id = String(a._id || a.id).trim();
      if (!id) return [];
      const lm = safeLastModified(a.updatedAt).toISOString();
      return [
        { url: `${baseUrl}/en/agents-details/${id}`, lastmod: lm, changefreq: 'weekly', priority: '0.7' },
        { url: `${baseUrl}/ar/agents-details/${id}`, lastmod: lm, changefreq: 'weekly', priority: '0.7' },
      ];
    });

  const blogUrls = (blogs || [])
    .filter((b) => b && (b._id || b.id))
    .flatMap((b) => {
      const id = String(b._id || b.id).trim();
      if (!id) return [];
      const lm = safeLastModified(b.updatedAt || b.publishedAt).toISOString();
      return [
        { url: `${baseUrl}/en/blog-details/${id}`, lastmod: lm, changefreq: 'weekly', priority: '0.6' },
        { url: `${baseUrl}/ar/blog-details/${id}`, lastmod: lm, changefreq: 'weekly', priority: '0.6' },
      ];
    });

  const staticPages = [
    // Only include locale-prefixed URLs (root / redirects to /en or /ar via next-intl - avoid duplicate/redirect issues)
    { url: `${baseUrl}/en`, lastmod: now, changefreq: 'daily', priority: '1' },
    { url: `${baseUrl}/ar`, lastmod: now, changefreq: 'daily', priority: '1' },
    { url: `${baseUrl}/en/property-list`, lastmod: now, changefreq: 'daily', priority: '0.9' },
    { url: `${baseUrl}/ar/property-list`, lastmod: now, changefreq: 'daily', priority: '0.9' },
    { url: `${baseUrl}/en/agents`, lastmod: now, changefreq: 'weekly', priority: '0.8' },
    { url: `${baseUrl}/ar/agents`, lastmod: now, changefreq: 'weekly', priority: '0.8' },
    { url: `${baseUrl}/en/terms-and-conditions`, lastmod: now, changefreq: 'monthly', priority: '0.8' },
    { url: `${baseUrl}/ar/terms-and-conditions`, lastmod: now, changefreq: 'monthly', priority: '0.8' },
    { url: `${baseUrl}/en/privacy-policy`, lastmod: now, changefreq: 'monthly', priority: '0.8' },
    { url: `${baseUrl}/ar/privacy-policy`, lastmod: now, changefreq: 'monthly', priority: '0.8' },
    { url: `${baseUrl}/en/about-us`, lastmod: now, changefreq: 'monthly', priority: '0.7' },
    { url: `${baseUrl}/ar/about-us`, lastmod: now, changefreq: 'monthly', priority: '0.7' },
    { url: `${baseUrl}/en/vision`, lastmod: now, changefreq: 'monthly', priority: '0.6' },
    { url: `${baseUrl}/ar/vision`, lastmod: now, changefreq: 'monthly', priority: '0.6' },
    { url: `${baseUrl}/en/blog-grid`, lastmod: now, changefreq: 'weekly', priority: '0.7' },
    { url: `${baseUrl}/ar/blog-grid`, lastmod: now, changefreq: 'weekly', priority: '0.7' },
    { url: `${baseUrl}/en/property-rental-service`, lastmod: now, changefreq: 'monthly', priority: '0.7' },
    { url: `${baseUrl}/ar/property-rental-service`, lastmod: now, changefreq: 'monthly', priority: '0.7' },
    { url: `${baseUrl}/en/future-buyer-interest`, lastmod: now, changefreq: 'monthly', priority: '0.7' },
    { url: `${baseUrl}/ar/future-buyer-interest`, lastmod: now, changefreq: 'monthly', priority: '0.7' },
    { url: `${baseUrl}/en/contact`, lastmod: now, changefreq: 'monthly', priority: '0.6' },
    { url: `${baseUrl}/ar/contact`, lastmod: now, changefreq: 'monthly', priority: '0.6' },
    { url: `${baseUrl}/en/faq`, lastmod: now, changefreq: 'monthly', priority: '0.5' },
    { url: `${baseUrl}/ar/faq`, lastmod: now, changefreq: 'monthly', priority: '0.5' },
    { url: `${baseUrl}/en/career`, lastmod: now, changefreq: 'monthly', priority: '0.5' },
    { url: `${baseUrl}/ar/career`, lastmod: now, changefreq: 'monthly', priority: '0.5' },
  ];

  const all = [...staticPages, ...propertyUrls, ...agentUrls, ...blogUrls].filter((e) => e?.url?.startsWith('http'));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map(
    (e) =>
      `  <url>
    <loc>${escapeXml(e.url)}</loc>
    <lastmod>${escapeXml(e.lastmod)}</lastmod>
    <changefreq>${escapeXml(e.changefreq)}</changefreq>
    <priority>${escapeXml(e.priority)}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
