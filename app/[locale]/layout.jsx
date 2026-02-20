import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { timeZone } from '@/i18n';
import IntlErrorHandlingProvider from '@/components/providers/IntlErrorHandlingProvider';
import ClientLayout from '../ClientLayout';
import Providers from '../Providers';
import StructuredData from '@/components/seo/StructuredData';
import KeywordOptimization from '@/components/seo/KeywordOptimization';
import AdvancedSEO from '@/components/seo/AdvancedSEO';
import PerformanceOptimization from '@/components/seo/PerformanceOptimization';
import InternationalSEO from '@/components/seo/InternationalSEO';
import BrandSEO from '@/components/seo/BrandSEO';
import { getDefaultOgImages, getDefaultOgImageUrls } from '@/lib/defaultOgImages';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    metadataBase: new URL(BASE_URL),
    openGraph: {
      images: getDefaultOgImages(BASE_URL, locale),
    },
    twitter: {
      card: 'summary_large_image',
      images: getDefaultOgImageUrls(BASE_URL, locale),
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  // Await params in Next.js 15
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Enable static rendering - must be called before getMessages or any next-intl API
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  // Explicitly pass locale to getMessages
  const messages = await getMessages({ locale });
  
    // Safety check: ensure messages are loaded
    if (!messages || Object.keys(messages).length === 0) {
      // Fallback to default locale messages
      try {
        const defaultMessages = await import(`@/messages/${routing.defaultLocale}.json`);
        const fallbackMessages = defaultMessages.default || {};
        return (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  if (typeof document !== 'undefined') {
                    document.documentElement.setAttribute('lang', '${routing.defaultLocale}');
                    document.documentElement.setAttribute('dir', 'ltr');
                  }
                `,
              }}
            />
            <NextIntlClientProvider locale={routing.defaultLocale} messages={fallbackMessages} timeZone={timeZone}>
              <Providers>
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  Error loading messages. Please refresh the page.
                </div>
              </Providers>
            </NextIntlClientProvider>
          </>
        );
      } catch (_error) {
        // If even default messages fail, return minimal layout
        return (
          <Providers>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              Error loading messages. Please refresh the page.
            </div>
          </Providers>
        );
      }
    }

  // For next-intl with localePrefix: 'always', we need to set lang/dir on the html element
  // But we can't have nested <html> tags, so we use a script to update the root <html>
  return (
    <>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/images/logo/logo-16x16.png" type="image/png" sizes="16x16" />
      <link rel="icon" href="/images/logo/Logo-32x32.png" type="image/png" sizes="32x32" />
      <link rel="apple-touch-icon" href="/images/logo/Apple-Touch-Icon.png" />
      <style dangerouslySetInnerHTML={{
        __html: `
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none !important;
            margin: 0 !important;
            opacity: 0 !important;
            pointer-events: none !important;
            display: none !important;
            visibility: hidden !important;
            width: 0 !important;
            height: 0 !important;
          }
          input[type="number"] {
            -moz-appearance: textfield !important;
          }
        `
      }} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof document !== 'undefined') {
              document.documentElement.setAttribute('lang', '${locale}');
              document.documentElement.setAttribute('dir', '${locale === 'ar' ? 'rtl' : 'ltr'}');
            }
          `,
        }}
      />
      <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
        <IntlErrorHandlingProvider locale={locale} messages={messages}>
        <Providers>
          <StructuredData />
          <KeywordOptimization />
          <AdvancedSEO />
          <PerformanceOptimization />
          <InternationalSEO />
          <BrandSEO />
          <ClientLayout>{children}</ClientLayout>
        </Providers>
        </IntlErrorHandlingProvider>
      </NextIntlClientProvider>
    </>
  );
}

