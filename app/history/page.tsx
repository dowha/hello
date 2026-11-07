import type { Metadata } from 'next'
import ClientHistory from './ClientHistory'

const canonicalUrl = 'https://dowha.kim/history'

export const metadata: Metadata = {
  title: 'History of Dowha',
  description: 'A running log of how Dowha Kim got here.',
  alternates: { canonical: canonicalUrl },
  openGraph: { url: canonicalUrl },
}

export default function HistoryPage() {
  return <ClientHistory />
}
