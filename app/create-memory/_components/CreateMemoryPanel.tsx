import { FC, useMemo, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { MemoryCreationFields } from '../../_shared/_types/memory';
import { createMemory } from '../_api/createMemory';
import { CreateMemoryCard } from './CreateMemoryCard';
import { UploadImageCard } from './UploadImageCard';

export const CreateMemoryPanel: FC = () => {
  const [isAlert, setIsAlert] = useState(false);

  const methods = useForm<MemoryCreationFields>({
    defaultValues: {
      imageId: null,
    },
  });

  const onSubmit: SubmitHandler<MemoryCreationFields> = useMemo(
    () => async (data) => {
      createMemory(data).then((result) => {
        if (result.isSuccess) {
          methods.reset({ title: '', message: '', hashtag: '', imageId: null });
        } else {
          setIsAlert(true);
        }
      });
    },
    [methods],
  );

  return (
    <main className="flex-1 bg-stone-100 px-28 py-12">
      <FormProvider {...methods}>
        <form
          aria-label="create-memory-form"
          className="grid grid-cols-2 gap-x-12 h-3/4"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <CreateMemoryCard />
          <UploadImageCard memoryTitle={methods.watch('title')} />
        </form>
        {/* TODO create better alert component which user can close */}
        {isAlert && <p>Error creating memory</p>}
      </FormProvider>
    </main>
  );
};
