import { ImageResponse } from 'next/og';

export const alt = 'AqaarGate - Property in Syria & Lattakia';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  const { locale } = await params;
  const isAr = locale === 'ar';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f1913d 0%, #ff6b35 50%, #e85a2e 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 200,
            height: 200,
            background: 'white',
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
            boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
          }}
        >
          <span style={{ fontSize: 90, fontWeight: 900, color: '#f1913d', letterSpacing: -2 }}>AG</span>
        </div>
        <div style={{ fontSize: 72, fontWeight: 900, color: 'white', marginBottom: 16, textShadow: '3px 3px 6px rgba(0,0,0,0.3)' }}>
          AqaarGate
        </div>
        <div style={{ fontSize: 36, fontWeight: 600, color: 'white', opacity: 0.95, marginBottom: 24 }}>
          Real Estate
        </div>
        <div style={{ fontSize: 28, color: 'white', opacity: 0.92, textAlign: 'center', maxWidth: 900 }}>
          {isAr ? 'عقارات سوريا واللاذقية | منازل للبيع والإيجار' : 'Premium Properties in Syria & Lattakia | Buy, Rent, Holiday Homes'}
        </div>
        <div style={{ position: 'absolute', bottom: 35, fontSize: 22, color: 'white', opacity: 0.9, fontWeight: 600 }}>
          www.aqaargate.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
