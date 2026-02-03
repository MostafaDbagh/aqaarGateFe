"use client";

import { NextIntlClientProvider } from "next-intl";

/**
 * Client-side provider for next-intl error handling.
 * getMessageFallback is not inherited from server config, so we provide it here.
 * When a translation key is missing, show a readable fallback instead of "namespace.key".
 * Locale and messages are passed from the parent layout to avoid inference issues.
 */
function getMessageFallback({ namespace, key }) {
  const path = [namespace, key].filter((part) => part != null).join(".");
  // Return the key part in readable format (e.g., "futureBuyer" -> "Future Buyer")
  const readableKey = (key || "")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
  return readableKey || path;
}

export default function IntlErrorHandlingProvider({ children, locale, messages }) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      getMessageFallback={getMessageFallback}
    >
      {children}
    </NextIntlClientProvider>
  );
}
