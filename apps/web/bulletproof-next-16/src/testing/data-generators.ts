import {
  randCatchPhrase,
  randCompanyName,
  randEmail,
  randParagraph,
  randPassword,
  randUserName,
  randUuid,
} from '@ngneat/falso';

/** 전용 유틸리티: ID 생성 시 중복 방지*/
const generateId = () => randUuid();

const generateUser = () => ({
  id: generateId(),
  firstName: randUserName({ withAccents: false }),
  lastName: randUserName({ withAccents: false }),
  email: randEmail(),
  password: randPassword(),
  teamId: generateId(),
  teamName: randCompanyName(),
  role: 'ADMIN',
  bio: randParagraph(),
  createdAt: Date.now(),
});

export const createUser = (overrides = {}) => ({
  ...generateUser(),
  ...overrides,
});

// --- Team ---
const generateTeam = () => ({
  id: generateId(),
  name: randCompanyName(),
  description: randParagraph(),
  createdAt: Date.now(),
});

export const createTeam = (overrides = {}) => ({
  ...generateTeam(),
  ...overrides,
});

// --- Discussion ---
const generateDiscussion = () => ({
  id: generateId(),
  title: randCatchPhrase(),
  body: randParagraph(),
  createdAt: Date.now(),
  public: true,
  authorId: generateId(), // 기본값 포함
  teamId: generateId(),
});

export const createDiscussion = (overrides = {}) => ({
  ...generateDiscussion(),
  ...overrides,
});

// --- Comment ---
const generateComment = () => ({
  id: generateId(),
  body: randParagraph(),
  createdAt: Date.now(),
  authorId: generateId(),
  discussionId: generateId(),
});

export const createComment = (overrides = {}) => ({
  ...generateComment(),
  ...overrides,
});
