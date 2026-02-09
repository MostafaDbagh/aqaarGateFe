// Centralized amenities data source
export const amenitiesList = [
  "Solar energy system",
  "Star link internet",
  "Fiber internet",
  "Basic internet",
  "Parking",
  "Lift",
  "A/C",
  "Gym",
  "Security cameras",
  "Reception (nator)",
  "Balcony",
  "Swimming pool",
  "Fire alarms"
];

// Map amenity display value to translation key (for amenities.*)
export const amenityToTranslationKey = {
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
  "Fire alarms": "fireAlarms"
};

// Export as default as well for convenience
export default amenitiesList;
