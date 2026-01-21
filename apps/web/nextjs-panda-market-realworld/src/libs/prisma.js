/** @see https://accelerate-speed-test.prisma.io/?utm_source=github&utm_medium=accelerate-readme#testArea */
import { withAccelerate } from '@prisma/extension-accelerate';

import { PrismaClient } from './generated/prisma-client/index.js';

// Accelerate 확장 기능을 적용 .withAccelerate()를 사용하면 Prisma Data Proxy를 통해 데이터베이스에 연결
const prisma = new PrismaClient().$extends(withAccelerate());

// Node.js global
// Prisma Client 인스턴스를 한 번만 생성하도록 관리
const globalForPrisma = global;

if (process.env.NODE_ENV !== 'production') {
  if (!globalForPrisma.prisma) {
    // 현재 생성된 인스턴스를 전역 객체에 저장
    globalForPrisma.prisma = prisma;
  }
}

export default prisma;
