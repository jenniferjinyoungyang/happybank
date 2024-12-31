import { FC, useEffect, useState } from 'react';
import { match, P } from 'ts-pattern';
import { Memory } from '../../_shared/_types/memory';
import { ApiDataStatus, getLoadingStatus } from '../../_shared/_utils/apiData';
import { getMemory } from '../_api/getMemory';
import { DashboardActionPanel } from './DashboardActionPanel';
import { MemoryCard } from './MemoryCard';
import { MemoryImageCard } from './MemoryImageCard';

const EmptyDashboard: FC = () => <p>You don&apos;t have any memories yet.</p>;

const LoadedDashboard: FC<{ memories: Memory[] }> = ({ memories }) => (
  <>
    {match<Memory[]>(memories)
      .with(
        P.when((it) => it.length === 0),
        () => <EmptyDashboard />,
      )
      .otherwise(() => (
        <>
          <h2 className="mb-10 font-medium">{`This is your memory from ${new Date(
            memories[memories.length - 1].createdAt,
          ).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}`}</h2>
          <div className="flex h-3/4">
            <MemoryCard memory={memories[memories.length - 1]} />
            <MemoryImageCard imageId={memories[memories.length - 1].imageId} />
            <DashboardActionPanel />
          </div>
        </>
      ))}
  </>
);

export const Dashboard: FC = () => {
  const [memoriesStatus, setMemoriesStatus] =
    useState<ApiDataStatus<Memory[]>>(getLoadingStatus<Memory[]>());

  useEffect(() => {
    getMemory().then((result) => {
      if (result.isSuccess) {
        setMemoriesStatus({ status: 'loaded', data: result.data, error: null });
      } else {
        setMemoriesStatus({ status: 'error', data: null, error: 'unknown error' });
      }
    });
  }, []);

  // TODO how to pick / send random memory from memory[] data - at the  level?

  return (
    <main className="flex-1 bg-stone-100 px-28 py-12">
      {match(memoriesStatus)
        .with({ status: 'loading' }, () => <p>loading data...</p>)
        .with({ status: 'loaded' }, ({ data }) => <LoadedDashboard memories={data} />)
        .with({ status: 'error' }, () => <p>error loading data</p>)
        .exhaustive()}
    </main>
  );
};
