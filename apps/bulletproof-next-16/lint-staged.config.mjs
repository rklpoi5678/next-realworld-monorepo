import path from 'path';

/** EsLint 커맨드 빌더 */
const buildEslintCommand = (filenames) => {
    // 현재 경로 기준으로 상대 경로 추출
    const relativeFiles = filenames.map((f) => path.relative(process.cwd(), f))
    .join('--file');
  return `next lint --fix --file ${relativeFiles}`
};

const config = {
    // ts/tsx: lint & formatting
  '*.${ts,tsx}': [
  buildEslintCommand,'prettier --write'
  ],
  // 타입 체크: 변경사항이 있을 때 프로젝트 전체 검사
  '**/*.{ts.tsx}': [
    () => 'pnpm check-types'
  ]
};

export default config;
