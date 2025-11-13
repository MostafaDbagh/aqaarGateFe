// Syrian Provinces/States in alphabetical order
export const syrianProvinces = [
  "Aleppo",
  "As-Suwayda", 
  "Damascus",
  "Daraa",
  "Deir ez-Zur",
  "Hama",
  "Homs",
  "Idlib",
  "Latakia",
  "Raqqah",
  "Tartus"
];

// For dropdown options with "All" as default
export const provinceOptions = [
  "All",
  ...syrianProvinces
];

// For search form with proper state handling
export const getProvinceOptions = () => [
  "All",
  ...syrianProvinces
];
