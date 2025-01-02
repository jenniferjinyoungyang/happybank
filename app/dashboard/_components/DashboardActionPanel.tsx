import Link from 'next/link';
import { FC } from 'react';
import piggyBank from '../../../public/images/piggy-bank.png';

export const DashboardActionPanel: FC = () => (
  <section className="flex-initial flex flex-col items-center w-1/4">
    <div className="flex flex-col items-center w-5/6">
      <p className="text-neutral-400">Show me another memory!</p>
      <button
        type="button"
        className="tracking-wide font-semibold bg-indigo-400 text-gray-100 w-5/6 py-4 rounded-lg hover:bg-indigo-600 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
      >
        Recall
      </button>
    </div>
    <div className="flex flex-col items-center mt-10 w-5/6">
      <p className="text-neutral-400">Let&apos;s save a new memory!</p>
      <Link
        className="tracking-wide font-semibold bg-indigo-400 text-gray-100 w-5/6 py-4 rounded-lg hover:bg-indigo-600 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
        href="/create-memory"
      >
        Deposit
      </Link>
    </div>
    <img src={piggyBank.src} className="flex w-3/5 mt-auto" alt="piggy bank icon" />
    {/* TODO: attribution for the piggy bank icon
      <a
        href="https://www.flaticon.com/free-icons/piggy-bank"
        title="piggy bank icons"
      >
        Piggy bank icons created by Freepik - Flaticon
      </a> */}
  </section>
);
