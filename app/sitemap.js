// Sitemap Generator for AqaarGate Real Estate
// Generates sitemap.xml with all public pages and dynamic content

const logger = {
  error: (...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(...args);
    }
  },
};

async function getProperties() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aqaargatebe2.onrender.com/api';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${apiUrl}/listing/search?limit=1000&approvalStatus=approved&isSold=false&isDeleted=false`, {
        next: { revalidate: 3600 },
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        logger.error('Failed to fetch properties for sitemap');
        return [];
      }

      const data = await response.json();
      let properties = Array.isArray(data) ? data : (data.data || data.listings || data.results || []);

      if (!properties || properties.length === 0) {
        properties = data?.listings?.data || data?.results?.data || [];
      }

      const filteredProperties = (properties || []).filter(
        (p) =>
          p &&
          (p._id || p.id) &&
          p.approvalStatus === 'approved' &&
          p.isSold !== true &&
          p.isDeleted !== true
      );

      if (process.env.NODE_ENV !== 'production' && filteredProperties.length > 0) {
        logger.error(`Sitemap: Found ${filteredProperties.length} properties`);
      }

      return filteredProperties.slice(0, 1000);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        logger.error('Timeout fetching properties for sitemap');
      } else {
        logger.error('Error fetching properties for sitemap:', fetchError);
      }
      return [];
    }
  } catch (error) {
    logger.error('Error in getProperties:', error);
    return [];
  }
}

async function getAgents() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aqaargatebe2.onrender.com/api';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${apiUrl}/agents?limit=500&isBlocked=false`, {
        next: { revalidate: 3600 },
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        logger.error('Failed to fetch agents for sitemap');
        return [];
      }

      const data = await response.json();
      let agents = Array.isArray(data) ? data : (data.data || data.results || []);

      if (!agents || agents.length === 0) {
        agents = data?.agents?.data || data?.results?.data || [];
      }

      const filteredAgents = (agents || []).filter(
        (a) => a && (a._id || a.id) && a.isBlocked !== true
      );

      if (process.env.NODE_ENV !== 'production' && filteredAgents.length > 0) {
        logger.error(`Sitemap: Found ${filteredAgents.length} agents`);
      }

      return filteredAgents.slice(0, 500);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        logger.error('Timeout fetching agents for sitemap');
      } else {
        logger.error('Error fetching agents for sitemap:', fetchError);
      }
      return [];
    }
  } catch (error) {
    logger.error('Error in getAgents:', error);
    return [];
  }
}

export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';

  const [propertiesResult, agentsResult] = await Promise.allSettled([
    getProperties(),
    getAgents(),
  ]);

  const properties = propertiesResult.status === 'fulfilled' ? propertiesResult.value : [];
  const agents = agentsResult.status === 'fulfilled' ? agentsResult.value : [];

  if (process.env.NODE_ENV !== 'production') {
    logger.error(`Sitemap generation: ${properties.length} properties, ${agents.length} agents`);
  }

  const propertyUrls = (properties || [])
    .filter((property) => {
      const hasId = property && (property._id || property.id);
      if (!hasId && process.env.NODE_ENV !== 'production') {
        logger.error('Sitemap: Property missing ID', property);
      }
      return hasId;
    })
    .map((property) => ({
      url: `${baseUrl}/property-detail/${property._id || property.id}`,
      lastModified: property.updatedAt ? new Date(property.updatedAt) : new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

  const agentUrls = (agents || [])
    .filter((agent) => {
      const hasId = agent && (agent._id || agent.id);
      if (!hasId && process.env.NODE_ENV !== 'production') {
        logger.error('Sitemap: Agent missing ID', agent);
      }
      return hasId;
    })
    .map((agent) => ({
      url: `${baseUrl}/agents-details/${agent._id || agent.id}`,
      lastModified: agent.updatedAt ? new Date(agent.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/ar`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/property-list`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/property-list`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ar/property-list`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/agents`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/agents`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ar/agents`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ar/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ar/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ar/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/vision`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/vision`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ar/vision`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog-grid`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/blog-grid`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ar/blog-grid`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/property-rental-service`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/property-rental-service`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ar/property-rental-service`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/future-buyer-interest`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/future-buyer-interest`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ar/future-buyer-interest`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ar/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/en/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/ar/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/career`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/en/career`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/ar/career`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  return [...staticPages, ...propertyUrls, ...agentUrls].filter(Boolean);
}

