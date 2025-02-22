import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Dialog, DialogContent } from './dialog'

type Language = 'en' | 'ko'
type CommandPaletteProps = {
  language?: Language
}

const CommandPalette = ({ language = 'en' }: CommandPaletteProps) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [platform, setPlatform] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setPlatform(navigator.platform.includes('Mac') ? '⌘' : 'Ctrl')
      setIsMobile(/Mobi|Android/i.test(navigator.userAgent))
    }
  }, [])

  const handleClose = (e: React.PointerEvent) => {
    if (e.target === e.currentTarget) {
      setOpen(false)
    }
  }

  const content = {
    en: {
      buttonText: 'Get to know me more...',
      searchPlaceholder: 'Search...',
      navigation: 'Navigation',
      noResults: 'No results found.',
      navItems: [
        { title: 'Resume', href: `/resume` },
        { title: 'Things I have made (Work in Progress)', href: '/things' },
      ],
    },
    ko: {
      buttonText: '저에 대해 더 궁금하시다면...',
      searchPlaceholder: '검색...',
      navigation: '추가 페이지 목록',
      noResults: '검색 결과가 없습니다.',
      navItems: [
        { title: '이력서', href: `/resume` },
        { title: '내가 만든 것들 (준비중)', href: '/things' },
      ],
    },
  }

  const currentContent = content[language]

  const filteredItems = currentContent.navItems.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={() => setOpen(true)}
        className="mt-3 w-[260px] flex items-center gap-2 h-10 px-4 rounded-lg border border-gray-200 text-gray-500 text-xs hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <Search className="w-3 h-3" />
        <span>{currentContent.buttonText}</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 text-[10px] text-gray-500">
          {isMobile ? 'Tap!' : `${platform} K`}
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <div className="fixed inset-0 bg-black/30 z-50" onPointerDown={handleClose}>
          {/* ✅ 팝업 바깥을 터치하면 닫히도록 설정 */}
          <DialogContent
            className="p-0 custom-dialog-content border w-[90%] max-w-[600px] mx-auto rounded-lg overflow-hidden bg-white"
            onPointerDown={(e) => e.stopPropagation()} // ✅ 내부 클릭 시 닫히지 않도록 설정
          >
            <div className="border-b px-3 py-2">
              <div className="flex items-center gap-2">
                <Search className="w-3 h-3 text-gray-400" />
                <input
                  className="flex h-10 w-full rounded-md bg-transparent py-3 text-xs outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={currentContent.searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  className="inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 text-[10px] text-gray-500 cursor-pointer whitespace-nowrap"
                  onClick={() => setOpen(false)} // ✅ 닫기 버튼 정상 작동
                >
                  {isMobile ? '닫기' : 'ESC'}
                </button>
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-500">
                  {currentContent.noResults}
                </div>
              ) : (
                <div className="py-2">
                  <div className="px-3 py-2 text-[10px] font-semibold text-gray-500">
                    {currentContent.navigation}
                  </div>
                  {filteredItems.map((item) => (
                    <button
                      key={item.href}
                      onClick={(e) => {
                        e.stopPropagation() // ✅ 버튼 클릭 시 다른 이벤트 방해 방지
                        setTimeout(() => {
                          setOpen(false)
                          window.location.href = item.href
                        }, 100) // ✅ 페이지 이동 후 닫히도록 설정
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  )
}

export default CommandPalette
