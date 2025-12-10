"use client";
import React, { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import DropdownSelect from "../common/DropdownSelect";
import DropdownTagSelect from "../common/DropdownTagSelect";
import { amenitiesList } from "@/constants/amenities";

export default function FilterModal({ onSearchChange, searchParams = {}, disabled = false }) {
  const t = useTranslations('filterModal');
  const tCommon = useTranslations('common');
  const tAmenities = useTranslations('amenities');
  const locale = useLocale();
  
  // City name mapping for fallback
  const cityNameMap = useMemo(() => ({
    "latakia": "Latakia",
    "damascus": "Damascus",
    "aleppo": "Aleppo",
    "homs": "Homs",
    "hama": "Hama",
    "idlib": "Idlib",
    "deirEzZor": "Deir ez-Zor",
    "daraa": "Daraa",
    "tartous": "Tartous"
  }), []);
  
  // Helper function to get city translation safely
  const getCityTranslation = useMemo(() => {
    return (key) => {
      const englishName = cityNameMap[key] || key;
      
      // Try to get translation using raw access to avoid next-intl errors
      // Since cities are in common.cities, we need to access them differently
      try {
        // Use raw translation access with proper namespace
        const translationKey = `common.cities.${key}`;
        // For now, use a direct mapping based on locale
        if (locale === 'ar') {
          const arabicCities = {
            "latakia": "اللاذقية",
            "damascus": "دمشق",
            "aleppo": "حلب",
            "homs": "حمص",
            "hama": "حماة",
            "idlib": "إدلب",
            "deirEzZor": "دير الزور",
            "daraa": "درعا",
            "tartous": "طرطوس"
          };
          return arabicCities[key] || englishName;
        } else {
          return englishName;
        }
      } catch (e) {
        return englishName;
      }
    };
  }, [locale, cityNameMap]);

  // Single source of truth for cities (English values for backend)
  const citiesList = useMemo(() => [
    "Latakia",
    "Damascus",
    "Aleppo",
    "Homs",
    "Hama",
    "Idlib",
    "Deir ez-Zor",
    "Daraa",
    "Tartous"
  ], []);

  // Single source of truth for property types (English values for backend)
  const propertyTypesList = useMemo(() => [
    "Apartment",
    "Commercial",
    "Land",
    "Holiday Home",
    "Villa/farms",
    "Office"
  ], []);

  // Get translated city options based on locale
  const getCityOptions = useMemo(() => {
    const allCitiesOption = t('allCities');
    const translatedCities = citiesList.map(city => {
      // Map English city names to translation keys
      const cityKeyMap = {
        "Latakia": "latakia",
        "Damascus": "damascus",
        "Aleppo": "aleppo",
        "Homs": "homs",
        "Hama": "hama",
        "Idlib": "idlib",
        "Deir ez-Zor": "deirEzZor",
        "Daraa": "daraa",
        "Tartous": "tartous"
      };
      const key = cityKeyMap[city] || city.toLowerCase();
      // Get city translation using helper function
      const translated = getCityTranslation(key);
      return translated || city;
    });
    return [allCitiesOption, ...translatedCities];
  }, [t, getCityTranslation, citiesList]);

  // Get translated property type options based on locale
  const getPropertyTypeOptions = useMemo(() => {
    const anyOption = t('any');
    const translatedTypes = propertyTypesList.map(type => {
      // Map English property types to translations
      if (type === "Holiday Home") {
        return tCommon('holidayHome');
      } else if (type === "Villa/farms") {
        return locale === 'ar' ? "فيلا/مزرعة" : type;
      } else if (type === "Apartment") {
        return locale === 'ar' ? "شقة" : type;
      } else if (type === "Commercial") {
        return locale === 'ar' ? "محل تجاري" : type;
      } else if (type === "Land") {
        return locale === 'ar' ? "أرض" : type;
      } else if (type === "Office") {
        return locale === 'ar' ? "مكتب" : type;
      }
      return type;
    });
    return [anyOption, ...translatedTypes];
  }, [t, tCommon, locale, propertyTypesList]);

  // Handle city change - send English value to backend
  const handleCityChange = (displayValue) => {
    if (displayValue === t('allCities')) {
      handleChange("cities", "");
      return;
    }
    
    // Find the English value from the translated display value
    const cityIndex = getCityOptions.findIndex(opt => opt === displayValue);
    if (cityIndex > 0) {
      // cityIndex - 1 because first option is "allCities"
      handleChange("cities", citiesList[cityIndex - 1]);
    } else {
      // Fallback: try to find by matching translation
      const englishValue = citiesList.find(city => {
        const key = {
          "Latakia": "latakia",
          "Damascus": "damascus",
          "Aleppo": "aleppo",
          "Homs": "homs",
          "Hama": "hama",
          "Idlib": "idlib",
          "Deir ez-Zor": "deirEzZor",
          "Daraa": "daraa",
          "Tartous": "tartous"
        }[city];
        const translated = getCityTranslation(key);
        return (translated || city) === displayValue;
      }) || displayValue;
      handleChange("cities", englishValue);
    }
  };

  // Handle property type change - send English value to backend
  const handlePropertyTypeChange = (displayValue) => {
    if (displayValue === t('any')) {
      handleChange("propertyType", "");
      return;
    }
    
    // Find the English value from the translated display value
    const typeIndex = getPropertyTypeOptions.findIndex(opt => opt === displayValue);
    if (typeIndex > 0) {
      // typeIndex - 1 because first option is "any"
      handleChange("propertyType", propertyTypesList[typeIndex - 1]);
    } else {
      // Fallback: try to match by translation
      let englishValue = displayValue;
      if (displayValue === tCommon('holidayHome')) {
        englishValue = "Holiday Home";
      } else if (displayValue === "فيلا/مزرعة" || displayValue === "Villa/farms") {
        englishValue = "Villa/farms";
      } else if (displayValue === "شقة" || displayValue === "Apartment") {
        englishValue = "Apartment";
      } else if (displayValue === "محل تجاري" || displayValue === "Commercial") {
        englishValue = "Commercial";
      } else if (displayValue === "أرض" || displayValue === "Land") {
        englishValue = "Land";
      } else if (displayValue === "مكتب" || displayValue === "Office") {
        englishValue = "Office";
      }
      handleChange("propertyType", englishValue);
    }
  };
  
  // Map amenity names to translation keys
  const getAmenityTranslationKey = (amenity) => {
    const mapping = {
      "Solar energy system": "solarEnergySystem",
      "Star link internet": "starLinkInternet",
      "Fiber internet": "fiberInternet",
      "Basic internet": "basicInternet",
      "Parking": "parking",
      "Lift": "lift",
      "A/C": "ac",
      "Gym": "gym",
      "Security cameras": "securityCameras",
      "Reception (nator)": "receptionNator",
      "Balcony": "balcony",
      "Swimming pool": "swimmingPool",
      "First aid kit": "firstAidKit",
      "Fire alarms": "fireAlarms"
    };
    return mapping[amenity] || amenity;
  };

  const translateAmenity = (amenity) => {
    const key = getAmenityTranslationKey(amenity);
    return tAmenities(key);
  };

  const handleChange = (key, value) => {
    if (onSearchChange) {
      onSearchChange({ [key]: value });
    }
  };

  const handleNumericInputChange = (key, value) => {
    if (value === '') {
      handleChange(key, '');
      return;
    }

    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      return;
    }

    handleChange(key, Math.max(0, parsed));
  };

  // Check if property type should hide beds, baths, and furnished (show by default)
  const shouldHideResidentialOptions = () => {
    const propertyType = searchParams.propertyType || "";
    const nonResidentialTypes = ["Commercial", "Land"];
    return nonResidentialTypes.includes(propertyType);
  };

  const shouldShowResidentialOptions = !shouldHideResidentialOptions();
  
  return (
    <>
      <style jsx>{`
        .range-inputs {
          display: flex !important;
          gap: 16px !important;
          align-items: flex-end !important;
          flex-wrap: wrap !important;
        }

        .widget-price.full-width {
          width: 100% !important;
        }

        .widget-price.full-width .range-inputs {
          width: 100% !important;
          background: #f8f9fa;
          border-radius: 16px;
          padding: 18px;
          border: 1px solid rgba(125, 138, 156, 0.22);
          position: relative;
        }

        .widget-price.full-width .range-input-group {
          flex: 1 !important;
        }

        .widget-price.full-width .range-input {
          width: 100% !important;
        }

        .box-title-price {
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-start !important;
          gap: 12px !important;
        }

        .range-input-group {
          display: flex !important;
          flex-direction: column !important;
          gap: 6px !important;
        }

        .range-input {
          width: 160px !important;
          height: 48px !important;
          border-radius: 12px !important;
          border: 2px solid #e8e8e8 !important;
          padding: 0 16px !important;
          font-size: 14px !important;
          color: #333 !important;
          background-color: #fff !important;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05) !important;
          transition: all 0.3s ease !important;
          outline: none !important;
        }

        .range-input:focus {
          border-color: #ff6b35 !important;
          box-shadow: 0 4px 16px rgba(255, 107, 53, 0.12) !important;
        }

        .range-input::-webkit-outer-spin-button,
        .range-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .range-input {
          -moz-appearance: textfield;
        }

        /* Property ID Input Styling */
        .property-id-input {
          width: 100% !important;
          height: 56px !important;
          border-radius: 8px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
          border: 1px solid #e0e0e0 !important;
          padding: 0 16px !important;
          font-size: 14px !important;
        }
        
        /* Enhanced City Dropdown Styling for FilterModal */
        .modal-filter .city-dropdown .nice-select {
          background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%);
          border: 2px solid #e1ecff;
          border-radius: 12px;
          transition: all 0.3s ease;
          height: 56px;
        }
        
        .modal-filter .city-dropdown .nice-select:hover {
          border-color: #667eea;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
          transform: translateY(-1px);
        }
        
        .modal-filter .city-dropdown .nice-select.open {
          border-color: #667eea;
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
        }
        
        .modal-filter .city-dropdown .nice-select .list {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid #e1ecff;
          max-height: 300px;
          overflow-y: auto;
          z-index: 9999;
        }
        
        .modal-filter .city-dropdown .nice-select .list .option {
          padding: 12px 16px;
          font-weight: 500;
          color: #4a5568;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .modal-filter .city-dropdown .nice-select .list .option::before {
          content: "📍";
          margin-right: 8px;
          font-size: 14px;
        }
        
        .modal-filter .city-dropdown .nice-select .list .option:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: translateX(4px);
        }
        
        .modal-filter .city-dropdown .nice-select .list .option.selected {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
        }
        
        .modal-filter .city-dropdown .nice-select .list .option.selected::after {
          content: "✓";
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-weight: bold;
        }
        
        /* Custom scrollbar for city dropdown in FilterModal */
        .modal-filter .city-dropdown .nice-select .list::-webkit-scrollbar {
          width: 6px;
        }
        
        .modal-filter .city-dropdown .nice-select .list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .modal-filter .city-dropdown .nice-select .list::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }
        
        .modal-filter .city-dropdown .nice-select .list::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        }

        .range-reset {
          position: absolute;
          left: 2px;
          top: 2px;
          padding: 10px 18px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #8f9bb2 0%, #5f6c83 100%);
          color: white;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.05em;
          cursor: pointer;
          box-shadow: 0 12px 24px rgba(95, 108, 131, 0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        [dir="rtl"] .range-reset {
          right: auto;
          left: 18px;
        }

        .range-reset:hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 28px rgba(95, 108, 131, 0.3);
        }

        .range-reset:active {
          transform: translateY(0);
          box-shadow: 0 10px 20px rgba(95, 108, 131, 0.25);
        }

      `}</style>
      <div className="modal modal-filter fade" id="modalFilter">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="wd-search-form style-3">
            <div className="title-box">
              <h4>{t('advancedSearch')}</h4>
              <span
                className="close-modal icon-close"
                data-bs-dismiss="modal"
              />
            </div>
            <div className="group-input mb-30">
              <div className="box-input">
                <label className="mb-2" htmlFor="propertyId">
                  {t('propertyId')}
                </label>
                <input
                  type="text"
                  id="propertyId"
                  className="form-control property-id-input"
                  placeholder={t('propertyIdPlaceholder')}
                  value={searchParams.propertyId || ""}
                  onChange={(e) => handleChange("propertyId", e.target.value)}
                />
              </div>
            </div>
            
            {/* Property Type - First Input */}
            <div className="group-input mb-30">
              <div className="box-input">
                <label className="mb-2" htmlFor="propertyTypeSelect">
                  {t('propertyType')}
                </label>
                <DropdownSelect
                  id="propertyTypeSelect"
                  options={getPropertyTypeOptions}
                  addtionalParentClass=""
                  selectedValue={
                    searchParams.propertyType 
                      ? getPropertyTypeOptions.find((opt, idx) => idx > 0 && propertyTypesList[idx - 1] === searchParams.propertyType) || t('any')
                      : t('any')
                  }
                  onChange={(value) => handlePropertyTypeChange(value)}
                />
              </div>
            </div>

                        {/* Syria Cities Dropdown */}
    

            {/* Property ID Input Field */}
      
            <div className="group-input mb-30">
              <div className="box-input">
                <label className="mb-2" htmlFor="citiesSelect">
                   {t('cities')}
                </label>
                <div className="city-dropdown">
                  <DropdownSelect
                    id="citiesSelect"
                    options={getCityOptions}
                    addtionalParentClass=""
                    selectedValue={
                      searchParams.cities 
                        ? getCityOptions.find((opt, idx) => idx > 0 && citiesList[idx - 1] === searchParams.cities) || t('allCities')
                        : t('allCities')
                    }
                    onChange={(value) => handleCityChange(value)}
                  />
                </div>
              </div>
            </div>
            <div className="group-input mb-30">
              <div className="box-input">
                <label className="mb-2" htmlFor="modalFurnishedSelect">
                  {t('furnishing')}
                </label>
                <DropdownSelect
                  id="modalFurnishedSelect"
                  options={[t('any'), t('furnished'), t('unfurnished')]}
                  addtionalParentClass=""
                  selectedValue={
                    searchParams.furnished === true
                      ? t('furnished')
                      : searchParams.furnished === false
                      ? t('unfurnished')
                      : t('any')
                  }
                  onChange={(value) => {
                    let furnishedValue;
                    if (value === t('furnished')) furnishedValue = true;
                    else if (value === t('unfurnished')) furnishedValue = false;
                    else furnishedValue = undefined;
                    handleChange("furnished", furnishedValue);
                  }}
                />
              </div>
            </div>
            {shouldShowResidentialOptions && (
              <div className="group-select">
                <div className="box-select">
                <DropdownTagSelect
                  id="bathsSelect"
                  label={t('baths')}
                  options={[t('any'), "1", "2", "3", "4", "5", "6"]}
                  addtionalParentClass=""
                  value={searchParams.bathrooms || ""}
                  onChange={(value) => handleChange("bathrooms", value)}
                />
              </div>
              
              <div className="box-select">
                <DropdownTagSelect
                  id="bedsSelect"
                  label={t('rooms')}
                  options={[t('any'), 'studio', "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
                  addtionalParentClass=""
                  value={searchParams.bedrooms || ""}
                  onChange={(value) => handleChange("bedrooms", value)}
                />
              </div>
              
              </div>
            )}
            <div className="group-input mb-30">
              <div className="widget-price full-width">
                <div className="box-title-price">
                  <span className="title-price">{t('price')}</span>
                  <div className="range-inputs">
                    <div className="range-input-group">
                      <span className="input-label">{t('from')}</span>
                      <input
                        id="filterPriceMin"
                        type="number"
                        className="range-input"
                        placeholder={t('minPrice')}
                        value={searchParams.priceMin ?? ''}
                        onChange={(e) => handleNumericInputChange('priceMin', e.target.value)}
                      />
                    </div>
                    <div className="range-input-group">
                      <span className="input-label">{t('to')}</span>
                      <input
                        id="filterPriceMax"
                        type="number"
                        className="range-input"
                        placeholder={t('maxPrice')}
                        value={searchParams.priceMax ?? ''}
                        onChange={(e) => handleNumericInputChange('priceMax', e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      className="range-reset"
                      onClick={() => {
                        handleChange('priceMin', '');
                        handleChange('priceMax', '');
                      }}
                    >
                      {t('reset')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="group-input mb-30">
              <div className="widget-price full-width">
                <div className="box-title-price">
                  <span className="title-price">{t('size')}</span>
                  <div className="range-inputs">
                    <div className="range-input-group">
                      <span className="input-label">{t('from')}</span>
                      <input
                        id="filterSizeMin"
                        type="number"
                        className="range-input"
                        placeholder={t('minSize')}
                        value={searchParams.sizeMin ?? ''}
                        onChange={(e) => handleNumericInputChange('sizeMin', e.target.value)}
                      />
                    </div>
                    <div className="range-input-group">
                      <span className="input-label">{t('to')}</span>
                      <input
                        id="filterSizeMax"
                        type="number"
                        className="range-input"
                        placeholder={t('maxSize')}
                        value={searchParams.sizeMax ?? ''}
                        onChange={(e) => handleNumericInputChange('sizeMax', e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      className="range-reset"
                      onClick={() => {
                        handleChange('sizeMin', '');
                        handleChange('sizeMax', '');
                      }}
                    >
                      {t('reset')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
      
            <div className="group-checkbox">
              <div className="title text-4 fw-6">{t('amenities')}</div>
              <div className="group-amenities">
                {amenitiesList.map((amenity, index) => (
                  <fieldset key={amenity} className={`checkbox-item style-1 ${index > 0 ? 'mt-12' : ''}`}>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={searchParams.amenities?.includes(amenity) || false}
                        onChange={(e) => {
                          const newAmenities = new Set(searchParams.amenities || []);
                          if (e.target.checked) {
                            newAmenities.add(amenity);
                          } else {
                            newAmenities.delete(amenity);
                          }
                          handleChange("amenities", Array.from(newAmenities));
                        }}
                      />
                      <span className="btn-checkbox" />
                      <span className="text-4">{translateAmenity(amenity)}</span>
                    </label>
                  </fieldset>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
