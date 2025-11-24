"use client";

import { NextIntlClientProvider } from 'next-intl';
import { usePathname } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { useEffect, useState, useMemo } from 'react';
// Preload default messages synchronously
import defaultMessages from '@/messages/en.json';

export default function IntlProvider({ children, serverMessages = null, serverLocale = null }) {
  const pathname = usePathname();
  
  // Use server-provided messages if available (from [locale] routes), otherwise use client-side detection
  const [messages, setMessages] = useState(serverMessages || defaultMessages);
  const [locale, setLocale] = useState(serverLocale || routing.defaultLocale);

  useEffect(() => {
    // If server provided messages/locale, use them (for [locale] routes)
    if (serverMessages && serverLocale) {
      setMessages(serverMessages);
      setLocale(serverLocale);
      return;
    }

    // Otherwise, detect from pathname (for routes outside [locale])
    const pathSegments = pathname.split('/').filter(Boolean);
    const detectedLocale = pathSegments[0] && routing.locales.includes(pathSegments[0])
      ? pathSegments[0]
      : routing.defaultLocale;
    
    setLocale(detectedLocale);

    // Only load messages if locale is different from default
    if (detectedLocale !== routing.defaultLocale) {
      import(`@/messages/${detectedLocale}.json`)
        .then((module) => {
          setMessages(module.default);
        })
        .catch((error) => {
          // Silently fallback to default locale
          // Keep default messages on error
        });
    } else {
      // Ensure default messages are set
      setMessages(defaultMessages);
    }
  }, [pathname, serverMessages, serverLocale]);

  // Always render the provider with messages (default or loaded)
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

