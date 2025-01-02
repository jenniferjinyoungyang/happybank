import { FC } from 'react';

export const PageFooter: FC = () => (
  <footer className="fixed bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-b-neutral-200 shadow md:flex md:items-center md:justify-between md:p-4">
    <span className="text-sm text-gray-500 sm:text-center">
      © 2025{' '}
      <a href="https://happybank-black.vercel.app/" className="hover:underline">
        HappyBank
      </a>
    </span>
    <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 sm:mt-0">
      <li>
        <div className="me-4 md:me-6">Created By</div>
      </li>
      <li>
        <a href="https://github.com/jenniferjinyoungyang" className="hover:underline me-4 md:me-6">
          Jennifer Yang
        </a>
      </li>
      <li>
        <div className="me-4 md:me-6">and</div>
      </li>
      <li>
        <div className="flex">
          <a href="https://github.com/itsyurika" className="hover:underline me-4 md:me-6">
            Yuri Yang
          </a>
        </div>
      </li>
      <div className="me-4 md:me-6">With Love♡</div>
      <li>
        <a href="https://www.flaticon.com" title="icons">
          <p className="text-gray-200">
            Icon made by `&quot;`Freepik`&quot;` and `&quot;`ICs Icons`&quot;` from www.flaticon.com
          </p>
        </a>
      </li>
    </ul>
  </footer>
);
