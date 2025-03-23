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
        <div className="me-1.5">Created by</div>
      </li>
      <li>
        <a href="https://github.com/jenniferjinyoungyang" className="hover:underline me-1.5">
          Jennifer Yang
        </a>
      </li>
      <li>
        <div className="me-1.5">and</div>
      </li>
      <li>
        <div className="flex">
          <a href="https://github.com/itsyurika" className="hover:underline me-1.5">
            Yuri Yang
          </a>
        </div>
      </li>
      <div className="me-1.5">with Love♡</div>
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
