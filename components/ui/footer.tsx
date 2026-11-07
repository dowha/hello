import { Logomark } from '@/components/brand'

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-gray-200 py-3 flex items-center justify-center print-hide">
      <div className="max-w-md mx-auto flex items-center gap-1.5 text-xs text-gray-500">
        <Logomark className="w-3 h-3 text-brand" aria-hidden />
        Proudly generalist, embracing an open-source mindset.
      </div>
    </footer>
  )
}
