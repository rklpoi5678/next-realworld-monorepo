'use client';

import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';

import { useDeleteComment } from '../api/delete-comment';

type DeleteCommentProps = {
  id: string;
  discussionId: string;
};

export const DeleteComment = ({ id, discussionId }: DeleteCommentProps) => {
  const { addNotification } = useNotifications();

  const deleteCommentMutation = useDeleteComment({
    discussionId,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Comment Deleted',
        });
      },
    },
  });

  const handleDelete = async () => {
    deleteCommentMutation.mutate({ commentId: id });
  };

  return (
    <ConfirmationDialog
      isDone={deleteCommentMutation.isSuccess}
      icon="danger"
      title="Delete Comment"
      body="Are you sure you want to delete this comment?"
      triggerButton={
        <Button variant="destructive" size="sm" className="gap-2">
          <Trash2 className="size-4" />
          <span>Delete Comment</span>
        </Button>
      }
      confirmButton={
        <Button
          isLoading={deleteCommentMutation.isPending}
          type="button"
          variant="destructive"
          onClick={handleDelete}
        >
          Delete Comment
        </Button>
      }
    />
  );
};
