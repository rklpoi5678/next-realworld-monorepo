import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    react(),
    // Next.js의 @/* 경로를로르 인식시키기 위해 필수 Paths
    tsconfigPaths(),
  ],
  test: {
    // 전역 변수(describe, it등)를 설정 파일 없이 사용 가능하게 한다.
    globals: true,
    // React 19 및 브라우저 환경 시뮬레이션을 위한 설정
    environment: 'jsdom',
    // 테스트 시작 전 초기화 스크립트
    setupFiles: '../src/testing/setup-tests.ts',
    exclude: ['**/node_modules/**', '**/e2e/**', './next/**'],
    // 커버리지 설정
    coverage: {
      provider: 'v8',
      //최신 vitest는 v8을 권장한다.
      include: ['src/**'],
      exclude: ['src/**/*.stories.{ts.tsx}', 'src/**/*.test.{ts,tsx}', 'src/testing/**'],
      // 다양한 리포트 형식을 지원하게 설정
      reporter: ['text', 'json', 'html'],
    },
    /**  성능 및 기타 최적화 */
    // 병렬 처리 방식 설정
    pool: 'threads',
    alias: {
      // tsconfigPaths가 해결해주지만, 명시적으로 필요한 경우 추가합시다.
      /** @see  https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/import.meta */
      '@/': new URL('./src/', import.meta.url).pathname,
    },
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});
