// app/resume/ClientResume.tsx
'use client';
import { useState, useEffect, Suspense } from 'react';
import Resume from '@/components/resume';
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

export default function ClientResume() {
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
