import { dirname } from 'path';
import { defineConfig, globalIgnores } from 'eslint/config';
// import nextVitals from "eslint-config-next/core-web-vitals";
// import nextTs from "eslint-config-next/typescript";
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import checkFile from 'eslint-plugin-check-file'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = defineConfig([
  // next.js 및 TS 기본 설정 확장
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // 전역 무시 패턴
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
    'public/mockServiceWorker.js',
    'generators/**',
  ]),

  // 의존성 제어 규칙 (Architecture 규칙)
  {
    files: ['**/*.ts', '**/*.tsx'],
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
            { target: './src/features', from: './src/app' }, 
            // 아키텍처 하향 원칙 (feature는 app을 참조할 수 없음)
          ],
        },
      ],
      // 순환 참조 방지
      "import/no-cycle": "error", 
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling"], "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true}
        }
      ]
    },
  },

  // 파일 명명 규칙 (Kebab-Case 강제)
  {
    files: ["src/**/*"],
    plugins: {
      "check-file": checkFile,
    },
    rules: {
      "check-file/filename-naming-convention": ["error", { "**/*.{ts,tsx}": "KEBAB_CASE" }],
      "check-file/folder-naming-convention": ["error", { "!(src/app)/**/*": "KEBAB_CASE" }],
    }
  }
]);

export default eslintConfig;
