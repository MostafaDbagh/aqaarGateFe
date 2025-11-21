async function getProperties() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aqaargatebe2.onrender.com/api';
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(`${apiUrl}/listing/search?limit=500&approvalStatus=approved`, {
        next: { revalidate: 3600 }, // Revalidate every hour
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error('Failed to fetch properties for sitemap');
        return [];
      }
      
      const data = await response.json();
      // Handle both array response and wrapped response
      const properties = Array.isArray(data) ? data : (data.data || data.listings || []);
      
      // Filter only approved and not sold properties
      return (properties || []).filter(p => 
        p && 
        (p._id || p.id) && 
        p.approvalStatus === 'approved' && 
        p.isSold !== true && 
        p.isDeleted !== true
      ).slice(0, 1000); // Limit to 1000 properties max
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error('Timeout fetching properties for sitemap');
      } else {
        console.error('Error fetching properties for sitemap:', fetchError);
      }
      return [];
    }
  } catch (error) {
    console.error('Error in getProperties:', error);
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
      const response = await fetch(`${apiUrl}/agents?limit=500`, {
        next: { revalidate: 3600 }, // Revalidate every hour
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error('Failed to fetch agents for sitemap');
        return [];
      }
      
      const data = await response.json();
      // Handle both array response and wrapped response
      const agents = Array.isArray(data) ? data : (data.data || []);
      
      // Filter only non-blocked agents
      return (agents || []).filter(a => 
        a && 
        (a._id || a.id) && 
        a.isBlocked !== true
      ).slice(0, 500); // Limit to 500 agents max
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error('Timeout fetching agents for sitemap');
      } else {
        console.error('Error fetching agents for sitemap:', fetchError);
      }
      return [];
    }
  } catch (error) {
    console.error('Error in getAgents:', error);
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
  
  // Generate property URLs (only if properties exist and have IDs)
  const propertyUrls = (properties || [])
    .filter((property) => property && (property._id || property.id))
    .map((property) => ({
      url: `${baseUrl}/property-detail/${property._id || property.id}`,
      lastModified: property.updatedAt ? new Date(property.updatedAt) : new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));
  
  // Generate agent URLs (only if agents exist and have IDs)
  const agentUrls = (agents || [])
    .filter((agent) => agent && (agent._id || agent.id))
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
    
    // Property listing pages - High priority for SEO
    {
      url: `${baseUrl}/property-list`,
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
    
    // Dynamic property detail pages
    // These are generated from the API and include all approved properties
    // Each property gets its own URL: /property-detail/[id]
    ...propertyUrls,
    
    // Dynamic agent detail pages
    // These are generated from the API and include all non-blocked agents
    // Each agent gets its own URL: /agents-details/[id]
    ...agentUrls,
  ]
}
