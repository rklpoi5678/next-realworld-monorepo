// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import checkFile from 'eslint-plugin-check-file';

/** 파일 명명 규칙 (Kebab-Case 강제) */
const checkFileRules = {
  files: ['src/**/*.{ts,tsx}'],
  plugins: {
    'check-file': checkFile,
  },
  rules: {
    'check-file/filename-naming-convention': [
      'error',
      {
        '**/*.{ts,tsx}': 'KEBAB_CASE',
      },
      {ignoreMiddleExtensions: true}
    ],
    'check-file/folder-naming-convention': [
      'error',
      {
        '!(src/app)/**/': 'KEBAB_CASE',
      },
      {
        errorMessage:
          'The folder "{{ target }}" does not match the "{{ pattern }}" pattern, see eslint-pattern for details',
      },
    ],
  },
};

/**  의존성 제어 규칙 (Architecture 규칙) */
const architectureRules = {
  files: ['src/**/*.{ts,tsx}'],
  rules: {
    // 기능 간의 결합도를 낮추기 위한 참조 개선
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          { target: './src/features/auth', from: './src/features', except: ['./auth'] },
          { target: './src/features/comments', from: './src/features', except: ['./comments'] },
          {
            target: './src/features/discussions',
            from: './src/features',
            except: ['./discussions'],
          },
          { target: './src/features/teams', from: './src/features', except: ['./teams'] },
          { target: './src/features/users', from: './src/features', except: ['./users'] },
          // 아키텍처 하향 원칙 (feature는 상위 도메인(app)을 참조할 수 없음)
          { target: './src/features', from: './src/app' },
        ],
      },
    ],
    // 순환 참조 방지
    'import/no-cycle': 'error',
    // 임포트 순서 강제
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
};

/** 최종 ESLint 설정 */
const eslintConfig = defineConfig([
  // 전역 무시 패턴
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'storybook-static/**',
    'next-env.d.ts',
    'node_modules/**',
    'public/mockServiceWorker.js',
    'generators/**',
  ]),
  // next.js 및 TS 기본 설정 확장
  ...nextVitals,
  ...nextTs,
  ...storybook.configs['flat/recommended'],
  // 사용자 정의 규칙 레이어
  checkFileRules,
  architectureRules
]);

export default eslintConfig;
