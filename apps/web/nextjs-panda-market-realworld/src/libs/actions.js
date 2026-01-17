// @see https://www.youtube.com/watch?v=wh4kGL1EIGM
// ! server action (Never trust data from the client)

// 'use server';
// 댓글 서버 액션 구현예제

// import { updateTag } from 'next/cache';
// import { z } from 'zod';

// import prisma from './prisma';
// import {
//   createCommentSchema,
//   updateCommentSchema,
// } from './schemas/comment.schema';

// export const createComment = async (formData) => {
//   const rawAuthorId = formData.get('authorId');
//   const rawArticleId = formData.get('articleId');

//   try {
//     const validateSchema = createCommentSchema.parse({
//       authorId: parseInt(rawAuthorId),
//       articleId: parseInt(rawArticleId),
//       context: formData.get('context'),
//     });

//     await prisma.comment.create({
//       data: {
//         authorId: validateSchema.authorId,
//         articleId: validateSchema.articleId,
//         context: validateSchema.context,
//       },
//     });
//     /**
//      * @see https://nextjs.org/docs/messages/revalidate-tag-single-arg
//      * @see https://nextjs.org/docs/app/api-reference/functions/updateTag
//      * 두 번쨰 인수 없을시 헬퍼 호출됨(더이상 권장 되지않음) -> max추가
//      */
//     updateTag('comment');

//     return { message: 'Added Successfully' };
//   } catch (error) {
//     console.error(error);
//     if (error instanceof z.ZodError) {
//       return { message: 'Invalid input data', issues: error.issues };
//     }
//     return { message: 'Failed to create comment' };
//   }
// };

// export const updateComment = async (formData) => {
//   const commentId = formData.get('commentId');
//   const context = formData.get('context');

//   // id 값 사전 처리
//   const data = {
//     commentId: parseInt(commentId),
//     context: context,
//   };

//   if (!commentId) return { success: false, message: 'Invalid input' };

//   try {
//     const validateSchema = updateCommentSchema.parse(data);

//     await prisma.comment.update({
//       where: { id: validateSchema.commentId },
//       data: { context: validateSchema.context },
//     });

//     updateTag('comment');

//     return { success: true, message: 'Success Update Comment' };
//   } catch (error) {
//     console.error(error);
//     if (error instanceof z.ZodError) {
//       return {
//         success: false,
//         message: 'Invalid Input Data',
//         issues: error.issues,
//       };
//     }
//     return { success: false, message: 'Failed Update Comment' };
//   }
// };

// export const deleteComment = async (id) => {
//   if (!id) return { success: false, message: 'Invalid id' };
//   try {
//     await prisma.comment.delete({
//       where: { id: parseInt(id) },
//     });

//     updateTag('comment');

//     return { success: true, message: 'Success Delete Comment' };
//   } catch (error) {
//     console.error(error);
//     if (error instanceof z.ZodError) {
//       return { message: 'Invalid Data', issues: error.issues };
//     }
//     return { success: false, message: 'Failed Delete Comment' };
//   }
// };
