'use client';

import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { ko } from 'date-fns/locale';
import { format, getDay, parse, startOfWeek } from 'date-fns';

// date-fns -> localizer
const locales = {
  ko: ko,
};

const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export const BigCalendarView = () => {
  const events = [
    {
      title: '팀 주간 회의',
      start: new Date(2026, 0, 12, 10, 0), //2026-01-12 10:00
      end: new Date(2026, 0, 12, 12, 0),
    },
    {
      title: 'EduOps 배포 작업',
      start: new Date(2026, 0, 14, 14, 0),
      end: new Date(2026, 0, 14, 16, 0),
    },
    {
      title: '숙면',
      start: new Date(2026, 0, 16, 0, 0),
      end: new Date(2026, 0, 16, 23, 59),
    },
  ];

  return (
    <div className="h-[600px] bg-white p-6 rounded-2xl shadow-xl border text-gray-800 border-gray-200">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.MONTH}
        views={['month', 'week', 'day']}
        culture="ko"
        messages={{
          next: '다음',
          previous: '이전',
          today: '오늘',
          month: '월',
          week: '주',
          day: '일',
        }}
        eventPropGetter={() => ({
          className: '!bg-indigo-600 !rounded-lg !border-none !text-xs !p-1 shadow-sm',
        })}
      />
    </div>
  );
};
