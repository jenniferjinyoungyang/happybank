'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { match } from 'ts-pattern';
import { FullPageSpinner } from '../_shared/_components/FullPageSpinner';
import { PageFooter } from '../_shared/_components/PageFooter';
import ChatWidget from '../_shared/_components/ChatWidget';
import PageHeader from '../_shared/_components/PageHeader';
import { SearchMemoriesContent } from './_components/SearchMemoriesContent';

const SearchMemoriesPage: React.FC = () => {
  const { status } = useSession();

  return (
    <>
      {match(status)
        .with('unauthenticated', () => (
          <section className="flex flex-col h-screen items-center justify-center bg-stone-100 px-6">
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
          <section className="flex flex-col h-screen">
            <PageHeader />
            <main className="bg-stone-100 h-[calc(100%-8rem)] lg:h-[calc(100%-10rem)] px-6 py-4 lg:px-28 lg:pt-12 overflow-auto">
              <SearchMemoriesContent />
            </main>
            <PageFooter />
            <ChatWidget />
          </section>
        ))
        .exhaustive()}
    </>
  );
};

export default SearchMemoriesPage;

