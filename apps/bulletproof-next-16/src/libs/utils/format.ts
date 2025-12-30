import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

/**
 *  날짜를 형식 (지금코드에선 December 30, 2025 11:15 AM)으로 변환
 * @param date - number(timestamp), string(ISO) or Date 객체 모두
 * @returns  - 포맷팅된 날짜 문자열 반환
 */

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (date: number | string | Date, tz: string = 'Asia/Seoul'): string => {
  const parsed = dayjs(date).tz(tz);

  if (!parsed.isValid()) {
    throw new Error('Invalid date provided to formatDate');
  }

  return dayjs(date).format('MMMM D, YYYY h:mm A');
};
