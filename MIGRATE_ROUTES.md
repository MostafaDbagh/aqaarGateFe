# Route Migration Guide for i18n

## Overview
All routes need to be moved from `app/` to `app/[locale]/` to support internationalization.

## Migration Steps

### Option 1: Manual Migration (Recommended for testing)

1. **Move route folders:**
   ```bash
   # Example: Move contact page
   mv app/contact app/[locale]/contact
   
   # Move all route groups
   mv app/\(admin\) app/[locale]/\(admin\)
   mv app/\(agents\) app/[locale]/\(agents\)
   mv app/\(blogs\) app/[locale]/\(blogs\)
   mv app/\(dashboard\) app/[locale]/\(dashboard\)
   mv app/\(otherPages\) app/[locale]/\(otherPages\)
   mv app/\(properties\) app/[locale]/\(properties\)
   mv app/\(property-details\) app/[locale]/\(property-details\)
   mv app/admin app/[locale]/admin
   ```

2. **Update all Link components:**
   - Replace `href="/path"` with `href={`/${locale}/path`}`
   - Or use the `Link` from `@/i18n/routing` which handles locales automatically

3. **Update router.push calls:**
   - Use `useRouter` from `@/i18n/routing` instead of `next/navigation`
   - It automatically includes the locale

### Option 2: Automated Script

Run this script to move routes (backup first!):

```bash
cd aqaarGate-FE/app

# Create backup
cp -r . ../app_backup

# Move routes
for dir in contact admin \(admin\) \(agents\) \(blogs\) \(dashboard\) \(otherPages\) \(properties\) \(property-details\); do
  if [ -d "$dir" ]; then
    mv "$dir" "[locale]/$dir"
  fi
done
```

## Important Notes

1. **Keep in app/ (not in [locale]):**
   - `layout.jsx` (root)
   - `not-found.jsx`
   - `robots.js`
   - `sitemap.js`
   - `favicon.ico`
   - `ClientLayout.jsx`
   - `HomePageClient.jsx`

2. **Update imports:**
   - Components using `next/navigation` should use `@/i18n/routing` for navigation
   - All `Link` components should use `Link` from `@/i18n/routing`

3. **Test after migration:**
   - Visit `/en` and `/ar` routes
   - Verify language switching works
   - Check all links navigate correctly

## Current Status

✅ **Completed:**
- [locale] folder structure created
- [locale]/layout.jsx configured
- [locale]/page.jsx created
- Register modal uses translations
- Hero component uses translations
- LanguageSwitcher component created

⏳ **Pending:**
- Move all routes to [locale] folder
- Update Navigation components
- Add LanguageSwitcher to header
- Update all Link components to use i18n routing

