import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

/** 모든 도메인별 핸들러 통합 */
export const handlers = [
  /** 공통 / 유틸리티 핸들러 */
  http.get(`${env.API_URL}/healthcheck`, async () => {
    //인위적인 네트워크 지연 추가 (개발 환경에서 체감을 위해)

    return HttpResponse.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  }),
];
