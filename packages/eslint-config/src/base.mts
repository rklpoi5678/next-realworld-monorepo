import { resolve } from 'node:path'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import type { Linter } from 'eslint'

/**
 * base.mts: 기본적인 TypeScript/JS 규칙 (eslint.config.mts)
 */
const baseConfig = (projectPath: string) => {
  // 모노레포에서는 각 앱/패키지마다 tsconfig.json 파일의 위치가 다르다.
  // 는 개별 프로젝트 폴더의 경로(projectPath)를 인자로 받아, 해당 프로젝트의 타입스크립트 설정을 찾는다.
  const tsconfigPath = resolve(projectPath, 'tsconfig.json')

  // 기존레거시 .eslintrc 포맷을 연결 아직도 사용하는 포맷이라 (FlatCompat을 사용 => 연결)
  const compat = new FlatCompat({
    // 이 설정이 호출되는 앱/패키지의 컨텍스트에서 플러그인을 찾고 설정 파일을 해석하도록 합니다.
    baseDirectory: projectPath,
    resolvePluginsRelativeTo: projectPath,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
  })

  return [
    {
      // node_modules 폴더 모든 파일을 린트 대상에서 제외
      // Flat Config 와 독립된 ignore객체
      ignores: ['node_modules'],
    },
    // ts를 린트하기 위한 파서 및 설정
    ...compat.config({
      parser: '@typescript-eslint/parser',
      // 해당 프로젝트의 tsconfig.json 파일 지정
      parserOptions: {
        project: tsconfigPath,
        sourceType: 'module',
        tsconfigRootDir: projectPath,
      },
      plugins: ['@typescript-eslint'],
      // ts 권장 규칙 세트
      extends: ['plugin:@typescript-eslint/recommended'],
      root: true,
      // Node.js,Jest 두가지가 전역 변수를 인식할수있게
      // 해당 환경의 코드를 오류 없이 린트
      env: {
        node: true,
        jest: true,
      },
      rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        // function 명시적인 반한 타입 지정 강제 off (타입 추론을 허용)
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        // any타입 허용 (개발 속도 관련)
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        'no-unused-vars': 'off',
        // 사용하지 않는 변수 기본 JS규칙 off => 해당 규칙 적용
        // _로 시작하는 인자, 변수 등은 사용되지 않더라도 린트 오류에서 제외
        '@typescript-eslint/no-unused-vars': [
          'off',
          {
            ignoreRestSiblings: true,
            argsIgnorePattern: '^_',
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            varsIgnorePattern: '^_',
          },
        ],
      },
    }),
  ] satisfies Linter.Config[]
}

export default baseConfig
