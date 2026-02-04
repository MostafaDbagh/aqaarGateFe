import Link from 'next/link';

// Root not-found - shown when path doesn't match any route (e.g. before locale redirect)
// Renders a minimal 404 to avoid redirect loops when /en fails
export default function NotFound() {
  return (
    <div style={{ fontFamily: 'system-ui', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', color: '#f1913d' }}>404</h1>
      <p>Page not found.</p>
      <Link href="/en" style={{ color: '#f1913d', textDecoration: 'underline' }}>
        Go to homepage
      </Link>
    </div>
  );
}
