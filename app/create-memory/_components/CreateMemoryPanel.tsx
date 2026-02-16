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

type MemoryFormData = MemoryCreationFields & {
  readonly hashtags: string[];
};

export const CreateMemoryPanel: FC = () => {
  const [createMemoryStatus, setCreateMemoryStatus] =
    useState<ApiData<null>>(getInitialApiDataStatus());

  const methods = useForm<MemoryFormData>({
    defaultValues: {
      imageId: null,
      hashtags: [],
    },
  });

  const onSubmit: SubmitHandler<MemoryFormData> = useMemo(
    () => async (data) => {
      setCreateMemoryStatus(setLoadingStatus());

      const memoryData = {
        title: data.title,
        message: data.message,
        hashtags: data.hashtags || [],
        imageId: data.imageId,
      };

      createMemory(memoryData).then((result) => {
        if (result.isSuccess) {
          setCreateMemoryStatus({
            status: 'loaded',
            data: result.data,
            error: null,
            isLoading: false,
          });
          methods.reset({ title: '', message: '', hashtags: [], imageId: null });
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
    <main className="bg-stone-100 h-[calc(100%-8rem)] lg:h-[calc(100%-10rem)] px-6 py-4 lg:px-28 lg:pt-12 overflow-auto">
      <FormProvider {...methods}>
        <form
          aria-label="create-memory-form"
          className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:h-3/4"
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
