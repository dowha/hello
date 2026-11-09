import { Metadata } from 'next';
import ClientResume from './ClientResume';
import { getResumeData } from '@/lib/site-data';
import { languageParams, openGraphFor, pageLanguage, type LangParams } from '../params';

// 홈과 같이 10분마다 다시 만든다 (/wave 저장 시에는 바로)
export const revalidate = 600;
export const dynamicParams = false;
export const generateStaticParams = languageParams;

export async function generateMetadata(props: LangParams): Promise<Metadata> {
  const canonicalUrl = 'https://dowha.kim/resume';
  return {
    title: 'Resume',
    description: "Dowha Kim's resume",
    alternates: { canonical: canonicalUrl },
    openGraph: openGraphFor(await pageLanguage(props), canonicalUrl),
  };
}

export default async function ResumePage(props: LangParams) {
  const [language, data] = await Promise.all([pageLanguage(props), getResumeData()]);
  return <ClientResume language={language} data={data} />;
}
