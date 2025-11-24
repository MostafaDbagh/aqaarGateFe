# i18n Setup Guide for AqaarGate

## Overview
This project uses `next-intl` for internationalization (i18n) supporting English (en) and Arabic (ar).

## Current Setup

### 1. Configuration Files
- `i18n.js` - Main i18n configuration
- `i18n/routing.js` - Routing configuration for locales
- `middleware.js` - Middleware for locale detection and routing
- `messages/en.json` - English translations
- `messages/ar.json` - Arabic translations

### 2. App Structure
The app needs to be restructured to use `[locale]` routing:

```
app/
  [locale]/
    layout.jsx
    page.jsx
    (all other routes)
```

## Implementation Steps

### Step 1: Restructure App Directory
1. Create `app/[locale]` directory
2. Move all existing routes into `[locale]` folder
3. Update `app/layout.jsx` to be `app/[locale]/layout.jsx`

### Step 2: Update Components to Use Translations

#### Example: Register Modal

**Before:**
```jsx
<h2 className={styles.modalTitle}>Create Account</h2>
```

**After:**
```jsx
import { useTranslations } from 'next-intl';

const t = useTranslations('register');
<h2 className={styles.modalTitle}>{t('title')}</h2>
```

### Step 3: Language Switcher Component
Create a component to switch between languages:

```jsx
'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLanguage = (newLocale) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <div>
      <button onClick={() => switchLanguage('en')}>English</button>
      <button onClick={() => switchLanguage('ar')}>العربية</button>
    </div>
  );
}
```

## Translation File Structure

All translations are organized by feature:

```json
{
  "common": { ... },
  "register": { ... },
  "login": { ... },
  "hero": { ... },
  "navigation": { ... }
}
```

## Usage in Components

### Client Components
```jsx
'use client';
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('register');
  
  return <h1>{t('title')}</h1>;
}
```

### Server Components
```jsx
import { getTranslations } from 'next-intl/server';

export default async function MyComponent() {
  const t = await getTranslations('register');
  
  return <h1>{t('title')}</h1>;
}
```

## Next Steps

1. **Restructure app directory** - Move all routes to `[locale]` folder
2. **Update all components** - Replace static text with translations
3. **Add language switcher** - Allow users to change language
4. **Test both languages** - Ensure all text is translated

## Notes

- Arabic text requires RTL (right-to-left) support
- Some components may need layout adjustments for RTL
- All user-facing text should be in translation files
- API responses should be handled separately (backend i18n or client-side translation)

