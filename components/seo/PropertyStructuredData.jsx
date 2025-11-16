"use client";

export default function PropertyStructuredData({ property }) {
  if (!property) return null;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';
  
  // Clean up undefined values from schema
  const cleanSchema = (obj) => {
    return JSON.parse(JSON.stringify(obj, (key, value) => {
      return value === undefined ? null : value;
    }));
  };

  // Property Schema (Product for Sale/Rent)
  const propertySchemaObj = {
    "@context": "https://schema.org",
    "@type": property.status?.toLowerCase() === 'rent' ? "RentAction" : "SellAction",
    "target": {
      "@type": "Place",
      "name": property.propertyTitle || property.propertyKeyword || property.propertyType || 'Property',
      "address": {
        "@type": "PostalAddress",
        "streetAddress": property.address || "",
        "addressLocality": property.city || property.state || "Lattakia",
        "addressRegion": property.state || "Lattakia",
        "addressCountry": "SY"
      }
    },
    "object": {
      "@type": property.propertyType === 'House' || property.propertyType === 'Villa' ? "House" : 
              property.propertyType === 'Apartment' ? "Apartment" : "Residence",
      "name": property.propertyTitle || property.propertyKeyword || property.propertyType || 'Property',
      "description": property.description || `${property.propertyType} in ${property.city || property.state || 'Lattakia'}, Syria`,
      "image": property.images && property.images.length > 0 
        ? property.images.map(img => (typeof img === 'string' ? img : img.url || img))
        : ["/images/section/box-house-2.jpg"],
      "numberOfRooms": property.bedrooms || 0,
      "numberOfBathroomsTotal": property.bathrooms || 0,
      "floorSize": property.size ? {
        "@type": "QuantitativeValue",
        "value": property.size,
        "unitCode": "SQM"
      } : undefined,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": property.address || "",
        "addressLocality": property.city || property.state || "Lattakia",
        "addressRegion": property.state || "Lattakia",
        "addressCountry": "SY"
      },
      "offers": {
        "@type": "Offer",
        "price": property.propertyPrice || 0,
        "priceCurrency": property.currency || "USD",
        "availability": "https://schema.org/InStock",
        "url": `${baseUrl}/property-detail/${property._id}`,
        "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "category": property.status?.toLowerCase() === 'rent' ? "Rent" : "Sale"
      },
    }
  };

  // Add geo coordinates if available
  if (property.latitude && property.longitude) {
    propertySchemaObj.target.geo = {
      "@type": "GeoCoordinates",
      "latitude": property.latitude,
      "longitude": property.longitude
    };
  }

  // Remove undefined floorSize from object schema (we'll add it conditionally)
  if (!property.size) {
    delete propertySchemaObj.object.floorSize;
  }

  // Add amenities if available
  if (property.amenities && Array.isArray(property.amenities) && property.amenities.length > 0) {
    propertySchemaObj.object.amenityFeature = property.amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    }));
  }

  // Real Estate Listing Schema
  const listingSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.propertyTitle || property.propertyKeyword || property.propertyType || 'Property',
    "description": property.description || `${property.propertyType} for ${property.status?.toLowerCase() || 'sale'} in ${property.city || property.state || 'Lattakia'}, Syria`,
    "url": `${baseUrl}/property-detail/${property._id}`,
    "image": property.images && property.images.length > 0 
      ? property.images.map(img => (typeof img === 'string' ? img : img.url || img))
      : ["/images/section/box-house-2.jpg"],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address || "",
      "addressLocality": property.city || property.state || "Lattakia",
      "addressRegion": property.state || "Lattakia",
      "addressCountry": "SY"
    },
    "price": property.propertyPrice || 0,
    "priceCurrency": property.currency || "USD",
    "listingType": property.status?.toLowerCase() === 'rent' ? "rental" : "forSale",
    "numberOfRooms": property.bedrooms || 0,
    "numberOfBathroomsTotal": property.bathrooms || 0,
  };

  // Add floorSize if available
  if (property.size) {
    listingSchema.floorSize = {
      "@type": "QuantitativeValue",
      "value": property.size,
      "unitCode": "SQM"
    };
  }

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Properties",
        "item": `${baseUrl}/property-list`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": property.propertyTitle || property.propertyKeyword || property.propertyType || 'Property',
        "item": `${baseUrl}/property-detail/${property._id}`
      }
    ]
  };

  // Clean all schemas before rendering (remove null/undefined values)
  const cleanPropertySchema = cleanSchema(propertySchemaObj);
  const cleanListingSchema = cleanSchema(listingSchema);
  
  // Remove null values from JSON string
  const cleanJson = (obj) => {
    return JSON.stringify(obj).replace(/"[^"]*":null,?/g, '').replace(/,}/g, '}').replace(/,]/g, ']');
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: cleanJson(cleanPropertySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: cleanJson(cleanListingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

