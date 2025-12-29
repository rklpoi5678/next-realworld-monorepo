import { NodePlopAPI } from 'plop';
import { componentGenerator } from './generators/component/index';

/**
 * plop 설정 함수
 * import/no-anonymous-default-export rules 방지하기위헤 'plopfile'이름 부여
 * @param {import('plop').NodePlopAPI} plop
 */
export default function plopflie(plop: NodePlopAPI): void {
  // 컴포넌트 생성기 등록
  plop.setGenerator('component', componentGenerator);

  // feature 생성기를 등록하면 프로젝트 관리가 더 편해진다.
  // plop.setGenerrator('feature', featureGenerator);
}
