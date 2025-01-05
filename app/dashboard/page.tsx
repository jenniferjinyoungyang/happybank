'use client';

import { useSession } from 'next-auth/react';
import { match } from 'ts-pattern';
import { FullPageSpinner } from '../_shared/_components/FullPageSpinner';
import { PageFooter } from '../_shared/_components/PageFooter';
import PageHeader from '../_shared/_components/PageHeader';
import { Dashboard } from './_components/Dashboard';

const DashboardPage: React.FC = () => {
  const { status } = useSession();

  return (
    <>
      {match(status)
        .with('unauthenticated', () => <a href="/">Sign in</a>)
        .with('loading', () => <FullPageSpinner />)
        .with('authenticated', () => (
          <section className="flex flex-col h-screen">
            <PageHeader />
            <Dashboard />
          </section>
        ))
        .exhaustive()}
      <PageFooter />
    </>
  );
};

export default DashboardPage;
