import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { Language } from '@/lib/language'

const LABEL: Record<Language, string> = { ko: '뒤로', en: 'Back' }

/** 홈으로 돌아가는 버튼. 링크 안에 버튼을 넣지 않도록 Button을 링크로 그린다(asChild) */
export default function Back({ lang }: { lang: Language }) {
  return (
    <Button asChild variant="ghost" className="mb-4 no-underline">
      <Link href="/">
        <ArrowLeft className="mr-2 h-4 w-4" /> {LABEL[lang]}
      </Link>
    </Button>
  )
}
