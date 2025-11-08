module.exports = {
  '*.{js,jsx,ts,tsx,mjs,mts}': [
    // pnpm -r 로 모노레포 모든 워크스페이스 재귀적으로 실행
    // --fix: 자동 수정 가능한 오류 즉시 수정
    // --max-warnings=0: 경고도 오류로 간주 => 커밋을 실패시킨다.
    'pnpm -r eslint --fix --max-warnings=0',
  ],
}
