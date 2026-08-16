import { FC } from 'react';
import { formatMemoryDate } from '../_utils/formatMemoryDate';

type MemoryDateProps = {
  readonly date: string | Date;
  readonly className?: string;
};

export const MemoryDate: FC<MemoryDateProps> = ({ date, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 text-slate-500 ${className}`}>
      <span className="font-bold text-sm uppercase tracking-wider">{formatMemoryDate(date)}</span>
    </div>
  );
};
