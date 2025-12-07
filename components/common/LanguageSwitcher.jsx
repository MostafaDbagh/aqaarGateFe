"use client";
import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { routing } from '@/i18n/routing';
import { useAuthState } from '@/store/hooks/useAuth';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'ar', flag: '🇸🇾', name: 'العربية' }
  ];

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const switchLanguage = (newLocale) => {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }
    
    // Close dropdown immediately
    setIsOpen(false);
    
    // Store locale in sessionStorage for immediate access by axios interceptor
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('currentLocale', newLocale);
    }
    
    // Invalidate all queries to force refetch with new language
    queryClient.invalidateQueries();
    
    // Remove current locale from pathname
    const segments = pathname.split('/').filter(Boolean);
    
    // If first segment is a locale, remove it
    if (routing.locales.includes(segments[0])) {
      segments.shift();
    }
    
    // Add new locale and navigate
    const newPath = `/${newLocale}${segments.length > 0 ? '/' + segments.join('/') : ''}`;
    
    // Use window.location.href for immediate navigation and reload
    // This ensures the language changes from the first click
    if (typeof window !== 'undefined') {
      window.location.href = newPath;
    } else {
      // Fallback for SSR
      router.replace(newPath);
      router.refresh();
    }
  };

  return (
    <div className={styles.languageSwitcher} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.langButton}
        aria-label="Select language"
      >
        <span className={styles.flag}>{currentLanguage.flag}</span>
        <svg 
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          width="12" 
          height="12" 
          viewBox="0 0 12 12" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M3 4.5L6 7.5L9 4.5" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div 
            className={styles.overlay}
            onClick={() => setIsOpen(false)}
          />
          <div className={styles.dropdown}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`${styles.option} ${locale === lang.code ? styles.active : ''}`}
                onClick={() => switchLanguage(lang.code)}
              >
                <span className={styles.optionFlag}>{lang.flag}</span>
                <span className={styles.optionName}>{lang.name}</span>
                {locale === lang.code && (
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 14 14" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.checkIcon}
                  >
                    <path 
                      d="M11.6667 3.5L5.25 10.5L2.33334 7.58333" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

