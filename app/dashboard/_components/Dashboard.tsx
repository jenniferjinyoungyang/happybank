import { FC, useCallback, useEffect, useState } from 'react';
import { match, P } from 'ts-pattern';
import { FullComponentSpinner } from '../../_shared/_components/FullComponentSpinner';
import { Memory } from '../../_shared/_types/memory';
import { ApiData, getInitialApiDataStatus, setLoadingStatus } from '../../_shared/_utils/apiData';
import { getMemory } from '../_api/getMemory';
import { getMemoryStats, MemoryStats } from '../_api/getMemoryStats';
import { getCurations, TopHashtag } from '../_api/getCurations';
import { DashboardActionPanel } from './DashboardActionPanel';
import { EmptyMemoryCard } from './EmptyMemoryCard';
import { MemoryHeroSection } from './MemoryHeroSection';
import { MemoryImageCard } from './MemoryImageCard';
import { MemoryStatsCard } from './MemoryStatsCard';
import { Curations } from './Curations';

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
  readonly stats: MemoryStats | null;
  readonly curations: TopHashtag[];
};

const LoadedDashboard: FC<LoadedDashboardProps> = ({ memory, recallMemory, stats, curations }) => (
  <>
    {match<Memory | null>(memory)
      .with(null, () => <EmptyDashboard />)
      .with(P.not(null), (it) => (
        <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:grid lg:grid-cols-[2fr_1fr] lg:items-start lg:gap-8">
          <section className="flex flex-col space-y-12">
            <MemoryHeroSection memory={it} />
          </section>
          <aside className="lg:pl-8 space-y-10">
            <div>
              <DashboardActionPanel handleRecallMemory={recallMemory} />
            </div>
            <div className="space-y-8">
              {stats ? (
                <MemoryStatsCard
                  memoryCount={stats.memoryCount}
                  hashtagCount={stats.hashtagCount}
                  oldestMemoryDate={stats.oldestMemoryDate}
                  latestMemoryDate={stats.latestMemoryDate}
                />
              ) : null}
              <Curations curations={curations} />
            </div>
          </aside>
        </div>
      ))
      .exhaustive()}
  </>
);

export const Dashboard: FC = () => {
  const [memoryStatus, setMemoryStatus] =
    useState<ApiData<Memory | null>>(getInitialApiDataStatus<Memory | null>());
  const [statsStatus, setStatsStatus] =
    useState<ApiData<MemoryStats>>(getInitialApiDataStatus<MemoryStats>());
  const [curationsStatus, setCurationsStatus] =
    useState<ApiData<TopHashtag[]>>(getInitialApiDataStatus<TopHashtag[]>());

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

  const loadStats = useCallback(() => {
    setStatsStatus((currentStatus) => setLoadingStatus(currentStatus));
    getMemoryStats().then((result) => {
      if (result.isSuccess) {
        setStatsStatus({ status: 'loaded', data: result.data, error: null, isLoading: false });
      } else {
        setStatsStatus({ status: 'error', data: null, error: result.error });
      }
    });
  }, []);

  const loadCurations = useCallback(() => {
    setCurationsStatus((currentStatus) => setLoadingStatus(currentStatus));
    getCurations().then((result) => {
      if (result.isSuccess) {
        setCurationsStatus({ status: 'loaded', data: result.data, error: null, isLoading: false });
      } else {
        setCurationsStatus({ status: 'error', data: null, error: result.error });
      }
    });
  }, []);

  useEffect(() => {
    loadMemory();
    loadStats();
    loadCurations();
  }, [loadMemory, loadStats, loadCurations]);

  return (
    <main className="flex-1 min-h-0 overflow-auto bg-background px-4 py-4 pb-24 lg:px-12 lg:py-8 lg:pb-28">
      {match(memoryStatus)
        .with({ status: 'not loaded', isLoading: false }, () => null)
        .with({ status: 'not loaded', isLoading: true }, () => <FullComponentSpinner />)
        .with({ status: 'loaded' }, ({ data }) => (
          <LoadedDashboard
            memory={data}
            recallMemory={() => loadMemory(memoryStatus)}
            stats={statsStatus.status === 'loaded' ? statsStatus.data : null}
            curations={curationsStatus.status === 'loaded' ? curationsStatus.data : []}
          />
        ))
        .with({ status: 'error' }, () => <p>error loading data</p>)
        .exhaustive()}
    </main>
  );
};
