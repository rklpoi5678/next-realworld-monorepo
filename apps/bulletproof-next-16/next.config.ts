import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** 
   * 스트릭트 모드는 Next.js 13.5.1 부터
   * 앱 라우터에서는 기본적으로 엄격한 모드가 적용 되므로, 아래 설정은 페이지만 필요
   */
  // reactStrictMode: true,
  reactCompiler: true,
};

export default nextConfig;
