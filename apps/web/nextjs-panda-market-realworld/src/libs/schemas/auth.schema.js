import z from 'zod';

const loginFormSchema = z.object({
  email: z.string().email('이메일이 올바르지 않습니다.'),

  password: z
    .string({ required_error: '비밀번호를 입력해주세요' })
    .min(8, '비밀번호는 8자 이상 입력해주세요.')
    .max(50, '비밀번호는 50자 이내로 입력해주세요.'),
});

const signupFormSchema = z
  .object({
    email: z.string().email('이메일이 올바르지 않습니다.'),

    nickname: z
      .string({ required_error: '닉네임을 입력해주세요' })
      .min(2, '닉네임은 2자 이상 입력해주세요')
      .max(20, '닉네임은 20자 이내로 입력해주세요'),

    password: z
      .string({ required_error: '비밀번호를 입력해주세요' })
      .min(8, '비밀번호는 8자 이상 입력해주세요.')
      .max(50, '비밀번호는 50자 이내로 입력해주세요.'),

    passwordConfirmation: z.string({
      required_error: '패스워드 확인을 위해 입력해주세요',
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: '패스워드가 일치하지 않습니다.',
  });

export { loginFormSchema, signupFormSchema };
