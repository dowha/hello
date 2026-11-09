/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://dowha.kim',
  generateRobotsTxt: true, // robots.txt 자동 생성
  changefreq: 'daily', // 페이지 주소 변경 빈도
  sitemapSize: 50000, // 사이트맵 파일 1개로 생성
  generateIndexSitemap: false, // 인덱스 파일 비활성화 → sitemap-0.xml 방지
  // 관리자 페이지와 OG·트위터 이미지 라우트(app/*-image.png)는 페이지가 아니라 제외
  // 언어별 내부 경로(/ko·/en)는 공개 주소가 아니다. 공개 주소 / · /resume는 additionalPaths로 넣는다
  exclude: ['/wave', '/opengraph-image.png', '/twitter-image.png', '/ko', '/ko/*', '/en', '/en/*'],
  additionalPaths: async (config) => Promise.all(['/', '/resume'].map((p) => config.transform(config, p))),
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: 'daily',
      priority: path === '/' ? 1.0 : 0.7, // 홈페이지(`/`)는 1.0, 나머지는 0.7
    }
  },
  robotsTxtOptions: {
    // 모든 크롤러(검색·AI 포함) 허용, 관리자 페이지만 제외
    policies: [{ userAgent: '*', allow: '/', disallow: '/wave' }],
    additionalSitemaps: [
      'https://blog.dowha.kim/sitemap.xml', // ✅ 서브도메인 사이트맵 추가
      'https://blog.dowha.kim/api/rss',
    ],
  },
}
