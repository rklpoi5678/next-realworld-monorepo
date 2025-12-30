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

type EnvConfig = z.infer<typeof envSchema>;
/** 환경 변수 유효성 검사 함수 */
const createEnv = (): EnvConfig => {
  const parsedEnv = envSchema.safeParse(process.env);

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
export const config = createEnv();

//type export
export type Env = z.infer<typeof envSchema>;
