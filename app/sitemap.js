async function getProperties() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aqaargatebe2.onrender.com/api';
    const response = await fetch(`${apiUrl}/listing/search?limit=100`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      console.error('Failed to fetch properties for sitemap');
      return [];
    }
    
    const data = await response.json();
    // Handle both array response and wrapped response
    const properties = Array.isArray(data) ? data : (data.data || data.listings || []);
    return properties;
  } catch (error) {
    console.error('Error fetching properties for sitemap:', error);
    return [];
  }
}

async function getAgents() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aqaargatebe2.onrender.com/api';
    const response = await fetch(`${apiUrl}/agents`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      console.error('Failed to fetch agents for sitemap');
      return [];
    }
    
    const data = await response.json();
    // Handle both array response and wrapped response
    const agents = Array.isArray(data) ? data : (data.data || []);
    return agents;
  } catch (error) {
    console.error('Error fetching agents for sitemap:', error);
    return [];
  }
}

export default async function sitemap() {
  // Update to your production domain
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com'
  
  // Fetch all properties and agents
  const properties = await getProperties();
  const agents = await getAgents();
  
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
    {
      url: baseUrl,
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
    

    {
      url: `${baseUrl}/agents`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/career`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },

    {
      url: `${baseUrl}/vision`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog-grid`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog-list`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Add all property detail pages
    ...propertyUrls,
    // Add all agent detail pages
    ...agentUrls,
  ]
}
