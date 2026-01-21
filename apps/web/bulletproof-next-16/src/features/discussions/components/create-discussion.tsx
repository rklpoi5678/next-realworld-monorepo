'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormDrawer, Input, Label, Switch, Textarea } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
import { useUser } from '@/libs/auth';
import { policies } from '@/libs/authorization';

import { createDiscussionInputSchema, useCreateDiscussion } from '../api/create-discussion';

export const CreateDiscussion = () => {
  const { addNotification } = useNotifications();
  const user = useUser();

  const createDiscussionMutation = useCreateDiscussion({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Discussion Created',
        });
      },
    },
  });

  if (user.isPending) return null;
  /** LUT로 정책 기반 권한 체크 */
  if (!policies['discussion:create'](user?.data)) return null;

  return (
    <FormDrawer
      isDone={createDiscussionMutation.isSuccess}
      title="Create Discussion"
      triggerButton={
        <Button size="sm" icon={<Plus className="size-4" />}>
          Create Discussion
        </Button>
      }
      submitButton={
        <Button
          form="create-discussion"
          type="submit"
          size="sm"
          isLoading={createDiscussionMutation.isPending}
        >
          Submit
        </Button>
      }
    >
      <Form
        id="create-discussion"
        onSubmit={(values) => {
          createDiscussionMutation.mutate({ data: values });
        }}
        schema={createDiscussionInputSchema}
        options={{
          defaultValues: {
            title: '',
            body: '',
            public: false,
          },
        }}
      >
        {({ register, formState, setValue, watch }) => {
          // Switch 상태 실시간 구독
          const isPublic = watch('public');
          return (
            <div className="space-y-4">
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
                  // RHF 과 비제어 컴포넌트 Switch 연결
                  checked={isPublic}
                  // 수동으로 값을 바꿀 때 즉시 유효성 검사를 실행하여 에러 메시지 갱신
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
