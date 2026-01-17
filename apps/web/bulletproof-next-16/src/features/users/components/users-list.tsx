'use client';

import { Suspense } from 'react';

import { Spinner } from '@/components/ui/spinner';
import { Table } from '@/components/ui/table';
import { formatDate } from '@/libs/utils/format';

import { DeleteUser } from './delete-user';
import { useUsers } from '../api/get-users';

const UsersTable = () => {
  const { data: usersResponse } = useUsers({});
  const users = usersResponse?.data ?? [];

  if (users.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-muted-foreground">
        No users found.
      </div>
    );
  }

  return (
    <Table
      data={users}
      columns={[
        {
          title: 'First Name',
          field: 'firstName',
        },
        {
          title: 'Last Name',
          field: 'lastName',
        },
        {
          title: 'Email',
          field: 'email',
        },
        {
          title: 'Role',
          field: 'role',
        },
        {
          title: 'Created At',
          field: 'createdAt',
          Cell({ entry: { createdAt } }) {
            return <span>{formatDate(createdAt)}</span>;
          },
        },
        {
          title: '',
          field: 'id',
          Cell({ entry: { id } }) {
            return <DeleteUser id={id} />;
          },
        },
      ]}
    />
  );
};

export const UsersList = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-48 w-full items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <UsersTable />
    </Suspense>
  );
};
