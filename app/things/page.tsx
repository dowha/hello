// app/things/page.tsx
import { Metadata } from 'next';
import ClientThings from './ClientThings';

export async function generateMetadata(): Promise<Metadata> {
  const canonicalUrl = 'https://dowha.kim/things';
  return {
    alternates: { canonical: canonicalUrl },
    openGraph: { url: canonicalUrl },
  };
}

export default function ThingsPage() {
  return <ClientThings />;
}
