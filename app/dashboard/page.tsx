'use client';

import { useSession } from 'next-auth/react';
import DashboardHeader from './_components/DashboardHeader';
import { DashboardBody } from './_components/DashboardBody';

const Dashboard: React.FC = () => {
  const { status } = useSession();

  if (status === 'unauthenticated') {
    return <a href="/">Sign in</a>;
  }

  if (status === 'loading') {
    return <>Loading your happy memories...</>;
  }

  return (
    <section className="flex flex-col h-screen">
      <DashboardHeader />
      <DashboardBody />
    </section>
  );
};

export default Dashboard;
