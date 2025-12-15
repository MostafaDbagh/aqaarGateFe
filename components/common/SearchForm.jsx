"use client";

import { useEffect, useRef, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import DropdownSelect from "./DropdownSelect";
import DropdownTagSelect from "./DropdownTagSelect";
import { provinceOptions } from "@/constants/provinces";
import { amenitiesList } from "@/constants/amenities";
import logger from "@/utlis/logger";
import styles from "./SearchForm.module.css";
import "./SearchForm.css";

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

  // Map English city names to translation keys (reusable)
  const cityKeyMap = useMemo(() => ({
    "Latakia": "latakia",
    "Damascus": "damascus",
    "Aleppo": "aleppo",
    "Homs": "homs",
    "Hama": "hama",
    "Idlib": "idlib",
    "Deir ez-Zor": "deirEzZor",
    "Daraa": "daraa",
    "Tartous": "tartous"
  }), []);

  // Get translated city options based on locale
  const getCityOptions = useMemo(() => {
    const allCitiesOption = t('allCities');
    const translatedCities = citiesList.map(city => {
      const key = cityKeyMap[city] || city.toLowerCase();
      // Get city translation using helper function
      const translated = getCityTranslation(key);
      return translated || city;
    });
    return [allCitiesOption, ...translatedCities];
  }, [t, getCityTranslation, citiesList, cityKeyMap]);

  // Get translated property type options based on locale
  const getPropertyTypeOptions = useMemo(() => {
    const anyOption = t('All');
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
        const key = cityKeyMap[city];
        const translated = getCityTranslation(key);
        return (translated || city) === displayValue;
      }) || displayValue;
      handleChange(fieldName, englishValue);
    }
  };

  // Handle property type change - send English value to backend
  const handlePropertyTypeChange = (displayValue) => {
    if (displayValue === t('All')) {
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
      <div className={parentClass} ref={searchFormRef}>
        <div className="search-form-header mb-32">
          <h4 className="advanced-search-title">{t('advancedSearch')}</h4>
        </div>
        
        {/* Property Type - First Input */}
        <div className="group-input mb-30 col-4">
        <div className={`box-input ${styles.formRowItem}`}>
            <label className={`mb-2 ${styles.formLabel}`} htmlFor="propertyId">
              {t('propertyId')}
            </label>
            <input
              type="text"
              id="propertyId"
              className={`form-control ${styles.formInputEnhanced}`}
              placeholder={t('propertyIdPlaceholder')}
              value={searchParams.propertyId || ""}
              onChange={(e) => handleChange("propertyId", e.target.value)}
            />
          </div>
   
        </div>
        
                {/* Syria Cities and Property ID Row */}
        <div className={`group-input mb-30 ${styles.formRowFlex}`}>
          <div className={`box-input ${styles.formRowItem}`}>
            <label className={`mb-2 ${styles.formLabel}`} htmlFor="syriaCitiesSelect">
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
          <div className={`box-input ${styles.formRowItem} ${styles.propertyTypeColumn}`}>
            <label className={`mb-2 ${styles.formLabel}`} htmlFor="propertyTypeSelect">
              {t('propertyType')}
            </label>
            <DropdownSelect
              id="propertyTypeSelect"
              options={getPropertyTypeOptions}
              addtionalParentClass=""
              selectedValue={
                searchParams.propertyType 
                  ? getPropertyTypeOptions.find((opt, idx) => idx > 0 && propertyTypesList[idx - 1] === searchParams.propertyType) || t('All')
                  : t('All')
              }
              onChange={handlePropertyTypeChange}
            />
          </div>
        </div>
      
      {/* Cities Dropdown for style-3 */}
      {parentClass.includes('style-3') && (
        <div className="group-input mb-30">
          <div className="box-input">
            <label className={`mb-2 ${styles.formLabel}`} htmlFor="citiesSelectStyle3">
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
            options={['studio', "1", "2", "3", "4", "5", "6"]}
            addtionalParentClass=""
            value={searchParams.bedrooms || ""}
            onChange={(value) => handleChange("bedrooms", value)}
          />
        </div>

        <div className="box-select">
          <DropdownTagSelect
            id="bathsSelect"
            label={t('baths')}
            options={["1", "2", "3", "4", "5","6"]}
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
    options={[t('any'), t('furnished'), t('unfurnished')]}
    addtionalParentClass=""
    value={
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
      )}

      <div className="group-price mb-30">
        <div className="widget-price">
          <label className="mb-2 title-price" htmlFor="priceRange">
            {t('priceRange')}
          </label>
          <div className="box-title-price">
            <div className={styles.rangeInputs}>
              <div className={styles.rangeInputGroup}>
                <span className={styles.inputLabel}>{t('from')}</span>
                <input
                  id="priceMin"
                  type="number"
                  className={styles.rangeInput}
                  placeholder={t('minPrice')}
                  value={searchParams.priceMin ?? ""}
                  onChange={(e) => handleNumericInputChange("priceMin", e.target.value)}
                />
              </div>
              <div className={styles.rangeInputGroup}>
                <span className={styles.inputLabel}>{t('to')}</span>
                <input
                  id="priceMax"
                  type="number"
                  className={styles.rangeInput}
                  placeholder={t('maxPrice')}
                  value={searchParams.priceMax ?? ""}
                  onChange={(e) => handleNumericInputChange("priceMax", e.target.value)}
                />
              </div>
              <button
                type="button"
                className={styles.rangeReset}
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
            <div className={styles.rangeInputs}>
              <div className={styles.rangeInputGroup}>
                <span className={styles.inputLabel}>{t('from')}</span>
                <input
                  id="sizeMin"
                  type="number"
                  className={styles.rangeInput}
                  placeholder={t('minSize')}
                  value={searchParams.sizeMin ?? ""}
                  onChange={(e) => handleNumericInputChange("sizeMin", e.target.value)}
                />
              </div>
              <div className={styles.rangeInputGroup}>
                <span className={styles.inputLabel}>{t('to')}</span>
                <input
                  id="sizeMax"
                  type="number"
                  className={styles.rangeInput}
                  placeholder={t('maxSize')}
                  value={searchParams.sizeMax ?? ""}
                  onChange={(e) => handleNumericInputChange("sizeMax", e.target.value)}
                />
              </div>
              <button
                type="button"
                className={styles.rangeReset}
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
