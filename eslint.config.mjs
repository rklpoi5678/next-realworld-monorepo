import { defineConfig, globalIgnores } from 'eslint/config'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

import baseConfigFn from '@packages/eslint-config/base.mjs'
import nextConfigFn from '@packages/eslint-config/next.mjs'

// --- 디렉토리 경로 정의 ---
const __dirname = fileURLToPath(new URL('.', import.meta.url))
// Next.js 앱의 경로와 tsconfig.json이 있는 위치
const appDir = resolve(__dirname, 'apps/nextjs-typescript-realworld')
// 다른 패키지들의 경로 (예: eslint-config 패키지)
const eslintConfigPackageDir = resolve(__dirname, 'packages/eslint-config')
// 루트 경로
const rootDir = __dirname

// Next.js 앱을 위한 설정
// nextConfigFn을 앱 경로(appDir)로 호출하고,
// 'files' 속성을 추가하여 이 설정이 오직 해당 앱에만 적용되도록 제한
// const nextAppConfig = nextConfigFn(appDir).map((config) => ({
//   ...config,
//   files: ['apps/nextjs-typescript-realworld/**/*.{js,jsx,ts,tsx}'],
// }))

// packages/eslint-config 설정
const eslintPackageConfig = baseConfigFn(eslintConfigPackageDir).map((config) => ({
  ...config,
  files: ['packages/eslint-config/**/*.{js,jsx,ts,tsx,mts}'],
}))

// 모노레포 루트 파일(ex: turbo.json, package.json 등)을 위한 설정
const rootFilesConfig = baseConfigFn(rootDir).map((config) => ({
  ...config,
  files: ['*.{js,mjs,ts}', ''],
}))

const eslintConfig = defineConfig([
  globalIgnores([
    '**/node_modules/**',
    '**/.next/**',
    '**/.turbo/**',
    '**/dist/**',
    '**/build/**',
    '**/out/**',
    'apps/nextjs-typescript-realworld/.next/**', // 명시적 무시
    'apps/nextjs-typescript-realworld/**'
  ]),

  // 라우팅된 설정 적용
  // ...nextAppConfig, // Next.js 앱 파일에 적용
  ...eslintPackageConfig, // eslint-config 패키지 파일에 적용
  ...rootFilesConfig, // 루트 파일에 적용
])

export default eslintConfig
