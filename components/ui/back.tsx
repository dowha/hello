import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function Back() {
  return (
    <Link href={`/`} passHref className="no-underline">
    <Button variant="ghost" className="mb-4">
      <ArrowLeft className="mr-2 h-4 w-4" /> Back
    </Button>
  </Link>
  )
}