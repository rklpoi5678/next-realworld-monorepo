/** @type {import('@commitlint/types').UserConfig} */
const config = {
  /*
   * @commitlint/config-conventional 규칙을 상속받습니다.
   * 이는 가장 대중적인 'Conventional Commits' 규격을 기본으로 사용하겠다는 의미입니다.
   * 예: type(scope): subject
   */   
  extends: ['@commitlint/config-conventional'],
  /*
   * 프로젝트에 맞게 커스텀 규칙을 정의합니다.
   * 규칙 구조: [Level, Applicability, Value]
   * Level: 0 (끄기), 1 (경고), 2 (에러 - 커밋 차단)
   * Applicability: 'always' (항상 적용), 'never' (반대로 적용)
   */
  rules: {
    // 커밋 메시지의 '타입(Type)'으로 사용할 수 있는 단어들을 제한합니다. (기본 소문자로 컨밴션)
    'type-enum': [
      2,                            // 에러 레벨 (규칙 위반 시 커밋 실패)
      'always',                 // 항상 이 규칙을 준수해야 함
      [
        'feat',                    // 새로운 기능 추가
        'fix',                      // 버그 수정
        'docs',                  // 문서 변경 (README 등)
        'style',                  // 코드 포맷팅, 세미콜론 누락 등 (로직 변경 없음)
        'refactor',             // 코드 리팩토링 (기능 변화 없는 구조 개선)
        'test',                    // 테스트 코드 추가 및 수정
        'chore',                // 기타 잡무 (패키지 매니저 설정, 빌드 업무 등)
        'build'                  // 빌드 시스템이나 외부 의존성 관련 변경
      ],
    ],

    // 커밋 메시지 제목(subject)의 최대 길이를 설정합니다.
    'subject-max-length': [
      2,                         // 에러 레벨
      'always', 
      100                      // 제목은 공백 포함 최대 100자까지만 허용
    ],
  },
};

export default config;