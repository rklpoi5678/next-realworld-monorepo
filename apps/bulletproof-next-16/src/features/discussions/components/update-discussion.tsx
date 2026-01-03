'use client';

import { Pen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormDrawer, Input, Label, Switch, Textarea } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
import { useUser } from '@/libs/auth'; // 경로 통일
import { policies } from '@/libs/authorization'; // LUT 기반 정책 사용

import { useDiscussion } from '../api/get-discussion';
import { updateDiscussionInputSchema, useUpdateDiscussion } from '../api/update-discussion';

export const UpdateDiscussion = ({ discussionId }: { discussionId: string }) => {
  const { addNotification } = useNotifications();
  const user = useUser();

  const discussionQuery = useDiscussion({ discussionId });
  const updateDiscussionMutation = useUpdateDiscussion({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Discussion Updated',
        });
      },
    },
  });

  // 유저 정보 로딩중 이거나 권한이 없으면 렌더링하지 않습니다.
  if (user.isPending) return null;
  if (!policies['discussion:update'](user.data)) return null;

  const discussion = discussionQuery.data?.data;

  return (
    <FormDrawer
      isDone={updateDiscussionMutation.isSuccess}
      title="Update Discussion"
      triggerButton={
        <Button icon={<Pen className="size-4" />} size="sm">
          Update Discussion
        </Button>
      }
      submitButton={
        <Button
          form="update-discussion"
          type="submit"
          size="sm"
          isLoading={updateDiscussionMutation.isPending}
        >
          Submit
        </Button>
      }
    >
      <Form
        id="update-discussion"
        onSubmit={(values) => {
          updateDiscussionMutation.mutate({
            data: values,
            discussionId,
          });
        }}
        options={{
          defaultValues: {
            title: discussion?.title ?? '',
            body: discussion?.body ?? '',
            public: discussion?.public ?? false,
          },
        }}
        schema={updateDiscussionInputSchema}
      >
        {({ register, formState, setValue, watch }) => {
          const isPublic = watch('public');

          return (
            <div className="space-y-4 pt-4">
              <Input
                label="Title"
                error={formState.errors.title}
                registration={register('title')}
              />
              <Textarea
                label="Body"
                error={formState.errors.body}
                registration={register('body')}
              />

              <div className="flex items-center gap-2 py-2">
                <Switch
                  id="public"
                  checked={isPublic}
                  onCheckedChange={(checked) =>
                    setValue('public', checked, { shouldValidate: true })
                  }
                />
                <Label htmlFor="public" className="cursor-pointer select-none">
                  {isPublic ? 'Public Discussion' : 'Private Discussion'}
                </Label>
              </div>
            </div>
          );
        }}
      </Form>
    </FormDrawer>
  );
};
