'use client';

import { useSession } from 'next-auth/react';
import PageHeader from '../_components/PageHeader';
import { Dashboard } from './_components/Dashboard';

const DashboardPage: React.FC = () => {
  const { status } = useSession();

  if (status === 'unauthenticated') {
    return <a href="/">Sign in</a>;
  }

  if (status === 'loading') {
    return <>Loading your happy memories...</>;
  }

  return (
    <section className="flex flex-col h-screen">
      <PageHeader />
      <Dashboard />
    </section>
  );
};

export default DashboardPage;
