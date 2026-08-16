/* eslint-disable jsx-a11y/label-has-associated-control */
'use client';

import { FC } from 'react';
import { Memory } from '../../_shared/_types/memory';
import { SearchResultCard } from './SearchResultCard';

export const SearchResultLightbox: FC<{
  readonly memory: Memory | null;
  readonly onClose: () => void;
}> = ({ memory, onClose }) =>
  memory ? (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-8 right-3 sm:right-4 z-30 flex items-center justify-center h-8 w-8 rounded-full bg-neutral-900 text-white shadow-md border border-white/80 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
          aria-label="Close"
        >
          <span className="text-lg font-semibold leading-none text-white!">×</span>
        </button>

        <SearchResultCard memory={memory} fullMessage className="w-full" />
      </div>
    </div>
  ) : null;
