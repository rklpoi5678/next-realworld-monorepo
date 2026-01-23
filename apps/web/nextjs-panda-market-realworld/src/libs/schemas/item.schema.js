import { z } from 'zod';

const itemFormSchema = z.object({
  name: z
    .string()
    .min(1, '제목을 입력해주세요.')
    .max(30, '제목은 30자 이내로 입력해주세요.'),
  description: z
    .string()
    .min(10, '내용은 10자 이상 입력해주세요.')
    .max(100, '내용은 100자 이내로 입력해주세요.'),
  price: z.string(),
  tags: z
    .string()
    .min(1, '태그를 입력해주세요')
    .transform((val) => {
      return val
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    })
    .pipe(
      z
        .array(
          z
            .string()
            .min(1, '태그 내용을 입력해주세요.')
            .max(5, '태그는 5자 이하로 해주세요'),
        )
        .min(1, '최소 1개 이상의 태그를 입력해주세요.')
        .max(5, '태그는 최대 5개까지만 입력 가능합니다.'),
    ),
});

const backendItemFormSchema = z.object({
  name: z
    .string()
    .min(1, '제목을 입력해주세요.')
    .max(30, '제목은 30자 이내로 입력해주세요.'),
  description: z
    .string()
    .min(10, '내용은 10자 이상 입력해주세요.')
    .max(100, '내용은 100자 이내로 입력해주세요.'),
  price: z.string(),
  tags: z
    .array(
      z
        .string()
        .min(1, '태그 내용을 입력해주세요.')
        .max(5, '태그는 5자 이하로 해주세요'),
    )
    .min(1, '최소 1개 이상의 태그를 입력해주세요.') // 배열 전체의 최소 길이
    .max(5, '태그는 최대 5개까지만 입력 가능합니다.'), // 배열 전체의 최대 길이
});

export { backendItemFormSchema, itemFormSchema };
