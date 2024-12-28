import { Dispatch, FC, SetStateAction } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../../_components/Button';
import { MemoryCreationFields } from '../../_types/memory';
import { createMemory } from '../_api/createMemory';

type CreateMemoryCardProps = {
  readonly onTitleUpdate: Dispatch<SetStateAction<string>>;
};
export const CreateMemoryCard: FC<CreateMemoryCardProps> = ({
  onTitleUpdate,
}) => {
  const { register, handleSubmit, reset } = useForm<MemoryCreationFields>();

  const onSubmit: SubmitHandler<MemoryCreationFields> = async (data) => {
    console.log('input data: ', data);
    try {
      await createMemory(data);
      reset({
        title: '',
        message: '',
        hashtag: '',
      });
    } catch (err) {
      console.log('submission error: ', err);
    }
  };

  return (
    <form
      className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md p-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="mb-5">
        <label
          htmlFor="memory-title"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Title
          <input
            type="text"
            id="memory-title"
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base
          focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            {...register('title', {
              onChange: (e) => onTitleUpdate(e.target.value),
            })}
          />
        </label>
      </div>
      <div className="mb-5 h-1/2 flex flex-col">
        <label
          htmlFor="memory-message"
          className="flex-1 flex flex-col mb-2 text-sm font-medium text-gray-900"
        >
          Message
          <textarea
            id="memory-message"
            className="block w-full p-2 flex-1 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base
          focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            {...register('message')}
          />
        </label>
      </div>
      <div>
        <label
          htmlFor="memory-hashtag"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Hashtag
          <input
            type="text"
            id="memory-hashtag"
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 "
            {...register('hashtag')}
          />
        </label>
      </div>
      <Button type="submit" label="Submit" cssWrapper="mt-auto" />
    </form>
  );
};
