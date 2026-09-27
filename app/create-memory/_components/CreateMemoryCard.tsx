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

  const hashtags: string[] = watch('hashtags');
  const titleValue = watch('title') ?? '';
  const messageValue = watch('message') ?? '';
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    register('hashtags', {
      validate: (value: string[]) => {
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
    if (e.key === ' ' || e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = inputValue.trim().replace(/^#+/, '').replace(/,+$/, '');
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
    <div className="relative bg-white rounded-2xl 4xl:rounded-3xl p-8 4xl:p-14 shadow-xl shadow-primary/5 border border-outline-variant/30 lg:col-span-7 xl:col-span-6 4xl:col-span-5 flex flex-col justify-between h-full">
      {isLoading && (
        <>
          <Overlay />
          <FullComponentSpinner />
        </>
      )}
      <div className="space-y-8 4xl:space-y-12">
        {/* Title Field */}
        <div className="space-y-3 4xl:space-y-5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="memory-title"
              className="block font-label font-semibold text-on-surface text-base 4xl:text-2xl"
            >
              The Memory Title
            </label>
            <span className="text-sm 4xl:text-xl text-outline font-hind">
              {titleValue.length}/{MEMORY_VALIDATION.TITLE_MAX_LENGTH}
            </span>
          </div>
          <input
            type="text"
            id="memory-title"
            placeholder="e.g. Morning coffee in the sun"
            className="w-full px-6 4xl:px-8 py-4 4xl:py-6 rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg 4xl:text-2xl placeholder:text-outline-variant/60 font-hind transition-all"
            {...register('title', {
              required: 'This field is required.',
              maxLength: {
                value: MEMORY_VALIDATION.TITLE_MAX_LENGTH,
                message: `This input cannot exceed maximum length of ${MEMORY_VALIDATION.TITLE_MAX_LENGTH}.`,
              },
            })}
          />
          {errors.title && (
            <p className="mt-2 text-sm 4xl:text-lg text-error font-hind">
              {errors.title.message?.toString()}
            </p>
          )}
        </div>

        {/* Story / Message Field */}
        <div className="space-y-3 4xl:space-y-5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="memory-message"
              className="block font-label font-semibold text-on-surface text-base 4xl:text-2xl"
            >
              Tell the Story
            </label>
            <span className="text-sm 4xl:text-xl text-outline font-hind">
              {messageValue.length}/{MEMORY_VALIDATION.MESSAGE_MAX_LENGTH}
            </span>
          </div>
          <textarea
            id="memory-message"
            rows={6}
            placeholder="What happened? How did it feel?"
            className="w-full px-6 4xl:px-8 py-4 4xl:py-6 rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg 4xl:text-2xl placeholder:text-outline-variant/60 font-hind transition-all resize-y"
            {...register('message', {
              required: 'This field is required.',
              maxLength: {
                value: MEMORY_VALIDATION.MESSAGE_MAX_LENGTH,
                message: `This input cannot exceed maximum length of ${MEMORY_VALIDATION.MESSAGE_MAX_LENGTH}.`,
              },
            })}
          />
          {errors.message && (
            <p className="mt-2 text-sm 4xl:text-lg text-error font-hind">
              {errors.message.message?.toString()}
            </p>
          )}
        </div>

        {/* Hashtags Field */}
        <div className="space-y-3 4xl:space-y-5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="memory-hashtags"
              className="block font-label font-semibold text-on-surface text-base 4xl:text-2xl"
            >
              Hashtags
            </label>
            <span className="text-sm 4xl:text-xl text-outline font-hind">
              {hashtags.length}/{MEMORY_VALIDATION.HASHTAG_MAX_COUNT}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 px-6 4xl:px-8 py-3 4xl:py-5 rounded-xl border border-outline-variant focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all bg-white min-h-[58px] 4xl:min-h-[76px]">
            {hashtags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 px-3 py-1 text-base 4xl:text-xl text-primary bg-primary/10 rounded-lg font-medium"
              >
                #{tag}
                <button
                  type="button"
                  aria-label={`Remove #${tag}`}
                  onClick={() => removeTag(tag)}
                  className="text-primary hover:text-primary-dim transition-colors cursor-pointer"
                >
                  <XMarkIcon className="w-4 h-4 4xl:w-6 4xl:h-6" />
                </button>
              </span>
            ))}
            <input
              type="text"
              id="memory-hashtags"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                hashtags.length === 0 ? '#gratitude, #weekend, #family (separated by commas)' : ''
              }
              className="flex-1 min-w-[140px] bg-transparent outline-none text-on-surface text-lg 4xl:text-2xl placeholder:text-outline-variant/60 font-hind"
            />
          </div>
          {errors.hashtags && (
            <p className="mt-2 text-sm 4xl:text-lg text-error font-hind">
              {errors.hashtags.message?.toString()}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-8 4xl:pt-12">
        <Button
          type="submit"
          label="Deposit to Vault"
          cssWrapper="w-full bg-primary text-white py-5 4xl:py-8 rounded-2xl font-headline text-xl 4xl:text-3xl hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer"
        />
      </div>
    </div>
  );
};
