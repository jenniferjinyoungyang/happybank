import { FC } from 'react';
import { Memory } from '../../_types/memory';

type MemoryCardProps = {
  readonly memory: Memory;
};

export const MemoryCard: FC<MemoryCardProps> = ({ memory }) => {
  const { title, message } = memory;

  return (
    <article className="relative flex bg-clip-border rounded-xl bg-white text-gray-700 shadow-md w-1/3 flex-row mr-12">
      <div className="p-6">
        <h4 className="block mb-4 antialiased leading-snug tracking-normal text-blue-gray-900 uppercase">
          {title}
        </h4>
        <p className="block mb-8 antialiased leading-relaxed text-gray-700">
          {message}
        </p>
      </div>
    </article>
  );
};
