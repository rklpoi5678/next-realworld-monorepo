import { z } from 'zod';

const articleFormSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요.')
    .max(30, '제목은 30자 이내로 입력해주세요.'),
  content: z
    .string()
    .min(10, '내용은 10자 이상 입력해주세요.')
    .max(100, '내용은 100자 이내로 입력해주세요.'),
});

const updateCommentSchema = z.object({
  context: z.string().min(1, '수정할 댓글 내용을 입력해주세요.'),
});

const articleCommentSchema = z.object({
  context: z.string().min(1, '댓글 내용을 입력해주세요'),
});

const updateArticleCommentSchema = z.object({
  commentId: z.number({ message: '유효한 댓글 ID가 아닙니다.' }),
  context: z.string().min(1, '수정할 댓글 내용을 입력해주세요.'),
});

export {
  articleCommentSchema,
  articleFormSchema,
  updateArticleCommentSchema,
  updateCommentSchema,
};
