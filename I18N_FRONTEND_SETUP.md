# Frontend i18n Integration Guide

## Overview
The frontend has been updated to automatically send the `Accept-Language` header to the backend API based on the current locale.

## What Was Changed

### 1. Axios Interceptor Updated
**File:** `axios/index.js`

The axios interceptor now automatically:
- Detects the current locale from the URL pathname (`/en/` or `/ar/`)
- Adds `Accept-Language` header to all API requests
- Defaults to `en` if locale cannot be determined

### How It Works

```javascript
// Automatically extracts locale from URL
// /en/listing → Accept-Language: en
// /ar/listing → Accept-Language: ar
```

## Testing Locally

### 1. Start Backend Server
```bash
cd api
npm run dev
# Server should run on http://localhost:5500
```

### 2. Start Frontend Server
```bash
cd aqaarGate-FE
npm run dev
# Frontend should run on http://localhost:3000
```

### 3. Test with Browser DevTools

1. **Open Browser DevTools** (F12)
2. **Go to Network tab**
3. **Navigate to:**
   - English: `http://localhost:3000/en/property-list`
   - Arabic: `http://localhost:3000/ar/property-list`

4. **Check API Requests:**
   - Look for requests to `/api/listing/search`
   - Check the **Request Headers**
   - Verify `Accept-Language: en` or `Accept-Language: ar`

5. **Check API Responses:**
   - Open a request
   - Go to **Response** tab
   - Verify translated values:
     - English: `"propertyType": "Apartment"`
     - Arabic: `"propertyType": "شقة"`

## Expected Behavior

### English Page (`/en/...`)
- API requests include: `Accept-Language: en`
- Responses show English values:
  - `propertyType: "Apartment"`
  - `status: "For Sale"`
  - `city: "Damascus"`

### Arabic Page (`/ar/...`)
- API requests include: `Accept-Language: ar`
- Responses show Arabic values:
  - `propertyType: "شقة"`
  - `status: "للبيع"`
  - `city: "دمشق"`
- Original values preserved:
  - `propertyTypeOriginal: "Apartment"`
  - `statusOriginal: "sale"`
  - `cityOriginal: "Damascus"`

## Components That Will Show Translated Data

All components that display API data will automatically show translated values:

1. **Property Listings** (`/property-list`)
   - Property types, status, cities will be translated

2. **Property Details** (`/property-detail/:id`)
   - All listing fields will be translated

3. **Agents Page** (`/agents`)
   - Agent locations will be translated

4. **Agent Details** (`/agents-details/:id`)
   - Agent location will be translated

5. **Cities Section** (Home page)
   - City names will be translated

6. **Categories Section** (Home page)
   - Category names will be translated

## Important Notes

### Filtering
- **Backend filtering works correctly** - The backend filters data BEFORE translation, so filtering by `propertyType`, `status`, `city` works as expected
- **Frontend filtering** - If you do any client-side filtering, use the original values:
  ```javascript
  import { getOriginalValue } from '@/utils/translatedData';
  
  const originalType = getOriginalValue(listing, 'propertyType');
  // Use originalType for filtering
  ```

### Display
- **Display translated values directly** - The API returns translated values ready for display
- No need to translate on the frontend - backend handles all translation

## Debugging

### Check if Translation is Working

1. **Open Browser Console**
2. **Navigate to a page with listings**
3. **Check Network tab for API calls**
4. **Verify headers:**
   ```javascript
   // In Network tab, check Request Headers
   Accept-Language: ar  // or en
   ```

5. **Check response:**
   ```json
   {
     "propertyType": "شقة",  // Should be translated
     "propertyTypeOriginal": "Apartment",  // Original preserved
     "city": "دمشق",  // Should be translated
     "cityOriginal": "Damascus"  // Original preserved
   }
   ```

### Common Issues

**Issue:** API returns English even on Arabic page
- **Check:** Network tab → Request Headers → `Accept-Language` should be `ar`
- **Fix:** Verify URL has `/ar/` prefix

**Issue:** No translation in response
- **Check:** Backend server is running and i18n is configured
- **Check:** Translation files exist in `api/locales/ar/translation.json`

**Issue:** Filtering not working
- **Check:** Backend filters use original values (happens before translation)
- **Note:** Frontend should send original values in query params if doing client-side filtering

## Testing Checklist

- [ ] Start backend server (`npm run dev` in `api/`)
- [ ] Start frontend server (`npm run dev` in `aqaarGate-FE/`)
- [ ] Navigate to `/en/property-list` and check Network tab
- [ ] Verify `Accept-Language: en` in request headers
- [ ] Verify English values in response
- [ ] Navigate to `/ar/property-list` and check Network tab
- [ ] Verify `Accept-Language: ar` in request headers
- [ ] Verify Arabic values in response
- [ ] Check that original values are preserved (`propertyTypeOriginal`, etc.)
- [ ] Test filtering - should work correctly
- [ ] Test search - should work correctly
- [ ] Test property details page - should show translated data
- [ ] Test agents page - should show translated locations
- [ ] Test cities section - should show translated city names
- [ ] Test categories section - should show translated category names








