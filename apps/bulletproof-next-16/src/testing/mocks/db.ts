/**
 * MSW Data를 활용하여 인메모리 DB구축
 * 이를 파일(Node)이나 로컬 스토리지(Browser)에 영속(Persistence)
 */
import path from 'path';

import { factory, primaryKey } from '@mswjs/data';
import { nanoid } from 'nanoid';

/** 모델 정의 (Schema) */
export const models = {
  user: {
    id: primaryKey(nanoid),
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    teamId: String,
    role: String,
    bio: String,
    createdAt: () => new Date().toISOString(),
  },
  team: {
    id: primaryKey(nanoid),
    name: String,
    description: String,
    createdAt: () => new Date().toISOString(),
  },
  discussion: {
    id: primaryKey(nanoid),
    title: String,
    body: String,
    authorId: String,
    teamId: String,
    createdAt: () => new Date().toISOString(),
    public: Boolean,
  },
  comment: {
    id: primaryKey(nanoid),
    body: String,
    authorId: String,
    discussionId: String,
    createdAt: () => new Date().toISOString(),
  },
};

export const db = factory(models);

/** 모델 키 타입  */
export type ModelKey = keyof typeof models;

/** 로컬 파일 시스템 저장 구조 타입 */
type SerializedDb = {
  [K in ModelKey]?: Record<string, unknown>[];
};

/** 모노레포 대응 경로 설정( 실행위치에 따라 파일 생성 위치가 달라질위험 방지)*/
const dbFilePath = path.join(process.cwd(), 'mocked-db.json');

/** DB 로드 */
export const loadDb = async () => {
  if (typeof window === 'undefined') {
    const { readFile, writeFile } = await import('fs/promises');
    try {
      const data = await readFile(dbFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err.code === 'ENOENT') {
        const emptyDB = {};
        await writeFile(dbFilePath, JSON.stringify(emptyDB, null, 2));
        return emptyDB;
      }
      console.error('Error loading mocked DB:', error);
      return {};
    }
  }
  // 브라우저 환경에서 돌아갈때
  const localData = window.localStorage.getItem('msw-db');
  return localData ? (JSON.parse(localData) as SerializedDb) : {};
};

/** DB 영속화 */
export const persistDb = async (modelKey: ModelKey) => {
  // 테스트 환경에서는 실제 파일을 건드리지 않도록 방어합니다.
  if (process.env.NODE_ENV === 'test') return;

  const currentDb = await loadDb();
  // @mswjs/data의 해당 모델 데이터를 모두 가져와 업데이트
  currentDb[modelKey] = db[modelKey].getAll();

  const data = JSON.stringify(currentDb, null, 2);

  if (typeof window === 'undefined') {
    const { writeFile } = await import('fs/promises');
    await writeFile(dbFilePath, data);
  } else {
    window.localStorage.setItem('msw-db', data);
  }
};

/** 초기화 (시드 및 로드) */
export const initializeDb = async (): Promise<void> => {
  const database = await loadDb();

  Object.entries(db).forEach(([key, model]) => {
    const modelName = key as ModelKey;
    const entries = database[modelName];

    if (Array.isArray(entries)) {
      entries.forEach((entry) => {
        // 이미 존재하는 ID인지 확인 (중복 생성 방지)
        const idValue = entry.id as string;
        const existing = model.findFirst({
          where: { id: { equals: idValue } },
        });
        if (!existing) {
          model.create(entry);
        }
      });
    }
  });
};

export const resetDb = (): void => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('msw-db');
  }
};
