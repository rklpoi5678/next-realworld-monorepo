import fs from 'node:fs';
import path from 'node:path';
import { PlopGeneratorConfig } from 'plop';

/** Feature 목록 동적 로드 */
const featuresDir = path.join(process.cwd(), 'src/features');
let features: string[] = [];

try {
  if (fs.existsSync(featuresDir)) {
    features = fs.readdirSync(featuresDir).filter((file) => {
      // dir만 필터링 (파일 제외)
      return fs.statSync(path.join(featuresDir, file)).isDirectory();
    });
  }
} catch (error) {
  console.error('Features directory not found or inaccessible');
}

/** 컴포넌트 생성기 설정*/
export const componentGenerator: PlopGeneratorConfig = {
  description: 'Component Generator',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: '컴포넌트의 이름을 입력하세요 (kebab-case)',
      validate: (value: string) => {
        if (!value) return '이름은 필수입니다.';
        return true;
      },
    },
    {
      type: 'list',
      name: 'feature',
      message: '이 컴포넌트는 어느 feature에 속합니까?',
      choices: ['components', ...features],
      when: () => features.length > 0,
    },
    {
      type: 'input',
      name: 'folder',
      message: 'src/components 내의 하위 폴더명을 입력해주세요 (예: ui, layouts):',
      // feature을 선택하지 않았거나 'components'를 선택한 경우 질문
      when: ({ feature }) => !feature || feature === 'components',
      default: 'ui',
    },
  ],
  actions: (data) => {
    // 답변에 따른 생성 경로 설정
    const isSharedComponent = !data?.feature || data.feature === 'components';

    // base경로 결정
    const basePath = isSharedComponent
      ? 'src/components/{{folder}}'
      : 'src/features/{{feature}}/components';
    
    // 모든 파일이 컴포넌트 이름으로 된 폴더 안에 들어가도록 경로 구성
    const componentPath = `${basePath}/{{kebabCase name}}`;

    // 파일 생성 액션 리스트
    return [
      {
        type: 'add',
        path: componentPath + '/index.ts',
        templateFile: 'generators/component/index.ts.hbs',
      },
      {
        type: 'add',
        path: componentPath + '/{{kebabCase name}}.tsx',
        templateFile: 'generators/component/component.tsx.hbs',
      },
      {
        type: 'add',
        path: componentPath + '/{{kebabCase name}}.stories.tsx',
        templateFile: 'generators/component/component.stories.tsx.hbs',
      },
    ];
  },
};