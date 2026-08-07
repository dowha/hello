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
    ]
  },
}

export default nextConfig
