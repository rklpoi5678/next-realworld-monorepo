import { FullCalendarView } from '@/components/fullcalendar-view';
import NextLink from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function FullCalendarPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비게이션 */}
      <header className="flex items-center justify-between px-8 py-4 border-b">
        <NextLink
          href="/"
          className="flex items-center text-gray-500 hover:text-black transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="ml-1 font-medium">돌아가기</span>
        </NextLink>
        <h1 className="text-lg font-bold text-gray-800">FullCalendar 데모</h1>
        <div className="w-20"></div> {/* 밸런스 유지용 */}
      </header>

      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">이벤트 스케줄러</h2>
            <p className="text-gray-500 text-sm">일정을 클릭하거나 드래그하여 관리해 보세요.</p>
          </div>

          <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <FullCalendarView />
          </div>
        </div>
      </main>
    </div>
  );
}
