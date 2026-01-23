'use client';

import { addDays, setHours, setMinutes, subDays } from 'date-fns';
import { useState } from 'react';
import { EventCalendar } from '@/components/event-calendar/event-calendar';
import type { CalendarEvent } from '@/components/event-calendar';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const samepleEvents: CalendarEvent[] = [
  {
    allDay: true,
    color: 'sky',
    description: '내년도 전략 수립 회의',
    end: subDays(new Date(), 23),
    id: '1',
    location: '메인 컨퍼런스 홀',
    start: subDays(new Date(), 24),
    title: '연간 계획 수립',
  },
  {
    color: 'amber',
    description: '최종 결과물 제출',
    end: setMinutes(setHours(subDays(new Date(), 9), 15), 30),
    id: '2',
    location: '사무실',
    start: setMinutes(setHours(subDays(new Date(), 9), 13), 0),
    title: '프로젝트 마감',
  },
  {
    allDay: true,
    color: 'orange',
    description: '분기별 예산 집행 검토',
    end: subDays(new Date(), 13),
    id: '3',
    location: '제2 회의실',
    start: subDays(new Date(), 13),
    title: '분기 예산 리뷰',
  },
  {
    color: 'sky',
    description: '주간 팀 싱크업',
    end: setMinutes(setHours(new Date(), 11), 0),
    id: '4',
    location: '회의실 A',
    start: setMinutes(setHours(new Date(), 10), 0),
    title: '팀 주간 회의',
  },
  {
    color: 'emerald',
    description: '신규 프로젝트 요구사항 논의',
    end: setMinutes(setHours(addDays(new Date(), 1), 13), 15),
    id: '5',
    location: '시내 카페',
    start: setMinutes(setHours(addDays(new Date(), 1), 12), 0),
    title: '클라이언트 오찬',
  },
  {
    allDay: true,
    color: 'violet',
    description: '신제품 시장 출시',
    end: addDays(new Date(), 6),
    id: '6',
    start: addDays(new Date(), 3),
    title: '제품 출시 행사',
  },
];

export default function CossEventCalendar() {
  const router = useRouter();
  const [events, setEvents] = useState<CalendarEvent[]>(samepleEvents);

  const handleEventAdd = (event: CalendarEvent) => {
    const newEvent = { ...event, id: event.id || crypto.randomUUID() };
    setEvents((prev) => [...prev, newEvent]);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)));
  };

  const handleEventDelete = (eventId: string) => {
    if (confirm('일정을 삭제하시겠습니까?')) {
      setEvents(events.filter((event) => event.id !== eventId));
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-1"
        >
          <ChevronLeft size={16} />
          <span>뒤로가기</span>
        </Button>
        <h1 className="text-xl font-bold tracking-tight">이벤트 캘린더</h1>
      </div>
      <div className="flex-1 border rounded-xl overflow-hidden bg-white shadow-sm">
        <EventCalendar
          events={events}
          onEventAdd={handleEventAdd}
          onEventDelete={handleEventDelete}
          onEventUpdate={handleEventUpdate}
        />
      </div>
    </div>
  );
}
