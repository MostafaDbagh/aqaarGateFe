"use client";
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useMemo } from 'react';

/**
 * Safe translation hook that works even when NextIntlClientProvider is not available
 * Falls back to dynamically loaded messages if provider is not found
 */
export function useSafeTranslations(namespace) {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const [fallbackMessages, setFallbackMessages] = useState(null);
  const [hasProvider, setHasProvider] = useState(true);
  
  // Always call useTranslations (hooks must be called unconditionally)
  // We'll catch the error in a useEffect
  let translationsHook;
  try {
    translationsHook = useTranslations(namespace);
  } catch (error) {
    // This will be caught, but we need to handle it differently
    // Hooks can't be in try-catch, so we'll use a different approach
  }
  
  // Check if provider is available by checking if hook is a function
  useEffect(() => {
    // Check if we can actually use the translations
    if (translationsHook && typeof translationsHook === 'function') {
      setHasProvider(true);
    } else {
      setHasProvider(false);
    }
  }, [translationsHook]);
  
  // Load fallback messages if provider is not available
  useEffect(() => {
    if (!hasProvider && !fallbackMessages) {
      const loadMessages = async () => {
        try {
          const messages = await import(`@/messages/${locale}.json`);
          setFallbackMessages(messages.default?.[namespace] || {});
        } catch (error) {
          // Fallback to English if locale messages not found
          try {
            const defaultMessages = await import(`@/messages/en.json`);
            setFallbackMessages(defaultMessages.default?.[namespace] || {});
          } catch (e) {
            setFallbackMessages({});
          }
        }
      };
      loadMessages();
    }
  }, [hasProvider, locale, namespace, fallbackMessages]);
  
  // Return translation function
  return useMemo(() => {
    if (hasProvider && translationsHook) {
      return translationsHook;
    }
    
    // Fallback function
    return (key) => {
      if (!fallbackMessages) {
        return key; // Return key while loading
      }
      // Support nested keys like 'errors.emailInvalid'
      const keys = key.split('.');
      let value = fallbackMessages;
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }
      return value !== undefined ? value : key;
    };
  }, [hasProvider, translationsHook, fallbackMessages]);
}

