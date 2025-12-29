import { createMiddleware } from '@mswjs/http-middleware';
import cors from 'cors';
import express from 'express';
import logger from 'pino-http';

import { initializeDb } from '@/testing/mocks/db';
import { handlers } from '@/testing/mocks/handlers';

/** MSW 브라우저의 Service Worker방식이 아니라  별도의 Express서버를 띄워 실제 네트워크 요청을 처리하는 방식*/
const app = express();
const port = process.env.NEXT_PUBLIC_MOCK_API_PORT || 4000;

app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  logger({
    level: 'info',
    // 보안을 위해 헤더 정보 제외
    redact: ['req.headers', 'res.headers'],
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  }),
);

// MSW v2 Handler - Express 미들웨어로 변환하여 적용
app.use(createMiddleware(...handlers));

initializeDb()
  .then(() => {
    console.log('Mock DB initialized');
    app.listen(port, () => {
      console.log(`Mock API Server Started At http://localhost:${port}}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize Mock DB:', err);
  });
