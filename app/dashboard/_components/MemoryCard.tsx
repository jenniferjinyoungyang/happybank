import { FC } from 'react';
import { Memory } from '../../_types/memory';

type MemoryCardProps = {
  readonly memory: Memory;
};

export const MemoryCard: FC<MemoryCardProps> = ({ memory }) => {
  const { title, message } = memory;

  return (
    <article className="relative flex bg-clip-border rounded-xl bg-white text-gray-700 shadow-md w-4/12 flex-row mr-12">
      <div className="p-6">
        <h6 className="block mb-4 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-gray-700 uppercase">
          {title}
        </h6>
        <h4 className="block mb-2 font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Lyft launching cross-platform service this week
        </h4>
        <p className="block mb-8 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
          {message}
        </p>
      </div>
    </article>
  );
};
