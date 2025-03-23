import { FC, useCallback, useEffect, useState } from 'react';
import { match, P } from 'ts-pattern';
import { FullComponentSpinner } from '../../_shared/_components/FullComponentSpinner';
import { Memory } from '../../_shared/_types/memory';
import { ApiData, getInitialApiDataStatus, setLoadingStatus } from '../../_shared/_utils/apiData';
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
  readonly recallMemory: () => void;
};

const LoadedDashboard: FC<LoadedDashboardProps> = ({ memory, recallMemory }) => (
  <>
    {match<Memory | null>(memory)
      .with(null, () => <EmptyDashboard />)
      .with(P.not(null), (it) => (
        <>
          <h2 className="hidden lg:block mb-8 font-medium">{`This is your memory from ${new Date(
            it.createdAt,
          ).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}.`}</h2>
          <h2 className="block lg:hidden mb-4 font-medium text-base">{`This is your memory from ${new Date(
            it.createdAt,
          ).toLocaleDateString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}.`}</h2>
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-0 lg:h-3/4">
            <MemoryCard memory={it} />
            <MemoryImageCard imageId={it.imageId} />
            <DashboardActionPanel handleRecallMemory={recallMemory} />
          </div>
        </>
      ))
      .exhaustive()}
  </>
);

export const Dashboard: FC = () => {
  const [memoryStatus, setMemoryStatus] =
    useState<ApiData<Memory | null>>(getInitialApiDataStatus<Memory | null>());

  const loadMemory = useCallback((currentStatus?: ApiData<Memory | null>) => {
    setMemoryStatus(setLoadingStatus(currentStatus));
    getMemory().then((result) => {
      if (result.isSuccess) {
        setMemoryStatus({ status: 'loaded', data: result.data, error: null, isLoading: false });
      } else {
        setMemoryStatus({ status: 'error', data: null, error: 'unknown error' });
      }
    });
  }, []);

  useEffect(() => {
    loadMemory();
  }, [loadMemory]);

  return (
    <main className="bg-stone-100 h-[calc(100%-8rem)] lg:h-[calc(100%-10rem)] px-6 py-4 lg:px-28 lg:pt-12 overflow-auto">
      {match(memoryStatus)
        .with({ status: 'not loaded', isLoading: false }, () => null)
        .with({ status: 'not loaded', isLoading: true }, () => <FullComponentSpinner />)
        .with({ status: 'loaded' }, ({ data }) => (
          <LoadedDashboard memory={data} recallMemory={() => loadMemory(memoryStatus)} />
        ))
        .with({ status: 'error' }, () => <p>error loading data</p>)
        .exhaustive()}
    </main>
  );
};
