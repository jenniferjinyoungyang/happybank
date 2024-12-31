'use client';

import { useSession } from 'next-auth/react';
import { match } from 'ts-pattern';
import PageHeader from '../_shared/_components/PageHeader';
import { Dashboard } from './_components/Dashboard';

const DashboardPage: React.FC = () => {
  const { status } = useSession();

  return (
    <>
      {match(status)
        .with('unauthenticated', () => <a href="/">Sign in</a>)
        .with('loading', () => <>Loading your happy memories...</>)
        .with('authenticated', () => (
          <section className="flex flex-col h-screen">
            <PageHeader />
            <Dashboard />
          </section>
        ))
        .exhaustive()}
    </>
  );
};

export default DashboardPage;
