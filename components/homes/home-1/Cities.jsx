import React, { useMemo } from "react";
import Image from "next/image";
import SplitTextAnimation from "@/components/common/SplitTextAnimation";
import LocationLoader from "@/components/common/LocationLoader";
import { useQuery } from "@tanstack/react-query";
import { cityAPI } from "@/apis/city";
import { useRouter } from "next/navigation";

export default function Cities() {
  const router = useRouter();
  
  // Use new city API - much more efficient than fetching all listings
  const { data: cityStatsResponse, isLoading, isError, error } = useQuery({
    queryKey: ['cities', 'stats'],
    queryFn: () => cityAPI.getCityStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  
  // Extract cities data from API response
  const citiesData = useMemo(() => {
    if (!cityStatsResponse?.data?.cities) {
      // Log for debugging
      console.log('Cities API Response:', cityStatsResponse);
      return [];
    }
    return cityStatsResponse.data.cities;
  }, [cityStatsResponse]);
  
  // Log error if any
  if (isError) {
    console.error('Cities API Error:', error);
  }

  // Memoize locations array to prevent recreation on every render
  const locations = useMemo(() => {
    return citiesData
      .sort((a, b) => b.count - a.count) // Sort by count descending
      .slice(0, 9) // Show only top 9 cities
      .map((city, index) => ({
        id: index + 1,
        city: city.city || city.displayName,
        properties: `${city.count} Property${city.count !== 1 ? 's' : ''}`,
        imageSrc: city.imageSrc || '/images/cities/SY.webp',
        alt: city.city || city.displayName,
        width: 400,
        height: 350
      }));
  }, [citiesData]);

  // Handle city button click - scroll to properties and trigger search
  const handleCityClick = (e, cityName) => {
    e.preventDefault();
    
    // Navigate to property list page with city filter
    const searchParams = new URLSearchParams();
    searchParams.set('cities', cityName);
    
    // Route to property list page with city filter
    router.push(`/property-list?${searchParams.toString()}`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="section-neighborhoods">
        <div className="tf-container full">
          <div className="col-12">
            <div className="heading-section text-center mb-48">
                <h2 className="title">
                  Explore Syria Cities Offerings
                </h2>
              <p className="text-1 split-text split-lines-transform">
                Discover beautiful properties across Syria's major cities
              </p>
            </div>
            <div style={{ padding: '40px 20px' }}>
              <LocationLoader size="medium" message="Loading Syrian cities..." />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no locations
  if (locations.length === 0) {
    return (
      <section className="section-neighborhoods">
        <div className="tf-container full">
          <div className="col-12">
            <div className="heading-section text-center mb-48">
              <h2 className="title">
                Explore Syria Cities Offerings
              </h2>
              <p className="text-1 split-text split-lines-transform">
                Discover beautiful properties across Syria's major cities
              </p>
            </div>
            <div className="text-center">
              <div className="alert alert-info">
                <h4>No Syrian Cities Available</h4>
                <p>There are currently no properties available to show Syrian cities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <style jsx>{`
        .hero-cities-section {
          padding: 80px 0;
          position: relative;
        }
        
        .city-card {
          height: 350px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
          cursor: pointer;
          
        }
        
        .city-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }
        
        .city-card .image-wrap {
          height: 100% !important;
          position: relative;
        }
        
        .city-image {
          object-fit: contain !important;
          width: 100% !important;
          height: 100% !important;
        }
        
        .city-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.25) 70%, rgba(0, 0, 0, 0.45) 100%);
          opacity: 0.6;
          transition: opacity 0.3s ease;
        }
        
        .city-card:hover .city-overlay {
          opacity: 0.7;
        }
        
        .city-card:hover .city-image {
          transform: scale(1.05);
        }
        
        .city-content {
          z-index: 10;
        }
        
        .city-title {
          font-size: 2rem !important;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
          font-weight: 700 !important;
          line-height: 1.2;
        }
        
        .city-count {
          font-size: 1.4rem !important;
          font-weight: 700 !important;
          color: #ffffff !important;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
          padding: 8px 16px;
          border-radius: 25px;
          border: none;
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
          transition: all 0.3s ease;
          display: inline-block;
        }
        
        .city-count:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
          background: linear-gradient(135deg, #ff8c42, #ff6b35);
        }
        
        .city-btn {
          font-size: 1rem !important;
          padding: 12px 24px !important;
          border-radius: 6px !important;
          font-weight: 600 !important;
          text-transform: none !important;
          border: 2px solid rgba(255, 255, 255, 0.8) !important;
          background-color: transparent !important;
          color: white !important;
          transition: all 0.3s ease !important;
          min-width: 140px !important;
        }
        
        .city-btn:hover {
          background-color: rgba(255, 255, 255, 0.15) !important;
          border-color: white !important;
          color: white !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .city-btn i {
          font-size: 1.1rem !important;
          margin-left: 8px !important;
        }
        
        .heading-section .title {
          font-size: 40px !important;
          font-weight: 700 !important;
          color: #000000 !important;
          margin-bottom: 1rem !important;
          text-align: center !important;
          display: block !important;
          visibility: visible !important;
          text-shadow: 0 2px 4px rgba(255, 255, 255, 0.8);
        }
        
        .heading-section .text-1 {
          color: #000000 !important;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .hero-cities-section {
            min-height: 80vh;
            padding: 60px 0;
            background-attachment: scroll;
          }
          
          .heading-section .title {
            font-size: 32px !important;
          }
          .city-title {
            font-size: 1.6rem !important;
          }
          
          .city-count {
            font-size: 1.2rem !important;
            padding: 5px 10px;
          }
          
          .city-btn {
            font-size: 0.9rem !important;
            padding: 10px 20px !important;
            min-width: 120px !important;
          }
          
          .city-card {
            height: 320px;
          }
        }
        
        @media (max-width: 576px) {
          .hero-cities-section {
            min-height: 70vh;
            padding: 40px 0;
          }
          
          .heading-section .title {
            font-size: 28px !important;
          }
          
          .city-title {
            font-size: 1.4rem !important;
          }
          
          .city-count {
            font-size: 1.1rem !important;
            padding: 4px 8px;
          }
          
          .city-btn {
            font-size: 0.85rem !important;
            padding: 8px 16px !important;
            min-width: 100px !important;
          }
          
          .city-card {
            height: 300px;
          }
        }
      `}</style>
      
      <section className="section-neighborhoods hero-cities-section">
        <div className="tf-container">
          <div className="col-12">
          <div className="heading-section text-center mb-48">
            <h2 className="title">
                Explore Syria Cities Offerings
            </h2>
            <p className="text-1 split-text split-lines-transform">
              Discover beautiful properties across Syria's major cities
            </p>
          </div>
          <div className="row g-4">
            {locations.slice(0, 9).map((location) => (
              <div key={location.id} className="col-lg-4 col-md-6 col-sm-6">
                <div 
                  className="box-location city-card"
                  onClick={(e) => handleCityClick(e, location.city)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="image-wrap position-relative overflow-hidden rounded-3 ariirirriri" style={{height:'100% !important'}}>
                    <Image
                      className="city-image"
                      alt={location.alt}
                      src={location.imageSrc}
                      width={location.width}
                      height={location.height}
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                    <div className="city-overlay"></div>
                  </div>
                  <div className="city-content position-absolute bottom-0 start-0 end-0 p-4">
                    <h4 className="text-white mb-3 fw-bold city-title">{location.city}</h4>
                    <div className="d-flex align-items-center justify-content-between">
                      <span 
                        className="city-count" 
                        onClick={(e) => handleCityClick(e, location.city)}
                        style={{ cursor: 'pointer' }}
                      >
                        {location.properties}
                      </span>
                      <a
                        href="#"
                        className="text-1 tf-btn style-border pd-23 text_white city-btn"
                        onClick={(e) => handleCityClick(e, location.city)}
                      >
                        {location.properties} <i className="icon-arrow-right" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
