import { Suspense } from 'react'
import Things from '@/components/projects'

export const metadata = {
  title: 'Things',
  description: 'Things I have made.',
  openGraph: {
    title: 'Things',
    description: 'Things I have made.',
  },
}

export default function ThingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <Things />
    </Suspense>
  )
}
