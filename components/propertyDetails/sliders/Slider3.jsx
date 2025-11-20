"use client";
import Image from "next/image";
import { useState, useMemo } from "react";
import { Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Gallery, Item } from "react-photoswipe-gallery";

// Fallback images if property has no images
const fallbackImages = [
  {
    src: "/images/section/property-details-v2-1.jpg",
    alt: "Property Image",
  },
  { src: "/images/section/property-details-v3-1.jpg", alt: "Property Image" },
  { src: "/images/section/property-details-v3-2.jpg", alt: "Property Image" },
  { src: "/images/section/property-details-v3-3.jpg", alt: "Property Image" },
  { src: "/images/section/property-details-v3-4.jpg", alt: "Property Image" },
  { src: "/images/section/property-details-v3-5.jpg", alt: "Property Image" },
];

export default function Slider3({ property }) {
  const [swiperRef, setSwiperRef] = useState(null);
  
  // Helper function to resolve image URL
  const resolveImageUrl = (value) => {
    if (!value) return null;
    
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return null;
      // If it's already a full URL or starts with /, return as is
      if (trimmed.startsWith('http') || trimmed.startsWith('/')) {
        return trimmed;
      }
      // Otherwise, assume it's a path and add leading slash
      return `/${trimmed}`;
    }
    
    if (typeof value === 'object' && value !== null) {
      return value.url || value.secure_url || value.path || value.src || null;
    }
    
    return null;
  };

  // Memoize images processing to prevent hydration issues
  const images = useMemo(() => {
    if (!property) return fallbackImages;
    
    const urls = [];
    
    const pushUrl = (value) => {
      const resolved = resolveImageUrl(value);
      if (resolved) {
        urls.push(resolved);
      }
    };

    // Try images array (can be array of objects with url property or array of strings)
    if (Array.isArray(property.images) && property.images.length > 0) {
      property.images.forEach((item) => {
        // Handle object format: { url: "...", publicId: "...", ... }
        if (typeof item === 'object' && item !== null) {
          pushUrl(item.url || item.secure_url || item.path || item.src);
        } else {
          // Handle string format
          pushUrl(item);
        }
      });
    }

    // Try galleryImages array
    if (Array.isArray(property.galleryImages) && property.galleryImages.length > 0) {
      property.galleryImages.forEach((item) => {
        if (typeof item === 'object' && item !== null) {
          pushUrl(item.url || item.secure_url || item.path || item.src);
        } else {
          pushUrl(item);
        }
      });
    }

    // Try imageNames array (usually strings)
    if (Array.isArray(property.imageNames) && property.imageNames.length > 0) {
      property.imageNames.forEach((name) => pushUrl(name));
    }

    // Try single image properties
    pushUrl(property.coverImage);
    pushUrl(property.featuredImage);
    pushUrl(property.mainImage);

    // Remove duplicates and filter out nulls
    const uniqueUrls = urls
      .filter(Boolean)
      .filter((url, index, arr) => arr.indexOf(url) === index);

    // Convert to image objects with alt text
    const propertyImages = uniqueUrls.map((url, idx) => ({
      src: url,
      alt: `${property?.propertyKeyword || property?.propertyType || 'Property'} - Image ${idx + 1}`,
    }));

    // Return property images if found, otherwise empty array (we'll show a message instead)
    return propertyImages;
  }, [property]);
  // If no images, show a message instead of fallback images
  if (images.length === 0) {
    return (
      <div className="single-property-gallery style-1">
        <div className="position-relative">
          <div style={{
            width: '100%',
            minHeight: '520px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            border: '2px dashed #dee2e6',
            borderRadius: '8px',
            padding: '40px 20px'
          }}>
            <div style={{
              textAlign: 'center',
              color: '#6c757d'
            }}>
              <i className="icon-image" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }} />
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#495057' }}>
                No Images Available
              </h3>
              <p style={{ margin: 0, fontSize: '14px' }}>
                This property does not have any images uploaded yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="single-property-gallery style-1">
      <div className="position-relative">
        <Gallery>
          <Swiper
            dir="ltr"
            modules={[Thumbs, Navigation]}
            thumbs={{ swiper: swiperRef }}
            navigation={{
              prevEl: ".snbpdp1",
              nextEl: ".snbpdn1",
            }}
            className="swiper sw-single"
          >
            {images.map((elm, i) => (
              <SwiperSlide key={`main-${elm.src}-${i}`} className="swiper-slide">
                <Item
                  original={elm.src}
                  thumbnail={elm.src}
                  width={840}
                  height={473}
                >
                  {({ ref, open }) => (
                    <a
                      data-fancybox="gallery"
                      onClick={open}
                      className="image-wrap d-block"
                      style={{
                        maxHeight: '520px',
                        minWidth: '970px',
                        overflow: 'hidden',
                        display: 'block',
                        margin: '0 auto'
                      }}
                    >
                      <Image
                        ref={ref}
                        className="lazyload"
                        alt="Property gallery image"
                        src={elm.src}
                        width={840}
                        height={473}
                        style={{
                          width: '100%',
                          height: 'auto',
                          maxHeight: '520px',
                          minWidth: '970px',
                          objectFit: 'contain'
                        }}
                      />
                    </a>
                  )}
                </Item>
              </SwiperSlide>
            ))}
          </Swiper>
        </Gallery>
        <div className="box-navigation">
          <div className="swiper-button-prev sw-button style-2 sw-thumbs-prev snbpdp1">
            <i className="icon-arrow-left-1" />
          </div>
          <div className="swiper-button-next sw-button style-2 sw-thumbs-next snbpdn1">
            <i className="icon-arrow-right-1" />
          </div>
        </div>
        <Swiper
          dir="ltr"
          onSwiper={setSwiperRef}
          className="swiper thumbs-sw-pagi"
          spaceBetween={15}
          slidesPerView={5}
        >
          {images.map((elm, i) => (
            <SwiperSlide key={`thumb-${elm.src}-${i}`} className="swiper-slide">
              <div className="img-thumb-pagi">
                <Image alt="Property gallery thumbnail" src={elm.src} width={317} height={202} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
