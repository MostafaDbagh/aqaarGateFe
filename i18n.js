import { getRequestConfig } from 'next-intl/server';
import { routing } from './i18n/routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale;
  
  try {
    locale = await requestLocale;
  } catch (error) {
    // Fallback to default locale if requestLocale fails
    locale = routing.defaultLocale;
  }

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  try {
    const messages = (await import(`./messages/${locale}.json`)).default;
    return {
      locale,
      messages,
      timeZone: 'UTC'
    };
  } catch (error) {
    // Fallback to default locale messages if import fails
    const defaultMessages = (await import(`./messages/${routing.defaultLocale}.json`)).default;
    return {
      locale: routing.defaultLocale,
      messages: defaultMessages,
      timeZone: 'UTC'
    };
  }
});

