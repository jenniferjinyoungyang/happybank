'use client';

import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { FC, useLayoutEffect, useRef, useState } from 'react';
import { Memory } from '../../_shared/_types/memory';

type MemoryCardProps = {
  readonly memory: Memory;
};

const parseMemoryDate = (value: string | Date) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const MemoryCard: FC<MemoryCardProps> = ({ memory }) => {
  const { title, message, hashtags, createdAt } = memory;
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [prevMemory, setPrevMemory] = useState(memory);
  const messageRef = useRef<HTMLParagraphElement>(null);

  if (prevMemory !== memory) {
    setPrevMemory(memory);
    setIsExpanded(false);
  }

  useLayoutEffect(() => {
    const messageElement = messageRef.current;
    if (!messageElement || isExpanded) {
      return;
    }

    const isOverflowing =
      messageElement.scrollHeight > messageElement.clientHeight + 1 ||
      (messageElement.clientHeight === 0 && message.length > 150);
    setHasOverflow(isOverflowing);
  }, [isExpanded, message]);

  return (
    <div className="relative group z-10 -mt-8 ml-auto mr-4 max-w-xl">
      {/* Overlapping Title Badge */}
      <h1 className="absolute -top-5 -left-3 z-20 font-permanent_marker text-2xl sm:text-3xl text-tertiary -rotate-2 bg-surface-container-lowest px-4 py-1.5 shadow-md shadow-on-surface/5 rounded-md border border-outline-variant/10 select-none">
        {title}
      </h1>

      <article
        className={`bg-surface-container-lowest rounded-xl flex flex-col relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl shadow-indigo-100/50 p-6 sm:p-8 lg:p-10 border border-outline-variant/10 ${
          isExpanded ? 'min-h-[520px] h-auto' : 'h-[520px]'
        }`}
      >
        {/* Date Header */}
        <span className="font-label text-xs tracking-widest text-outline font-bold uppercase my-4 block shrink-0">
          {parseMemoryDate(createdAt)}
        </span>

        {/* Message Container with Soft Gradient Fade */}
        <div className="relative flex-1 overflow-hidden flex flex-col min-h-0">
          <p
            ref={messageRef}
            className={`font-body text-on-surface leading-relaxed text-lg italic ${
              isExpanded ? 'overflow-y-auto' : 'max-h-[400px] overflow-hidden'
            }`}
          >
            &ldquo;{message}&rdquo;
          </p>

          {!isExpanded && hasOverflow && (
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-transparent pointer-events-none" />
          )}
        </div>

        {/* Centered Expand/Collapse Chevron Button */}
        {(hasOverflow || isExpanded) && (
          <div className="flex justify-center pt-2 mb-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-label={isExpanded ? 'Show less' : 'Show more'}
              className="text-primary-fixed-dim hover:text-primary transition-colors focus:outline-none p-1 cursor-pointer"
            >
              <ChevronDownIcon
                className={`h-6 w-6 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : 'animate-bounce'
                }`}
              />
            </button>
          </div>
        )}

        {/* Hashtags Footer */}
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
            {hashtags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-xs font-bold font-label tracking-wide uppercase"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
};
