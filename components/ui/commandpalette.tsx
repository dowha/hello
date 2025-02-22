import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Dialog, DialogContent } from './dialog'

type Language = 'en' | 'ko'
type CommandPaletteProps = {
  language?: Language
}

const CommandPalette = ({ language = 'en' }: CommandPaletteProps) => {
  const [open, setOpen] = useState(false)
  const [platform, setPlatform] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setPlatform(navigator.platform.includes('Mac') ? '⌘' : 'Ctrl')
      setIsMobile(/Mobi|Android/i.test(navigator.userAgent))
    }
  }, [])

  const handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setOpen(false)
    }
  }

  const content = {
    en: {
      buttonText: 'Get to know me more...',
      navigation: 'Navigation',
      navItems: [
        { title: 'Resume', href: `/resume` },
        { title: 'Things I have made (Work in Progress)', href: '/things' },
      ],
    },
    ko: {
      buttonText: '저에 대해 더 궁금하시다면...',
      navigation: '추가 페이지 목록',
      navItems: [
        { title: '이력서', href: `/resume` },
        { title: '내가 만든 것들 (준비중)', href: '/things' },
      ],
    },
  }

  const currentContent = content[language]

  const shortcutLabel = isMobile
    ? language === 'en'
      ? 'Tap!'
      : '탭!'
    : `${platform} K`

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={() => setOpen(true)}
        className="mt-3 w-[260px] flex items-center gap-2 h-10 px-4 rounded-lg border border-gray-200 text-gray-500 text-xs hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <Search className="w-3 h-3" />
        <span>{currentContent.buttonText}</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 text-[10px] text-gray-500">
          {shortcutLabel}
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="p-0 custom-dialog-content border w-[90%] max-w-[600px] mx-auto rounded-lg overflow-hidden bg-white"
          onClick={handleClose} // ✅ 바깥 클릭 감지
        >
          <div className="w-full bg-white" onClick={(e) => e.stopPropagation()}>
            {/* ✅ 내부 요소 클릭은 닫히지 않도록 이벤트 버블링 차단 */}
            <div className="border-b px-3 py-2 flex justify-between items-center">
              <span className="text-sm font-semibold">{currentContent.navigation}</span>
              <button
                className="inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 text-[10px] text-gray-500 cursor-pointer"
                onClick={() => setOpen(false)} // ✅ 닫기 버튼 정상 작동
              >
                {isMobile ? '닫기' : 'ESC'}
              </button>
            </div>

            <div className="max-h-[300px] overflow-y-auto">
              <div className="py-2">
                {currentContent.navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={(e) => {
                      e.stopPropagation() // ✅ 버튼 클릭 시 팝업이 닫히지 않도록 설정
                      setTimeout(() => {
                        setOpen(false)
                        window.location.href = item.href
                      }, 100) // ✅ 클릭 후 닫히도록 설정
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CommandPalette
