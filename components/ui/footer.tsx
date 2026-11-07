import { Logomark } from '@/components/brand'

export default function Footer() {
  return (
    <footer className="w-full fixed border-t border-gray-200 bottom-0 left-0 right-0 h-8 flex items-center justify-center bg-white bg-opacity-50 backdrop-blur print-hide">
      <div className="max-w-md mx-auto flex items-center gap-1.5 text-xs text-gray-500">
        <Logomark className="w-3 h-3 text-brand" aria-hidden />
        Proudly generalist, embracing an open-source mindset.
      </div>
    </footer>
  )
}
