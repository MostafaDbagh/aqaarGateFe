'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Error({ error, reset }) {
  const pathname = usePathname();
  const locale = pathname?.startsWith('/ar') ? 'ar' : 'en';
  const isRTL = locale === 'ar';

  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        margin: 0,
        fontFamily: 'system-ui, sans-serif',
        padding: '2rem',
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '500px' }}>
        <h1 style={{ fontSize: '2rem', color: '#f1913d', marginBottom: '1rem' }}>
          {isRTL ? 'حدث خطأ ما' : 'Something went wrong'}
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem', lineHeight: 1.6 }}>
          {isRTL
            ? 'واجهنا خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
            : 'We encountered an unexpected error. Please try again.'}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => reset()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#f1913d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {isRTL ? 'حاول مرة أخرى' : 'Try again'}
          </button>
          <Link
            href={`/${locale}`}
            style={{
              padding: '12px 24px',
              backgroundColor: '#333',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 600,
            }}
          >
            {isRTL ? 'العودة للصفحة الرئيسية' : 'Go to homepage'}
          </Link>
        </div>
      </div>
    </div>
  );
}
