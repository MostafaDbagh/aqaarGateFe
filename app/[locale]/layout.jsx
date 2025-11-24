import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import ClientLayout from '../ClientLayout';
import Providers from '../Providers';
import StructuredData from '@/components/seo/StructuredData';
import KeywordOptimization from '@/components/seo/KeywordOptimization';
import AdvancedSEO from '@/components/seo/AdvancedSEO';
import PerformanceOptimization from '@/components/seo/PerformanceOptimization';
import InternationalSEO from '@/components/seo/InternationalSEO';

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
            <NextIntlClientProvider messages={fallbackMessages}>
              <Providers>
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  Error loading messages. Please refresh the page.
                </div>
              </Providers>
            </NextIntlClientProvider>
          </>
        );
      } catch (error) {
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
      <NextIntlClientProvider messages={messages}>
        <Providers>
          <StructuredData />
          <KeywordOptimization />
          <AdvancedSEO />
          <PerformanceOptimization />
          <InternationalSEO />
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </NextIntlClientProvider>
    </>
  );
}

