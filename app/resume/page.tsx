// app/resume/page.tsx
import { Metadata } from 'next';
import ClientResume from './ClientResume';

export async function generateMetadata(): Promise<Metadata> {
  const canonicalUrl = 'https://dowha.kim/resume';
  return {
    title: 'Resume',
    description: "Dowha Kim's resume",
    alternates: { canonical: canonicalUrl },
    // openGraph를 덮어쓰면 루트의 OG 이미지가 빠지므로 이미지를 함께 지정
    openGraph: {
      url: canonicalUrl,
      images: [{ url: '/opengraph-image.png?v=2', width: 2400, height: 1260, alt: 'dowha kim — B2B SaaS Specialist' }],
    },
  };
}

export default function ResumePage() {
  return <ClientResume />;
}
