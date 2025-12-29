import type { StorybookConfig } from '@storybook/nextjs';
import type { PropItem} from 'react-docgen-typescript'

const config: StorybookConfig = {
  /** 최신 스토리 파일 패턴 (mdx 파일 확장자 변경 반영) */
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  /** essentials에 actions, docs, controls, viewport 등이 모두 포함되어있음(즉 현재 최신버전에서 불필요) */
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],

  /** 프레임워크 설정 (객체 형태로 세부 옵션 제어 가능) */
  framework: {
    name: '@storybook/nextjs',
    options: {
      builder: {
        useSWC: true, // 성능 향상을 위해 SWC사용
      },
    },
  },

  /** 문서화 설정 */
  docs: {
    autodocs: 'tag',
  },

  /** 정적 파일 경로 (public폴더 내 이미지 등 사용 시)*/
  staticDirs: ['../public'],

  /** TS설정 (Storybook은 기본적으로 react-docgen사용)  */
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
      // 속성 설명은 더 깔끔하게
      propFilter: (prop: PropItem) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
};

export default config;
