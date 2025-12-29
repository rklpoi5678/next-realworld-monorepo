import type { Preview, StoryFn } from '@storybook/react';
/** 전역 CSS(경로확인) */
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    // actions 설정: argTypesRegex대신 명시적인 매칭 사용 권장
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    /** App Router 환경 시뮬레이션 */
    nextjs: {
      appDirectory: true,
    },
  },
  /** Decorators */
  decorators: [
    (Story: StoryFn) => (
      <div className="font-sans antialiased">
        <Story />
      </div>
    ),
  ],
};

export default preview;
