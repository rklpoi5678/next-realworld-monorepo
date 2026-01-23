"use client"
import { BigCalendarView } from '@/components/big-calendar-view';
import NextLink from 'next/link';
import { ChevronLeft, LayoutPanelTop, Monitor } from 'lucide-react';

export default function BigCalendarPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* 전문적인 헤더 디자인 */}
      <header className="bg-indigo-900 text-white px-8 py-5 flex items-center justify-between shadow-lg">
        <NextLink
          href="/"
          className="flex items-center text-indigo-200 hover:text-white transition-all"
        >
          <ChevronLeft size={22} />
          <span className="font-bold ml-1 text-sm uppercase tracking-wider">Showcase Home</span>
        </NextLink>
        <div className="flex items-center gap-3">
          <LayoutPanelTop className="text-indigo-400" />
          <h1 className="text-xl font-black tracking-tight italic">BIG_CALENDAR</h1>
        </div>
        <div className="hidden md:block">
          <span className="text-xs font-medium bg-indigo-800 px-3 py-1 rounded-full border border-indigo-700">
            Enterprise Grade
          </span>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* 왼쪽 설명 섹션 */}
          <div className="lg:w-1/4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <Monitor className="text-indigo-600 mb-4" size={32} />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">대형 화면에 최적화</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Big Calendar는 화면 전체를 사용하는 대시보드에 최적화되어 있습니다. FullCalendar보다
                가볍고, React 컴포넌트 기반으로 커스텀이 매우 용이합니다.
              </p>
            </div>

            <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg">
              <h3 className="font-bold mb-2">Key Highlights</h3>
              <ul className="text-xs space-y-2 text-indigo-100 italic">
                <li>• Flexbox 기반의 가변 그리드</li>
                <li>• date-fns / moment 완벽 지원</li>
                <li>• 경량화된 패키지 사이즈</li>
              </ul>
            </div>
          </div>

          {/* 오른쪽 캘린더 메인 */}
          <div className="flex-1 w-full">
            <BigCalendarView />
          </div>
        </div>
      </main>

      {/* 스타일 보정 (App Router에서 Big Calendar 스타일을 덮어쓰기 위해 필요) */}
      <style jsx global>{`
        .rbc-calendar {
          font-family: inherit;
        }
        .rbc-toolbar button {
          border-radius: 8px !important;
          border: 1px solid #e2e8f0 !important;
          color: #475569 !important;
          font-weight: 600 !important;
        }
        .rbc-toolbar button.rbc-active {
          background-color: #4f46e5 !important;
          color: white !important;
        }
        .rbc-header {
          padding: 10px 0 !important;
          font-weight: 700 !important;
          color: #64748b;
        }
      `}</style>
    </div>
  );
}
