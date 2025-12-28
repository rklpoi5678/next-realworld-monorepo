/**
 * 모든 API 주소를 한 곳에 모아둔다. 그래고 타입으로 해당 주소들만 허용하는 타입을 생성한다.
 */
export const API_ENDPOINTS = {
  CURRENT_USER: '/api/user',
  // other API...  (ex: ARTICLES: '/api/articles')
} as const
// 'as const' => 이 객체의  모든 속성을 읽기 전용(readonly)상수로 만듬
// ts가 string타입이 아닌 => 'api/user'라는 '특정 값' 타입으로 인식을 하겠지요

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS]
/**
 * typeof API_ENDPOINTS:
 *  API_ENDPOINTS obj <-> TS type을 가져옴
 *  type { readonly CURRENT_USER: '/api/user';} 형태
 *
 * keyof typeof API_ENDPOINTS:
 *  해당 타입의 모든 키들의 유니언 타입
 *  타입은 'CURRENT_USER' 형태
 *
 * swr-provider 에 fetcher 함수에 url을 직접 문자열로 입력보단 정의된 타입을 사용할수있다.
 * 추후 swr.useSWR('/api/userrr'); 라면 당연히 오류를 타입스크립트가 잡아주지 못하겠지요
 * 또한 이곳에서만 정의되니 프로젝트 전체에 변경 사항이 반영됨 (config/path도 비슷한)
 */
