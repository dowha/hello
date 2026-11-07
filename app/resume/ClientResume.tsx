// app/resume/ClientResume.tsx
'use client';
import { useState, useEffect, Suspense } from 'react';
import Resume from '@/components/resume';
import GNB from '@/components/ui/gnb';
import { resolveLanguage } from '@/lib/language';
import { Spinner } from '@/components/ui/spinner';

export default function ClientResume() {
  const [language, setLanguage] = useState<'en' | 'ko' | null>(null);

  useEffect(() => {
    setLanguage(resolveLanguage());
  }, []);

  // 언어는 마운트 직후 바로 정해지므로 스피너를 띄우지 않는다
  if (language === null) return null;

  return (
    <Suspense fallback={<Spinner className="min-h-[300px]" />}>
     
      <GNB
        showLanguage={true}
        showTheme={false}
        currentLanguage={language}
        onLanguageChange={setLanguage}
      />
      <Resume lang={language} />
    </Suspense>
  );
}
