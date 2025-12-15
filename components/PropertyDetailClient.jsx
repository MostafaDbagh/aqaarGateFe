"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useListing, useIncrementVisitCount } from "@/apis/hooks";
import { useTranslations, useLocale } from 'next-intl';
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";
import Details3 from "@/components/propertyDetails/Details3";
import PropertyReviews from "@/components/propertyDetails/PropertyReviews";
import RelatedProperties from "@/components/propertyDetails/RelatedProperties";
import LocationLoader from "@/components/common/LocationLoader";
import PropertyStructuredData from "@/components/seo/PropertyStructuredData";

export default function PropertyDetailClient({ id }) {
  const t = useTranslations('propertyDetail');
  const locale = useLocale();
  const router = useRouter();
  const { data: property, isLoading, isError, error } = useListing(id);
  const incrementVisitCount = useIncrementVisitCount();
  const hasIncremented = useRef(false);
  const hasRedirected = useRef(false);

  // Redirect to 404 if property doesn't exist or has error
  // This must be called before any conditional returns to maintain hook order
  useEffect(() => {
    if (!hasRedirected.current && !isLoading) {
      // Check for specific error types that indicate property doesn't exist
      const errorMessage = error?.message || error?.error || '';
      const isNotFoundError = 
        isError && (
          errorMessage.includes('Cast to ObjectId') ||
          errorMessage.includes('not found') ||
          errorMessage.includes('Not Found') ||
          errorMessage.includes('404') ||
          error?.response?.status === 404 ||
          error?.status === 404
        );

      // If error indicates property doesn't exist, or property is null after loading
      if (isNotFoundError || (!isLoading && !property && !isError)) {
        hasRedirected.current = true;
        // Redirect to locale-specific 404 page
        router.replace(`/${locale}/404`);
        return;
      }
    }
  }, [isError, error, property, isLoading, router]);

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
    // Check if this is a "not found" type error
    const errorMessage = error?.message || error?.error || '';
    const isNotFoundError = 
      errorMessage.includes('Cast to ObjectId') ||
      errorMessage.includes('not found') ||
      errorMessage.includes('Not Found') ||
      errorMessage.includes('404') ||
      error?.response?.status === 404 ||
      error?.status === 404;

    // If it's a "not found" error, redirect to 404 (handled by useEffect above)
    if (isNotFoundError) {
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

    // For other errors, show error message
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>{t('errorLoading')}</h4>
          <p>{error?.message || t('failedToLoad')}</p>
          <p>{t('tryAgainLater')}</p>
        </div>
      </div>
    );
  }

  if (!property && !isLoading) {
    // Property not found, redirect to 404 (handled by useEffect above)
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

  return (
    <>
      <PropertyStructuredData property={property} />
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
