import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '../../_shared/_components/Button';
import { FullComponentSpinner } from '../../_shared/_components/FullComponentSpinner';
import { Overlay } from '../../_shared/_components/Overlay';

type CreateMemoryCardProps = {
  isLoading: boolean;
};
export const CreateMemoryCard: FC<CreateMemoryCardProps> = ({ isLoading }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md p-5">
      {isLoading && (
        <>
          <Overlay />
          <FullComponentSpinner />
        </>
      )}
      <div className="mb-5">
        <label htmlFor="memory-title" className="block mb-2 text-sm font-medium text-gray-900">
          Title
          <input
            type="text"
            id="memory-title"
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base
          focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            {...register('title', {
              required: 'This field is required.',
              maxLength: {
                value: 100,
                message: 'This input cannot exceed maximum length of 100.',
              },
            })}
          />
        </label>
        {errors.title && <p className="text-red-500">{errors.title.message?.toString()}</p>}
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
            {...register('message', {
              required: 'This field is required.',
              maxLength: {
                value: 1000,
                message: 'This input cannot exceed maximum length of 1000.',
              },
            })}
          />
        </label>
        {errors.message && <p className="text-red-500">{errors.message.message?.toString()}</p>}
      </div>
      <div>
        <label htmlFor="memory-hashtag" className="block mb-2 text-sm font-medium text-gray-900">
          Hashtag #
          <input
            type="text"
            id="memory-hashtag"
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 "
            {...register('hashtag', {
              maxLength: {
                value: 20,
                message: 'This input caanot exceed maximum length of 20.',
              },
            })}
          />
        </label>
        {errors.hashtag && <p className="text-red-500">{errors.hashtag.message?.toString()}</p>}
      </div>
      <Button type="submit" label="Submit" cssWrapper="mt-auto" />
    </div>
  );
};
