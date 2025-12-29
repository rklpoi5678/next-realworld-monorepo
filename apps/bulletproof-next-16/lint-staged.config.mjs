import path from 'path';

/** EsLint 커맨드 빌더 */
const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;

const config = {
    // ts/tsx: lint & formatting
  '*.{js,jsx,ts,tsx}': [buildEslintCommand,'prettier --write'],
  // 타입 체크: 변경사항이 있을 때 프로젝트 전체 검사
  '**/*.{ts,tsx}': [() => 'pnpm check-types']
};

export default config;
