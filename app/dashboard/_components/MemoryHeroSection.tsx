import { FC } from 'react';
import { Memory } from '../../_shared/_types/memory';
import { MemoryCard } from './MemoryCard';
import { MemoryImageCard } from './MemoryImageCard';

type MemoryHeroSectionProps = {
  readonly memory: Memory;
};

export const MemoryHeroSection: FC<MemoryHeroSectionProps> = ({ memory }) => (
  <div>
    <h2 className="mb-4 font-headline text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant">
      Memory of the Moment
    </h2>
    <div className="relative">
      <MemoryImageCard imageId={memory.imageId} />
      <MemoryCard memory={memory} />
    </div>
  </div>
);
