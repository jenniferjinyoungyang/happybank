import { XMarkIcon } from '@heroicons/react/20/solid';
import { FC, KeyboardEvent, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '../../_shared/_components/Button';
import { FullComponentSpinner } from '../../_shared/_components/FullComponentSpinner';
import { Overlay } from '../../_shared/_components/Overlay';
import { MEMORY_VALIDATION } from '../../_shared/_constants/memory';

type CreateMemoryCardProps = {
  readonly isLoading: boolean;
};
export const CreateMemoryCard: FC<CreateMemoryCardProps> = ({ isLoading }) => {
  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitSuccessful },
  } = useFormContext();

  const hashtags: string[] = watch('hashtags') || [];
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    register('hashtags', {
      validate: (value: string[]) => {
        if (!value) return true;
        if (value.length > MEMORY_VALIDATION.HASHTAG_MAX_COUNT) {
          return `You can only add up to ${MEMORY_VALIDATION.HASHTAG_MAX_COUNT} hashtags.`;
        }
        if (value.some((tag) => tag.length > MEMORY_VALIDATION.HASHTAG_MAX_LENGTH)) {
          return `Each hashtag cannot exceed ${MEMORY_VALIDATION.HASHTAG_MAX_LENGTH} characters.`;
        }
        return true;
      },
    });
  }, [register]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      setInputValue('');
    }
  }, [isSubmitSuccessful]);

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const trimmed = inputValue.trim().replace(/^#/, '');
      if (trimmed) {
        if (!hashtags.includes(trimmed)) {
          setValue('hashtags', [...hashtags, trimmed]);
          await trigger('hashtags');
        }
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && hashtags.length > 0) {
      setValue('hashtags', hashtags.slice(0, -1));
    }
  };

  const removeTag = async (tagToRemove: string) => {
    setValue(
      'hashtags',
      hashtags.filter((tag: string) => tag !== tagToRemove),
    );
    await trigger('hashtags');
  };

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
                value: MEMORY_VALIDATION.TITLE_MAX_LENGTH,
                message: `This input cannot exceed maximum length of ${MEMORY_VALIDATION.TITLE_MAX_LENGTH}.`,
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
                value: MEMORY_VALIDATION.MESSAGE_MAX_LENGTH,
                message: `This input cannot exceed maximum length of ${MEMORY_VALIDATION.MESSAGE_MAX_LENGTH}.`,
              },
            })}
          />
        </label>
        {errors.message && <p className="text-red-500">{errors.message.message?.toString()}</p>}
      </div>
      <div>
        <label htmlFor="memory-hashtags" className="block mb-2 text-sm font-medium text-gray-900">
          Hashtags
        </label>
        <div className="flex flex-wrap items-center gap-2 p-2 mb-8 border border-gray-300 rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
          {hashtags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2 py-1 text-sm text-indigo-800 bg-indigo-100 rounded-md"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </span>
          ))}
          <input
            type="text"
            id="memory-hashtags"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hashtags.length === 0 ? 'e.g., happy' : ''}
            className="flex-1 min-w-[120px] bg-transparent outline-none text-gray-900 placeholder-gray-400"
          />
        </div>
        {errors.hashtags && (
          <p className="text-red-500 -mt-6 mb-4">{errors.hashtags.message?.toString()}</p>
        )}
      </div>
      <Button type="submit" label="Submit" cssWrapper="mt-auto" />
    </div>
  );
};
