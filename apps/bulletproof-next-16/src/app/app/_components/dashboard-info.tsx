'use client';

import { useUser } from '@/libs/auth';

export function DashboardInfo() {
  const { data: user } = useUser();

  if (!user) return null;

  const { firstName, lastName, role } = user;
  const fullName = `${firstName}${lastName}`;

  return (
    <>
      <h1 className="text-xl">
        Welcome <b>{fullName}</b>
      </h1>
      <h4 className="my-3">
        Your role is : <b>{role}</b>
      </h4>
      <p className="font-medium">In this application you can:</p>
      <ul className="my-4 list-inside list-disc">
        {role === 'USER' && (
          <>
            <li>Create comments in discussions</li>
            <li>Delete own comments</li>
          </>
        )}
        {role === 'ADMIN' && (
          <>
            <li>Create discussions</li>
            <li>Edit discussions</li>
            <li>Delete discussions</li>
            <li>Comment on discussions</li>
            <li>Delete all comments</li>
          </>
        )}
      </ul>
    </>
  );
}
