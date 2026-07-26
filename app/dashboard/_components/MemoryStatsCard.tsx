import { ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { FC } from 'react';

type MemoryStatsCardProps = {
  readonly memoryCount: number;
  readonly hashtagCount: number;
  readonly oldestMemoryDate: string | null;
  readonly latestMemoryDate: string | null;
};

const formatMonthYear = (dateString: string | null): string => {
  if (!dateString) {
    return '—';
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${monthNames[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
};

export const MemoryStatsCard: FC<MemoryStatsCardProps> = ({
  memoryCount,
  hashtagCount,
  oldestMemoryDate,
  latestMemoryDate,
}) => (
  <div className="bg-surface-container-lowest border border-outline-variant/15 p-10 rounded-xl shadow-sm">
    <div className="flex flex-col items-center text-center">
      <div className="mb-6 p-4 bg-tertiary/10 rounded-full">
        <ArchiveBoxIcon className="h-10 w-10 text-tertiary" aria-hidden="true" />
      </div>
      <h2 className="font-headline text-5xl font-extrabold tracking-tighter text-on-surface mb-2">
        {memoryCount}
      </h2>
      <p className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant">
        moments stored
      </p>

      <div className="w-full mt-8 pt-8 border-t border-outline-variant/10 grid grid-cols-2 gap-4">
        <div>
          <span className="block text-2xl font-bold font-headline">{hashtagCount}</span>
          <span className="block text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">
            Hashtags
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-bold font-headline">
              {formatMonthYear(oldestMemoryDate)}
            </span>
            <span className="text-sm font-bold font-headline text-on-surface-variant">-</span>
            <span className="text-sm font-bold font-headline">
              {formatMonthYear(latestMemoryDate)}
            </span>
          </div>
          <span className="block text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">
            TIMELINE
          </span>
        </div>
      </div>
    </div>
  </div>
);
