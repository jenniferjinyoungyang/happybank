import { FC, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '../../_shared/_components/Button';
import { FullComponentSpinner } from '../../_shared/_components/FullComponentSpinner';
import { HashtagsInput } from '../../_shared/_components/HashtagsInput';
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

  const handleHashtagsChange = async (newHashtags: string[]) => {
    setValue('hashtags', newHashtags);
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
              className="block font-montserrat font-semibold text-on-surface text-base 4xl:text-2xl"
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
            placeholder="Morning coffee in the sun"
            className="w-full px-6 4xl:px-8 py-4 4xl:py-6 rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg 4xl:text-2xl placeholder:text-outline-variant/60 font-hind transition-all"
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
              className="block font-montserrat font-semibold text-on-surface text-base 4xl:text-2xl"
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
            className="w-full px-6 4xl:px-8 py-4 4xl:py-6 rounded-xl border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg 4xl:text-2xl placeholder:text-outline-variant/60 font-hind transition-all resize-y"
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
              className="block font-montserrat font-semibold text-on-surface text-base 4xl:text-2xl"
            >
              Hashtags
            </label>
            <span className="text-sm 4xl:text-xl text-outline font-hind">
              {hashtags.length}/{MEMORY_VALIDATION.HASHTAG_MAX_COUNT}
            </span>
          </div>
          <HashtagsInput
            id="memory-hashtags"
            hashtags={hashtags}
            onChange={handleHashtagsChange}
            inputValue={inputValue}
            onInputValueChange={setInputValue}
            containerClassName="flex flex-wrap items-center gap-2 px-6 4xl:px-8 py-3 4xl:py-5 rounded-xl border border-outline-variant focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all bg-white min-h-[58px] 4xl:min-h-[76px] cursor-text"
            inputClassName="flex-1 min-w-[140px] bg-transparent outline-none text-on-surface text-lg 4xl:text-2xl placeholder:text-outline-variant/60 font-hind"
          />
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
          cssWrapper="w-full bg-primary text-white py-5 4xl:py-8 rounded-2xl font-montserrat text-xl 4xl:text-3xl hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer"
        />
      </div>
    </div>
  );
};
