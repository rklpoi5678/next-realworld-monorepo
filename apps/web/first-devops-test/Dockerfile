FROM node:24-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# 루트 설정 복사
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
# 앱의 package.json을 원래 앱의 경로에 복사
COPY apps/web/first-devops-test/package.json ./apps/web/first-devops-test/

# frozen-lockfile로 보안 및 일관성 유지
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build --filter first-devops-test-web-app

FROM node:24-alpine
WORKDIR /app

COPY --from=builder /app/apps/web/first-devops-test/.next ./apps/web/first-devops-test/.next
COPY --from=builder /app/apps/web/first-devops-test/public ./apps/web/first-devops-test/public
COPY --from=builder /app/apps/web/first-devops-test/package.json ./apps/web/first-devops-test/package.json
COPY --from=builder /app/pnpm-lock.yaml /app/package.json /app/pnpm-workspace.yaml ./

RUN corepack enable && corepack prepare pnpm@latest --activate
# Husky 등 라이프사이클 스크립트 실행 방지
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

EXPOSE 3000
WORKDIR /app/apps/web/first-devops-test
CMD [ "pnpm", "start" ]