"use client";

import React, { useState } from "react";

export default function DropdownTagSelect({
  id,
  options = [],
  value = "",
  onChange,
  label = "",
  addtionalParentClass = "",
  placeholder = "Select option"
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option) => {
    onChange(option === "Any" ? "" : option);
    setIsOpen(false);
  };

  const displayValue = value || "Any";

  return (
    <div className={`dropdown-tag-select ${addtionalParentClass}`}>
      {label && (
        <label className="mb-2 dropdown-label" htmlFor={id}>
          {label}
        </label>
      )}
      
      <div className="tag-select-container">
        {/* Selected Value Display */}
        <div 
          className="selected-value-display"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{displayValue}</span>
          <i className={`icon-arrow-down arrow-icon ${isOpen ? 'open' : ''}`} />
        </div>

        {/* Options Grid */}
        {isOpen && (
          <div className="options-grid">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                className={`tag-option ${value === option ? 'selected' : ''}`}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .dropdown-label {
          font-size: 14px !important;
          font-weight: 600 !important;
          color: #5c5E61 !important;
          display: block !important;
        }
        
        .selected-value-display {
          padding: 12px 16px !important;
          border: 2px solid #e8e8e8 !important;
          border-radius: 12px !important;
          background-color: #fff !important;
          cursor: pointer !important;
          font-size: 14px !important;
          color: #333 !important;
          font-weight: 500 !important;
          transition: all 0.3s ease !important;
          min-height: 48px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
        }
        
        .arrow-icon {
          transition: transform 0.3s ease !important;
          width: 12px !important;
          height: 19px !important;
          display: block !important;
          font-size: 12px !important;
          color: #333 !important;
        }
        
        .arrow-icon.open {
          transform: rotate(180deg) !important;
        }
        
        .dropdown-tag-select {
          position: relative;
          width: 100%;
        }
        
        .tag-select-container {
          position: relative;
          width: 100%;
        }
        
        .options-grid {
          position: absolute !important;
          top: 100% !important;
          left: 0 !important;
          right: 0 !important;
          background-color: #fff !important;
          border: 1px solid #e8e8e8 !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
          z-index: 1000 !important;
          margin-top: 4px !important;
          padding: 16px !important;
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(60px, 1fr)) !important;
          gap: 8px !important;
          max-height: 200px !important;
          overflow-y: auto !important;
        }
        
        .tag-option {
          padding: 8px !important;
          border: 2px solid #e8e8e8 !important;
          border-radius: 24px !important;
          background-color: #f8f9fa !important;
          color: #333 !important;
          font-size: 13px !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          text-align: center !important;
        }
        
        .tag-option.selected {
          background-color: #f1913d !important;
          color: #fff !important;
          border-color: #f1913d !important;
        }
        
        .tag-option:hover:not(.selected) {
          background-color: #f1913d !important;
          color: #fff !important;
          border-color: #f1913d !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3) !important;
        }
        
        .options-grid::-webkit-scrollbar {
          width: 6px;
        }
        
        .options-grid::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .options-grid::-webkit-scrollbar-thumb {
          background: #f1913d;
          border-radius: 3px;
        }
        
        .options-grid::-webkit-scrollbar-thumb:hover {
          background: #e07a2e;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .options-grid {
            grid-template-columns: repeat(auto-fit, minmax(50px, 1fr)) !important;
            gap: 6px !important;
            padding: 12px !important;
          }
          
          .tag-option {
            padding: 6px 8px !important;
            font-size: 12px !important;
            min-width: 40px !important;
          }
        }
        
        @media (max-width: 480px) {
          .options-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
