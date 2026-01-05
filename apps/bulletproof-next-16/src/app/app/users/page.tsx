import { Metadata } from 'next';

import { ContentLayout } from '@/components/layout/content-layout';

import { AdminGuard } from './_components/admin-guard';
import { Users } from './_components/users';

export const metadata: Metadata = {
  title: 'Users',
  description: 'Manage and view system users.',
};

export default async function UsersPage() {
  return (
    <ContentLayout title="Users">
      <AdminGuard>
        <section>
          <Users />
        </section>
      </AdminGuard>
    </ContentLayout>
  );
}
