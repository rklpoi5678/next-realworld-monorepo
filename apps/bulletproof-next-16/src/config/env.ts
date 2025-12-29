import { z } from 'zod';

/** 환경 변수 스키마 정의 */
const envSchema = z.object({
  API_URL: z.string(),
  ENABLE_API_MOCKING: z
    .enum(['true', 'false'])
    .default('false')
    .transform((val) => val === 'true'),
  APP_URL: z.string().optional().default('http://localhost:3000'),
  APP_MOCK_API_PORT: z.string().optional().default('8080'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

/** 환경 변수 유효성 검사 함수 */
const createEnv = () => {
  const envVars = {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    ENABLE_API_MOCKING: process.env.NEXT_PUBLIC_ENABLE_API_MOCKING,
    APP_URL: process.env.NEXT_PUBLIC_URL,
    APP_MOCK_API_PORT: process.env.NEXT_PUBLIC_MOCK_API_PORT,
    NODE_ENV: process.env.NODE_ENV,
  };

  const parsedEnv = envSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    const errors = parsedEnv.error.flatten().fieldErrors;
    const errorMessage = Object.entries(errors)
      .map(([key, message]) => `- ${key}: ${message?.join(', ')}`)
      .join('\n');

    throw new Error(`Invalid environment variables:\n${errorMessage}`);
  }

  return parsedEnv.data;
};

//singleton
export const env = createEnv();

//type export
export type Env = z.infer<typeof envSchema>;
