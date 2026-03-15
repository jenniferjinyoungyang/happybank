/* eslint-disable jsx-a11y/label-has-associated-control */
'use client';

import { FC } from 'react';
import { Memory } from '../../_shared/_types/memory';
import { CldImage } from 'next-cloudinary';
import polaroid from '../../../public/images/polaroid.png';
import Image from 'next/image';

const truncateMessage = (message: string, maxLength = 180): string =>
  message.length > maxLength ? `${message.slice(0, maxLength).trimEnd()}…` : message;

export const SearchResultCard: FC<{
  readonly memory: Memory;
  readonly onOpen: () => void;
}> = ({ memory, onOpen }) => (
  <button
    type="button"
    onClick={onOpen}
    className="w-full max-w-xl mx-auto text-left bg-white rounded-xl shadow-md overflow-hidden border border-neutral-200 hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
  >
    <div className="flex flex-col sm:flex-row">
      <div className="relative w-full sm:w-1/3 h-56 sm:h-64 bg-black">
        {memory.imageId ? (
          <CldImage
            src={memory.imageId}
            sizes="100vw"
            alt="memory image"
            className="w-full h-full object-contain bg-black"
            fill
          />
        ) : (
          <Image
            src={polaroid.src}
            alt="memory placeholder"
            className="w-full h-full object-contain bg-white"
            fill
          />
        )}
      </div>
      <div className="flex-1 p-4 flex flex-col gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">
            {memory.title}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {new Date(memory.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </p>
        </div>
        <p className="text-sm text-gray-700">{truncateMessage(memory.message)}</p>
        {memory.hashtags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2">
            {memory.hashtags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs sm:text-sm text-indigo-800 bg-indigo-100 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  </button>
);
