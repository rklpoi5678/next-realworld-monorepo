FROM node:24-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 루트 설정 복사
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
# 앱의 package.json을 원래 앱의 경로에 복사
COPY apps/server/first-devops-test/package.json ./apps/server/first-devops-test/

# frozen-lockfile로 보안 및 일관성 유지
RUN pnpm install --frozen-lockfile

COPY  . .
RUN pnpm run build --filter first-devops-test-backend-app

FROM node:24-alpine
WORKDIR /app

COPY --from=builder /app/apps/server/first-devops-test/dist ./apps/server/first-devops-test/dist
COPY --from=builder /app/apps/server/first-devops-test/package.json ./apps/server/first-devops-test/package.json
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./

RUN corepack enable && corepack prepare pnpm@latest --activate
# Husky 등 라이프사이클 스크립트 실행 방지
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

WORKDIR /app/apps/server/first-devops-test

EXPOSE 4000
CMD [ "pnpm", "start" ]