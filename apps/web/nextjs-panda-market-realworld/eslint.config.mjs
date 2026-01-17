import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettierConfig from 'eslint-config-prettier';
// 파일/폴더명 정렬 플러그인 - 캐밥케이스
import checkFilePlugin from 'eslint-plugin-check-file';
// 파일/폴더명 정렬 플러그인
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

/**
 * @see https://nextjs.org/docs/app/api-reference/config/eslint
 * @see https://en.wikipedia.org/wiki/Glob_(programming)
 */
// 기본 설정 (모든 파일에 적용)
const baseConfig = [
  {
    files: ['**/**.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser, // window. document 브라우저 전역변수 허용
        ...globals.node, // process, require 노드.js 전역 변수
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    // var금지, const우선
    rules: {
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];

// react, reactHooks setting
/**
 * @see https://mariais.tistory.com/entry/Eslint-reactreact-in-jsx-scope-off%EA%B0%80-%EC%9E%91%EB%8F%99%EC%9D%B4-%EC%95%88%EB%90%98%EB%8A%94-%EA%B2%BD%EC%9A%B0
 */
const reactConfig = {
  files: ['**/*.{jsx}'],
  // 플러그인 권장규칙으로
  rules: {
    'react/react-in-jsx-scope': 'off', // ! 최신버전에서 import React 필요 없음
  },
};

const ImportSortConfig = {
  plugins: {
    'simple-import-sort': simpleImportSortPlugin,
  },
  rules: {
    'simple-import-sort/imports': 'error', // import 순서 강제
    'simple-import-sort/exports': 'error', // export 순서 강제
  },
};

/**
 * @see https://www.reddit.com/r/nextjs/comments/1i23e46/kebabcase_or_pascalcase_for_nextjs_file_names/#:~:text=According%20to%20a%20Reddit%20user%2C%20kebab%2Dcase%20is,renaming%20a%20file%20with%20a%20capitalization%20change
 * @see https://www.piyushgambhir.com/blogs/next-js-naming-conventions#:~:text=%EC%9D%B4%20%EA%B7%9C%EC%B9%99%EC%9D%80%20%EA%B2%BD%EB%A1%9C%20URL%EC%9D%84%20%EC%98%88%EC%B8%A1%20%EA%B0%80%EB%8A%A5%ED%95%98%EA%B3%A0%20SEO%20%EC%B9%9C%ED%99%94%EC%A0%81%EC%9C%BC%EB%A1%9C%20%EB%A7%8C%EB%93%AD%EB%8B%88%EB%8B%A4.%20%EC%98%88%EB%A5%BC%20%EB%93%A4%EC%96%B4%2C%20%EB%9D%BC%EB%8A%94%20%ED%8E%98%EC%9D%B4%EC%A7%80%20%ED%8C%8C%EC%9D%BC%EC%9D%80%20%ED%95%98%EC%9D%B4%ED%94%88%EC%9D%84%20%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC%20%EA%B2%BD%EB%A1%9C%EB%A5%BC%20%EC%83%9D%EC%84%B1%ED%95%98%EB%8A%94%EB%8D%B0%2C%20%EC%9D%B4%EB%8A%94%20%EA%B2%80%EC%83%89%20%EC%97%94%EC%A7%84%EC%97%90%EC%84%9C%20%EC%BA%90%EB%A9%9C%EC%BC%80%EC%9D%B4%EC%8A%A4%EB%82%98%20%EB%B0%91%EC%A4%84%EB%B3%B4%EB%8B%A4%20%EC%9D%BD%EA%B8%B0%20%EC%89%BD%EA%B3%A0%20%EC%84%A0%ED%98%B8%ED%95%A9%EB%8B%88%EB%8B%A4.%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%20%EC%A0%84%EC%B2%B4%EC%97%90%EC%84%9C%20%EC%9D%BC%EA%B4%80%EB%90%9C%20%EC%86%8C%EB%AC%B8%EC%9E%90%20%EC%9D%B4%EB%A6%84%EC%9D%84%20%EC%A7%80%EC%A0%95%ED%95%98%EB%A9%B4%20%ED%8C%80%EC%9D%98%20%ED%83%90%EC%83%89%EC%9D%B4%20%ED%96%A5%EC%83%81%EB%90%98%EA%B3%A0%20%ED%8C%8C%EC%9D%BC%EC%9D%84%20%EA%B0%80%EC%A0%B8%EC%98%AC%20%EB%95%8C%20%EC%98%A4%EB%A5%98%EA%B0%80%20%EC%A4%84%EC%96%B4%EB%93%AD%EB%8B%88%EB%8B%A4(%EC%A0%95%ED%99%95%ED%95%9C%20%EB%8C%80%EC%86%8C%EB%AC%B8%EC%9E%90%EA%B0%80%20%EC%9D%BC%EC%B9%98%ED%95%B4%EC%95%BC%20%ED%95%98%EA%B8%B0%20%EB%95%8C%EB%AC%B8%EC%97%90)
 */
const fileNamingConventionConfig = {
  files: ['src/**/*'],
  plugins: {
    'check-file': checkFilePlugin,
  },
  rules: {
    // file-name
    'check-file/filename-naming-convention': [
      'error',
      { '**/*.{js,jsx}': 'KEBAB_CASE' },
      { ignoreMiddleExtensions: true }, // .module.css 같은 경우 예외로 중간 확장자를 무시하게
    ],
    // folder-name
    'check-file/folder-naming-convention': [
      'error',
      { '!(src/app)/**/*': 'KEBAB_CASE' },
      {
        errorMessage:
          'The folder "{{ target }}" does not match the "{{ pattern }}" pattern, see eslint-pattern for details',
      },
    ],
  },
};

const eslintConfig = defineConfig([
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
    // 여기서 무시할 파일/폴더 추가
  ]),

  // config export
  ...baseConfig,
  ...nextVitals,
  reactConfig,
  ImportSortConfig,
  fileNamingConventionConfig,

  // Prettier와 충돌하는 모든 린팅 규칙을 비활성화
  prettierConfig,
]);

export default eslintConfig;
