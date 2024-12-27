import { FC, useEffect, useState } from 'react';
import { Memory } from '../../_types/memory';
import { getMemories } from '../_api/getMemories';
import { DashboardActionPanel } from './DashboardActionPanel';
import { MemoryCard } from './MemoryCard';
import { MemoryImageCard } from './MemoryImageCard';

export const Dashboard: FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    getMemories().then((data) => setMemories(data ?? []));
  }, []);

  // TODO how to pick / send random memory from memory[] data - at the api level?

  return (
    <main className="flex-1 bg-stone-100 px-28 py-12">
      {memories.length === 0 && <p>You don&apos;t have any memories yet.</p>}
      {memories.length !== 0 && (
        <>
          <h2 className="mb-10 font-medium">{`This is your memory from ${new Date(memories[0].createdAt).toDateString()}`}</h2>
          <div className="flex h-3/4">
            <MemoryCard memory={memories[0]} />
            <MemoryImageCard />
            <DashboardActionPanel />
          </div>
        </>
      )}
    </main>
  );
};
