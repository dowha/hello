/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: '/things', destination: '/', permanent: true }]
  },
  async headers() {
    return [
      {
        // 보안 헤더: HTTPS 고정(하위 도메인 제외), MIME 추측 금지, 다른 사이트의 iframe 삽입 차단
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
        ],
      },
    ]
  },
}

export default nextConfig
