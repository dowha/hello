// app/things/ClientThings.tsx
'use client';
import { useState, useEffect, Suspense } from 'react';
import Head from 'next/head';
import Things from '@/components/projects';
import GNB from '@/components/ui/gnb';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white/30 backdrop-blur-sm">
      <div className="text-center">
        <div className="inline-block">
          <div className="w-8 h-8 rounded-full border-4 border-gray-400 border-t-transparent animate-spin" />
        </div>
        <p className="mt-2 text-sm text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  );
}

export default function ClientThings() {
  const [language, setLanguage] = useState<'en' | 'ko' | null>(null);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('preferredLanguage') as 'en' | 'ko' | null;
    if (storedLanguage) {
      setLanguage(storedLanguage);
    } else {
      const userLang = navigator.language.startsWith('ko') ? 'ko' : 'en';
      setLanguage(userLang);
    }
  }, []);

  if (language === null) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Head>
        <link rel="canonical" href="https://dowha.kim/things" />
      </Head>
      <GNB
        showLanguage={true}
        showTheme={false}
        currentLanguage={language}
        onLanguageChange={setLanguage}
      />
      <Things language={language} />
    </Suspense>
  );
}
