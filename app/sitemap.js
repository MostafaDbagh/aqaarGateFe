// Import logger for server-side logging
const logger = {
  error: (...args) => {
    // Server-side logging - only log in development or use proper logging service
    if (process.env.NODE_ENV !== 'production') {
      console.error(...args);
    }
  }
};

async function getProperties() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aqaargatebe2.onrender.com/api';
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      // Try multiple API endpoints to ensure we get properties
      const response = await fetch(`${apiUrl}/listing/search?limit=1000&approvalStatus=approved&isSold=false&isDeleted=false`, {
        next: { revalidate: 3600 }, // Revalidate every hour
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
      // Handle both array response and wrapped response
      let properties = Array.isArray(data) ? data : (data.data || data.listings || data.results || []);
      
      // If still empty, try alternative response structure
      if (!properties || properties.length === 0) {
        properties = data?.listings?.data || data?.results?.data || [];
      }
      
      // Filter only approved and not sold properties
      const filteredProperties = (properties || []).filter(p => 
        p && 
        (p._id || p.id) && 
        p.approvalStatus === 'approved' && 
        p.isSold !== true && 
        p.isDeleted !== true
      );
      
      // Log for debugging (only in development)
      if (process.env.NODE_ENV !== 'production' && filteredProperties.length > 0) {
        logger.error(`Sitemap: Found ${filteredProperties.length} properties`);
      }
      
      return filteredProperties.slice(0, 1000); // Limit to 1000 properties max
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
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      // Try multiple API endpoints to ensure we get agents
      const response = await fetch(`${apiUrl}/agents?limit=500&isBlocked=false`, {
        next: { revalidate: 3600 }, // Revalidate every hour
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
      // Handle both array response and wrapped response
      let agents = Array.isArray(data) ? data : (data.data || data.results || []);
      
      // If still empty, try alternative response structure
      if (!agents || agents.length === 0) {
        agents = data?.agents?.data || data?.results?.data || [];
      }
      
      // Filter only non-blocked agents
      const filteredAgents = (agents || []).filter(a => 
        a && 
        (a._id || a.id) && 
        a.isBlocked !== true
      );
      
      // Log for debugging (only in development)
      if (process.env.NODE_ENV !== 'production' && filteredAgents.length > 0) {
        logger.error(`Sitemap: Found ${filteredAgents.length} agents`);
      }
      
      return filteredAgents.slice(0, 500); // Limit to 500 agents max
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

/**
 * Sitemap Generator for AqaarGate Real Estate
 * 
 * This file generates a sitemap.xml file that lists all public pages
 * that should be indexed by search engines.
 * 
 * The sitemap includes:
 * - Static pages (homepage, property-list, agents, etc.)
 * - Dynamic property detail pages (fetched from API)
 * - Dynamic agent detail pages (fetched from API)
 * 
 * Note: Only approved properties and non-blocked agents are included
 */

// Configure sitemap generation - revalidate every hour
export const revalidate = 3600;

export default async function sitemap() {
  // Base URL for the website - Update this to your production domain
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'
  
  // Fetch all properties and agents from the API in parallel with timeout protection
  // Properties are filtered to only include approved ones
  // Agents are filtered to exclude blocked ones
  // Use Promise.allSettled to prevent one failure from breaking the entire sitemap
  const [propertiesResult, agentsResult] = await Promise.allSettled([
    getProperties(),
    getAgents()
  ]);
  
  const properties = propertiesResult.status === 'fulfilled' ? propertiesResult.value : [];
  const agents = agentsResult.status === 'fulfilled' ? agentsResult.value : [];
  
  // Log results for debugging
  if (process.env.NODE_ENV !== 'production') {
    logger.error(`Sitemap generation: ${properties.length} properties, ${agents.length} agents`);
  }
  
  // Generate property URLs (only if properties exist and have IDs)
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
  
  // Generate agent URLs (only if agents exist and have IDs)
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
  
  return [
    // Homepage - Highest priority
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    
    // Localized homepage URLs - CRITICAL for indexing
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
    
    // Property listing pages - High priority for SEO
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
    
    // Agent pages - Important for SEO
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
    
    // Legal and policy pages - Required for compliance
    {
      url: `${baseUrl}/terms-and-conditions`,
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
    
    // Company information pages
    {
      url: `${baseUrl}/about-us`,
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
    
    // Blog pages - Content marketing
    {
      url: `${baseUrl}/blog-grid`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Note: blog-list page removed - redirects to blog-grid
    
    // Service pages
    {
      url: `${baseUrl}/property-rental-service`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    
    // Contact and support pages
    {
      url: `${baseUrl}/contact`,
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
      url: `${baseUrl}/career`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    
    // Dynamic property and agent URLs
    ...propertyUrls,
    ...agentUrls,
  ].filter(Boolean); // Remove any null/undefined entries
}
