import { FC, useCallback, useEffect, useState } from 'react';
import { match, P } from 'ts-pattern';
import { Memory } from '../../_shared/_types/memory';
import { ApiDataStatus, getLoadingStatus } from '../../_shared/_utils/apiData';
import { getMemory } from '../_api/getMemory';
import { DashboardActionPanel } from './DashboardActionPanel';
import { EmptyMemoryCard } from './EmptyMemoryCard';
import { MemoryCard } from './MemoryCard';
import { MemoryImageCard } from './MemoryImageCard';

const EmptyDashboard: FC = () => (
  <>
    <h2 className="mb-10 font-medium">Let&apos;s start saving your special memories</h2>
    <div className="flex h-3/4">
      <EmptyMemoryCard />
      <MemoryImageCard imageId={null} />
      <DashboardActionPanel />
    </div>
  </>
);

type LoadedDashboardProps = {
  readonly memory: Memory | null;
  readonly loadMemory: () => void;
};

const LoadedDashboard: FC<LoadedDashboardProps> = ({ memory, loadMemory }) => (
  <>
    {match<Memory | null>(memory)
      .with(null, () => <EmptyDashboard />)
      .with(P.not(null), (it) => (
        <>
          <h2 className="mb-10 font-medium">{`This is your memory from ${new Date(
            it.createdAt,
          ).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}`}</h2>
          <div className="flex h-3/4">
            <MemoryCard memory={it} />
            <MemoryImageCard imageId={it.imageId} />
            <DashboardActionPanel handleRecallMemory={loadMemory} />
          </div>
        </>
      ))
      .exhaustive()}
  </>
);

export const Dashboard: FC = () => {
  const [memoryStatus, setMemoryStatus] =
    useState<ApiDataStatus<Memory | null>>(getLoadingStatus<Memory | null>());

  const loadMemory = useCallback(
    () =>
      getMemory().then((result) => {
        if (result.isSuccess) {
          setMemoryStatus({ status: 'loaded', data: result.data, error: null });
        } else {
          setMemoryStatus({ status: 'error', data: null, error: 'unknown error' });
        }
      }),
    [],
  );

  useEffect(() => {
    loadMemory();
  }, [loadMemory]);

  return (
    <main className="flex-1 bg-stone-100 px-28 py-12">
      {match(memoryStatus)
        .with({ status: 'loading' }, () => <p>loading data...</p>)
        .with({ status: 'loaded' }, ({ data }) => (
          <LoadedDashboard memory={data} loadMemory={loadMemory} />
        ))
        .with({ status: 'error' }, () => <p>error loading data</p>)
        .exhaustive()}
    </main>
  );
};
