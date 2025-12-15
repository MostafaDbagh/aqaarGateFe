import { redirect } from 'next/navigation';

// Root not-found - redirect to default locale
export default function NotFound() {
  // Redirect to default locale homepage
  redirect('/en');
}
