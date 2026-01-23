import {DayPickerView} from "@/components/day-picker-view";
import NextLink from "next/link";
import { ChevronLeft, CalendarDays } from "lucide-react";

export default function DayPickerPage() {
  return (
    // 배경을 어둡게 설정하여 중앙 카드가 돋보이게 함
    <div className="min-h-screen bg-slate-950">
      <header className="flex items-center justify-between px-8 py-6 bg-slate-900/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
        <NextLink href="/" className="flex items-center text-slate-400 hover:text-white transition-all group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="ml-1 font-semibold">Back to Home</span>
        </NextLink>
        <div className="flex items-center gap-2 text-white">
          <CalendarDays size={20} className="text-blue-500" />
          <h1 className="text-sm font-black tracking-widest uppercase">DayPicker Edition</h1>
        </div>
        <div className="w-20"></div>
      </header>

      <main className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* 타이틀 섹션 */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">
              Pick Your <span className="text-blue-500">Moment.</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium max-w-md mx-auto">
              가장 가볍고, 가장 빠르며, 가장 아름다운 <br />
              날짜 선택 경험을 제공합니다.
            </p>
          </div>

          {/* 컴포넌트 메인 */}
          <DayPickerView />

          {/* 하단 장점 포인트 (카드 스타일 변경) */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-slate-900 rounded-3xl border border-white/5 hover:border-blue-500/50 transition-colors">
              <h4 className="text-white font-bold text-lg mb-2">High Contrast UI</h4>
              <p className="text-slate-400 leading-relaxed text-sm">다크 모드 기반의 고대비 인터페이스로 가독성을 극대화했습니다.</p>
            </div>
            <div className="p-8 bg-slate-900 rounded-3xl border border-white/5 hover:border-purple-500/50 transition-colors">
              <h4 className="text-white font-bold text-lg mb-2">Precision Control</h4>
              <p className="text-slate-400 leading-relaxed text-sm">React 19와 TypeScript를 사용하여 정밀한 날짜 연산을 보장합니다.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}