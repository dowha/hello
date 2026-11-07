import { Logomark } from '@/components/brand'

export default function Footer() {
  return (
    // 배경 없이, 홈 상단 로고 밑과 같은 짧은 구분선만 둔다
    <footer className="mt-auto w-full bg-transparent pb-6 flex flex-col items-center print-hide">
      <span aria-hidden className="block w-8 h-px bg-gray-200 mb-5" />
      <div className="max-w-md mx-auto flex items-center gap-1.5 text-xs text-gray-500">
        <Logomark className="w-3 h-3 text-brand" aria-hidden />
        Proudly generalist, embracing an open-source mindset.
      </div>
    </footer>
  )
}
