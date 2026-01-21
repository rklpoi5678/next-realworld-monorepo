import { defineConfig, globalIgnores } from "eslint/config";
import prettier from 'eslint-config-prettier';
import betterTailwind  from 'eslint-plugin-better-tailwindcss'
import tsParser from '@typescript-eslint/parser'
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const customConfig = {
  name: "custom-project-config",
  files: ["**/*.ts", "**/*.tsx"],
  languageOptions: {
    parser: tsParser,
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
  },
  settings: {
    next: {
      rootDir: true,
    },
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    'node_modules/**'
  ]),
{
    name: "better-tailwind-config",
    plugins: {
      "better-tailwindcss": betterTailwind,
    },
    rules: {
      ...betterTailwind.configs["recommended-error"].rules,
      "better-tailwindcss/no-custom-classnames": "off", 
    },
  },
  // 프로젝트 커스텀 설정
  customConfig,
  // prettier와 충돌일어나지게 않게 맨 밑에서 정의
  prettier
]);

export default eslintConfig;
