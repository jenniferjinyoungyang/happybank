import { FC, useMemo, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { MemoryCreationFields } from '../../_shared/_types/memory';
import {
  ApiData,
  getInitialApiDataStatus,
  isLoadingStatus,
  setLoadingStatus,
} from '../../_shared/_utils/apiData';
import { createMemory } from '../_api/createMemory';
import { CreateMemoryCard } from './CreateMemoryCard';
import { UploadImageCard } from './UploadImageCard';

export const CreateMemoryPanel: FC = () => {
  const [createMemoryStatus, setCreateMemoryStatus] =
    useState<ApiData<null>>(getInitialApiDataStatus());

  const methods = useForm<MemoryCreationFields>({
    defaultValues: {
      imageId: null,
    },
  });

  const onSubmit: SubmitHandler<MemoryCreationFields> = useMemo(
    () => async (data: MemoryCreationFields) => {
      setCreateMemoryStatus(setLoadingStatus());
      createMemory(data).then((result) => {
        if (result.isSuccess) {
          setCreateMemoryStatus({
            status: 'loaded',
            data: result.data,
            error: null,
            isLoading: false,
          });
          methods.reset({ title: '', message: '', hashtag: '', imageId: null });
        } else {
          setCreateMemoryStatus({
            status: 'error',
            data: null,
            error: 'unknown error',
          });
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
          <CreateMemoryCard isLoading={isLoadingStatus(createMemoryStatus)} />
          <UploadImageCard
            memoryTitle={methods.watch('title')}
            isLoading={isLoadingStatus(createMemoryStatus)}
          />
        </form>
        {/* TODO create better alert component which user can close */}
        {createMemoryStatus.status === 'error' && <p>Error creating memory</p>}
      </FormProvider>
    </main>
  );
};
