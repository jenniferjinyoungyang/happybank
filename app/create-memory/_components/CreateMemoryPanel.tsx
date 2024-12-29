import { FC, useMemo } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { MemoryCreationFields } from '../../_types/memory';
import { createMemory } from '../_api/createMemory';
import { CreateMemoryCard } from './CreateMemoryCard';
import { UploadImageCard } from './UploadImageCard';

export const CreateMemoryPanel: FC = () => {
  const methods = useForm<MemoryCreationFields>();

  const onSubmit: SubmitHandler<MemoryCreationFields> = useMemo(
    () => async (data) => {
      createMemory(data).then((result) => {
        if (result.isSuccess) {
          methods.reset({ title: '', message: '', hashtag: '', imageId: '' });
        } else {
          console.log('create memory submission error');
        }
      });
    },
    [methods],
  );

  return (
    <main className="flex-1 bg-stone-100 px-28 py-12">
      <FormProvider {...methods}>
        <form className="grid grid-cols-2 gap-x-12 h-3/4" onSubmit={methods.handleSubmit(onSubmit)}>
          <CreateMemoryCard />
          <UploadImageCard memoryTitle={methods.watch('title')} />
        </form>
      </FormProvider>
    </main>
  );
};
