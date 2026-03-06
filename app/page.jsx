import { redirect } from 'next/navigation';

// Fallback when middleware does not run (e.g. some hosts): root URL → default locale /ar
export default function RootPage() {
  redirect('/ar');
}
