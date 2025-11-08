import { Linter } from 'eslint'
import { resolve } from 'node:path'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import nextVitals from 'eslint-config-next/core-web-vitals'
import prettierConfig from 'eslint-config-prettier'
import checkFilePlugin from 'eslint-plugin-check-file'
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'

//  ! TS 환경에선 .mjs로 임포트해야 함
import baseConfigFn from './base.mjs'

/**
 * next.mts: base.mts import -> React/Next.js 특화 규칙 적용
 */
const nextConfig = (projectPath: string) => {
  const tsconfigPath = resolve(projectPath, 'tsconfig.json')

  // base.mts 기본 TS 설정을 가져옴
  const compat = new FlatCompat({
    baseDirectory: projectPath,
    resolvePluginsRelativeTo: projectPath,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
  })

  const nextAppRules = compat.config({
    // next.js 앱 모든 소스파일에 적용
    files: ['**/*.{js,jsx,ts,tsx}'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: tsconfigPath,
      sourceType: 'module',
      tsconfigRootDir: projectPath,
    },
    extends: [
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    globals: {
      React: true,
      JSX: true,
    },
    env: {
      browser: true,
      node: true,
    },
    // base.mts와 중복시 여기설정을 우선
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
      // react-hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  })

  // 정렬 및 파일명 규칙
  const ImportSortConfig = {
    plugins: {
      'simple-import-sort': simpleImportSortPlugin as any,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  }

  const fileNamingConventionConfig = {
    files: ['src/**/*'],
    plugins: {
      'check-file': checkFilePlugin,
    },
    rules: {
      // 파일명: KEBAB_CASE (js,jsx,ts,tsx)
      'check-file/filename-naming-convention': [
        'error',
        { '**/*.{js,jsx,ts,tsx}': 'KEBAB_CASE' },
        { ignoreMiddleExtensions: true },
      ],
      // 폴더명: KEBAB_CASE (src/app => next.js 파일명 규칙을 따르도록)
      'check-file/folder-naming-convention': [
        'error',
        { '!(src/app)/**/*': 'KEBAB_CASE' },
        {
          errorMessage:
            'The folder "{{ target }}" does not match the "{{ pattern }}" pattern, see eslint-pattern for details',
        },
      ],
    },
  }

  return [
    // base.mts
    ...baseConfigFn(projectPath),

    // next.js / react environment rules
    ...nextAppRules, // next.js용 재정의 규칙
    ...nextVitals, //next.js 공식 바이털 규칙

    // code convention
    ImportSortConfig,
    fileNamingConventionConfig,

    // Prettier는 항상 마지막에 위치하여 앞선 모든 린트 규칙과 충돌하는 포맷팅 규칙을 비활
    prettierConfig,
  ] satisfies Linter.Config[]
}

export default nextConfig
