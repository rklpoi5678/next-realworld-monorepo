import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

import { db } from '../db';
import { networkDelay } from '../utils';

export const teamsHandlers = [
  /** 모든 팀 목록 조회 */
  http.get(`${env.API_URL}/teams`, async () => {
    await networkDelay();

    try {
      const result = db.team.getAll();
      
      return HttpResponse.json({ 
        data: result 
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Server Error';
      
      return HttpResponse.json(
        { message }, 
        { status: 500 }
      );
    }
  }),
];