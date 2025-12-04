"use client";

import { useEffect, useRef, useState } from "react";
const optionsDefault = ["Newest", "Oldest", "3 days"];
export default function DropdownSelect({
  onChange = (elm) => {},
  options = optionsDefault,
  defaultOption,
  selectedValue,
  addtionalParentClass = "",
  translateOption = null, // Optional translation function: (option) => translatedText
}) {
  const selectRef = useRef();
  const optionsRef = useRef();
  const [selected, setSelected] = useState(selectedValue || options[0]);
  const toggleDropdown = () => {
    selectRef.current.classList.toggle("open");
  };
  useEffect(() => {
    // Update selected state when selectedValue changes
    // Handle both defined values (including empty string) and undefined
    if (selectedValue !== undefined) {
      // If selectedValue is in options, use it; otherwise use default
      if (selectedValue === "" || options.includes(selectedValue)) {
        setSelected(selectedValue || options[0]);
      } else {
        setSelected(options[0]);
      }
    }
  }, [selectedValue, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!selectRef.current.contains(event.target)) {
        selectRef.current.classList.remove("open");
      }
    };

    // Add event listeners to each dropdown element

    // Add a global click event listener to detect outside clicks
    document.addEventListener("click", handleClickOutside);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Function to handle clicks outside the select or options
    const handleClickOutside = (event) => {
      if (
        selectRef.current &&
        selectRef.current.contains(event.target) &&
        optionsRef.current &&
        !optionsRef.current.contains(event.target)
      ) {
        // Close the options if clicked outside
        toggleDropdown();
      }
    };

    // Add event listener on mount
    document.addEventListener("click", handleClickOutside);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Helper function to get translated or original option
  const getDisplayText = (option) => {
    if (translateOption && typeof translateOption === 'function') {
      return translateOption(option) || option;
    }
    return option;
  };

  const currentDisplayValue = selectedValue || selected || defaultOption || options[0];

  return (
    <>
      <div className={`nice-select ${addtionalParentClass}`} ref={selectRef}>
        <span className="current">
          {getDisplayText(currentDisplayValue)}
        </span>
        <ul className="list" ref={optionsRef}>
          {options.map((elm, i) => (
            <li
              key={i}
              onClick={() => {
                setSelected(elm);
                onChange(elm);
                toggleDropdown();
              }}
              className={`option ${
                (selectedValue !== undefined && selectedValue == elm) || 
                (selectedValue === undefined && selected == elm)
                  ? "selected"
                  : ""
              }  text text-1`}
            >
              {getDisplayText(elm)}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
