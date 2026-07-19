'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { match } from 'ts-pattern';
import ChatWidget from '../_shared/_components/ChatWidget';
import { FullPageSpinner } from '../_shared/_components/FullPageSpinner';
import { PageContainer } from '../_shared/_components/PageContainer';
import { PageFooter } from '../_shared/_components/PageFooter';
import PageHeader from '../_shared/_components/PageHeader';
import { SearchMemoriesContent } from './_components/SearchMemoriesContent';

const SearchMemoriesPage: React.FC = () => {
  const { status } = useSession();

  return (
    <PageContainer>
      {match(status)
        .with('unauthenticated', () => (
          <section className="flex flex-col h-screen items-center justify-center bg-background px-6">
            <p className="mb-4 text-gray-900 font-medium">
              You need to sign in to search your memories.
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
          <section className="flex min-h-0 flex-1 flex-col">
            <PageHeader />
            <main className="flex-1 min-h-0 overflow-auto bg-background px-6 py-4 pb-24 lg:px-28 lg:py-8 lg:pb-28">
              <SearchMemoriesContent />
            </main>
            <PageFooter />
            <ChatWidget />
          </section>
        ))
        .exhaustive()}
    </PageContainer>
  );
};

export default SearchMemoriesPage;
