import { FC } from 'react';

export const PageFooter: FC = () => (
  <footer className="fixed bottom-0 left-0 z-20 w-full bg-white border-t border-b-neutral-200 shadow">
    <div className="mx-auto flex w-full flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between md:p-4">
      <span className="text-sm text-gray-500 sm:text-center">
        © 2025{' '}
        <a href="https://happybank-black.vercel.app/" className="hover:underline">
          HappyBank
        </a>
      </span>
      <ul className="flex flex-wrap items-center text-sm font-medium text-gray-500">
        <li>
          <p className="me-1">Created by</p>
        </li>
        <li>
          <a
            href="https://github.com/jenniferjinyoungyang"
            className="hover:underline font-hind me-1"
          >
            Jennifer Yang
          </a>
        </li>
        <li>
          <p className="me-1">and</p>
        </li>
        <li>
          <div className="flex">
            <a href="https://github.com/itsyurika" className="hover:underline font-hind me-1">
              Yuri Yang
            </a>
          </div>
        </li>
        <p className="me-1">with Love♡</p>
        <li>
          <a href="https://www.flaticon.com" title="icons">
            <p className="hidden lg:block text-gray-200">
              Icon made by Freepik and ICs Icons from www.flaticon.com
            </p>
            <p className="block lg:hidden text-gray-200">
              Icon made by ICs Icons from www.flaticon.com
            </p>
          </a>
        </li>
      </ul>
    </div>
  </footer>
);
