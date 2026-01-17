# 프로젝트 아키텍처 및 학습 가이드

## 🇰🇷 프로젝트 의도
이 저장소는 `alan2207/bulletproof-react`의 프로젝트를 참고하여, **Next.js 16**과 **React 19**로 변경하였습니다. 어떻게 녹여낼지 학습하기 위해 제작되었습니다.

## 핵심 학습 포인트

### 1. React 19 Action 및 폼 처리
기존의 복잡한 상태 관리 대신, React 19의 `Action` 개념과 `useActionState`, `useOptimistic` 훅을 사용하여 선언적으로 비동기 로직을 처리하는 방법을 제시합니다.

### 2. Next.js 16 서버 컴포넌트(RSC)
- **Async Params**: Next.js 16의 필수 변경 사항인 비동기 `params` 처리 방식을 적용했습니다.
- **Server Prefetching**: 서버에서 데이터를 미리 가져오고 클라이언트에서 `HydrationBoundary`로 이어받는 최적화된 흐름을 구현합니다.

### 3. TanStack Query v5와 Suspense
- `useSuspenseQuery`를 사용하여 명령형 로딩 처리를 제거하고, React의 `Suspense`를 활용한 선언적 UI 구조를 구축합니다.

### 4. Tailwind CSS v4
- 엔진인 Tailwind v4를 적용하여 더 빠른 빌드 속도와 단순해진 설정 방식을 경험할 수 있습니다.