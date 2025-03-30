import { FC } from 'react';

export const PageFooter: FC = () => (
  <footer className="fixed bottom-0 left-0 z-20 w-full px-4 py-2 lg:py-4 h-20 lg:h-12 bg-white border-t border-b-neutral-200 shadow md:flex md:items-center md:justify-between md:p-4">
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
            Icon made by `&quot;`Freepik`&quot;` and `&quot;`ICs Icons`&quot;` from www.flaticon.com
          </p>
          <p className="block lg:hidden text-gray-200">
            Icon made by `&quot;`ICs Icons`&quot;` from www.flaticon.com
          </p>
        </a>
      </li>
    </ul>
  </footer>
);
