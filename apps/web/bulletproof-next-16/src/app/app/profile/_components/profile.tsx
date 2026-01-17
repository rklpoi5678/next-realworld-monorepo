'use client';

import { UpdateProfile } from '@/features/users/components/update-profile';
import { useUser } from '@/libs/auth';

type EntryProps = {
  label: string;
  value: string | undefined | null;
};

const Entry = ({ label, value }: EntryProps) => (
  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{value || 'N/A'}</dd>
  </div>
);

export function Profile() {
  const user = useUser();

  if (!user.data) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">사용자 정보를 불러올 수 없습니다.</div>
    );
  }

  const { firstName, lastName, email, bio, role } = user.data;

  return (
    <article className="overflow-hidden bg-white shadow sm:rounded-lg">
      <header className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold leading-6 text-gray-900">User Information</h3>
          <UpdateProfile />
        </div>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details of the user.</p>
      </header>

      <section className="border-t border-gray-200 px-4 py-5 sm:p-0">
        {/* dl 태그 내 구조적 마크업 개선 */}
        <dl className="sm:divide-y sm:divide-gray-200">
          <Entry label="First Name" value={firstName} />
          <Entry label="Last Name" value={lastName} />
          <Entry label="Email Address" value={email} />
          <Entry label="Role" value={role} />
          <Entry label="Bio" value={bio} />
        </dl>
      </section>
    </article>
  );
}
