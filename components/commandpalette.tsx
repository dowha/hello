import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Dialog, DialogContent } from './ui/dialog'

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
      setIsMobile(/Mobi|Android/i.test(navigator.userAgent)) // Check if the device is mobile
    }
  }, [])

  const content = {
    en: {
      buttonText: 'Get to know me more...',
      searchPlaceholder: 'Search...',
      navigation: 'Navigation',
      noResults: 'No results found.',
      navItems: [
        { title: 'CV/Resume', href: '/cv' },
        { title: 'Bag', href: '/bag' },
        { title: 'STACKed', href: '/stacked' },
        { title: 'Repertoire', href: '/repertoire' },
        { title: 'Attribution', href: '/attribution' },
      ],
    },
    ko: {
      buttonText: '저에 대해 더 궁금하시다면...',
      searchPlaceholder: '검색...',
      navigation: 'Navigation',
      noResults: '검색 결과가 없습니다.',
      navItems: [
        { title: 'CV/Resume', href: '/cv' },
        { title: "What's in my (hypothetical) Bag?", href: '/bag' },
        { title: 'STACKed', href: '/stacked' },
        { title: 'Repertoire', href: '/repertoire' },
        { title: 'Attribution', href: '/attribution' },
      ],
    },
  }

  const currentContent = content[language]

  const filteredItems = currentContent.navItems.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }

      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const escLabel = isMobile
    ? language === 'en'
      ? 'Close'
      : '닫기'
    : 'ESC'

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
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 text-[10px] font-mono text-gray-500">
          {shortcutLabel}
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 custom-dialog-content border w-[90%] max-w-[600px] mx-auto rounded-lg overflow-hidden">
          <div className="w-full bg-white">
            <div className="border-b px-3 py-2">
              <div className="flex items-center gap-2">
                <Search className="w-3 h-3 text-gray-400" />
                <input
                  className="flex h-10 w-full rounded-md bg-transparent py-3 text-xs outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={currentContent.searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <kbd
                  className="inline-flex h-6 select-none items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 text-[10px] font-mono text-gray-500 cursor-pointer"
                  onClick={() => setOpen(false)}
                >
                  {escLabel}
                </kbd>
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
                      onClick={() => {
                        setOpen(false)
                        console.log(`Navigating to ${item.href}`)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CommandPalette
