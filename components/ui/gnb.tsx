'use client'

import { useEffect, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Check } from 'lucide-react'

type Language = 'en' | 'ko'
type Theme = 'light' | 'dark' | 'system'

interface GNBProps {
  showLanguage?: boolean
  showTheme?: boolean
  currentLanguage?: Language
  onLanguageChange?: (language: Language) => void
}

export default function GNB({
  showLanguage = true,
  showTheme = true,
  currentLanguage: externalLanguage,
  onLanguageChange,
}: GNBProps) {
  const [theme, setTheme] = useState<Theme>('light')
  const [languageOpen, setLanguageOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)

  // ✅ 페이지 로드 시 `localStorage`에서 언어 값 가져오기 (페이지 이동 후 유지)
  const [internalLanguage, setInternalLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('preferredLanguage') as Language) ?? 'ko'
    }
    return 'ko'
  })

  // ✅ 외부에서 언어 변경될 때 `localStorage` 업데이트
  useEffect(() => {
    if (externalLanguage) {
      setInternalLanguage(externalLanguage)
      localStorage.setItem('preferredLanguage', externalLanguage) // ✅ 변경된 언어 저장
    }
  }, [externalLanguage])

  // 🔹 언어 변경 핸들러
  const handleLanguageChange = (newLanguage: Language) => {
    if (internalLanguage !== newLanguage) {
      setInternalLanguage(newLanguage)
      onLanguageChange?.(newLanguage)
      localStorage.setItem('preferredLanguage', newLanguage)
    }
    setLanguageOpen(false)
  }

  // 🔹 테마 변경 핸들러 (✅ 기존 테마 변경 코드 유지)
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    setThemeOpen(false) // 팝업 닫기

    // HTML 태그에 테마 적용
    document.documentElement.classList.remove('light', 'dark')
    if (newTheme !== 'system') {
      document.documentElement.classList.add(newTheme)
    }
  }

  const languageOptions: Record<Language, string> = {
    ko: '한국어',
    en: 'English',
  }

  const themeOptions: Record<Theme, string> = {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  }

  const languagelabels: Record<Language, string> = {
    ko: "언어 변경",
    en: "Change language",
  };


  const themelabels: Record<Language, string> = {
    ko: "테마 변경",
    en: "Change theme",
  };

  return (
    <nav className="top-0 left-0 right-0 h-14 bg-white flex items-center justify-end px-4 z-50 print-hide">
      <div className="flex items-center space-x-2">
        {/* 🌐 언어 변경 버튼 */}
        {showLanguage && (
          <Popover open={languageOpen} onOpenChange={setLanguageOpen}>
            <PopoverTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-full no-highlight" aria-label={languagelabels[internalLanguage]} title={languagelabels[internalLanguage]}>
                <svg
                  data-testid="geist-icon"
                  height="16"
                  strokeLinejoin="round"
                  viewBox="0 0 16 16"
                  width="16"
                  style={{ color: 'currentcolor' }}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.268 14.0934C11.9051 13.4838 13.2303 12.2333 13.9384 10.6469C13.1192 10.7941 12.2138 10.9111 11.2469 10.9925C11.0336 12.2005 10.695 13.2621 10.268 14.0934ZM8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM8.48347 14.4823C8.32384 14.494 8.16262 14.5 8 14.5C7.83738 14.5 7.67616 14.494 7.51654 14.4823C7.5132 14.4791 7.50984 14.4759 7.50647 14.4726C7.2415 14.2165 6.94578 13.7854 6.67032 13.1558C6.41594 12.5744 6.19979 11.8714 6.04101 11.0778C6.67605 11.1088 7.33104 11.125 8 11.125C8.66896 11.125 9.32395 11.1088 9.95899 11.0778C9.80021 11.8714 9.58406 12.5744 9.32968 13.1558C9.05422 13.7854 8.7585 14.2165 8.49353 14.4726C8.49016 14.4759 8.4868 14.4791 8.48347 14.4823ZM11.4187 9.72246C12.5137 9.62096 13.5116 9.47245 14.3724 9.28806C14.4561 8.87172 14.5 8.44099 14.5 8C14.5 7.55901 14.4561 7.12828 14.3724 6.71194C13.5116 6.52755 12.5137 6.37904 11.4187 6.27753C11.4719 6.83232 11.5 7.40867 11.5 8C11.5 8.59133 11.4719 9.16768 11.4187 9.72246ZM10.1525 6.18401C10.2157 6.75982 10.25 7.36805 10.25 8C10.25 8.63195 10.2157 9.24018 10.1525 9.81598C9.46123 9.85455 8.7409 9.875 8 9.875C7.25909 9.875 6.53877 9.85455 5.84749 9.81598C5.7843 9.24018 5.75 8.63195 5.75 8C5.75 7.36805 5.7843 6.75982 5.84749 6.18401C6.53877 6.14545 7.25909 6.125 8 6.125C8.74091 6.125 9.46123 6.14545 10.1525 6.18401ZM11.2469 5.00748C12.2138 5.08891 13.1191 5.20593 13.9384 5.35306C13.2303 3.7667 11.9051 2.51622 10.268 1.90662C10.695 2.73788 11.0336 3.79953 11.2469 5.00748ZM8.48347 1.51771C8.4868 1.52089 8.49016 1.52411 8.49353 1.52737C8.7585 1.78353 9.05422 2.21456 9.32968 2.84417C9.58406 3.42562 9.80021 4.12856 9.95899 4.92219C9.32395 4.89118 8.66896 4.875 8 4.875C7.33104 4.875 6.67605 4.89118 6.04101 4.92219C6.19978 4.12856 6.41594 3.42562 6.67032 2.84417C6.94578 2.21456 7.2415 1.78353 7.50647 1.52737C7.50984 1.52411 7.51319 1.52089 7.51653 1.51771C7.67615 1.50597 7.83738 1.5 8 1.5C8.16262 1.5 8.32384 1.50597 8.48347 1.51771ZM5.73202 1.90663C4.0949 2.51622 2.76975 3.7667 2.06159 5.35306C2.88085 5.20593 3.78617 5.08891 4.75309 5.00748C4.96639 3.79953 5.30497 2.73788 5.73202 1.90663ZM4.58133 6.27753C3.48633 6.37904 2.48837 6.52755 1.62761 6.71194C1.54392 7.12828 1.5 7.55901 1.5 8C1.5 8.44099 1.54392 8.87172 1.62761 9.28806C2.48837 9.47245 3.48633 9.62096 4.58133 9.72246C4.52807 9.16768 4.5 8.59133 4.5 8C4.5 7.40867 4.52807 6.83232 4.58133 6.27753ZM4.75309 10.9925C3.78617 10.9111 2.88085 10.7941 2.06159 10.6469C2.76975 12.2333 4.0949 13.4838 5.73202 14.0934C5.30497 13.2621 4.96639 12.2005 4.75309 10.9925Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-32 p-1 mx-2">
              <div className="flex flex-col text-sm">
                {Object.entries(languageOptions).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => handleLanguageChange(key as Language)}
                    className={`px-2 py-1.5 text-left hover:bg-gray-100 rounded flex items-center no-highlight justify-between ${
                      internalLanguage === key ? 'bg-gray-100' : ''
                    }`}
                  >
                    {value}
                    {internalLanguage === key && <Check size={14} />}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* 🎨 테마 변경 버튼 (✅ 기존 코드 유지) */}
        {showTheme && (
          <Popover open={themeOpen} onOpenChange={setThemeOpen}>
            <PopoverTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-full no-highlight" aria-label={themelabels[internalLanguage]} title={themelabels[internalLanguage]}>
                <svg
                  data-testid="geist-icon"
                  height="16"
                  strokeLinejoin="round"
                  viewBox="0 0 16 16"
                  width="16"
                  style={{ color: 'currentcolor' }}
                >
                  <g clipPath="url(#clip0_174_19347)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.8095 13.5C14.2386 13.0469 14.6152 12.5437 14.9297 12H1.07026C1.38476 12.5437 1.76141 13.0469 2.1905 13.5H13.8095ZM15.9381 9C15.851 9.69864 15.6738 10.3693 15.4185 11H0.581517C0.326218 10.3693 0.149013 9.69864 0.0618937 9H15.9381ZM15.9997 8.06438C15.9999 8.04294 16 8.02148 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8H15.9997V8.06438ZM3.33528 14.5C4.64841 15.444 6.25928 16 8 16C9.74072 16 11.3516 15.444 12.6647 14.5H3.33528Z"
                      fill="currentColor"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_174_19347">
                      <rect
                        width="16"
                        height="16"
                        fill="var(--ds-background-100)"
                      ></rect>
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-32 p-1 mx-2">
              <div className="flex flex-col text-sm">
                {Object.entries(themeOptions).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => handleThemeChange(key as Theme)}
                    className={`px-2 py-1.5 text-left hover:bg-gray-100 rounded flex items-center no-highlight justify-between ${
                      theme === key ? 'bg-gray-100' : ''
                    }`}
                  >
                    {value}
                    {theme === key && <Check size={14} />}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </nav>
  )
}
