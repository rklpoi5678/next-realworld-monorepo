'use client';

import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';
import { useUser } from '@/libs/auth';

import { useDeleteUser } from '../api/delete-user';

type DeleteUserProps = {
  id: string;
};

export const DeleteUser = ({ id }: DeleteUserProps) => {
  const { data: currentUser } = useUser();
  const { addNotification } = useNotifications();
  const deleteUserMutation = useDeleteUser({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'User Deleted',
        });
      },
    },
  });

  // 자기 자신 삭제 방지 로직
  // 현재 로그인한 유저의 ID와 삭제 대상 ID가 같으면 컴포넌트를 렌더링하지 않습니다.
  if (currentUser?.id === id) return null;

  return (
    <ConfirmationDialog
      isDone={deleteUserMutation.isSuccess}
      icon="danger"
      title="Delete User"
      body="Are you sure you want to delete this user? This action cannot be undone."
      triggerButton={
        <Button variant="destructive" size="sm" className="gap-2">
          <Trash2 className="size-4" />
          <span>Delete</span>
        </Button>
      }
      confirmButton={
        <Button
          isLoading={deleteUserMutation.isPending}
          type="button"
          variant="destructive"
          onClick={() => deleteUserMutation.mutate({ userId: id })}
        >
          Delete User
        </Button>
      }
    />
  );
};
