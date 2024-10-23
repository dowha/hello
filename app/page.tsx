import { About } from '@/components/introduction'

export const metadata = {
  title: 'Hello, I am Dowha Kim!', 
  description: 'B2B SaaS Specialist.',
  openGraph: {
    title: 'Hello, I am Dowha Kim!',
    description: 'B2B SaaS Specialist.',
  },
}

export default function AboutPage() {
  return (
    <main>
      <About />
    </main>
  )
}
