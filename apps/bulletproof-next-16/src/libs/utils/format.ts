import dayjs from 'dayjs'

/**
 *  날짜를 형식 (지금코드에선 December 30, 2025 11:15AM)으로 변환
 * @param date - number(timestamp), string(ISO) or Date 객체 모두 
 * @returns  - 포맷팅된 날짜 문자열 반환
 */
export const formatDate = (date: number | string | Date) => 
    dayjs(date).format('MMMM D, YYYY h:mm A')