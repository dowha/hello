/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: '/things', destination: '/', permanent: true }]
  },
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
        ],
      },
      {
        // 자기소멸 SW는 항상 최신본을 받아야 옛 Gatsby SW를 즉시 교체함 → 캐시 금지
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ]
  },
}

export default nextConfig
