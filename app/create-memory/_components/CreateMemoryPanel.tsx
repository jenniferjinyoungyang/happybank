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
        hashtags: data.hashtags,
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
    <main className="flex-1 min-h-0 overflow-auto bg-background pt-8 lg:pt-12 4xl:pt-24 pb-20 px-6 sm:px-8 4xl:px-16 max-w-[2400px] mx-auto w-full">
      <div className="max-w-3xl mb-10 4xl:mb-16">
        <h1 className="font-black text-4xl md:text-4xl mb-6 tracking-tighter">Deposit a New Joy</h1>
        <p className="font-hind leading-relaxed opacity-80">
          Every small moment of happiness is a treasure. Describe it, tag it, and lock it away in
          your vault of memories.
        </p>
      </div>
      <FormProvider {...methods}>
        <form
          aria-label="create-memory-form"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 4xl:gap-24 items-stretch"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <CreateMemoryCard isLoading={isLoadingStatus(createMemoryStatus)} />
          <UploadImageCard
            memoryTitle={methods.watch('title') ?? ''}
            isLoading={isLoadingStatus(createMemoryStatus)}
          />
        </form>
        {/* TODO create better alert component which user can close */}
        {createMemoryStatus.status === 'error' && (
          <p className="mt-6 text-center text-error font-medium font-hind text-lg">
            Error creating memory
          </p>
        )}
      </FormProvider>
    </main>
  );
};
