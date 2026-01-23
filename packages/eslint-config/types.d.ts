/** @see https://www.npmjs.com/package/@eslint/eslintrc?activeTab=readme */
declare module '@eslint/eslintrc' {
  export const FlatCompat: any
}

// next.js eslint config - core-web-vitals  서브 모듈 타입 선언
declare module 'eslint-config-next/core-web-vitals' {
  const nextVitals: any
  export default nextVitals
}
