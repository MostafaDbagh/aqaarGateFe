"use client";
import React, { useEffect, useRef } from "react";
import { useListing, useIncrementVisitCount } from "@/apis/hooks";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";
import Details3 from "@/components/propertyDetails/Details3";
import PropertyReviews from "@/components/propertyDetails/PropertyReviews";
import RelatedProperties from "@/components/propertyDetails/RelatedProperties";
import LocationLoader from "@/components/common/LocationLoader";

export default function PropertyDetailClient({ id }) {
  const { data: property, isLoading, isError, error } = useListing(id);
  const incrementVisitCount = useIncrementVisitCount();
  const hasIncremented = useRef(false);

  // Increment visit count when property loads (only once per page load)
  useEffect(() => {
    if (property?._id && !hasIncremented.current) {
      const propertyId = property._id;
      
      // Check if already visited in this session
      try {
        const visitedProperties = JSON.parse(
          typeof window !== 'undefined' 
            ? localStorage.getItem('visitedProperties') || '[]' 
            : '[]'
        );
        
        if (!visitedProperties.includes(propertyId)) {
          // Increment visit count
          incrementVisitCount.mutate(propertyId, {
            onSuccess: (data) => {
              // Successfully incremented
            },
            onError: (error) => {
              // Error incrementing - log but don't block
            }
          });
          
          // Mark as visited in localStorage
          visitedProperties.push(propertyId);
          if (typeof window !== 'undefined') {
            localStorage.setItem('visitedProperties', JSON.stringify(visitedProperties));
          }
        }
      } catch (error) {
        // If localStorage fails, still increment visit count
        incrementVisitCount.mutate(propertyId, {
          onSuccess: (data) => {
            // Successfully incremented
          },
          onError: (error) => {
            // Error incrementing
          }
        });
      }
      hasIncremented.current = true;
    }
  }, [property?._id, incrementVisitCount]);

  if (isLoading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <LocationLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Error Loading Property</h4>
          <p>{error?.message || 'Failed to load property details'}</p>
          <p>Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <h4>Property Not Found</h4>
          <p>The property you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div id="wrapper">
        <Header1 />
        <Breadcumb pageName="Property Details" />
        <div className="main-content">
          <Details3 property={property} />
          <RelatedProperties currentProperty={property} />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}
