// app/resume/page.tsx
import { Metadata } from 'next';
import ClientResume from './ClientResume';
import { LanguagePending } from '@/components/language-pending';
import { getResumeData } from '@/lib/site-data';

// 홈과 같이 10분마다 다시 만든다 (/wave 저장 시에는 바로)
export const revalidate = 600;

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

export default async function ResumePage() {
  const data = await getResumeData();
  return (
    <>
      <LanguagePending />
      <ClientResume data={data} />
    </>
  );
}
