// app/things/page.tsx
import { Metadata } from 'next';
import ClientThings from './ClientThings';

export async function generateMetadata(): Promise<Metadata> {
  const canonicalUrl = 'https://dowha.kim/things';
  return {
    title: 'Things | Dowha Kim',
    description: 'Things I have made',
    alternates: { canonical: canonicalUrl },
    openGraph: { url: canonicalUrl },
  };
}

export default function ThingsPage() {
  return <ClientThings />;
}
