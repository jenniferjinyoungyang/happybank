import { FC } from 'react';
import { Memory } from '../../_shared/_types/memory';

type MemoryCardProps = {
  readonly memory: Memory;
};

export const MemoryCard: FC<MemoryCardProps> = ({ memory }) => {
  const { title, message } = memory;

  return (
    <article className="relative flex bg-clip-border rounded-xl bg-white text-gray-700 shadow-md lg:w-1/3 flex-row py-6 lg:mr-12 h-72 lg:h-full">
      <div className="overflow-auto px-6">
        <h4 className="block mb-4 antialiased leading-snug tracking-normal text-blue-gray-900 uppercase">
          {title}
        </h4>
        <p className="block mb-8 antialiased leading-relaxed text-gray-700">{message}</p>
      </div>
    </article>
  );
};
