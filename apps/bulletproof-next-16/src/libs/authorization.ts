import { Comment, User } from '@/types/api';

/** User Role (관리자 확인용) */
const isAdmin = (user: User | null | undefined) => user?.role === 'ADMIN';

/** Discussion 관련 권한 */
export const canCreateDiscussion = (user: User | null | undefined) => {
  return isAdmin(user);
};

export const canDeleteDiscussion = (user: User | null | undefined) => {
  return isAdmin(user);
};

export const canUpdateDiscussion = (user: User | null | undefined) => {
  return isAdmin(user);
};

export const canViewUsers = (user: User | null | undefined) => {
  return isAdmin(user);
};

/** Comment 삭제 권한 */
export const canDeleteComment = (user: User | null | undefined, comment: Comment) => {
  if (!user) return false;

  // 관리자는 모든 댓글 삭제 가능
  if (isAdmin(user)) return true;

  // 일반 유저는 본인이 작성한 댓글만 삭제 가능
  return user.role === 'USER' && comment.author?.id === user.id;
};

/** 권한 그룹화(LUT로 import 최적화) */
export const policies = {
  'discussion:create': canCreateDiscussion,
  'discussion:update': canUpdateDiscussion,
  'discussion:delete': canDeleteDiscussion,
  'comment:delete': canDeleteComment,
  'user:view': canViewUsers,
};
