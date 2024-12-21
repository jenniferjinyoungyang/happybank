import { FC, useEffect, useState } from 'react';
import { memoriesApi } from '../_api/memoriesApi';
import { Memory } from '../../_types/memory';
import { MemoryCard } from './MemoryCard';
import { MemoryImageCard } from './MemoryImageCard';

export const DashboardBody: FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    memoriesApi.get().then((data) => setMemories(data ?? []));
  }, []);

  // TODO how to pick / send random memory from memory[] data - at the api level?

  return (
    <main className="flex-1 bg-stone-100 px-28 py-12">
      {memories.length === 0 && (
        <p>`&quot;`you don`&apos;`t have any memories yet`&quot;`</p>
      )}
      {memories.length !== 0 && (
        <>
          <div className="mb-10 text-3xl">{`This is your memory from ${new Date(memories[0].createdAt).toDateString()}`}</div>
          <div className="flex h-3/4">
            <MemoryCard memory={memories[0]} />
            <MemoryImageCard />
          </div>
        </>
      )}
    </main>
  );
};
