"use client";

import { useEffect, useRef, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import DropdownSelect from "./DropdownSelect";
import DropdownTagSelect from "./DropdownTagSelect";
import { provinceOptions } from "@/constants/provinces";
import { amenitiesList } from "@/constants/amenities";
import logger from "@/utlis/logger";

export default function SearchForm({
  parentClass = "wd-search-form",
  searchParams = {},
  onSearchChange,
}) {
  const t = useTranslations('searchForm');
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
  const searchFormRef = useRef();

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
  const handleCityChange = (displayValue, fieldName) => {
    if (displayValue === t('allCities')) {
      handleChange(fieldName, "");
      return;
    }
    
    // Find the English value from the translated display value
    const cityIndex = getCityOptions.findIndex(opt => opt === displayValue);
    if (cityIndex > 0) {
      // cityIndex - 1 because first option is "allCities"
      handleChange(fieldName, citiesList[cityIndex - 1]);
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
      handleChange(fieldName, englishValue);
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
      } else if (displayValue === "تجاري" || displayValue === "Commercial") {
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

  useEffect(() => {
    const searchFormToggler = document.querySelector(".searchFormToggler");

    const handleToggle = (event) => {
      event.preventDefault();
      event.stopPropagation();
      searchFormRef.current.classList.toggle("show");
    };

    const handleClickOutside = (event) => {
      if (searchFormRef.current && 
          searchFormRef.current.classList.contains("show") &&
          !searchFormRef.current.contains(event.target) &&
          !searchFormToggler?.contains(event.target)) {
        logger.debug("Closing SearchForm - clicked outside");
        searchFormRef.current.classList.remove("show");
      }
    };

    if (searchFormToggler) {
      searchFormToggler.addEventListener("click", handleToggle);
    }

    // Use mousedown instead of click for better detection
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      if (searchFormToggler) {
        searchFormToggler.removeEventListener("click", handleToggle);
      }
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (key, value) => {
    if (onSearchChange) {
      onSearchChange({ [key]: value });
    }
  };

  const handleAmenityChange = (amenity) => {
    const newAmenities = new Set(searchParams.amenities || []);
    if (newAmenities.has(amenity)) {
      newAmenities.delete(amenity);
    } else {
      newAmenities.add(amenity);
    }
    handleChange("amenities", Array.from(newAmenities));
  };

  const handleNumericInputChange = (key, value) => {
    if (value === "") {
      handleChange(key, "");
      return;
    }

    const parsedValue = Number(value);
    if (Number.isNaN(parsedValue)) {
      return;
    }

    handleChange(key, Math.max(0, parsedValue));
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
        /* Form layout utilities */
        .form-row-flex {
          display: flex !important;
          gap: 24px !important;
          align-items: flex-end !important;
          flex-wrap: wrap !important;
        }
        
        .form-row-item {
          flex: 1 !important;
          min-width: 280px !important;
        }
        
        .form-label {
          font-size: 14px !important;
          font-weight: 600 !important;
          color: #333 !important;
          display: block !important;
        }
        
        .form-input-enhanced {
          width: 100% !important;
          height: 56px !important;
          border-radius: 12px !important;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08) !important;
          border: 2px solid #e8e8e8 !important;
          padding: 0 20px !important;
          font-size: 14px !important;
          color: #333 !important;
          background-color: #fff !important;
          transition: all 0.3s ease !important;
          outline: none !important;
        }
        
        .form-input-enhanced:focus {
          border-color: #ff6b35 !important;
          box-shadow: 0 4px 20px rgba(255, 107, 53, 0.15) !important;
        }
        
        .range-inputs {
          width: 100% !important;
          display: flex !important;
          gap: 12px !important;
          align-items: flex-end !important;
          flex-wrap: wrap !important;
          background: #f8f9fa;
          border-radius: 16px;
          padding: 18px;
          border: 1px solid rgba(125, 138, 156, 0.22);
          position: relative;
        }

        .range-input-group {
          display: flex !important;
          flex-direction: column !important;
          gap: 4px !important;
          flex: 1 !important;
        }

        .range-input-group .input-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #333;
        }

        .range-input {
          width: 190px !important;
          height: 52px !important;
          border-radius: 14px !important;
          border: 1px solid #cfd5dd !important;
          padding: 0 18px !important;
          font-size: 15px !important;
          color: #222 !important;
          background-color: rgba(255, 255, 255, 0.96) !important;
          box-shadow: 0 10px 30px rgba(125, 138, 156, 0.12) !important;
          transition: all 0.28s ease !important;
          outline: none !important;
        }

        .range-input:focus {
          border-color: #728096 !important;
          box-shadow: 0 16px 32px rgba(125, 138, 156, 0.18) !important;
          transform: translateY(-1px);
        }

        .range-reset {
          position: absolute !important;
          top: 4px !important;
          left:12px !important;
          padding: 10px 18px !important;
          border-radius: 12px !important;
          border: none !important;
          background: linear-gradient(135deg, #8f9bb2 0%, #5f6c83 100%) !important;
          color: white !important;
          font-weight: 600 !important;
          font-size: 13px !important;
          letter-spacing: 0.05em !important;
          cursor: pointer !important;
          box-shadow: 0 12px 24px rgba(95, 108, 131, 0.25) !important;
          transition: transform 0.2s ease, box-shadow 0.2s ease !important;
        }

        html[dir="rtl"] .range-reset,
        html[dir="rtl"] .range-inputs .range-reset,
        [dir="rtl"] .range-reset,
        [dir="rtl"] .range-inputs .range-reset {
          right: auto !important;
          left: 18px !important;
        }

        .range-reset:hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 28px rgba(95, 108, 131, 0.3);
        }

        .range-reset:active {
          transform: translateY(0);
          box-shadow: 0 10px 20px rgba(95, 108, 131, 0.25);
        }

        .range-input::-webkit-outer-spin-button,
        .range-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .range-input {
          -moz-appearance: textfield;
        }

        /* Enhanced City Dropdown Styling for style-3 */
        .wd-search-form.style-3 .city-dropdown .nice-select {
          background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%);
          border: 2px solid #e1ecff;
          border-radius: 12px;
          transition: all 0.3s ease;
          height: 56px;
        }
        
        .wd-search-form.style-3 .city-dropdown .nice-select:hover {
          border-color: #667eea;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
          transform: translateY(-1px);
        }
        
        .wd-search-form.style-3 .city-dropdown .nice-select.open {
          border-color: #667eea;
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
        }
        
        .wd-search-form.style-3 .city-dropdown .nice-select .list {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid #e1ecff;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .wd-search-form.style-3 .city-dropdown .nice-select .list .option {
          padding: 12px 16px;
          font-weight: 500;
          color: #4a5568;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .wd-search-form.style-3 .city-dropdown .nice-select .list .option::before {
          content: "📍";
          margin-right: 8px;
          font-size: 14px;
        }
        
        .wd-search-form.style-3 .city-dropdown .nice-select .list .option:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: translateX(4px);
        }
        
        .wd-search-form.style-3 .city-dropdown .nice-select .list .option.selected {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
        }
        
        .wd-search-form.style-3 .city-dropdown .nice-select .list .option.selected::after {
          content: "✓";
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-weight: bold;
        }
        
        /* Custom scrollbar for city dropdown in style-3 */
        .wd-search-form.style-3 .city-dropdown .nice-select .list::-webkit-scrollbar {
          width: 6px;
        }
        
        .wd-search-form.style-3 .city-dropdown .nice-select .list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .wd-search-form.style-3 .city-dropdown .nice-select .list::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }
        
        .wd-search-form.style-3 .city-dropdown .nice-select .list::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        }
        
        /* Enhanced City Dropdown Styling for all SearchForm variants */
        .wd-search-form .city-dropdown .nice-select {
          background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%);
          border: 2px solid #e1ecff;
          border-radius: 12px;
          transition: all 0.3s ease;
          height: 56px;
        }
        
        .wd-search-form .city-dropdown .nice-select:hover {
          border-color: #667eea;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
          transform: translateY(-1px);
        }
        
        .wd-search-form .city-dropdown .nice-select.open {
          border-color: #667eea;
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
        }
        
        .wd-search-form .city-dropdown .nice-select .list {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid #e1ecff;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .wd-search-form .city-dropdown .nice-select .list .option {
          padding: 12px 16px;
          font-weight: 500;
          color: #4a5568;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .wd-search-form .city-dropdown .nice-select .list .option::before {
          content: "📍";
          margin-right: 8px;
          font-size: 14px;
        }
        
        .wd-search-form .city-dropdown .nice-select .list .option:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: translateX(4px);
        }
        
        .wd-search-form .city-dropdown .nice-select .list .option.selected {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
        }
        
        .wd-search-form .city-dropdown .nice-select .list .option.selected::after {
          content: "✓";
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-weight: bold;
        }
        
        /* Custom scrollbar for city dropdown in SearchForm */
        .wd-search-form .city-dropdown .nice-select .list::-webkit-scrollbar {
          width: 6px;
        }
        
        .wd-search-form .city-dropdown .nice-select .list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .wd-search-form .city-dropdown .nice-select .list::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }
        
        .wd-search-form .city-dropdown .nice-select .list::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        }

        /* Property type column styles */
        .property-type-column {
          max-width: 50% !important;
          flex: 0 0 50% !important;
        }

      `}</style>
      <div className={parentClass} ref={searchFormRef}>
        <div className="search-form-header mb-32">
          <h4 className="advanced-search-title">{t('advancedSearch')}</h4>
        </div>
        
        {/* Property Type - First Input */}
        <div className="group-input mb-30 col-4">
        <div className="box-input form-row-item">
            <label className="mb-2 form-label" htmlFor="propertyId">
              {t('propertyId')}
            </label>
            <input
              type="text"
              id="propertyId"
              className="form-control form-input-enhanced"
              placeholder={t('propertyIdPlaceholder')}
              value={searchParams.propertyId || ""}
              onChange={(e) => handleChange("propertyId", e.target.value)}
            />
          </div>
   
        </div>
        
                {/* Syria Cities and Property ID Row */}
        <div className="group-input mb-30 form-row-flex">
          <div className="box-input form-row-item">
            <label className="mb-2 form-label" htmlFor="syriaCitiesSelect">
               {t('city')}
            </label>
            <div className="city-dropdown">
              <DropdownSelect
                id="syriaCitiesSelect"
                options={getCityOptions}
                addtionalParentClass=""
                selectedValue={
                  searchParams.cities 
                    ? getCityOptions.find((opt, idx) => idx > 0 && citiesList[idx - 1] === searchParams.cities) || t('allCities')
                    : t('allCities')
                }
                onChange={(value) => handleCityChange(value, "cities")}
              />
            </div>
          </div>
          <div className="box-input form-row-item property-type-column">
            <label className="mb-2 form-label" htmlFor="propertyTypeSelect">
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
              onChange={handlePropertyTypeChange}
            />
          </div>
        </div>
      
      {/* Cities Dropdown for style-3 */}
      {parentClass.includes('style-3') && (
        <div className="group-input mb-30">
          <div className="box-input">
            <label className="mb-2 form-label" htmlFor="citiesSelectStyle3">
              {t('cities')}
            </label>
            <div className="city-dropdown">
              <DropdownSelect
                options={getCityOptions}
                addtionalParentClass=""
                selectedValue={
                  searchParams.state 
                    ? getCityOptions.find((opt, idx) => idx > 0 && citiesList[idx - 1] === searchParams.state) || t('allCities')
                    : t('allCities')
                }
                onChange={(value) => handleCityChange(value, "state")}
              />
            </div>
          </div>
        </div>
      )}
      
      

      {shouldShowResidentialOptions && (
        <div className="group-select">
          <div className="box-select">
          <DropdownTagSelect
            id="bedsSelect"
            label={t('rooms')}
            options={[t('any'), 'studio', "1", "2", "3", "4", "5", "6"]}
            addtionalParentClass=""
            value={searchParams.bedrooms || ""}
            onChange={(value) => handleChange("bedrooms", value)}
          />
        </div>

        <div className="box-select">
          <DropdownTagSelect
            id="bathsSelect"
            label={t('baths')}
            options={[t('any'), "1", "2", "3", "4", "5"]}
            addtionalParentClass=""
            value={searchParams.bathrooms || ""}
            onChange={(value) => handleChange("bathrooms", value)}
          />
        </div>

        <div className="box-select">
  <label className="mb-2" htmlFor="furnishedSelect">
    {t('furnishing')}
  </label>
  <DropdownSelect
    id="furnishedSelect"
    options={[t('furnished'), t('unfurnished')]}
    addtionalParentClass=""
    value={
      searchParams.furnished === true
        ? t('furnished')
        : searchParams.furnished === false
        ? t('unfurnished')
        : t('furnished') // Default to "مفروش" if not set
    }
    onChange={(value) => {
      let furnishedValue;
      if (value === t('furnished')) furnishedValue = true;
      else if (value === t('unfurnished')) furnishedValue = false;
      else furnishedValue = true; // Default to furnished
      handleChange("furnished", furnishedValue);
    }}
  />
</div>
        </div>
      )}

      <div className="group-price mb-30">
        <div className="widget-price">
          <label className="mb-2 title-price" htmlFor="priceRange">
            {t('priceRange')}
          </label>
          <div className="box-title-price">
            <div className="range-inputs">
              <div className="range-input-group">
                <span className="input-label">{t('from')}</span>
                <input
                  id="priceMin"
                  type="number"
                  className="range-input"
                  placeholder={t('minPrice')}
                  value={searchParams.priceMin ?? ""}
                  onChange={(e) => handleNumericInputChange("priceMin", e.target.value)}
                />
              </div>
              <div className="range-input-group">
                <span className="input-label">{t('to')}</span>
                <input
                  id="priceMax"
                  type="number"
                  className="range-input"
                  placeholder={t('maxPrice')}
                  value={searchParams.priceMax ?? ""}
                  onChange={(e) => handleNumericInputChange("priceMax", e.target.value)}
                />
              </div>
              <button
                type="button"
                className="range-reset"
                onClick={() => {
                  handleChange("priceMin", "");
                  handleChange("priceMax", "");
                }}
              >
                {t('reset')}
              </button>
            </div>
          </div>
        </div>
        <div className="widget-price">
          <label className="mb-2 title-price" htmlFor="sizeRange">
            {t('sizeRange')}
          </label>
          <div className="box-title-price">
            <div className="range-inputs">
              <div className="range-input-group">
                <span className="input-label">{t('from')}</span>
                <input
                  id="sizeMin"
                  type="number"
                  className="range-input"
                  placeholder={t('minSize')}
                  value={searchParams.sizeMin ?? ""}
                  onChange={(e) => handleNumericInputChange("sizeMin", e.target.value)}
                />
              </div>
              <div className="range-input-group">
                <span className="input-label">{t('to')}</span>
                <input
                  id="sizeMax"
                  type="number"
                  className="range-input"
                  placeholder={t('maxSize')}
                  value={searchParams.sizeMax ?? ""}
                  onChange={(e) => handleNumericInputChange("sizeMax", e.target.value)}
                />
              </div>
              <button
                type="button"
                className="range-reset"
                onClick={() => {
                  handleChange("sizeMin", "");
                  handleChange("sizeMax", "");
                }}
              >
                {t('reset')}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="group-checkbox">
        <div className="title text-4 fw-6 mb-2">{t('amenities')}</div>
        <div className="group-amenities">
          {amenitiesList.map((amenity, idx) => (
            <fieldset
              className={`checkbox-item style-1${idx > 0 ? " mt-12" : ""}`}
              key={amenity + idx}
            >
              <label>
                <input
                  type="checkbox"
                  checked={searchParams.amenities?.includes(amenity) || false}
                  onChange={() => handleAmenityChange(amenity)}
                />
                <span className="btn-checkbox" />
                <span className="text-4">{translateAmenity(amenity)}</span>
              </label>
            </fieldset>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
