// app/resume/page.tsx
import { Metadata } from 'next';
import ClientResume from './ClientResume';

export async function generateMetadata(): Promise<Metadata> {
  const canonicalUrl = 'https://dowha.kim/resume';
  return {
    title: 'Resume',
    description: 'Dowha Kim’s resume',
    alternates: { canonical: canonicalUrl },
    openGraph: { url: canonicalUrl },
  };
}

export default function ResumePage() {
  return <ClientResume />;
}
