"use client";

import { useEffect, useRef } from "react";
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
  const searchFormRef = useRef();

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
          position: absolute;
          right: 18px;
          top: 18px;
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
      `}</style>
      <div className={parentClass} ref={searchFormRef}>
        <div className="search-form-header mb-32">
          <h4 className="advanced-search-title">Advanced Search</h4>
        </div>
        
        {/* Property Type - First Input */}
        <div className="group-input mb-30 col-4">
        <div className="box-input form-row-item">
            <label className="mb-2 form-label" htmlFor="propertyId">
              Property ID
            </label>
            <input
              type="text"
              id="propertyId"
              className="form-control form-input-enhanced"
              placeholder="Enter Property ID"
              value={searchParams.propertyId || ""}
              onChange={(e) => handleChange("propertyId", e.target.value)}
            />
          </div>
   
        </div>
        
                {/* Syria Cities and Property ID Row */}
        <div className="group-input mb-30 form-row-flex">
          <div className="box-input form-row-item">
            <label className="mb-2 form-label" htmlFor="syriaCitiesSelect">
               City
            </label>
            <div className="city-dropdown">
              <DropdownSelect
                id="syriaCitiesSelect"
                options={[
                  "All Cities",
                  "Latakia",
                  "Damascus",
                  "Aleppo",
                  "Homs",
                  "Hama",
                  "Idlib",
                  "Deir ez-Zor",
                  "Daraa",
                  "Tartous"
                ]}
                addtionalParentClass=""
                selectedValue={searchParams.cities || "All Cities"}
                onChange={(value) => handleChange("cities", value === "All Cities" ? "" : value)}
              />
            </div>
          </div>
          <div className="box-input form-row-item" style={{ maxWidth: '50%', flex: '0 0 50%' }}>
            <label className="mb-2 form-label" htmlFor="propertyTypeSelect">
              Property Type
            </label>
            <DropdownSelect
              id="propertyTypeSelect"
              options={["Any", "Apartment", "Commercial", "Land", "Holiday Home", "Villa/farms", "Office"]}
              addtionalParentClass=""
              selectedValue={searchParams.propertyType || "Any"}
              onChange={(value) => handleChange("propertyType", value === "Any" ? "" : value)}
            />
          </div>
        </div>
      
      {/* Cities Dropdown for style-3 */}
      {parentClass.includes('style-3') && (
        <div className="group-input mb-30">
          <div className="box-input">
            <label className="mb-2 form-label" htmlFor="citiesSelectStyle3">
              Cities
            </label>
            <div className="city-dropdown">
              <DropdownSelect
                options={[
                  "All Cities",
                  "Latakia",
                  "Damascus",
                  "Aleppo",
                  "Homs",
                  "Hama",
                  "Idlib",
                  "Deir ez-Zor",
                  "Daraa",
                  "Tartous",
                ]}
                addtionalParentClass=""
                selectedValue={searchParams.state || "All Cities"}
                onChange={(value) => handleChange("state", value === "All Cities" ? "" : value)}
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
            label="Rooms"
            options={["Any", 'studio', "1", "2", "3", "4", "5", "6"]}
            addtionalParentClass=""
            value={searchParams.bedrooms || ""}
            onChange={(value) => handleChange("bedrooms", value)}
          />
        </div>

        <div className="box-select">
          <DropdownTagSelect
            id="bathsSelect"
            label="Baths"
            options={["Any", "1", "2", "3", "4", "5"]}
            addtionalParentClass=""
            value={searchParams.bathrooms || ""}
            onChange={(value) => handleChange("bathrooms", value)}
          />
        </div>

        <div className="box-select">
  <label className="mb-2" htmlFor="furnishedSelect">
    Furnishing
  </label>
  <DropdownSelect
    id="furnishedSelect"
    options={["Any", "Furnished", "Unfurnished"]}
    addtionalParentClass=""
    value={
      searchParams.furnished === true
        ? "Furnished"
        : searchParams.furnished === false
        ? "Unfurnished"
        : "Any"
    }
    onChange={(value) => {
      let furnishedValue;
      if (value === "Furnished") furnishedValue = true;
      else if (value === "Unfurnished") furnishedValue = false;
      else furnishedValue = undefined; // "Any" clears the filter
      handleChange("furnished", furnishedValue);
    }}
  />
</div>
        </div>
      )}

      <div className="group-price mb-30">
        <div className="widget-price">
          <label className="mb-2 title-price" htmlFor="priceRange">
            Price range 
          </label>
          <div className="box-title-price">
            <div className="range-inputs">
              <div className="range-input-group">
                <span className="input-label">From</span>
                <input
                  id="priceMin"
                  type="number"
                  className="range-input"
                  placeholder="Min price"
                  value={searchParams.priceMin ?? ""}
                  onChange={(e) => handleNumericInputChange("priceMin", e.target.value)}
                />
              </div>
              <div className="range-input-group">
                <span className="input-label">To</span>
                <input
                  id="priceMax"
                  type="number"
                  className="range-input"
                  placeholder="Max price"
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
                Reset
              </button>
            </div>
          </div>
        </div>
        <div className="widget-price">
          <label className="mb-2 title-price" htmlFor="sizeRange">
            Size range
          </label>
          <div className="box-title-price">
            <div className="range-inputs">
              <div className="range-input-group">
                <span className="input-label">From</span>
                <input
                  id="sizeMin"
                  type="number"
                  className="range-input"
                  placeholder="Min size (sqft)"
                  value={searchParams.sizeMin ?? ""}
                  onChange={(e) => handleNumericInputChange("sizeMin", e.target.value)}
                />
              </div>
              <div className="range-input-group">
                <span className="input-label">To</span>
                <input
                  id="sizeMax"
                  type="number"
                  className="range-input"
                  placeholder="Max size (sqft)"
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
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="group-checkbox">
        <div className="title text-4 fw-6 mb-2">Amenities:</div>
        <div className="group-amenities">
          {amenitiesList.map((amenity, idx) => (
            <fieldset
              className={`checkbox-item style-1${idx > 0 ? " mt-12" : ""}`}
              key={amenity + idx}
            >
              <label>
                <span className="text-4">{amenity}</span>
                <input
                  type="checkbox"
                  checked={searchParams.amenities?.includes(amenity) || false}
                  onChange={() => handleAmenityChange(amenity)}
                />
                <span className="btn-checkbox" />
              </label>
            </fieldset>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
