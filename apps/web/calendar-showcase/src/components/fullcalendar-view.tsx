'use client';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export const FullCalendarView = () => {
  const events = [
    { title: 'show-case-calendar', date: '2026-01-12' },
    { title: 'GitHub commit', date: '2026-01-15', color: '#3b82f6' },
  ];

  const handleDateClick = (arg: { dateStr: string }) => {
    alert(`선택한 날짜: ${arg.dateStr}`);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-black">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev.next today',
          center: 'title',
          right: 'dayGridMonth, timeGridWeek, timeGridDay',
        }}
        events={events}
        dateClick={handleDateClick}
        editable={true}
        selectable={true}
        height="auto"
      />
    </div>
  );
};
