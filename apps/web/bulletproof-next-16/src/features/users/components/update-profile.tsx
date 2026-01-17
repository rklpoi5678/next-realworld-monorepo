'use client';

import { Pen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormDrawer, Input, Textarea } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
import { useUser } from '@/libs/auth';

import { updateProfileInputSchema, useUpdateProfile } from '../api/update-profile';

export const UpdateProfile = () => {
  const user = useUser();
  const { addNotification } = useNotifications();
  const updateProfileMutation = useUpdateProfile({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your profile has been successfully updated.',
        });
      },
    },
  });

  return (
    <FormDrawer
      isDone={updateProfileMutation.isSuccess}
      triggerButton={
        <Button icon={<Pen className="size-4" />} size="sm" variant="outline">
          Update Profile
        </Button>
      }
      title="Update Profile"
      submitButton={
        <Button
          form="update-profile"
          type="submit"
          size="sm"
          isLoading={updateProfileMutation.isPending}
          disabled={updateProfileMutation.isPending}
        >
          Submit
        </Button>
      }
    >
      <Form
        id="update-profile"
        onSubmit={(values) => {
          updateProfileMutation.mutate({ data: values });
        }}
        options={{
          defaultValues: {
            firstName: user.data?.firstName ?? '',
            lastName: user.data?.lastName ?? '',
            email: user.data?.email ?? '',
            bio: user.data?.bio ?? '',
          },
        }}
        schema={updateProfileInputSchema}
      >
        {({ register, formState: { errors } }) => (
          <>
            <Input
              label="First Name"
              error={errors.firstName}
              registration={register('firstName')}
              placeholder="Enter your first name"
            />
            <Input
              label="Last Name"
              error={errors.lastName}
              registration={register('lastName')}
              placeholder="Enter your last name"
            />
            <Input
              label="Email Address"
              type="email"
              error={errors.email}
              registration={register('email')}
              placeholder="email@example.com"
            />

            <Textarea
              label="Bio"
              error={errors.bio}
              registration={register('bio')}
              placeholder="Tell us a bit about yourself"
              rows={4}
            />
          </>
        )}
      </Form>
    </FormDrawer>
  );
};
