import { getRequestConfig } from 'next-intl/server';
import { routing } from './i18n/routing';

// Global timeZone configuration
export const timeZone = 'UTC';

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
    // Load agent-specific translations
    let agentMessages = {};
    try {
      agentMessages = (await import(`./messages/agent.${locale}.json`)).default;
    } catch (agentError) {
      // If agent translations don't exist for this locale, try default locale
      try {
        agentMessages = (await import(`./messages/agent.${routing.defaultLocale}.json`)).default;
      } catch (defaultAgentError) {
        // Agent translations not available, continue without them
      }
    }
    
    // Merge agent translations into main messages
    const mergedMessages = {
      ...messages,
      agent: agentMessages
    };
    
    return {
      locale,
      messages: mergedMessages,
      timeZone: timeZone
    };
  } catch (error) {
    // Fallback to default locale messages if import fails
    const defaultMessages = (await import(`./messages/${routing.defaultLocale}.json`)).default;
    let defaultAgentMessages = {};
    try {
      defaultAgentMessages = (await import(`./messages/agent.${routing.defaultLocale}.json`)).default;
    } catch (agentError) {
      // Agent translations not available
    }
    
    const mergedDefaultMessages = {
      ...defaultMessages,
      agent: defaultAgentMessages
    };
    
    return {
      locale: routing.defaultLocale,
      messages: mergedDefaultMessages,
      timeZone: timeZone
    };
  }
});

