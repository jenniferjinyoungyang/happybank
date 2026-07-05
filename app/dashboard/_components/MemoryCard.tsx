import { FC } from 'react';
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

  return (
    <article className="relative z-10 -mt-8 ml-auto mr-4 max-w-xl rounded-[1.5rem] border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-xl shadow-on-surface/5 sm:p-8 lg:p-10">
      <span className="mb-4 block font-headline text-xs font-bold uppercase tracking-[0.2em] text-tertiary">
        {parseMemoryDate(createdAt)}
      </span>
      <h1 className="mb-6 font-headline text-3xl font-extrabold leading-tight tracking-tight text-on-surface sm:text-4xl">
        {title}
      </h1>
      <p className="font-body text-lg leading-relaxed text-on-surface-variant italic">
        “{message}”
      </p>
      {hashtags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
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
