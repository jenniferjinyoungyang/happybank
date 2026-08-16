'use client';

import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { FC, useLayoutEffect, useRef, useState } from 'react';
import { Memory } from '../../_shared/_types/memory';
import { MemoryHashtags } from '../../_shared/_components/MemoryHashtags';
import { MemoryDate } from '../../_shared/_components/MemoryDate';
import { MemoryTitle } from '../../_shared/_components/MemoryTitle';

type MemoryCardProps = {
  readonly memory: Memory;
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
      <MemoryTitle title={title} as="h1" className="absolute -top-5 -left-3 z-20" />

      <article
        className={`bg-surface-container-lowest rounded-xl flex flex-col relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl shadow-indigo-100/50 p-6 sm:p-8 lg:p-10 border border-outline-variant/10 ${
          isExpanded ? 'min-h-[520px] h-auto' : 'h-[520px]'
        }`}
      >
        {/* Date Header */}
        <MemoryDate date={createdAt} className="my-4 shrink-0" />

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

        <MemoryHashtags hashtags={hashtags} className="mt-auto pt-4 shrink-0" />
      </article>
    </div>
  );
};
