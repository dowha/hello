// 자기소멸(self-destroying) 서비스 워커.
// 목적: 예전 Gatsby(gatsby-plugin-offline) 시절 방문자 기기에 설치돼 남아있는
// 서비스 워커가, 캐싱한 옛 Gatsby 사이트(HTML·파비콘 등)를 계속 서빙하는 문제 제거.
//
// 동작: 기존 SW가 /sw.js 업데이트를 확인할 때 이 파일로 교체됨 → 즉시 활성화하여
// 모든 Cache Storage를 비우고, 자기 자신을 등록해제한 뒤, 열려있는 창들을 새로고침.
// 그러면 기기는 다음 로드부터 실제(Next.js) 사이트를 네트워크에서 받아온다.
//
// 역할을 다한 뒤에는(모든 기기 정리 확인되면) 이 파일을 제거해도 된다.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      } catch (e) {
        // 캐시 삭제 실패는 무시하고 계속 진행
      }
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => client.navigate(client.url));
    })()
  );
});
