/* eslint-disable jsx-a11y/label-has-associated-control */
'use client';

import { XMarkIcon } from '@heroicons/react/20/solid';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import {
  ChangeEvent,
  FC,
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSearchParams } from 'next/navigation';
import { match } from 'ts-pattern';
import { FullComponentSpinner } from '../../_shared/_components/FullComponentSpinner';
import { Memory } from '../../_shared/_types/memory';
import { ApiData, getInitialApiDataStatus, setLoadingStatus } from '../../_shared/_utils/apiData';
import { searchMemories } from '../_api/searchMemories';
import { SearchMemoriesEmptyState } from './SearchMemoriesEmptyState';
import { SearchResultCard } from './SearchResultCard';
import { SearchResultLightbox } from './SearchResultLightbox';

type SearchFormState = {
  readonly hashtags: string[];
  readonly query: string;
  readonly from: string;
  readonly to: string;
};

const initialFormState: SearchFormState = {
  hashtags: [],
  query: '',
  from: '',
  to: '',
};

type CarouselState = {
  readonly currentIndex: number;
};

export const SearchMemoriesContent: FC = () => {
  const [formState, setFormState] = useState<SearchFormState>(initialFormState);
  const [tagInputValue, setTagInputValue] = useState('');
  const tagInputRef = useRef<HTMLInputElement | null>(null);
  const [searchStatus, setSearchStatus] =
    useState<ApiData<Memory[]>>(getInitialApiDataStatus<Memory[]>());
  const [, setHasSearched] = useState(false);
  const [, setCarouselState] = useState<CarouselState>({ currentIndex: 0 });
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const searchParams = useSearchParams();
  const lastHashtagParamRef = useRef<string | null>(null);
  const carouselContainerRef = useRef<HTMLDivElement | null>(null);

  const addTagsFromString = (rawInput: string) => {
    const validTags = rawInput
      .split(',')
      .map((t) => t.trim().replace(/^#+/, '').replace(/,+$/, ''))
      .filter((t) => t.length > 0);

    if (validTags.length === 0) {
      return;
    }

    setFormState((prev) => {
      const nextHashtags = [...prev.hashtags];
      for (const tag of validTags) {
        if (!nextHashtags.includes(tag)) {
          nextHashtags.push(tag);
        }
      }
      return { ...prev, hashtags: nextHashtags };
    });
  };

  const removeTag = (tagToRemove: string) => {
    setFormState((prev) => ({
      ...prev,
      hashtags: prev.hashtags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.key === 'Enter' || e.key === ',') {
      const trimmed = tagInputValue.trim().replace(/^#+/, '').replace(/,+$/, '');
      if (trimmed) {
        e.preventDefault();
        addTagsFromString(trimmed);
        setTagInputValue('');
      } else if (e.key === ' ' || e.key === ',') {
        e.preventDefault();
      }
    } else if (e.key === 'Backspace' && !tagInputValue && formState.hashtags.length > 0) {
      setFormState((prev) => ({
        ...prev,
        hashtags: prev.hashtags.slice(0, -1),
      }));
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.includes(',')) {
      const parts = value.split(',');
      const lastPart = parts.pop() as string;
      addTagsFromString(parts.join(','));
      setTagInputValue(lastPart);
    } else {
      setTagInputValue(value);
    }
  };

  const executeSearch = useCallback(async (params: SearchFormState) => {
    setHasSearched(true);
    setSearchStatus((currentStatus) => setLoadingStatus(currentStatus));

    const result = await searchMemories({
      hashtags: params.hashtags,
      query: params.query || undefined,
      from: params.from || undefined,
      to: params.to || undefined,
    });

    if (result.isSuccess) {
      setSearchStatus({
        status: 'loaded',
        data: result.data,
        error: null,
        isLoading: false,
      });
      setCarouselState({ currentIndex: 0 });
    } else {
      setSearchStatus({
        status: 'error',
        data: null,
        error: result.error ?? 'unknown error',
      });
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let currentHashtags = formState.hashtags;
    const trimmed = tagInputValue.trim().replace(/^#+/, '').replace(/,+$/, '');
    if (trimmed) {
      const validTags = trimmed
        .split(',')
        .map((t) => t.trim().replace(/^#+/, '').replace(/,+$/, ''))
        .filter((t) => t.length > 0);

      const next = [...currentHashtags];
      for (const tag of validTags) {
        if (!next.includes(tag)) {
          next.push(tag);
        }
      }
      currentHashtags = next;
      setFormState((prev) => ({ ...prev, hashtags: currentHashtags }));
      setTagInputValue('');
    }
    await executeSearch({ ...formState, hashtags: currentHashtags });
  };

  useEffect(() => {
    const hashtagsParam = searchParams.get('hashtags');
    if (hashtagsParam && hashtagsParam !== lastHashtagParamRef.current) {
      lastHashtagParamRef.current = hashtagsParam;
      const initialTags = Array.from(
        new Set(
          decodeURIComponent(hashtagsParam)
            .split(',')
            .map((t) => t.trim().replace(/^#+/, ''))
            .filter((t) => t.length > 0),
        ),
      );

      const prefilledState = {
        ...initialFormState,
        hashtags: initialTags,
      };
      setFormState(prefilledState);
      executeSearch(prefilledState);
    }
  }, [searchParams, executeSearch]);

  const resetFilters = () => {
    lastHashtagParamRef.current = null;
    setFormState(initialFormState);
    setTagInputValue('');
    setSearchStatus(getInitialApiDataStatus<Memory[]>());
    setHasSearched(false);
    setCarouselState({ currentIndex: 0 });
    setSelectedMemory(null);
  };

  const handlePrev = () => {
    carouselContainerRef.current?.scrollBy?.({ left: -420, behavior: 'smooth' });
    setCarouselState((prev) => ({ currentIndex: Math.max(prev.currentIndex - 1, 0) }));
  };

  const handleNext = () => {
    carouselContainerRef.current?.scrollBy?.({ left: 420, behavior: 'smooth' });
    setCarouselState((prev) => ({ currentIndex: prev.currentIndex + 1 }));
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col w-full">
      {/* Search & Filter Section */}
      <section className="mb-20">
        <div className="flex flex-col gap-12">
          <div className="max-w-3xl">
            <h1 className="font-black text-4xl md:text-4xl mb-6 tracking-tighter">
              Relive your joy
            </h1>
            <p className="font-hind leading-relaxed opacity-80">
              Search through your personal bank of happiest moments and milestones.
            </p>
          </div>

          {/* Refined Horizontal Filter Bar */}
          <div className="bg-white rounded-2xl p-6 md:p-12 shadow-xl border border-slate-200 w-full">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* Row 1: Tags */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="search-hashtags"
                  className="font-montserrat font-bold text-sm text-on-background"
                >
                  Tags
                </label>
                <div
                  className="flex flex-wrap items-center gap-2 w-full bg-white border border-slate-300 rounded-lg py-2.5 px-4 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all min-h-[50px] cursor-text"
                  onClick={() => tagInputRef.current?.focus()}
                >
                  {formState.hashtags.map((tag) => (
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
                    ref={tagInputRef}
                    type="text"
                    id="search-hashtags"
                    value={tagInputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      formState.hashtags.length === 0 ? 'gratitude, weekend, family' : ''
                    }
                    autoComplete="off"
                    className="flex-1 min-w-[140px] bg-transparent outline-none text-on-surface text-base font-hind placeholder:text-outline-variant/60"
                  />
                </div>
                <p className="text-slate-500 text-xs font-hind">
                  We&apos;ll match memories that use any of these tags.
                </p>
              </div>

              {/* Row 2: Search Text */}
              <div className="flex flex-col gap-2">
                <label className="font-montserrat font-bold text-sm text-on-background">
                  Search text
                </label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 font-hind text-base placeholder:text-outline-variant/60 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all focus:outline-none"
                  placeholder="Search in titles and messages"
                  value={formState.query}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, query: event.target.value }))
                  }
                />
              </div>

              {/* Row 3: Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-montserrat font-bold text-sm text-on-background">
                    From
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 font-hind text-base placeholder:text-outline-variant/60 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all focus:outline-none"
                      value={formState.from}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, from: event.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-montserrat font-bold text-sm text-on-background">To</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full bg-white border border-slate-300 rounded-lg py-3 px-4 font-hind text-base placeholder:text-outline-variant/60 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all focus:outline-none"
                      value={formState.to}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, to: event.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Footer: Reset & Search */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="font-montserrat font-bold text-sm text-on-background underline hover:text-primary transition-colors cursor-pointer"
                >
                  Reset filters
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-on-primary px-10 py-3 rounded-full font-montserrat font-bold text-base transition-all active:scale-95 shadow-lg shadow-primary/20 cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Memory Gallery */}
      <section
        className="w-full mx-auto pb-24 flex-1 flex flex-col"
        data-purpose="carousel-section"
      >
        {match(searchStatus)
          .with({ status: 'not loaded', isLoading: false }, () => (
            <p className="font-hind text-lg text-slate-500">
              Run a search to see your memories here.
            </p>
          ))
          .with({ status: 'not loaded', isLoading: true }, () => <FullComponentSpinner />)
          .with({ status: 'loaded' }, ({ data }) => {
            const memories = data ?? [];
            if (memories.length === 0) {
              return <SearchMemoriesEmptyState onClearFilters={resetFilters} />;
            }

            return (
              <>
                <div className="flex items-end justify-between mb-10">
                  <div className="font-montserrat font-bold text-lg text-on-background">
                    Showing {memories.length} {memories.length === 1 ? 'memory' : 'memories'}
                  </div>

                  <div className="hidden md:flex gap-4">
                    <button
                      type="button"
                      aria-label="Previous memory"
                      onClick={handlePrev}
                      className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-on-background hover:bg-indigo-50 transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowLeftIcon className="w-6 h-6 text-on-background" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next memory"
                      onClick={handleNext}
                      className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-on-primary hover:bg-primary/90 transition-colors shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowRightIcon className="w-6 h-6 text-on-primary" />
                    </button>
                  </div>
                </div>

                {/* Carousel Track */}
                <div
                  ref={carouselContainerRef}
                  className="flex-1 overflow-x-auto no-scrollbar pb-8 -mx-8 px-8 scroll-smooth"
                >
                  <div className="flex gap-8 lg:gap-12 w-max min-h-[500px] items-stretch">
                    {memories.map((memory, index) => (
                      <SearchResultCard
                        key={`${memory.title}-${memory.createdAt.toString()}-${index}`}
                        memory={memory}
                        onOpen={() => setSelectedMemory(memory)}
                      />
                    ))}
                  </div>
                </div>
              </>
            );
          })
          .with({ status: 'error' }, ({ error }) => (
            <p className="font-hind text-red-600">
              Something went wrong while searching your memories. {error}
            </p>
          ))
          .exhaustive()}
      </section>

      <SearchResultLightbox memory={selectedMemory} onClose={() => setSelectedMemory(null)} />
    </div>
  );
};
