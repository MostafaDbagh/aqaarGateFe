"use client";

import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';

/**
 * Load translations from JSON files - works without NextIntlClientProvider.
 * Use for components that may render outside the intl provider (e.g. modals).
 */
export function useFileTranslations(namespace) {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const mod = await import(`@/messages/${locale}.json`);
        const msgs = mod.default?.[namespace];
        if (!cancelled) setMessages(msgs || {});
      } catch {
        try {
          const mod = await import(`@/messages/en.json`);
          const msgs = mod.default?.[namespace];
          if (!cancelled) setMessages(msgs || {});
        } catch {
          if (!cancelled) setMessages({});
        }
      }
    };
    load();
    return () => { cancelled = true; };
  }, [locale, namespace]);

  return useMemo(() => {
    return (key) => {
      if (!messages) return key;
      const keys = key.split('.');
      let value = messages;
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) return key;
      }
      return value;
    };
  }, [messages]);
}
