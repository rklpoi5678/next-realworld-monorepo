import type { Metadata } from 'next';

import { DashboardInfo } from './_components/dashboard-info';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard',
};

export default function DashboardPage() {
  return <DashboardInfo />;
}
