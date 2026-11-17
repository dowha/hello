export {} // 전역 선언을 위해 필요

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}
