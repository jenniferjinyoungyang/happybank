'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { match } from 'ts-pattern';
import { FullPageSpinner } from '../_shared/_components/FullPageSpinner';
import { PageFooter } from '../_shared/_components/PageFooter';
import ChatWidget from '../_shared/_components/ChatWidget';
import PageHeader from '../_shared/_components/PageHeader';
import { Dashboard } from './_components/Dashboard';

const DashboardPage: React.FC = () => {
  const { status } = useSession();

  return (
    <>
      {match(status)
        .with('unauthenticated', () => (
          <section className="flex flex-col h-screen items-center justify-center bg-stone-100 px-6">
            <p className="mb-4 text-gray-900 font-medium">
              You need to sign in to view your dashboard.
            </p>
            <Link
              href="/sign-in"
              className="tracking-wide font-semibold bg-indigo-400 text-gray-100 py-3 px-6 rounded-lg hover:bg-indigo-600 transition-all duration-300 ease-in-out focus:shadow-outline focus:outline-none"
            >
              Sign in
            </Link>
          </section>
        ))
        .with('loading', () => <FullPageSpinner />)
        .with('authenticated', () => (
          <section className="flex flex-col h-screen">
            <PageHeader />
            <Dashboard />
            <PageFooter />
            <ChatWidget />
          </section>
        ))
        .exhaustive()}
    </>
  );
};

export default DashboardPage;
