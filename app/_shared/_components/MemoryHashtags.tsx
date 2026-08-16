import { FC } from 'react';

type MemoryHashtagsProps = {
  readonly hashtags: readonly string[];
  readonly className?: string;
};

export const MemoryHashtags: FC<MemoryHashtagsProps> = ({ hashtags, className = '' }) => {
  if (hashtags.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {hashtags.map((tag) => (
        <span
          key={tag}
          className={
            'border px-3 py-1.5 rounded-lg text-sm font-bold bg-indigo-50 text-primary border-indigo-100'
          }
        >
          #{tag}
        </span>
      ))}
    </div>
  );
};
