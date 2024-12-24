import { FC, useState } from 'react';
import { CreateMemoryCard } from './CreateMemoryCard';
import { UploadImageCard } from './UploadImageCard';

export const CreateMemoryPanel: FC = () => {
  const [memoryTitle, setMemoryTitle] = useState<string>('');

  return (
    <main className="flex-1 grid grid-cols-2 bg-stone-100 px-28 py-12 h-3/4 gap-x-12">
      <CreateMemoryCard onTitleUpdate={setMemoryTitle} />
      <UploadImageCard memoryTitle={memoryTitle} />
    </main>
  );
};
