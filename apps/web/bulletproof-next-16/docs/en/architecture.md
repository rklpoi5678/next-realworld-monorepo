# Project Architecture & Learning Guide

## 🇺🇸 Motivation
This repository maintains the proven architecture of `alan2207/bulletproof-react` while modernizing it to explore how the major shifts in **Next.js 16** and **React 19** can be applied to real-world applications.

## Key Learning Points

### 1. React 19 Actions & Form Handling
Instead of complex state management, this project demonstrates declarative asynchronous logic using React 19's `Action` concept and hooks like `useActionState` and `useOptimistic`.

### 2. Next.js 16 Server Components (RSC)
- **Async Params**: Implemented the mandatory asynchronous `params` handling introduced in Next.js 16.
- **Server Prefetching**: Optimized flow by prefetching data on the server and hydrating it via `HydrationBoundary` on the client.

### 3. TanStack Query v5 & Suspense
- Removed imperative loading checks by using `useSuspenseQuery`, building a declarative UI structure with React's `Suspense`.

### 4. Tailwind CSS v4
- Experience faster build times and a simplified configuration process with the next-generation Tailwind v4 engine.