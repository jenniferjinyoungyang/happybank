import { FC } from 'react';

export const EmptyMemoryCard: FC = () => (
  <article className="relative flex bg-clip-border rounded-xl bg-white text-gray-700 shadow-md w-1/3 flex-row overflow-auto mr-12">
    <div className="p-6">
      <p className="block mb-8 antialiased leading-relaxed text-gray-700">
        You don&apos;t have any memories yet.
      </p>
    </div>
  </article>
);
