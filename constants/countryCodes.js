/**
 * Country Codes with Flags
 * Used for phone number inputs with country code selection
 */

export const countryCodes = [
  { code: "+963", flag: "🇸🇾", country: "Syria" },
  { code: "+1", flag: "🇺🇸", country: "USA" },
  { code: "+44", flag: "🇬🇧", country: "UK" },
  { code: "+49", flag: "🇩🇪", country: "Germany" },
  { code: "+33", flag: "🇫🇷", country: "France" },
  { code: "+39", flag: "🇮🇹", country: "Italy" },
  { code: "+34", flag: "🇪🇸", country: "Spain" },
  { code: "+31", flag: "🇳🇱", country: "Netherlands" },
  { code: "+971", flag: "🇦🇪", country: "UAE" },
  { code: "+966", flag: "🇸🇦", country: "Saudi Arabia" },
  { code: "+965", flag: "🇰🇼", country: "Kuwait" },
  { code: "+974", flag: "🇶🇦", country: "Qatar" },
  { code: "+961", flag: "🇱🇧", country: "Lebanon" },
  { code: "+962", flag: "🇯🇴", country: "Jordan" },
  { code: "+20", flag: "🇪🇬", country: "Egypt" },
  { code: "+90", flag: "🇹🇷", country: "Turkey" },
  { code: "+212", flag: "🇲🇦", country: "Morocco" },
  { code: "+213", flag: "🇩🇿", country: "Algeria" },
  { code: "+216", flag: "🇹🇳", country: "Tunisia" },
  { code: "+961", flag: "🇱🇧", country: "Lebanon" },
  { code: "+7", flag: "🇷🇺", country: "Russia" },
  { code: "+86", flag: "🇨🇳", country: "China" },
  { code: "+81", flag: "🇯🇵", country: "Japan" },
  { code: "+82", flag: "🇰🇷", country: "South Korea" },
  { code: "+91", flag: "🇮🇳", country: "India" },
  { code: "+61", flag: "🇦🇺", country: "Australia" },
  { code: "+64", flag: "🇳🇿", country: "New Zealand" },
  { code: "+27", flag: "🇿🇦", country: "South Africa" },
  { code: "+55", flag: "🇧🇷", country: "Brazil" },
  { code: "+52", flag: "🇲🇽", country: "Mexico" },
  { code: "+1", flag: "🇨🇦", country: "Canada" },
];

// Default country code (Syria)
export const DEFAULT_COUNTRY_CODE = "+963";

// Helper function to find country code by code string
export const findCountryByCode = (code) => {
  return countryCodes.find(country => country.code === code);
};

// Helper function to extract country code from phone number
export const extractCountryCode = (phoneNumber) => {
  if (!phoneNumber) return null;
  
  // Sort by code length (longest first) to match longer codes first
  const sortedCodes = [...countryCodes].sort((a, b) => b.code.length - a.code.length);
  
  for (const country of sortedCodes) {
    if (phoneNumber.startsWith(country.code)) {
      return {
        countryCode: country.code,
        phoneNumber: phoneNumber.replace(country.code, "").trim()
      };
    }
  }
  
  return null;
};

