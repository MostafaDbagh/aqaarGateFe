export default function KeywordOptimization() {
  // This component adds additional keyword-rich content for better SEO
  const keywords = [
    // Primary Syria & Lattakia Keywords
    'syria real estate',
    'lattakia real estate',
    'syria properties',
    'lattakia properties',
    'syria houses',
    'lattakia houses',
    'syria apartments',
    'lattakia apartments',
    
    // Sale Keywords
    'syria properties for sale',
    'lattakia properties for sale',
    'syria homes for sale',
    'lattakia homes for sale',
    'syria apartments for sale',
    'lattakia apartments for sale',
    'syria villas for sale',
    'lattakia villas for sale',
    
    // Rent Keywords
    'syria properties for rent',
    'lattakia properties for rent',
    'syria homes for rent',
    'lattakia homes for rent',
    'syria apartments for rent',
    'lattakia apartments for rent',
    'syria villas for rent',
    'lattakia villas for rent',
    
    // Holiday Homes & Vacation Rentals
    'syria holiday homes',
    'lattakia holiday homes',
    'syria vacation rentals',
    'lattakia vacation rentals',
    'syria beach houses',
    'lattakia beach houses',
    'syria coastal properties',
    'lattakia coastal properties',
    
    // Property Types
    'syria luxury homes',
    'lattakia luxury homes',
    'syria commercial properties',
    'lattakia commercial properties',
    'syria land for sale',
    'lattakia land for sale',
    'syria condos',
    'lattakia condos',
    
    // Real Estate Services
    'syria real estate agent',
    'lattakia real estate agent',
    'syria property management',
    'lattakia property management',
    'syria property investment',
    'lattakia property investment',
    
    // Location-Specific
    'syria beach properties',
    'lattakia beach properties',
    'syria mountain properties',
    'lattakia mountain properties',
    'syria city center properties',
    'lattakia city center properties',
    
    // Investment Keywords
    'syria real estate investment',
    'lattakia real estate investment',
    'syria property prices',
    'lattakia property prices',
    'syria property market',
    'lattakia property market'
  ];

  // Hidden div with keywords for SEO (not visible to users)
  return (
    <div style={{ display: 'none' }} aria-hidden="true">
      {keywords.map((keyword, index) => (
        <span key={index}>{keyword}</span>
      ))}
    </div>
  );
}
