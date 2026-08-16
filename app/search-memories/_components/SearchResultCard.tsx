/* eslint-disable jsx-a11y/label-has-associated-control */
'use client';

import { FC } from 'react';
import { Memory } from '../../_shared/_types/memory';
import { CldImage } from 'next-cloudinary';
import polaroid from '../../../public/images/polaroid.png';
import Image from 'next/image';
import { MemoryHashtags } from '../../_shared/_components/MemoryHashtags';
import { MemoryDate } from '../../_shared/_components/MemoryDate';
import { MemoryTitle } from '../../_shared/_components/MemoryTitle';

export const SearchResultCard: FC<{
  readonly memory: Memory;
  readonly onOpen?: () => void;
  readonly fullMessage?: boolean;
  readonly className?: string;
}> = ({ memory, onOpen, fullMessage = false, className }) => {
  const containerClasses = className ?? 'w-[320px] md:w-[400px] lg:w-[480px]';

  return (
    <div
      onClick={onOpen}
      className={`relative group z-10 pt-6 flex flex-col ${containerClasses} ${
        onOpen ? 'cursor-pointer' : ''
      }`}
    >
      {/* Overlapping Title Badge */}
      <MemoryTitle
        title={memory.title}
        as="h3"
        className="absolute top-0 left-3 z-20 max-w-[90%] truncate"
      />

      <article
        className={`w-full bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col flex-1 text-left ${
          onOpen ? 'transition-transform hover:-translate-y-2 duration-300' : ''
        }`}
      >
        {memory.imageId ? (
          <div className="relative h-64 lg:h-80 overflow-hidden">
            <CldImage
              src={memory.imageId}
              sizes="(max-width: 768px) 320px, (max-width: 1024px) 400px, 480px"
              alt={memory.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                onOpen ? 'group-hover:scale-105' : ''
              }`}
              fill
            />
            {onOpen && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </div>
        ) : (
          <div className="relative h-64 lg:h-80 overflow-hidden">
            <Image
              src={polaroid.src}
              alt="polaroid icon"
              className="h-full w-full bg-white object-scale-down p-10"
              fill
            />
          </div>
        )}

        <div className="p-8 flex-1 flex flex-col">
          <MemoryDate date={memory.createdAt} className="mb-4" />
          <p
            className={`font-hind text-on-surface-variant leading-relaxed mb-6 flex-1 ${
              fullMessage ? 'whitespace-pre-line' : 'line-clamp-3'
            }`}
          >
            {memory.message}
          </p>
          <MemoryHashtags hashtags={memory.hashtags} className="mt-auto" />
        </div>
      </article>
    </div>
  );
};
