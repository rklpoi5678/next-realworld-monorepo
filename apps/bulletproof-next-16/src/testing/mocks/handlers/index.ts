import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

import { networkDelay } from '../utils';
import { authHandlers } from './auth';
import { commentsHandlers } from './comments';
import { discussionsHandlers } from './discussions';

/** 모든 도메인별 핸들러 통합 */
export const handlers = [
  ...authHandlers,
  ...commentsHandlers,
  ...discussionsHandlers,
  /** 공통 / 유틸리티 핸들러 */
  http.get(`${env.API_URL}/healthcheck`, async () => {
    //인위적인 네트워크 지연 추가 (개발 환경에서 체감을 위해)
    await networkDelay();

    return HttpResponse.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  }),
];
