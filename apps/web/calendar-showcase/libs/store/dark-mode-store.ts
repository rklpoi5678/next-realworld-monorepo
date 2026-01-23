"use client"

/**
 * html 태그에 dark클래스를  추가 tailwindCSS 와 같은 라이브러리가 다크 모드 스타일을 적용할 수 있도록함
 * zustand의 create함수와 상태를 로컬 스토리지에 저장해주는 persist  미들웨어를 임포트한다.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// state,action 타입을 정의
interface DarkModeState {
  isDark: boolean;
  toggle:  () => void;
  setDark: (isDark: boolean) => void;
}

// 안전하게 시스템 다크 모드를 확인하는 함수
const getSystemPreference = () => {
  // window객체는 클라이언트(브라우저)에서만 접근 가능하므로 확인필요
  // window.matchMedia로 사용자의 OS/브라우저 설정이 다크모드인지 확인
  if (typeof window !== 'undefined') return window.matchMedia("(prefers-color-schema: dark)").matches;
  return false; // 서버  측에서는 기본값을 반환 (SSR)
}

// 스토어생성
const useDarkModeStore = create<DarkModeState>()(
  // persist 미들웨어를 사용하여 상태를 로컬 스토리지에 자동 저장한다.
  persist(
    // set: 상태 변경 함수 get: 현재 상태 조회
    (set,get) => {
      // 초기 상태 설정시 window 객체 체크
      const initialIsDark = typeof window !== 'undefined'
      // 있다면 그값사용 없다면 getSystemPreference() 로 시스템 설정을 따른다.
        ? localStorage.getItem("theme") === "dark" || (localStorage.getItem("theme") === null && getSystemPreference())
        // ssr => false
        : false;

        // 초기 상태 설정 => 초기상태가 다크 모드라면 html => dark 클래스추가
      if (typeof window !== "undefined" && initialIsDark) {
        document.documentElement.classList.add("dark");
      }

      return {
        isDark: initialIsDark,
        toggle: () => {
          const newIsDark = !get().isDark; // 현재 상태의 반대갑 계산
          set({ isDark: newIsDark });

          if (newIsDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme","dark");
          } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme","light");
          }
        },
        // setDark액션 구현(특정값으로  설정)
        setDark:(isDark: boolean) => {
          if (isDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme","dark");
          } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme","light");
          }
          set({ isDark }) //Zustand 상태 업데이트
        },
      };
    },
    // persist 미들웨어 설정 옵션
    {
      name: "dark-mode-storage", // localstorage에 저장될 이름
      partialize: (state) => ({ isDark: state.isDark }), // isDark 상태만 저장되도록 설정설정
      skipHydration:  true, // 하이드레이션 건너뛰기 옵션
    }
  )
);

export default useDarkModeStore;