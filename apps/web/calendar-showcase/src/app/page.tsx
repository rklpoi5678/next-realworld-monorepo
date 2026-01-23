import { Calendar, LayoutDashboard, MousePointer2, Zap } from 'lucide-react';
import NextLink from 'next/link';

export default function home() {
  const showcases = [
    {
      title: 'FullCalendar',
      description: '여러 기능을 제공하고 많이 사용하는 표준 달력 라이브러리입니다.',
      href: '/full-calendar',
      features: ['Drag & Drop', 'Timegrid view', 'Event Interaction'],
      color: 'blue',
    },
    {
      title: 'DayPicker',
      description: '가볍고 커스텀이 자유로운 날짜 선택 위젯입니다.',
      href: '/day-picker',
      features: ['React-focused', 'Highly Accessible', 'Lightweight'],
      color: 'purple',
    },
    {
      title: 'BigCalendar',
      description: 'event 캘린더에 최적화되어있습니다. 커스텀이 용이하다',
      href: '/big-calendar',
      features: ['React-focused', 'Highly Accessible', 'Lightweight'],
      color: 'red',
    },
    {
      title: 'CossEventCalendar',
      description: 'Shadcn/ui 를 이용하여 매우 간편하고 개발자 친화적이다.',
      href: '/coss-event-calendar',
      features: ['React-focused', 'Highly Accessible', 'Lightweight'],
      color: 'yellow',
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50/50">
      <section className="py-20 px-8 text-center bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-2 mb-4 bg-blue-50 text-blue-600 rounded-2xl">
            <Calendar size={24} className="mr-2" />
            <span className="font-semibold text-sm">Calendar Showcase</span>
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            어떤 달력이 프로젝트에 <br />
            <span className="text-blue-600">가장 적합할까요?</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            UI/UX 요구사항에 맞춰 최적화된 달력 패키지를 직접 체험해 보세요. <br />
            React 19와 Next.js 16 환경에서 완벽하게 작동합니다.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto py-16 px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {showcases.map((item) => (
            <NextLink
              key={item.title}
              href={item.href}
              className="group relative bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl bg-${item.color}-100 text-${item.color}-600`}>
                  <LayoutDashboard size={28} />
                </div>
                <div className="text-gray-300 group-hover:text-blue-500 transition-colors">
                  <MousePointer2 size={24} />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-3">{item.title}</h2>
              <p className="text-gray-500 mb-6 leading-relaxed">{item.description}</p>

              <div className="flex flex-wrap gap-2 mb-8">
                {item.features.map((f) => (
                  <span
                    key={f}
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
                  >
                    {f}
                  </span>
                ))}
              </div>

              <div className="flex items-center text-sm font-bold text-blue-600 group-hover:gap-2 transition-all">
                실행 화면 보기 <Zap size={16} className="ml-1" />
              </div>
            </NextLink>
          ))}
        </div>
      </section>

      <footer className="text-center py-10 border-t border-gray-400">
        <p className="text-sm text-gray-400">Powered by Next.js 16 & Tailwind CSS 4</p>
      </footer>
    </main>
  );
}
