# PDF Seeder Pipeline (검품기준서 데이터 파이프라인)

B-Mark PWA의 검품기준서 PDF를 파싱하여 Cloudflare D1 + R2에 적재하는 로컬 데이터 파이프라인.

## 사전 준비

- Node.js 20+
- Java 11+ (`java -version` 확인)
- Cloudflare 계정 (R2 버킷 + D1 데이터베이스)

## 설치

```bash
pnpm install
cp .env.example .env
# .env 파일에 Cloudflare 계정 정보 입력
```

## 사용법

### 1단계: PDF 파싱

```bash
# 신선 파트
PART=fresh PDF_PATH=./검품기준서_신선.pdf node scripts/parse.js

# 축산 파트
PART=frozen PDF_PATH=./검품기준서_축산.pdf node scripts/parse.js
```

출력: `data/data.json` + `data/images/`

### 2단계: R2 업로드 + D1 적재

```bash
node scripts/seed.js
```

출력: R2 버킷에 이미지 업로드, D1 `inspection_rules` 테이블에 데이터 INSERT, `data/data.final.json` 생성.

### D1 테이블 생성 (최초 1회)

```bash
cd ../bmark-pwa
npx wrangler d1 execute bmark-accounts --file=../other/next-realworld-monorepo/apps/web/opendataloader-pdf-seeder-ko/scripts/migrations/001_inspection_rules.sql
```

## 환경 변수

| 변수 | 설명 |
|------|------|
| `CF_ACCOUNT_ID` | Cloudflare Account ID |
| `CF_API_TOKEN` | Cloudflare API Token (D1 edit 권한) |
| `CF_D1_DATABASE_ID` | D1 Database UUID |
| `CF_R2_ACCESS_KEY_ID` | R2 Access Key ID |
| `CF_R2_SECRET_ACCESS_KEY` | R2 Secret Access Key |
| `CF_R2_ENDPOINT` | R2 S3 endpoint URL |
| `CF_R2_BUCKET_NAME` | R2 버킷 이름 |
| `CF_R2_PUBLIC_URL` | R2 퍼블릭 URL (커스텀 도메인 또는 `pub-<hash>.r2.dev`) |
| `PDF_PATH` | 파싱할 PDF 파일 경로 |
| `PART` | `fresh` (신선) 또는 `frozen` (축산) |

## 데이터 스키마

### data.json

```json
[
  {
    "name": "상품명",
    "standard": "허용기준",
    "defects": "부적합사항",
    "remark": "Remark",
    "localImagePath": "./images/item_001.jpg",
    "part": "fresh"
  }
]
```

### D1 inspection_rules

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER | PK, autoincrement |
| name | TEXT | 상품명 |
| standard | TEXT | 허용기준 |
| defects | TEXT | 부적합사항 |
| remark | TEXT | 비고 |
| r2_image_url | TEXT | R2 이미지 URL |
| part | TEXT | fresh 또는 frozen |
| created_at | INTEGER | 생성 시간 (unixepoch) |
| updated_at | INTEGER | 수정 시간 (unixepoch) |
