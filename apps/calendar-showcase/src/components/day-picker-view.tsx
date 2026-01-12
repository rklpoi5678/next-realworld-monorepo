'use client';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

export const DayPickerView = () => {
  const [selected, setSelected] = useState<Date>();

  return (
    <div className="flex flex-col md:flex-row gap-0 items-stretch justify-center overflow-hidden bg-white rounded-3xl shadow-2xl border border-gray-200">
      {/* 왼쪽: 달력 영역 (강조) */}
      <div className="p-8 bg-slate-900 text-white">
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={setSelected}
          locale={ko}
          // DayPicker 내부 스타일 커스텀
          modifiersStyles={{
            selected: {
              backgroundColor: '#3b82f6', // blue-500
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '50%',
            },
            today: {
              color: '#3b82f6',
              fontWeight: 'bold',
            },
          }}
          styles={{
            month_caption: { color: '#f8fafc' },
            weekday: { color: '#94a3b8' },
          }}
        />
      </div>

      {/* 오른쪽: 정보 표시 영역 (깔끔한 화이트) */}
      <div className="flex-1 p-10 flex flex-col justify-center bg-white">
        <div className="mb-6">
          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-md">
            Selected Status
          </span>
          <h3 className="text-3xl font-black text-slate-900 mt-4 tracking-tight">
            {selected ? format(selected, 'MMMM do', { locale: ko }) : '날짜 미선택'}
          </h3>
          <p className="text-slate-500 mt-2 font-medium">
            {selected
              ? `${format(selected, 'EEEE', { locale: ko })} 일정 확인 가능`
              : '달력에서 확인하고 싶은 날짜를 클릭하세요.'}
          </p>
        </div>

        <div
          className={`mt-4 p-5 rounded-2xl transition-all duration-500 ${
            selected
              ? 'bg-blue-50 border-2 border-blue-500/20'
              : 'bg-slate-50 border-2 border-dashed border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                selected ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'
              }`}
            />
            <p className={`text-sm font-bold ${selected ? 'text-blue-700' : 'text-slate-400'}`}>
              {selected ? '데이터 동기화 완료' : '날짜 대기 중...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayPickerView;
