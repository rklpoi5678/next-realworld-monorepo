import { type ClassValue, clsx}  from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 *  여러 개의 테일윈드 클래스 조건부 결합
 * 스타일 충돌을 해결하는 유틸리티 함수 
 * @param inputs  - 결합할 클래스 값들의 배열 (문자열, 객체, 배열, 불리언 등 가능)
 * @returns  최적화되어 하나로 합쳐진 클래스 문자열
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}