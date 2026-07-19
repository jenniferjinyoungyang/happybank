'use client';

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
  const messageRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const messageElement = messageRef.current;
    if (!messageElement || isExpanded) {
      return;
    }

    const isOverflowing =
      messageElement.scrollHeight > messageElement.clientHeight + 1 || message.length > 72;
    setHasOverflow(isOverflowing);
  }, [isExpanded, message]);

  return (
    <article
      className={`relative z-10 -mt-8 ml-auto mr-4 flex max-w-xl flex-col rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-xl shadow-on-surface/5 sm:p-8 lg:p-10 ${
        isExpanded ? 'min-h-96' : 'h-96'
      }`}
    >
      <span className="mb-4 block shrink-0 font-headline text-xs font-bold uppercase tracking-[0.2em] text-tertiary">
        {parseMemoryDate(createdAt)}
      </span>
      <h1 className="mb-4 shrink-0 font-headline text-3xl font-extrabold leading-tight tracking-tight text-on-surface sm:text-4xl">
        {title}
      </h1>
      <div className="flex min-h-0 flex-1 flex-col">
        <p
          ref={messageRef}
          className={`overflow-hidden font-body text-lg leading-relaxed text-on-surface-variant italic ${
            isExpanded ? '' : 'line-clamp-2'
          }`}
        >
          &ldquo;{message}&rdquo;
        </p>
        {(hasOverflow || isExpanded) && (
          <button
            type="button"
            onClick={() => setIsExpanded((expanded) => !expanded)}
            className="mt-3 shrink-0 self-start font-headline text-sm font-semibold text-primary hover:text-primary/80"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
      {hashtags.length > 0 && (
        <div className="mt-4 flex shrink-0 flex-wrap gap-2">
          {hashtags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-surface-container px-3 py-1 text-sm font-medium text-on-surface-variant"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};
