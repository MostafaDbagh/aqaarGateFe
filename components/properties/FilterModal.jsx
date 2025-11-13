"use client";
import React from "react";
import DropdownSelect from "../common/DropdownSelect";
import DropdownTagSelect from "../common/DropdownTagSelect";
import { amenitiesList } from "@/constants/amenities";

export default function FilterModal({ onSearchChange, searchParams = {} }) {
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
      `}</style>
      <div className="modal modal-filter fade" id="modalFilter">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="wd-search-form style-3">
            <div className="title-box">
              <h4>Advanced Search</h4>
              <span
                className="close-modal icon-close"
                data-bs-dismiss="modal"
              />
            </div>
            <div className="group-input mb-30">
              <div className="box-input">
                <label className="mb-2" htmlFor="propertyId">
                  Property ID
                </label>
                <input
                  type="text"
                  id="propertyId"
                  className="form-control property-id-input"
                  placeholder="Enter Property ID"
                  value={searchParams.propertyId || ""}
                  onChange={(e) => handleChange("propertyId", e.target.value)}
                />
              </div>
            </div>
            
            {/* Property Type - First Input */}
            <div className="group-input mb-30">
              <div className="box-input">
                <label className="mb-2" htmlFor="propertyTypeSelect">
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

                        {/* Syria Cities Dropdown */}
    

            {/* Property ID Input Field */}
      
            <div className="group-input mb-30">
              <div className="box-input">
                <label className="mb-2" htmlFor="citiesSelect">
                   Cities
                </label>
                <div className="city-dropdown">
                  <DropdownSelect
                    id="citiesSelect"
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
            </div>
            <div className="group-input mb-30">
              <div className="box-input">
                <label className="mb-2" htmlFor="modalFurnishedSelect">
                  Furnishing
                </label>
                <DropdownSelect
                  id="modalFurnishedSelect"
                  options={["Any", "Furnished", "Unfurnished"]}
                  addtionalParentClass=""
                  selectedValue={
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
                  label="Baths"
                  options={["Any", "1", "2", "3", "4", "5", "6"]}
                  addtionalParentClass=""
                  value={searchParams.bathrooms || ""}
                  onChange={(value) => handleChange("bathrooms", value)}
                />
              </div>
              
              <div className="box-select">
                <DropdownTagSelect
                  id="bedsSelect"
                  label="Rooms"
                  options={["Any", 'studio', "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
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
                  <span className="title-price">Price</span>
                  <div className="range-inputs">
                    <div className="range-input-group">
                      <span className="input-label">From</span>
                      <input
                        id="filterPriceMin"
                        type="number"
                        className="range-input"
                        placeholder="Min price"
                        value={searchParams.priceMin ?? ''}
                        onChange={(e) => handleNumericInputChange('priceMin', e.target.value)}
                      />
                    </div>
                    <div className="range-input-group">
                      <span className="input-label">To</span>
                      <input
                        id="filterPriceMax"
                        type="number"
                        className="range-input"
                        placeholder="Max price"
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
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="group-input mb-30">
              <div className="widget-price full-width">
                <div className="box-title-price">
                  <span className="title-price">Size (sqft)</span>
                  <div className="range-inputs">
                    <div className="range-input-group">
                      <span className="input-label">From</span>
                      <input
                        id="filterSizeMin"
                        type="number"
                        className="range-input"
                        placeholder="Min size"
                        value={searchParams.sizeMin ?? ''}
                        onChange={(e) => handleNumericInputChange('sizeMin', e.target.value)}
                      />
                    </div>
                    <div className="range-input-group">
                      <span className="input-label">To</span>
                      <input
                        id="filterSizeMax"
                        type="number"
                        className="range-input"
                        placeholder="Max size"
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
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
      
            <div className="group-checkbox">
              <div className="title text-4 fw-6">Amenities:</div>
              <div className="group-amenities">
                {amenitiesList.map((amenity, index) => (
                  <fieldset key={amenity} className={`checkbox-item style-1 ${index > 0 ? 'mt-12' : ''}`}>
                    <label>
                      <span className="text-4">{amenity}</span>
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
