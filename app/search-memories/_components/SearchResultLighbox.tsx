/* eslint-disable jsx-a11y/label-has-associated-control */
'use client';

import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import { FC } from 'react';
import polaroid from '../../../public/images/polaroid.png';
import { Memory } from '../../_shared/_types/memory';

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
        className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-4 sm:p-6 md:p-8"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-neutral-900 text-white shadow-md border border-white/60 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label="Close"
        >
          <span className="text-base sm:text-lg font-semibold leading-none text-white!">×</span>
        </button>
        <div className="flex flex-col gap-4">
          <div className="relative w-full h-64 sm:h-80 bg-black rounded-xl overflow-hidden">
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
          <div className="space-y-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{memory.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(memory.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </p>
            </div>
            <p className="text-sm sm:text-base text-gray-800 whitespace-pre-line">
              {memory.message}
            </p>
            {memory.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
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
      </div>
    </div>
  ) : null;
