import { XMarkIcon } from '@heroicons/react/20/solid';
import { ChangeEvent, FC, KeyboardEvent, useRef, useState } from 'react';

export const parseHashtags = (rawInput: string): string[] => {
  return rawInput
    .split(',')
    .map((t) => t.trim().replace(/^#+/, '').replace(/,+$/, ''))
    .filter((t) => t.length > 0);
};

export const appendUniqueTags = (
  existingTags: readonly string[],
  newTagsInput: string,
): string[] => {
  const validTags = parseHashtags(newTagsInput);
  if (validTags.length === 0) {
    return [...existingTags];
  }
  const next = [...existingTags];
  for (const tag of validTags) {
    if (!next.includes(tag)) {
      next.push(tag);
    }
  }
  return next;
};

export type HashtagsInputProps = {
  readonly id?: string;
  readonly hashtags: readonly string[];
  readonly onChange: (hashtags: string[]) => void;
  readonly placeholder?: string;
  readonly containerClassName?: string;
  readonly inputClassName?: string;
  readonly inputValue?: string;
  readonly onInputValueChange?: (value: string) => void;
};

export const HashtagsInput: FC<HashtagsInputProps> = ({
  id = 'hashtags-input',
  hashtags,
  onChange,
  placeholder = 'gratitude, weekend, family',
  containerClassName = 'flex flex-wrap items-center gap-2 w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all min-h-[50px] cursor-text',
  inputClassName = 'flex-1 min-w-[140px] bg-transparent outline-none text-on-surface text-base font-hind placeholder:text-outline-variant/60',
  inputValue,
  onInputValueChange,
}) => {
  const [internalValue, setInternalValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const currentValue = inputValue !== undefined ? inputValue : internalValue;
  const updateValue = (val: string) => {
    if (onInputValueChange) {
      onInputValueChange(val);
    } else {
      setInternalValue(val);
    }
  };

  const addTags = (rawInput: string) => {
    const updated = appendUniqueTags(hashtags, rawInput);
    onChange(updated);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(hashtags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.key === 'Enter' || e.key === ',') {
      const trimmed = currentValue.trim().replace(/^#+/, '').replace(/,+$/, '');
      if (trimmed) {
        e.preventDefault();
        addTags(trimmed);
        updateValue('');
      } else if (e.key === ' ' || e.key === ',') {
        e.preventDefault();
      }
    } else if (e.key === 'Backspace' && !currentValue && hashtags.length > 0) {
      onChange(hashtags.slice(0, -1));
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.includes(',')) {
      const parts = value.split(',');
      const lastPart = parts.pop() as string;
      addTags(parts.join(','));
      updateValue(lastPart);
    } else {
      updateValue(value);
    }
  };

  return (
    <div className={containerClassName} onClick={() => inputRef.current?.focus()}>
      {hashtags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1.5 px-3 py-1 text-base 4xl:text-xl text-primary bg-primary/10 rounded-lg font-medium"
        >
          #{tag}
          <button
            type="button"
            aria-label={`Remove #${tag}`}
            onClick={(e) => {
              e.stopPropagation();
              removeTag(tag);
            }}
            className="text-primary hover:text-primary-dim transition-colors cursor-pointer"
          >
            <XMarkIcon className="w-4 h-4 4xl:w-6 4xl:h-6" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        id={id}
        value={currentValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={hashtags.length === 0 ? placeholder : ''}
        autoComplete="off"
        className={inputClassName}
      />
    </div>
  );
};
